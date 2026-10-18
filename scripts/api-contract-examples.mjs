export function buildExamples(spec) {
  const cases=[];
  const id=n=>`00000000-0000-4000-8000-${String(n).padStart(12,'0')}`;
  const ids=Object.fromEntries(['account','party','project','pool','issuer','offering','terms','model','dataset','payoutPolicy','refundPolicy','documentVersion','recipientBinding','eligibility','quote','subscription','settlement','closing','allocation','position','report','batch','entitlement','claim','receipt','testUsdc','mockIdrx'].map((name,i)=>[name,id(i+1)]));
  const money=minor=>({currency:'IDR',minorUnits:String(minor),scale:0});
  const find=name=>Object.values(spec.paths).flatMap(p=>Object.values(p)).find(o=>o.operationId===name);
  const sample=(operationId,status)=>structuredClone(find(operationId).responses[status].content['application/json'].examples.synthetic.value);
  const meta=body=>Object.assign(body,{requestId:id(100),environment:'demo',asOf:'2026-10-18T03:00:00Z',provenance:{kind:'synthetic',sourceIds:[],datasetVersionId:ids.dataset,reviewedAt:null}});
  for(const [symbol,assetId,raw,decimals,baseCurrency,address]of [
    ['TEST_USDC',ids.testUsdc,'100000000',6,'USDC','0x'+'1'.repeat(40)],
    ['MOCK_IDRX',ids.mockIdrx,'160000000',2,'IDRX','0x'+'2'.repeat(40)],
  ]) {
    const body=meta(sample('createQuote','201'));
    Object.assign(body.data,{id:ids.quote,offeringId:ids.offering,partyId:ids.party,termsVersionId:ids.terms,modelVersionId:ids.model,inputAsset:{id:assetId,environment:'demo',chainId:84532,symbol,kind:'erc20',tokenAddress:address,decimals,enabled:true,sourceReference:'SYNTHETIC ONLY; not a deployment or real provider route',verifiedAt:'2026-10-18T03:00:00Z'},inputAmountMinor:raw,fx:{baseCurrency,quoteCurrency:'IDR',rate:baseCurrency==='USDC'?'16000':'1',basis:'synthetic fixture, not a market quote',quotedAt:'2026-10-18T03:00:00Z'},fees:[{name:'synthetic total fee',amount:money(16000)}],grossRights:money(1600000),netRights:money(1584000),minNetRights:money(1500000),expiresAt:'2026-10-18T03:05:00Z',state:'active',executable:true,payoutPolicyVersionId:ids.payoutPolicy,refundPolicyVersionId:ids.refundPolicy});
    cases.push({name:'quote-'+symbol.toLowerCase(),operationId:'createQuote',request:{offeringId:ids.offering,termsVersionId:ids.terms,modelVersionId:ids.model,inputAssetId:assetId,inputAmountMinor:raw},response:{status:201,body},notes:'Alternatif input untuk satu economics hak; bukan dua subscription/funding yang dijumlah. executable hanya synthetic adapter D0.'});
  }
  const subscription=meta(sample('createSubscription','201'));
  Object.assign(subscription.data,{id:ids.subscription,partyId:ids.party,offeringId:ids.offering,quoteId:ids.quote,termsVersionId:ids.terms,modelVersionId:ids.model,documentVersionIds:[ids.documentVersion],consentedAt:'2026-10-18T03:01:00Z',state:'payment_pending',inputAssetId:ids.mockIdrx,expectedInputAmountMinor:'160000000',receivedInputAmountMinor:'0',netSettledRights:null,settlementIds:[],allocationIds:[],positionIds:[],refundCaseIds:[],paymentInstructions:{mode:'simulated',inputAssetId:ids.mockIdrx,chainId:84532,escrowAddress:null,amountMinor:'160000000',expiresAt:'2026-10-18T03:05:00Z',businessReference:ids.subscription}});
  cases.push({name:'subscription-consent',operationId:'createSubscription',request:{quoteId:ids.quote,termsVersionId:ids.terms,modelVersionId:ids.model,documentVersionIds:[ids.documentVersion],riskAcknowledged:true},response:{status:201,body:subscription},notes:'Jalankan setelah quote IDRX; server memvalidasi current eligibility, cap, exact required docs dan expiry.'});
  const entitlement=meta(sample('getEntitlement','200'));
  Object.assign(entitlement.data,{id:ids.entitlement,batchId:ids.batch,positionId:ids.position,partyId:ids.party,snapshotUnits:'1584000',calculationVersionId:id(30),income:money(10000),capitalRecovery:null,deductions:money(0),net:money(10000),claimable:money(10000),state:'claimable',payoutAssetId:ids.mockIdrx,recipientBindingId:ids.recipientBinding,recipientBindingVersion:1,payoutAmountMinor:'1000000',payoutPolicyVersionId:ids.payoutPolicy,payoutQuoteId:null,payoutQuoteExpiresAt:null,revision:{version:1,updatedAt:'2026-10-18T03:06:00Z'}});
  cases.push({name:'funded-entitlement',operationId:'getEntitlement',response:{status:200,body:entitlement},notes:'Hanya sesudah settlement/closing/allocation serta reviewed collection, approval dan funding verified. Hak IDR10.000 dibayar Mock IDRX10.000 dalam fixture payout 1:1, bukan policy live.'});
  const claim=meta(sample('createClaim','202'));
  Object.assign(claim.data,{id:ids.claim,entitlementId:ids.entitlement,partyId:ids.party,recipientBindingId:ids.recipientBinding,recipientBindingVersion:1,assetId:ids.mockIdrx,amountMinor:'1000000',state:'reserved',payoutAttemptIds:[],receiptId:null,errorCode:null,revision:{version:1,updatedAt:'2026-10-18T03:07:00Z'}});
  cases.push({name:'claim-reserved',operationId:'createClaim',request:{recipientBindingId:ids.recipientBinding,recipientBindingVersion:1,expectedPayoutAssetId:ids.mockIdrx,expectedPayoutAmountMinor:'1000000',payoutPolicyVersionId:ids.payoutPolicy,payoutQuoteId:null},response:{status:202,body:claim},notes:'Headers: Origin app, session, Idempotency-Key UUID baru; poll Location. Amount dan recipient di server harus sama dengan expected guard.'});
  const unknown=structuredClone(claim);unknown.data.state='unknown';unknown.data.payoutAttemptIds=[id(31)];unknown.data.errorCode='TRANSACTION_UNKNOWN';unknown.data.revision.version=2;
  cases.push({name:'claim-outcome-unknown',operationId:'getClaim',response:{status:200,body:unknown},notes:'Jangan buat key/pembayaran baru; reserve dan liability tetap sampai reconciliation memastikan outcome.'});
  const receipt=meta(sample('getClaimReceipt','200'));
  Object.assign(receipt.data,{id:ids.receipt,claimId:ids.claim,assetId:ids.mockIdrx,amountMinor:'1000000',recipientAddress:'0x'+'3'.repeat(40),txHash:null,finalizedAt:'2026-10-18T03:10:00Z',reconciledAt:'2026-10-18T03:10:00Z',synthetic:true,finalityPolicyVersion:'synthetic-fixture-v1'});
  cases.push({name:'claim-synthetic-receipt',operationId:'getClaimReceipt',response:{status:200,body:receipt},notes:'Contoh sesudah synthetic reconciliation dan claim menjadi claimed; bukan receipt on-chain/testnet nyata.'});
  for(const [name,operationId,code]of [['quote-expired','createSubscription','QUOTE_EXPIRED'],['idempotency-body-conflict','createSubscription','IDEMPOTENCY_CONFLICT'],['claim-underfunded','createClaim','INSUFFICIENT_FUNDING']]) {
    cases.push({name,operationId,response:{status:409,body:{error:{code,message:'Synthetic failure example.',retryable:false,fieldErrors:[]},requestId:id(101),environment:'demo'}},notes:'Tidak membuat allocation/claim payment baru. Refresh resource dan tangani code; ini contoh response, bukan simulasi server.'});
  }
  return {synthetic:true,description:'Fixture kontrak terlepas dari database/server; UUID/address/rates/fees bukan deployment, market price, data mitra atau terms proyek nyata.',ids,cases};
}
