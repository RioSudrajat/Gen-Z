import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { schemas, operations, errorCatalog, ref } from '../docs/engineering/api/contract.mjs';
import { buildExamples } from './api-contract-examples.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root,'docs/engineering/api');
const write = (name,text) => fs.writeFileSync(path.join(output,name),text.trim()+'\n');
const object = properties => ({type:'object',properties,required:Object.keys(properties),additionalProperties:false});
const labels = {auth:'Auth dan health',intake:'Inquiry dan retensi',access:'Party, grant dan eligibility review',catalog:'Katalog dan offering',evidence:'Dokumen, evidence dan media',reporting:'Operasi, invoice, collection dan laporan',investor:'Dashboard, portfolio dan informasi',investment:'Quote, subscription dan allocation',distribution:'Entitlement, claim dan receipt',editorial:'Fakta, editorial dan publication',servicing:'Settlement, closing dan distribution servicing',exceptions:'Exception dan refund',operations:'Jobs, reconciliation, ledger dan audit',recovery:'Same-owner recovery D1',integration:'Adapter provider D1',demo:'Scenario demo D0'};
const parameter = (name,location,schema,required=false,description='') => ({name,in:location,required,description,schema});
const commonHeaders = {'Cache-Control':{schema:{type:'string'},description:'private, no-store untuk response privat; public intake juga no-store.'},Vary:{schema:{type:'string'},description:'Cookie pada response private.'}};
const targetHeaders = {...commonHeaders,'X-Request-Id':{schema:ref('Id'),description:'Correlation ID server, sama dengan requestId envelope.'}};
const pointer = name=>`#/components/schemas/${name}`;
const responseSchema = operation => {
  if(!operation.response) return null;
  if(operation.binary)return ref(operation.response);
  if(operation.raw) return ref(operation.response);
  const name=operation.operationId[0].toUpperCase()+operation.operationId.slice(1)+'Response';
  schemas[name]=object({data:operation.list?{type:'array',items:ref(operation.response),maxItems:100}:ref(operation.response),requestId:ref('Id'),environment:ref('Environment'),asOf:ref('Timestamp'),provenance:ref('Provenance'),...(operation.list?{page:ref('Page')}:{})});
  return ref(name);
};
function example(schema) {
  if(schema.$ref) return example(schemas[schema.$ref.split('/').at(-1)]);
  if(schema.const!==undefined) return schema.const;
  if(schema.enum) return schema.enum[0];
  if(schema.anyOf) return example(schema.anyOf[0]);
  if(schema.oneOf) return example(schema.oneOf[0]);
  if(schema.allOf?.[0]?.$ref&&!schema.type) {
    const value=example(schema.allOf[0]);
    for(const clause of schema.allOf.slice(1))for(const [key,rule]of Object.entries(clause.properties??{}))value[key]=example(rule);
    return value;
  }
  if(schema.type==='null') return null;
  if(schema.type==='boolean') return false;
  if(schema.type==='integer'||schema.type==='number') return schema.minimum??0;
  if(schema.type==='string') {
    if(schema.format==='uuid') return '11111111-1111-4111-8111-111111111111';
    if(schema.format==='date-time') return '2026-10-18T03:00:00Z';
    if(schema.format==='date') return '2026-10-18';
    if(schema.format==='email') return 'example@example.invalid';
    if(schema.format==='uri') return 'https://example.invalid/private-object';
    if(schema.format==='uri-reference')return '/api/v1/documents/11111111-1111-4111-8111-111111111111/content?accessGrantId=11111111-1111-4111-8111-111111111111';
    if(schema.pattern?.includes('0x')) return schema.pattern.includes('{64}')?'0x'+'1'.repeat(64):schema.pattern.includes('{40}')?'0x'+'1'.repeat(40):'0x12';
    if(schema.pattern?.includes('[A-Z]{2}')) return 'ID';
    if(schema.pattern?.includes('a-f0-9')) return '1'.repeat(64);
    if(schema.pattern?.includes('[1-9]')) return '1';
    if(schema.pattern?.includes('0(')) return '0';
    return 'example'.slice(0,schema.maxLength??100);
  }
  if(schema.type==='array') {
    if(schema.maxItems===0) return [];
    if(schema.allOf?.some(s=>s.contains)) return schema.allOf.filter(s=>s.contains).map(s=>({...example(schema.items),...Object.fromEntries(Object.entries(s.contains.properties).map(([key,value])=>[key,example(value)]))}));
    return Array.from({length:schema.minItems??1},()=>example(schema.items));
  }
  if(schema.type==='object') {
    const value=Object.fromEntries(Object.entries(schema.properties??{}).filter(([key])=>(schema.required??[]).includes(key)).map(([key,value])=>[key,example(value)]));
    for(const clause of schema.allOf??[]) {
      const matches=Object.entries(clause.if?.properties??{}).every(([key,rule])=>rule.const!==undefined?value[key]===rule.const:rule.enum?rule.enum.includes(value[key]):false);
      if(matches)for(const [key,rule] of Object.entries(clause.then?.properties??{})) {
        if(rule.type==='object'&&!rule.properties&&value[key]&&typeof value[key]==='object')continue;
        value[key]=example(rule);
      }
    }
    return value;
  }
  throw Error('No example strategy: '+JSON.stringify(schema));
}
const polling = {retryInquiryNotification:'getJob',runInquiryRetention:'getJob',completeUpload:'getUploadStatus',notifyPayment:'getObservation',allocateSubscription:'getAllocation',createClaim:'getClaim',notifyDistributionFunding:'getFunding',reconcileClaim:'getJob',executeRefund:'getRefund',createReconciliation:'getReconciliation',executeRecovery:'getRecovery',advanceDemo:'getJob'};
const financialErrors = ['createQuote','createSubscription','notifyPayment','allocateSubscription','calculateDistribution','notifyDistributionFunding','createClaim','executeRefund','executeRecovery'];
function errorsFor(o) {
  if(o.errors)return o.errors;
  const result={403:['FORBIDDEN'],429:errorCatalog[429],503:errorCatalog[503]};
  if(!o.public)result[401]=['UNAUTHENTICATED'];
  if(o.provider)result[401]=['INVALID_PROVIDER_SIGNATURE'];
  if(o.provider)result[409]=['IDEMPOTENCY_CONFLICT'];
  if(o.path.includes('{'))result[404]=errorCatalog[404];
  if(o.origin)result[403].push('INVALID_ORIGIN');
  if(o.demo)result[403].push('DEMO_ONLY');
  if(o.request)Object.assign(result,{400:['INVALID_JSON'],413:errorCatalog[413],415:errorCatalog[415],422:errorCatalog[422]});
  if(o.list||o.filters)result[400]=errorCatalog[400];
  if(o.method!=='get'&&o.implemented===false&&!o.provider)result[409]=['STATE_CONFLICT'];
  if(o.idem)result[409]=[...(result[409]??[]),'IDEMPOTENCY_CONFLICT','COMMAND_IN_PROGRESS'];
  if(financialErrors.includes(o.operationId))result[409]=[...errorCatalog[409]];
  if(['createDocumentVersion','createEvidence','createMedia'].includes(o.operationId))result[409]=[...new Set([...result[409],'UPLOAD_NOT_VERIFIED'])];
  if(o.operationId==='getClaimReceipt')result[409]=['STATE_CONFLICT'];
  if(o.match)Object.assign(result,{412:errorCatalog[412],428:errorCatalog[428]});
  return result;
}
const spec={openapi:'3.1.1',jsonSchemaDialect:'https://json-schema.org/draft/2020-12/schema',info:{title:'Gen-Z MVP API contract',version:'0.1.0-draft',description:'Kontrak lengkap target MVP [R], 18 Oktober 2026. Hanya operation x-implementation=source yang tersedia di source. Sisanya proposed; tidak mengaktifkan endpoint atau dana live. Source auth dipertahankan raw tanpa envelope baru. Contoh synthetic dan bukan deployment/token address nyata.'},servers:[{url:'http://localhost:3001',description:'Development platform; path proposed belum tersedia'}],security:[{sessionCookie:[]}],tags:Object.entries(labels).map(([name,description])=>({name,description})),paths:{},components:{responses:{},securitySchemes:{sessionCookie:{type:'apiKey',in:'cookie',name:'genz_session',description:'Opaque HttpOnly cookie; grants/party/resource checks terpisah.'},browserBinding:{type:'apiKey',in:'cookie',name:'genz_login',description:'Binding challenge browser untuk verify; bukan sesi.'},providerSignature:{type:'apiKey',in:'header',name:'X-GenZ-Signature',description:'Internal adapter HMAC v1; bukan signature scheme vendor yang belum dipilih. Lihat conventions.md.'}},schemas},'x-scope-baseline':'1.1-base','x-generated-by':'scripts/build-api-contract.mjs','x-error-catalog':errorCatalog};
for(const o of operations) {
  const parameters=[...o.path.matchAll(/\{([^}]+)\}/g)].map(([,name])=>parameter(name,'path',name==='providerKey'?{type:'string',pattern:'^[a-z][a-z0-9-]{0,63}$'}:ref('Id'),true,'ID resource; server memeriksa scope.'));
  if(o.origin)parameters.push(parameter('Origin','header',{type:'string',format:'uri'},true,o.public&&!o.implemented?'Harus exact configured allowed marketing Origin; tidak wildcard.':'Harus exact GENZ_APP_ORIGIN.'));
  if(!o.implemented&&!o.public)parameters.push(parameter('X-Acting-Party','header',ref('Id'),false,'Pilihan party dari access-context; current organization mandate diverifikasi server, bukan role selector.'));
  if(o.idem)parameters.push(parameter('Idempotency-Key','header',{type:'string',format:'uuid'},true,'128-bit key baru per logical command; retry body sama dengan key sama. Retensi replay minimum 24 jam; business uniqueness tetap.'));
  if(o.match)parameters.push(parameter('If-Match','header',{type:'string',pattern:'^"v[1-9][0-9]*"$'},true,'Strong resource version terakhir; 428 bila hilang, 412 bila berubah.'));
  if(o.provider)parameters.push(parameter('X-GenZ-Timestamp','header',{type:'string',pattern:'^[0-9]{10}$'},true,'Unix seconds, toleransi 300 detik.'),parameter('X-GenZ-Event-Id','header',{type:'string',minLength:1,maxLength:160},true,'Harus cocok body.eventId; dedupe provider/environment/eventId.'));
  if(o.list)parameters.push(parameter('limit','query',{type:'integer',minimum:1,maximum:100,default:20}),parameter('cursor','query',{type:'string',maxLength:2048,minLength:1}));
  for(const [name,schema]of Object.entries(o.filters??{}))parameters.push(parameter(name,'query',schema,o.requiredFilters?.includes(name)??false));
  const successfulSchema=responseSchema(o);
  const headers=o.implemented?(o.path.endsWith('/health')||o.path.endsWith('/ready')?{'Cache-Control':commonHeaders['Cache-Control']}:commonHeaders):{...targetHeaders,...(!o.list&&!o.public?{ETag:{schema:{type:'string',pattern:'^"v[1-9][0-9]*"$'},description:'Resource revision untuk commands If-Match bila mutable.'}}:{})};
  if(o.status===202&&polling[o.operationId])Object.assign(headers,{Location:{schema:{type:'string'},description:`Poll melalui operation ${polling[o.operationId]}; jangan menganggap 202 sebagai final domain outcome.`},'Retry-After':{schema:{type:'integer',minimum:1},description:'Minimum detik sebelum poll, default target 2; bukan SLA selesai.'}});
  if(['createChallenge','verifyWallet','logout'].includes(o.operationId))headers['Set-Cookie']={schema:{type:'string'},description:o.operationId==='createChallenge'?'genz_login; HttpOnly; SameSite=Strict; Path=/; Max-Age=600; Secure pada HTTPS.':o.operationId==='verifyWallet'?'genz_session; HttpOnly; SameSite=Lax; Path=/; Secure pada HTTPS; Max-Age 28800 EOA atau 3600 contract.':'Hapus genz_session dan genz_login; HTTP boleh memiliki beberapa header Set-Cookie.'};
  const responses={ [o.status]:{description:o.status===202?'Diterima secara durable; proses belum selesai.':o.status===204?'Berhasil tanpa response body.':o.status===503?'Overall domain belum ready; wallet auth status terpisah.':'Berhasil sesuai schema; bukan bukti fitur proposed sudah tersedia.',headers,...(successfulSchema?{content:{'application/json':{schema:successfulSchema,examples:{synthetic:{summary:'Contoh bentuk synthetic; referensi bukan data/deployment nyata',value:example(successfulSchema)}}}}}:{})}};
  if(o.binary) {
    responses[o.status].content={'application/octet-stream':{schema:successfulSchema}};
    responses[o.status].headers['Content-Disposition']={schema:{type:'string'},description:'attachment/inline dengan filename aman; Content-Type aktual sesuai objek yang diverifikasi.'};
  }
  const errors=errorsFor(o);
  for(const [status,codes]of Object.entries(errors)) {
    const errorSchema={allOf:[ref(o.implemented?'AuthError':'DomainError'),{type:'object',properties:{error:{type:'object',properties:{code:{enum:codes}}}}}]};
    const value=o.implemented?{error:{code:codes[0],message:'Request cannot be completed.'}}:{error:{code:codes[0],message:'Request cannot be completed.',retryable:['429','503'].includes(status),fieldErrors:[]},requestId:'11111111-1111-4111-8111-111111111111',environment:'demo'};
    responses[status]={description:codes.join(', '),headers:{...(o.implemented?commonHeaders:targetHeaders),...(status==='429'&&!o.implemented?{'Retry-After':{schema:{type:'integer',minimum:1},description:'Detik tunggu target; auth existing belum menjanjikan header ini.'}}:{})},content:{'application/json':{schema:errorSchema,examples:{failure:{value}}}}};
  }
  const body=o.request?{required:true,content:{'application/json':{schema:ref(o.request),examples:{synthetic:{value:example(ref(o.request))}}}}}:undefined;
  (spec.paths[o.path]??={})[o.method]={operationId:o.operationId,tags:[o.tag],summary:o.summary,description:[o.access,o.effect,o.implemented?'Tersedia pada source; tidak dites HTTP ulang oleh pembuatan dokumen ini.':'Rancangan [R]; belum ada handler.'].filter(Boolean).join('\n\n'),security:o.binding?[{browserBinding:[]}]:o.provider?[{providerSignature:[]}]:o.public?[]:[{sessionCookie:[]}],parameters,...(body?{requestBody:body}:{}),responses,'x-implementation':o.implemented?'source':'proposed','x-phase':o.phase,'x-requirements':o.requirements,'x-authorization':o.access,'x-capability':o.capability??null,'x-idempotency':o.idem?'required; replay >=24h; business uniqueness permanent':'not-applicable','x-concurrency':o.match?'If-Match strong version required':'domain preconditions and atomic invariants','x-error-codes':errors,...(o.source?{'x-runtime-source':o.source}:{}),...(polling[o.operationId]?{'x-poll-operation':polling[o.operationId]}:{})};
}
const sharedErrors=new Map();
spec['x-source-sha256']=createHash('sha256').update(['docs/engineering/api/contract.mjs','scripts/build-api-contract.mjs','scripts/api-contract-examples.mjs'].map(file=>fs.readFileSync(path.join(root,file),'utf8')).join('\n')).digest('hex');
for(const o of operations)for(const [status,value]of Object.entries(spec.paths[o.path][o.method].responses)) {
  if(Number(status)===o.status)continue;
  const key=JSON.stringify(value);
  if(!sharedErrors.has(key)) {
    const name=`${o.implemented?'Auth':'Domain'}Error${status}_${sharedErrors.size+1}`;
    sharedErrors.set(key,name);spec.components.responses[name]=value;
  }
  spec.paths[o.path][o.method].responses[status]={$ref:`#/components/responses/${sharedErrors.get(key)}`};
}
write('openapi.json',JSON.stringify(spec,null,2));
write('examples.json',JSON.stringify(buildExamples(spec),null,2));

function type(schema) {
  if(schema.$ref)return schema.$ref.split('/').at(-1);
  if(schema.const!==undefined)return JSON.stringify(schema.const);
  if(schema.enum)return schema.enum.map(v=>`\`${v}\``).join(' / ');
  if(schema.anyOf)return schema.anyOf.map(type).join(' atau ');
  if(schema.oneOf)return schema.oneOf.map(type).join(' atau ');
  if(schema.type==='array')return `array<${type(schema.items)}>`;
  return schema.format??schema.type??'schema';
}
const fieldTable = name => {
  const schema=schemas[name];
  if(!schema?.properties)return `Schema: \`${name}\` (${type(schema??{})}).`;
  return '| Field | Wajib | Tipe / batas |\n|---|---|---|\n'+Object.entries(schema.properties).map(([key,s])=>`| \`${key}\` | ${schema.required?.includes(key)?'Ya':'Tidak'} | ${type(s)}${s.maxLength?`; maks ${s.maxLength} karakter`:''}${s.maxItems!==undefined?`; maks ${s.maxItems} item`:''} |`).join('\n');
};
for(const [tag,label]of Object.entries(labels)) {
  const rows=operations.filter(o=>o.tag===tag);
  let text=`# ${label}\n\n> Dihasilkan dari [contract.mjs](contract.mjs); edit sumber lalu jalankan \`node scripts/build-api-contract.mjs\`. Baseline 18 Oktober 2026.\n\n[Indeks API](../api.md) · [OpenAPI](openapi.json) · [Konvensi](conventions.md) · [M01–M17](coverage.md). Contoh JSON request/response lengkap beserta schemas nested ada di OpenAPI. Status **proposed** berarti belum diimplementasikan.\n\n| Operation | Method/path | Status | Acceptance |\n|---|---|---|---|\n`+rows.map(o=>`| [${o.operationId}](#${o.operationId.toLowerCase()}) | \`${o.method.toUpperCase()} ${o.path}\` | ${o.implemented?'source':'proposed'} | ${o.requirements.join(', ')||'operational'} |`).join('\n');
  for(const o of rows) {
    const actual=spec.paths[o.path][o.method];
    text+=`\n\n## ${o.operationId}\n\n**${o.summary}** — \`${o.method.toUpperCase()} ${o.path}\`\n\nStatus: **${o.implemented?'source':'proposed [R]'}**; fase ${o.phase}; sukses ${o.status}${o.response?` → \`${o.response}\`${o.list?' (list)':''}`:' tanpa body'}.\n\nAkses: ${o.public?(o.binding?'cookie challenge binding':o.provider?'signature adapter provider':'publik'):'session cookie dan scope resource'}${o.capability?`; capability \`${o.capability}\``:''}. ${o.access}\n\n${o.idem?'Wajib `Idempotency-Key`. ':''}${o.match?'Wajib `If-Match` exact revision. ':''}${o.origin?'Wajib `Origin` yang diizinkan. ':''}${o.list?'Pagination `limit` 1–100 (default 20), cursor opaque. ':''}\n\n${o.effect??'Read/model atau command tunduk pada invariant dan akses di konvensi.'}\n`;
    if(o.request)text+='\n'+fieldTable(o.request)+'\n';
    if(Object.keys(o.filters??{}).length)text+='\nQuery filters: '+Object.entries(o.filters).map(([name,s])=>`\`${name}\`: ${type(s)}`).join('; ')+'.\n';
    text+='\nError: '+(Object.entries(actual['x-error-codes']).map(([status,codes])=>`**${status}** ${codes.map(c=>'`'+c+'`').join(', ')}`).join('; ')||'tidak ada error domain terstruktur yang dimodelkan untuk health/readiness')+'.\n';
    if(o.status===202&&polling[o.operationId])text+=`\nPoll: [${polling[o.operationId]}](${operations.find(x=>x.operationId===polling[o.operationId]).tag}.md#${polling[o.operationId].toLowerCase()}); baca \`Location\`/\`Retry-After\`. 202 bukan final accounting/payment.\n`;
    if(o.source)text+=`\nSource: [handler](../../../${o.source}).\n`;
  }
  const unique=[...new Set(rows.map(o=>o.response).filter(Boolean))];
  text+='\n\n## Model respons\n\nSchema nested, constraints dan contoh nilai lengkap ada di [OpenAPI](openapi.json). Domain proposed dibungkus envelope; auth existing raw.\n';
  for(const name of unique)text+=`\n### ${name}\n\n${fieldTable(name)}\n`;
  write(tag+'.md',text);
}
let coverage='# Coverage API terhadap MVP\n\n> Generated dari [contract.mjs](contract.mjs). Pemetaan kontrak, bukan hasil uji implementasi. [Requirement sumber](../../product/requirements.md) tetap menetapkan acceptance.\n\n| ID | Operations terkait | Kewajiban di luar kontrak HTTP |\n|---|---|---|\n';
for(let i=1;i<=17;i++) {
  const id='M'+String(i).padStart(2,'0');
  const rows=operations.filter(o=>o.requirements.includes(id));
  const outside=id==='M15'?'Bukti legal/counterparties/provider/security/mandat/operasi aktual dan sign-off; endpoint hanya read-only evidence tracking.':id==='M17'?'Uji UI mobile/keyboard/focus/kontras/reduced motion/empty/loading/error; schema tidak membuktikan aksesibilitas.':id==='M14'?'Contract/issuer same-owner proof, freeze/replacement dan finality tests D1.':'Domain/service/database/worker dan E2E harus membuktikan invariant; schema validation saja tidak cukup.';
  coverage+=`| ${id} | ${rows.map(o=>`[${o.operationId}](${o.tag}.md#${o.operationId.toLowerCase()})`).join(', ')} | ${outside} |\n`;
}
coverage+='\n## Cakupan dan batas\n\nPublic marketing/legal/informational content dapat tetap file/SSR; tidak membutuhkan endpoint palsu. Full operator self-service, functional rewards/points/TGE, secondary trading, instant exit dan live enablement tidak ditambahkan. Logical operations dapat diimplementasikan bertahap; jumlah kontrak bukan kewajiban membangun portal/operator atau microservices baru.\n';
write('coverage.md',coverage);
console.log(JSON.stringify({operations:operations.length,source:operations.filter(o=>o.implemented).length,proposed:operations.filter(o=>!o.implemented).length,schemas:Object.keys(schemas).length,tagGuides:Object.keys(labels).length},null,2));
