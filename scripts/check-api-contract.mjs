import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import ts from 'typescript';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const spec=read('docs/engineering/api/openapi.json');
const official=read('scripts/schemas/openapi-3.1.schema.json');
const failures=[];
function assert(condition,message) { if(!condition)failures.push(message); }
const expectedHash=createHash('sha256').update(['docs/engineering/api/contract.mjs','scripts/build-api-contract.mjs','scripts/api-contract-examples.mjs'].map(file=>fs.readFileSync(path.join(root,file),'utf8')).join('\n')).digest('hex');
assert(spec['x-source-sha256']===expectedHash,'Generated contract stale; jalankan npm run docs:api:build');
function walk(value,visit,pointer='#') {
  if(!value||typeof value!=='object')return;
  visit(value,pointer);
  for(const [key,child]of Object.entries(value))walk(child,visit,pointer+'/'+key.replaceAll('~','~0').replaceAll('/','~1'));
}
function resolve(reference) {
  if(!reference.startsWith('#/'))throw Error('External reference not allowed: '+reference);
  return reference.slice(2).split('/').reduce((value,key)=>value?.[key.replaceAll('~1','/').replaceAll('~0','~')],spec);
}
const structural=new Ajv2020({strict:false,allErrors:true});
addFormats(structural);
structural.addFormat('media-range',/^[^\s/]+\/[^\s/]+(?:\s*;[^\r\n]+)?$/);
// AJV tidak resolve non-root dynamic anchors pada base OAS meta-schema ini.
// Tanpa ekstensi dialect, #meta persis $defs/schema (object|boolean).
const baseSchema=structuredClone(official);
walk(baseSchema,node=>{if(node.$dynamicRef==='#meta'){delete node.$dynamicRef;node.$ref='#/$defs/schema';}});
const validateDocument=structural.compile(baseSchema);
assert(validateDocument(spec),'OpenAPI structure: '+JSON.stringify(validateDocument.errors?.slice(0,8)));

const ajv=new Ajv2020({strict:false,allErrors:true,validateFormats:true});
addFormats(ajv);
ajv.addFormat('binary',true);
const schemaRoot={$id:'urn:genz:mvp-api',components:{schemas:spec.components.schemas}};
ajv.addSchema(schemaRoot);
function validator(schema) {
  const local=structuredClone(schema);
  walk(local,node=>{if(node.$ref?.startsWith('#/'))node.$ref='urn:genz:mvp-api'+node.$ref;});
  return ajv.compile(local);
}
for(const [name,schema]of Object.entries(spec.components.schemas)) {
  assert(ajv.validateSchema(schema),`Invalid JSON Schema ${name}: ${JSON.stringify(ajv.errors)}`);
  try { validator({$ref:'#/components/schemas/'+name}); } catch(error) { failures.push(`${name}: ${error.message}`); }
}
let examples=0, references=0;
walk(spec,(node,pointer)=>{
  if(node.$ref){references++;assert(Boolean(resolve(node.$ref)),`Missing ref ${pointer}: ${node.$ref}`);}
  if(node.schema&&node.examples) {
    for(const [name,entry]of Object.entries(node.examples)) {
      if(!Object.hasOwn(entry,'value'))continue;
      const valid=validator(node.schema);
      examples++;
      assert(valid(entry.value),`Example ${pointer}/${name}: ${JSON.stringify(valid.errors?.slice(0,3))}`);
    }
  }
});
const methods=new Set(['get','post','put','patch','delete','head','options']);
const operations=[];
for(const [url,item]of Object.entries(spec.paths))for(const [method,operation]of Object.entries(item)) {
  if(!methods.has(method))continue;
  operations.push({url,method,operation});
  const params=(operation.parameters??[]).map(p=>p.$ref?resolve(p.$ref):p);
  for(const [,name]of url.matchAll(/\{([^}]+)\}/g))assert(params.some(p=>p.name===name&&p.in==='path'&&p.required),`Path param ${operation.operationId}:${name}`);
  assert(Object.keys(operation.responses).length>0,`No response ${operation.operationId}`);
  if(operation['x-idempotency'].startsWith('required'))assert(params.some(p=>p.name==='Idempotency-Key'&&p.required),`Missing idempotency ${operation.operationId}`);
  if(operation['x-concurrency'].startsWith('If-Match'))assert(params.some(p=>p.name==='If-Match'&&p.required),`Missing version precondition ${operation.operationId}`);
  if(operation['x-runtime-source'])assert(fs.existsSync(path.join(root,operation['x-runtime-source'])),`Missing source ${operation.operationId}`);
  if(url.includes('/admin/'))assert(operation.security?.some(s=>Object.hasOwn(s,'sessionCookie'))&&operation['x-capability'],`Admin auth/capability ${operation.operationId}`);
  assert(!/rewards\/(award|redeem)|points\/(award|redeem)|enable-live|swap|staking/.test(url),`Out of scope ${url}`);
}
assert(new Set(operations.map(o=>o.operation.operationId)).size===operations.length,'Duplicate operationId');
for(const {operation}of operations)if(operation['x-poll-operation'])assert(operations.some(o=>o.operation.operationId===operation['x-poll-operation']),`Missing poll ${operation.operationId}`);
for(let i=1;i<=17;i++) {
  const id='M'+String(i).padStart(2,'0');
  assert(operations.some(o=>o.operation['x-requirements'].includes(id)),`No coverage ${id}`);
}
const sourceRoutes=[];
function routes(directory) {
  for(const entry of fs.readdirSync(directory,{withFileTypes:true})) {
    const file=path.join(directory,entry.name);
    if(entry.isDirectory())routes(file);
    else if(entry.name==='route.ts') {
      const url='/api/'+path.relative(path.join(root,'apps/platform/src/app/api'),path.dirname(file)).split(path.sep).join('/');
      const code=fs.readFileSync(file,'utf8');
      for(const [,method]of code.matchAll(/export\s+(?:async\s+)?function\s+(GET|POST|PATCH|PUT|DELETE|OPTIONS|HEAD)\s*\(/g))sourceRoutes.push({url,method:method.toLowerCase()});
    }
  }
}
routes(path.join(root,'apps/platform/src/app/api'));
for(const {url,method}of sourceRoutes)assert(spec.paths[url]?.[method]?.['x-implementation']==='source',`Source route undocumented ${method} ${url}`);
assert(sourceRoutes.length===operations.filter(o=>o.operation['x-implementation']==='source').length,'Source operation count mismatch');

let workflowExamples=0;
for(const entry of read('docs/engineering/api/examples.json').cases) {
  const target=operations.find(o=>o.operation.operationId===entry.operationId)?.operation;
  assert(Boolean(target),`Workflow operation missing ${entry.name}`);
  if(!target)continue;
  if(entry.request) {
    const valid=validator(target.requestBody.content['application/json'].schema);
    assert(valid(entry.request),`Workflow request ${entry.name}: ${JSON.stringify(valid.errors)}`);workflowExamples++;
  }
  if(entry.response) {
    const response=target.responses[String(entry.response.status)];
    assert(Boolean(response),`Workflow response status ${entry.name}`);
    const resolved=response?.$ref?resolve(response.$ref):response;
    if(resolved) {
      const valid=validator(resolved.content['application/json'].schema);
      assert(valid(entry.response.body),`Workflow response ${entry.name}: ${JSON.stringify(valid.errors)}`);workflowExamples++;
    }
  }
}

function requestExample(operationId) {
  const entry=operations.find(o=>o.operation.operationId===operationId).operation;
  return structuredClone(entry.requestBody.content['application/json'].examples.synthetic.value);
}
function reject(name,schema,data) {
  const valid=validator({$ref:'#/components/schemas/'+schema});
  assert(!valid(data),`Negative fixture accepted: ${name}`);
}
const negative=[];
function negativeRequest(name,operationId,mutate) {
  const {operation}=operations.find(o=>o.operation.operationId===operationId);
  const schema=operation.requestBody.content['application/json'].schema;
  const data=requestExample(operationId);mutate(data);
  const valid=validator(schema);
  assert(!valid(data),`Negative request accepted: ${name}`);negative.push(name);
}
negativeRequest('wrong auth chain','createChallenge',x=>x.chainId=8453);
negativeRequest('client admin role','createChallenge',x=>x.role='admin');
negativeRequest('empty signature','verifyWallet',x=>x.signature='0x');
negativeRequest('negative quote amount','createQuote',x=>x.inputAmountMinor='-1');
negativeRequest('zero quote amount','createQuote',x=>x.inputAmountMinor='0');
negativeRequest('floating quote amount','createQuote',x=>x.inputAmountMinor=1.5);
negativeRequest('consent not accepted','createSubscription',x=>x.riskAcknowledged=false);
negativeRequest('arbitrary claim amount','createClaim',x=>x.amountMinor='999999999');
negativeRequest('arbitrary claim recipient','createClaim',x=>x.recipientAddress='0x'+'2'.repeat(40));
negativeRequest('client publication time','createOffering',x=>x.terms.publishedAt='2026-10-18T00:00:00Z');
negativeRequest('client model version','createOffering',x=>x.model.versionId='11111111-1111-4111-8111-111111111111');
negativeRequest('hybrid without fixed leg','createOffering',x=>x.model.fixed=null);
negativeRequest('wrong net rights currency','recordSettlement',x=>x.netRights={currency:'USDC',minorUnits:'100',scale:6});
negativeRequest('zero claim payout guard','createClaim',x=>x.expectedPayoutAmountMinor='0');
negativeRequest('free scenario formula','calculateScenario',x=>x.formula='return 999');
negativeRequest('unknown editorial block','createRevision',x=>x.tabs[0].blocks=[{type:'html',html:'<script>alert(1)</script>'}]);
negativeRequest('public sensitive upload','createInquiry',x=>x.documents=['passport.pdf']);
negativeRequest('automatic marketing consent','createInquiry',x=>x.marketingOptIn=true);
negativeRequest('oversized file','createUpload',x=>x.sizeBytes=26214401);
negativeRequest('script upload MIME','createUpload',x=>x.contentType='application/javascript');
negativeRequest('refund client value override','createRefund',x=>x.refundableAmountMinor='100000');
negativeRequest('provider paid flag','ingestProviderEvent',x=>x.paid=true);
negativeRequest('unsupported capability','proposeGrant',x=>x.capability='superuser:*');
reject('wrong IDR scale','Money',{currency:'IDR',minorUnits:'1',scale:2});
reject('floating ledger money','Money',{currency:'USDC',minorUnits:1.2,scale:6});
reject('IDRX precision mismatch','Money',{currency:'IDRX',minorUnits:'100',scale:6});
reject('missing metric represented as zero','Metric',{...operations.find(o=>o.operation.operationId==='getPerformance').operation.responses['200'].content['application/json'].examples.synthetic.value.data.metrics[0],status:'missing',value:'0'});
const tabResponse=operations.find(o=>o.operation.operationId==='getOfferingTabs').operation.responses['200'].content['application/json'].examples.synthetic.value.data;
reject('duplicate tabs','OfferingTabs',[...tabResponse.slice(0,6),tabResponse[0]]);
reject('test USDC decimals mismatch','ChainAsset',{id:'11111111-1111-4111-8111-111111111111',environment:'testnet',chainId:84532,symbol:'TEST_USDC',kind:'erc20',tokenAddress:'0x'+'1'.repeat(40),decimals:2,enabled:true,sourceReference:'synthetic fixture',verifiedAt:'2026-10-18T00:00:00Z'});

// Jalankan schema request Zod existing tanpa Next.js/server/database melalui transpile TS pure.
const loaded=new Map();
function loadTs(file) {
  if(loaded.has(file))return loaded.get(file).exports;
  const module={exports:{}};loaded.set(file,module);
  const nativeRequire=createRequire(file);
  const localRequire=name=>{
    if(name.startsWith('.')) {
      const resolved=path.resolve(path.dirname(file),name);
      if(fs.existsSync(resolved+'.ts'))return loadTs(resolved+'.ts');
    }
    return nativeRequire(name);
  };
  const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  vm.runInThisContext(`(function(require,module,exports){${code}\n})`,{filename:file})(localRequire,module,module.exports);
  return module.exports;
}
const runtime=loadTs(path.join(root,'apps/platform/src/server/auth/validation.ts'));
let parityCases=0;
for(const [operationId,zod]of [['createChallenge',runtime.challengeRequest],['verifyWallet',runtime.proofRequest]]) {
  const entry=operations.find(o=>o.operation.operationId===operationId).operation;
  const valid=validator(entry.requestBody.content['application/json'].schema);
  const good=requestExample(operationId);
  const candidates=[good,{}, {...good,role:'admin'},...Object.keys(good).map(key=>{const value={...good};delete value[key];return value;})];
  for(const value of candidates){parityCases++;assert(Boolean(valid(value))===zod.safeParse(value).success,`Auth schema parity ${operationId}: ${JSON.stringify(value)}`);}
}
const result={openapi:spec.openapi,operations:operations.length,sourceOperations:sourceRoutes.length,proposedOperations:operations.length-sourceRoutes.length,schemas:Object.keys(spec.components.schemas).length,references,validatedExamples:examples,workflowExamples,negativeCases:negative.length+6,authRequestParityCases:parityCases,structuralSchema:'official 2025-09-15 base, equivalent local #meta resolution for Ajv',failures};
console.log(JSON.stringify(result,null,2));
if(failures.length)process.exitCode=1;
