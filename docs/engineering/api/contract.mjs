// Sumber kontrak dokumentasi; tidak diimpor oleh runtime aplikasi.
export const schemas = {};
export const operations = [];
export const ref = name => ({ $ref: `#/components/schemas/${name}` });
const str = (maxLength = 240, minLength = 1) => ({ type: 'string', minLength, maxLength });
const en = (...values) => ({ type: 'string', enum: values });
const arr = (items, maxItems = 100) => ({ type: 'array', items, maxItems });
const nil = schema => ({ anyOf: [schema, { type: 'null' }] });
const bool = { type: 'boolean' };
const int = (minimum = 0, maximum = 2147483647) => ({ type: 'integer', minimum, maximum });
const obj = (properties, optional = []) => ({ type: 'object', properties, required: Object.keys(properties).filter(k => !optional.includes(k)), additionalProperties: false });
const put = (name, schema) => (schemas[name] = schema, ref(name));
const id = ref('Id'), time = ref('Timestamp'), money = ref('Money'), reason = str(2000);
const ids = () => ({...arr(id),uniqueItems:true});
const version = { type: 'integer', minimum: 1 };
const state = values => en(...values.split(' '));

put('Id', { type: 'string', format: 'uuid', description: 'ID opaque UUID target; bukan authorization boundary.' });
put('Timestamp', { type: 'string', format: 'date-time', description: 'RFC 3339; server mengeluarkan UTC Z.' });
put('Date', { type: 'string', format: 'date' });
put('EvmAddress', { type: 'string', pattern: '^0x[0-9a-fA-F]{40}$', description: 'Validasi checksum EVM oleh service; regex hanya bentuk. Identity lowercase, display checksum.' });
put('TxHash', { type: 'string', pattern: '^0x[0-9a-fA-F]{64}$' });
put('UnsignedInteger', { type: 'string', pattern: '^(0|[1-9][0-9]{0,77})$', description: 'Integer base 10 nonnegatif; tidak dikirim sebagai JSON number.' });
put('PositiveInteger', { type:'string',pattern:'^[1-9][0-9]{0,77}$' });
put('Decimal', { type: 'string', pattern: '^(0|[1-9][0-9]{0,37})(\\.[0-9]{1,18})?$', description: 'Decimal nonnegatif tanpa eksponen; bukan JavaScript floating point.' });
put('Ratio', { type: 'string', pattern: '^(0(\\.[0-9]{1,18})?|1(\\.0{1,18})?)$', description: 'Rasio 0..1; 0.15 berarti 15%.' });
put('Environment', en('demo', 'testnet'));
put('Money', { ...obj({ currency: en('IDR', 'IDRX', 'USDC', 'ETH'), minorUnits: ref('UnsignedInteger'), scale: int(0, 18) }), allOf: [
  ...[['IDR',0],['IDRX',2],['USDC',6],['ETH',18]].map(([currency,scale]) => ({ if: { properties: { currency: { const: currency } }, required: ['currency'] }, then: { properties: { scale: { const: scale } } } })),
] });
put('Period', obj({ from: ref('Date'), to: ref('Date') }));
put('Provenance', obj({ kind: en('synthetic', 'reviewed', 'provisional', 'system'), sourceIds: ids(), datasetVersionId: nil(id), reviewedAt: nil(time) }));
put('Page', obj({ nextCursor: nil(str(2048)), hasMore: bool }));
put('RevisionControl', obj({ version, updatedAt: time }));
put('ErrorDetail', obj({ code: str(100), message: str(1000), retryable: bool, fieldErrors: arr(obj({ path: str(300), code: str(100), message: str(500) }), 50) }));
put('DomainError', obj({ error: ref('ErrorDetail'), requestId: id, environment: ref('Environment') }));
put('AuthError', obj({ error: obj({ code: en('INVALID_JSON','INVALID_INPUT','INVALID_ORIGIN','BODY_TOO_LARGE','JSON_REQUIRED','TOO_MANY_ATTEMPTS','INVALID_WALLET_PROOF','UNAUTHENTICATED','WRONG_RPC_CHAIN','SERVICE_UNAVAILABLE'), message: str(1000) }) }));
put('ChallengeRequest', obj({ address: ref('EvmAddress'), chainId: { type: 'integer', const: 84532 } }));
put('ChallengeResponse', obj({ challengeId: id, message: { type: 'string' }, chainId: { type: 'integer', const: 84532 } }));
put('ProofRequest', obj({ challengeId: id, address: ref('EvmAddress'), message: str(2048), signature: { type: 'string', minLength: 4, maxLength: 4098, pattern: '^0x(?:[0-9a-fA-F]{2})+$' } }));
put('ProofResponse', obj({ address: ref('EvmAddress'), expiresAt: time }));
put('SessionResponse', obj({ accountId: id, address: ref('EvmAddress'), namespace: { const: 'eip155', type: 'string' }, chainId: { const: 84532, type: 'integer' }, proofMethod: en('siwe-eoa','siwe-contract'), expiresAt: time, environment: en('demo','testnet','live'), workspaces: { type: 'array', maxItems: 0, items: false } }));
put('Health', obj({ service: { const: 'platform', type: 'string' }, environment: en('demo','testnet','live'), status: { const: 'foundation', type: 'string' }, ready: { const: false, type: 'boolean' }, financialTransactionsEnabled: { const: false, type: 'boolean' } }));
put('Readiness', obj({ ...schemas.Health.properties, code: { const: 'PLATFORM_FEATURES_NOT_IMPLEMENTED', type: 'string' }, walletAuthenticationReady: bool }));

put('Contact', obj({ name: str(120), email: { type: 'string', format: 'email', maxLength: 254 }, organization: nil(str(160)), phone: nil(str(40)) }));
put('InquiryRequest', obj({ contact: ref('Contact'), assetCategory: en('energy','infrastructure'), location: obj({ countryCode: { type: 'string', const: 'ID' }, region: str(160) }), operationsState: en('operational','maintenance','planned','unknown'), assetDescription: str(4000), financingNeed: nil(money), privacyNoticeVersionId: id, privacyAcknowledged: { type: 'boolean', const: true } }));
put('InquiryReceipt', obj({ id, reference: str(64), receivedAt: time, state: { const: 'received', type: 'string' }, notificationState: en('pending','delivered','failed') }));
put('Inquiry', obj({ id, reference: str(64), contact: ref('Contact'), assetCategory: en('energy','infrastructure'), location: schemas.InquiryRequest.properties.location, operationsState: schemas.InquiryRequest.properties.operationsState, assetDescription: str(4000), financingNeed: nil(money), privacyNoticeVersionId: id, receivedAt: time, state: state('received screening awaiting_evidence active progressed closed rejected not_proceeding'), lastInteractionAt: time, retention: obj({ action: en('review','delete'), dueAt: time, policyVersion: str(80) }), notificationState: en('pending','delivered','failed'), linkedProjectId: nil(id), revision: ref('RevisionControl') }));
put('InquiryUpdate', obj({ action: state('start_screening request_evidence mark_active mark_progressed close reject not_proceeding'), note: reason, missingEvidence: arr(str(240),30), projectId: nil(id) }));
put('InquiryInteractionRequest', obj({ kind: en('contact','screening','evidence_request','retention_review'), note: reason, occurredAt: time }));
put('Interaction', obj({ id, inquiryId: id, kind: schemas.InquiryInteractionRequest.properties.kind, note: reason, occurredAt: time, recordedAt: time, actorAccountId: id }));
put('RetentionDecision', obj({ disposition: en('keep_active','not_proceeding'), reason }));
put('RetentionRunRequest', obj({ dryRun: bool }));
put('Job', obj({ id, kind: state('notification_retry retention reconciliation closing allocation refund demo_command recovery'), state: state('queued running succeeded failed blocked'), resourceId: nil(id), resultIds: ids(), errorCode: nil(str(100)), createdAt: time, updatedAt: time }));
put('ReasonRequest', obj({ reason }));

put('PartyRole', obj({ partyId: id, role: en('owner','operator','issuer'), authorityEvidenceVersionIds: ids(), validFrom: time, validUntil: nil(time) }));
put('Party', obj({ id, kind: en('person','organization'), displayName: str(240), countryCode: { type: 'string', pattern: '^[A-Z]{2}$' } }));
put('ProjectFacts', obj({ name: str(240), slug: { type: 'string', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$', maxLength: 120 }, countryCode: { type: 'string', const: 'ID' }, description: str(4000), partyRoles: arr(ref('PartyRole'),30), assetIds: ids() }));
put('Project', obj({ id, facts: ref('ProjectFacts'), state: state('draft evidence_review approved servicing paused resolved'), revision: ref('RevisionControl') }));
put('AssetFacts', obj({ name: str(240), category: en('energy','infrastructure'), technology: state('solar bess ev_charging battery_swap other'), countryCode: { type: 'string', const: 'ID' }, region: str(160), capacity: arr(obj({ value: ref('Decimal'), unit: en('kW','MW','kWh','MWh','connectors','units') }),10), operationsState: state('operational maintenance planned unknown'), showcaseAvailability: state('active_demo coming_soon hidden'), tags: arr(str(60),20) }));
put('Asset', obj({ id, facts: ref('AssetFacts'), projectIds: ids(), offeringIds: ids(), revision: ref('RevisionControl') }));
put('FeeRule', { oneOf: [obj({ kind: { const: 'fixed', type: 'string' }, name: str(120), amount: money }),obj({ kind: { const: 'ratio', type: 'string' }, name: str(120), ratio: ref('Ratio'), basis: en('gross_input','net_settlement','outstanding_principal','collected_cash') })] });
put('EconomicModel', obj({ versionId: id, kind: en('hybrid','revenue_participation','note'), rightsCurrency: { type: 'string', const: 'IDR' }, fixed: nil(obj({ annualRate: ref('Ratio'), basis: en('net_cost','outstanding_principal'), cadence: en('monthly','quarterly','at_maturity') })), variable: nil(obj({ share: ref('Ratio'), basis: en('eligible_gross_collected_cash','net_distributable_cash'), permittedDeductions: arr(en('opex','tax','insurance','reserve','servicing_fee'),10) })), principalPolicy: obj({ kind: en('none','bullet','amortizing','contractual_residual'), description: str(2000), maturityDate: nil(ref('Date')), expiryDate: nil(ref('Date')) }), rounding: obj({ mode: en('floor'), residualPolicy: str(1000), rightsUnitScale: int(0,18) }), fees: arr(ref('FeeRule'),30), assumptionsVersionId: id }));
put('Terms', obj({ versionId: id, modelVersionId: id, denomination: { type: 'string', const: 'IDR' }, minInvestment: money, maxInvestment: money, cap: money, tenorMonths: int(1,1200), transferPolicy: { type: 'string', const: 'restricted_closed_end' }, instantExitAvailable: { type: 'boolean', const: false }, requiredDocumentVersionIds: ids(), payoutPolicyVersionId: id, refundPolicyVersionId: id, publishedAt: time }));
put('OfferingFacts', obj({ projectId: id, poolId: id, issuerPartyId: id, name: str(240), series: str(120), model: ref('EconomicModel'), terms: ref('Terms') }));
put('Offering', obj({ id, facts: ref('OfferingFacts'), state: state('draft demo_open open closed servicing paused default resolved'), showcaseAvailability: state('active_demo coming_soon hidden'), synthetic: bool, revision: ref('RevisionControl') }));
const tabValues = ['overview','asset-operator','deal-terms','performance-data','reports-updates','risks','documents'];
put('TabKey', en(...tabValues));
put('ReferenceId', str(160));
put('EditorialBlock', { oneOf: [
  obj({ type: { const: 'heading', type: 'string' }, level: { type: 'integer', enum: [2,3] }, text: str(240) }),
  obj({ type: { const: 'paragraph', type: 'string' }, text: str(10000) }),
  obj({ type: { const: 'media-reference', type: 'string' }, mediaId: ref('ReferenceId'), alt: str(500), caption: str(1000,0) },['caption']),
  obj({ type: { const: 'document-reference', type: 'string' }, documentVersionId: ref('ReferenceId') }),
  obj({ type: { const: 'metric-reference', type: 'string' }, metricId: ref('ReferenceId'), datasetVersionId: ref('ReferenceId') }),
] });
put('TabDraft', obj({ schemaVersion: { type: 'integer', const: 1 }, offeringId: ref('ReferenceId'), tab: ref('TabKey'), locale: en('en','id'), blocks: arr(ref('EditorialBlock'),100) }));
put('TabView', obj({ tab: ref('TabKey'), locale: en('en','id'), revisionId: id, publishedAt: time, blocks: arr(ref('EditorialBlock'),100) }));
put('OfferingTabs', { type: 'array', items: ref('TabView'), minItems: 7, maxItems: 7, allOf: tabValues.map(tab=>({contains:{type:'object',properties:{tab:{const:tab}},required:['tab']},minContains:1,maxContains:1})) });
put('RevisionRequest', obj({ reason, supersedesRevisionId: nil(id), tabs: arr(ref('TabDraft'),14) }));
put('ReviewRequest', obj({ decision: en('approve','reject','request_changes'), reason }));
put('PublicationRequest', obj({ reviewDecisionId: id }));
put('ReviewDecision', obj({ id, subjectId: id, subjectVersionId: id, decision: en('approve','reject','request_changes'), reason, reviewerAccountId: id, reviewedAt: time }));
put('Revision', obj({ id, projectId: id, offeringId: id, version, state: state('draft submitted approved rejected changes_requested published superseded'), reason, supersedesRevisionId: nil(id), tabs: arr(ref('TabDraft'),14), reviewDecisionId: nil(id), createdAt: time }));
put('Publication', obj({ id, subjectId: id, subjectVersionId: id, reviewDecisionId: id, publishedAt: time, supersedesPublicationId: nil(id) }));
put('UploadRequest', obj({ kind: en('document','media'), fileName: str(200), contentType: en('application/pdf','image/png','image/jpeg','image/webp','text/csv'), sizeBytes: int(1,26214400), sha256: { type:'string',pattern:'^[a-f0-9]{64}$' }, projectId: id }));
put('UploadIntent', obj({ id, uploadUrl: { type:'string',format:'uri' }, method: { type:'string',const:'PUT' }, contentType: schemas.UploadRequest.properties.contentType, maxBytes: int(1,26214400), expiresAt: time }));
put('UploadCompleteRequest', obj({ sha256: schemas.UploadRequest.properties.sha256 }));
put('UploadedObject', obj({ id, uploadId: id, state: state('pending_scan verified rejected'), sha256: schemas.UploadRequest.properties.sha256, sizeBytes: int(1,26214400), contentType: schemas.UploadRequest.properties.contentType }));
put('EvidenceRequest', obj({ projectId: id, assetId: nil(id), offeringId: nil(id), period: nil(ref('Period')), kind: state('authority ownership ppa operation invoice collection insurance other'), sourceName: str(240), objectId: id, observedAt: nil(time) }));
put('Evidence', obj({ id, ...schemas.EvidenceRequest.properties, state: state('draft submitted reviewed rejected'), version, createdAt: time }));
put('DocumentRequest', obj({ evidenceId: id, offeringId: id, title: str(240), variant: en('investor_copy','original'), redactionReason: nil(reason), objectId: id, supersedesVersionId: nil(id) }));
put('Document', obj({ id, versionId: id, ...schemas.DocumentRequest.properties, state: state('draft submitted approved rejected published superseded'), sourceName: str(240), sha256: schemas.UploadRequest.properties.sha256, publishedAt: nil(time), revision: ref('RevisionControl') }));
put('DocumentAccess', obj({ documentVersionId: id, variant: en('investor_copy','original'), downloadUrl: { type:'string',format:'uri' }, expiresAt: time, contentType: schemas.UploadRequest.properties.contentType, sha256: schemas.UploadRequest.properties.sha256 }));
put('Media', obj({ id, objectId: id, contentType: en('image/png','image/jpeg','image/webp'), sourceName: str(240), alt: str(500), accessUrl: { type:'string',format:'uri' }, expiresAt: time }));

put('Metric', obj({ id, name: str(160), value: nil(ref('Decimal')), unit: state('kWh MWh kW MW percent count IDR tCO2e'), period: ref('Period'), sourceIds: ids(), status: state('reviewed provisional missing overdue stale unavailable'), coverage: nil(ref('Ratio')), observedAt: nil(time), ingestedAt: nil(time), connectionState: state('connected disconnected manual unknown'), methodologyVersionId: nil(id) }));
put('Performance', obj({ projectId: id, datasetVersionId: id, metrics: arr(ref('Metric'),500), asOf: time }));
put('OperationRecordRequest', obj({ projectId: id, assetId: id, period: ref('Period'), metricId: id, value: nil(ref('Decimal')), unit: schemas.Metric.properties.unit, quality: state('provisional reviewed missing'), evidenceVersionIds: ids(), sourceName: str(240) }));
put('OperationRecord', obj({ id, ...schemas.OperationRecordRequest.properties, recordedAt: time }));
put('InvoiceRequest', obj({ projectId: id, payerPartyId: id, invoiceReference: str(160), period: ref('Period'), amount: money, dueDate: ref('Date'), evidenceVersionIds: ids(), supersedesInvoiceId: nil(id) }));
put('Invoice', obj({ id, ...schemas.InvoiceRequest.properties, state: state('unpaid partially_paid paid overdue disputed corrected'), collected: money, revision: ref('RevisionControl') }));
put('CollectionRequest', obj({ projectId: id, payerPartyId: id, amount: money, receivedAt: time, externalReference: str(160), evidenceVersionIds: ids() }));
put('Collection', obj({ id, ...schemas.CollectionRequest.properties, state: state('pending_verification cleared rejected reversed'), clearedAt: nil(time), unmatchedAmount: money, revision: ref('RevisionControl') }));
put('CollectionMatchRequest', obj({ invoiceId: id, collectionId: id, amount: money }));
put('CollectionMatch', obj({ id, ...schemas.CollectionMatchRequest.properties, reconciliationId: id, createdAt: time }));
put('ReportRequest', obj({ offeringId: id, period: ref('Period'), operationRecordIds: ids(), invoiceIds: ids(), collectionIds: ids(), documentVersionIds: ids(), blocks: arr(ref('EditorialBlock'),100), correctionReason: nil(reason), supersedesVersionId: nil(id) }));
put('Report', obj({ id, versionId: id, ...schemas.ReportRequest.properties, state: state('draft submitted approved rejected published superseded'), reviewDecisionId: nil(id), publishedAt: nil(time), revision: ref('RevisionControl') }));

put('ScenarioRequest', obj({ offeringId: id, termsVersionId: id, modelVersionId: id, investment: money, utilization: ref('Ratio'), collectionRate: ref('Ratio'), opexMultiplier: ref('Decimal') }));
put('ScenarioResult', obj({ offeringId: id, modelVersionId: id, assumptionsVersionId: id, forecast: { type:'boolean',const:true }, rows: arr(obj({ period: ref('Period'), grossCash: money, deductions: money, fixedComponent: money, variableComponent: money, income: money, capitalRecovery: nil(money), netDistribution: money }),1200), warnings: arr(str(500),30) }));
put('EligibilityApplication', obj({ offeringId: id, countryCode: { type:'string',pattern:'^[A-Z]{2}$' }, applicantKind: en('person','organization'), evidenceVersionIds: ids(), disclosureAccepted: { type:'boolean',const:true } }));
put('Eligibility', obj({ id, partyId: id, offeringId: id, countryCode: { type:'string',pattern:'^[A-Z]{2}$' }, state: state('pending approved rejected expired revoked'), sandbox: bool, reasons: arr(str(240),30), expiresAt: nil(time), reviewerAccountId: nil(id), revision: ref('RevisionControl') }));
put('EligibilityDecisionRequest', obj({ decision: en('approve','reject','revoke'), reason, expiresAt: nil(time), evidenceVersionIds: ids() }));
put('ChainAsset', obj({ id, environment: ref('Environment'), chainId: { type:'integer',const:84532 }, symbol: en('TEST_USDC','MOCK_IDRX','ETH'), kind: en('erc20','native'), tokenAddress: nil(ref('EvmAddress')), decimals: { type:'integer',enum:[2,6,18] }, enabled: bool, sourceReference: str(500), verifiedAt: time }));
put('QuoteRequest', obj({ offeringId: id, termsVersionId: id, modelVersionId: id, inputAssetId: id, inputAmountMinor: ref('UnsignedInteger') }));
schemas.QuoteRequest.properties.inputAmountMinor = ref('PositiveInteger');
put('Quote', obj({ id, offeringId: id, partyId: id, termsVersionId: id, modelVersionId: id, inputAsset: ref('ChainAsset'), inputAmountMinor: ref('UnsignedInteger'), fx: obj({ baseCurrency: en('IDRX','USDC'), quoteCurrency: {type:'string',const:'IDR'}, rate: ref('Decimal'), basis: str(160), quotedAt: time }), fees: arr(obj({ name: str(160), amount: money }),30), grossRights: money, netRights: money, minNetRights: money, expiresAt: time, state: state('active expired consumed unavailable'), executable: bool, refundPolicyVersionId: id, payoutPolicyVersionId: id }));
put('SubscriptionRequest', obj({ quoteId: id, termsVersionId: id, modelVersionId: id, documentVersionIds: ids(), riskAcknowledged: {type:'boolean',const:true} }));
put('PaymentHint', obj({ chainId: {type:'integer',const:84532}, txHash: ref('TxHash'), inputAssetId: id }));
put('Observation', obj({ id, businessResourceId: id, chainId: {type:'integer',const:84532}, txHash: ref('TxHash'), state: state('received pending_verification included safe finalized reconciled rejected orphaned replaced unknown'), receivedAt: time }));
put('PaymentInstructions', obj({ mode: en('simulated','testnet'), inputAssetId: id, chainId: {type:'integer',const:84532}, escrowAddress: nil(ref('EvmAddress')), amountMinor: ref('UnsignedInteger'), expiresAt: time, businessReference: id }));
put('Subscription', obj({ id, partyId: id, offeringId: id, quoteId: id, termsVersionId: id, modelVersionId: id, documentVersionIds: ids(), consentedAt: time, state: state('payment_pending input_confirmed conversion_pending net_settled allocated quote_expired unmatched underpaid overpaid conversion_failed closing_failed refund_pending refunded'), inputAssetId: id, expectedInputAmountMinor: ref('UnsignedInteger'), receivedInputAmountMinor: ref('UnsignedInteger'), netSettledRights: nil(money), settlementIds: ids(), allocationIds: ids(), positionIds: ids(), refundCaseIds: ids(), paymentInstructions: ref('PaymentInstructions'), revision: ref('RevisionControl') }));
put('SettlementRequest', obj({ inputObservationIds: ids(), netRights: money, conversionReference: nil(str(160)), evidenceVersionIds: ids(), refundPolicyVersionId: id }));
put('Settlement', obj({ id, subscriptionId: id, ...schemas.SettlementRequest.properties, state: state('pending_review approved reconciled rejected reversed'), reconciliationId: nil(id), revision: ref('RevisionControl') }));
put('ClosingRequest', obj({ decision: en('close_success','closing_failed'), reason, termsVersionId: id }));
put('Closing', obj({ id, offeringId: id, decision: en('close_success','closing_failed'), state: state('pending_review approved completed rejected'), reason, termsVersionId: id, reviewDecisionId: nil(id), revision: ref('RevisionControl') }));
put('AllocationRequest', obj({ settlementId: id, closingId: id }));
put('Allocation', obj({ id, subscriptionId: id, settlementId: id, closingId: id, positionId: nil(id), units: ref('Decimal'), netCost: money, state: state('pending registered submitted finalized reconciled rejected'), contractAddress: nil(ref('EvmAddress')), txHash: nil(ref('TxHash')), createdAt: time }));
put('Position', obj({ id, partyId: id, offeringId: id, termsVersionId: id, modelVersionId: id, units: ref('Decimal'), netCost: money, initialPrincipal: nil(money), outstandingPrincipal: nil(money), state: state('active expired resolved frozen recovered'), allocationIds: ids(), recipientBindingId: id, revision: ref('RevisionControl') }));
put('Obligation', obj({ id, positionId: id, period: ref('Period'), dueDate: ref('Date'), incomeDue: nil(money), principalDue: nil(money), state: state('forecast due partially_paid paid overdue not_applicable'), modelVersionId: id }));
put('RecipientBinding', obj({ id, partyId: id, address: ref('EvmAddress'), chainId: {type:'integer',const:84532}, state: en('active','disabled'), version, verifiedAt: time, recoveryCaseId: nil(id) }));
put('DistributionRequest', obj({ offeringId: id, modelVersionId: id, period: ref('Period'), recordDate: time, collectionIds: ids(), reportVersionId: id }));
put('DistributionBatch', obj({ id, ...schemas.DistributionRequest.properties, calculationVersionId: id, state: state('calculated reviewed approved funding_pending funded claimable partially_claimed completed rejected shortfall paused reconciliation_break'), grossCollected: money, deductions: money, reserves: money, netDistributable: money, funded: money, reserved: money, claimed: money, reviewDecisionId: nil(id), revision: ref('RevisionControl') }));
put('FundingHint', obj({ chainId: {type:'integer',const:84532}, txHash: ref('TxHash'), assetId: id }));
put('Funding', obj({ id, batchId: id, assetId: id, amountMinor: ref('UnsignedInteger'), state: state('pending verified finalized reconciled rejected shortfall'), txHash: nil(ref('TxHash')), reconciliationId: nil(id), recordedAt: time }));
put('Entitlement', obj({ id, batchId: id, positionId: id, partyId: id, snapshotUnits: ref('Decimal'), calculationVersionId: id, income: money, capitalRecovery: nil(money), deductions: money, net: money, claimable: money, state: state('calculated approved awaiting_funding claimable reserved claimed paused'), payoutAssetId: id, recipientBindingId: id, recipientBindingVersion: version, revision: ref('RevisionControl') }));
put('ClaimRequest', obj({ recipientBindingId: id, recipientBindingVersion: version }));
put('Claim', obj({ id, entitlementId: id, partyId: id, recipientBindingId: id, recipientBindingVersion: version, assetId: id, amountMinor: ref('UnsignedInteger'), state: state('reserved submitted confirmed reconciled claimed denied failed retry_pending unknown'), payoutAttemptIds: ids(), receiptId: nil(id), errorCode: nil(str(100)), revision: ref('RevisionControl') }));
put('Receipt', obj({ id, claimId: id, assetId: id, amountMinor: ref('UnsignedInteger'), recipientAddress: ref('EvmAddress'), txHash: nil(ref('TxHash')), finalizedAt: time, reconciledAt: time, synthetic: bool, finalityPolicyVersion: str(80) }));
put('PayoutAttempt', obj({ id, claimId: nil(id), refundCaseId: nil(id), senderAddress: ref('EvmAddress'), nonce: ref('UnsignedInteger'), txHash: nil(ref('TxHash')), replacedByAttemptId: nil(id), state: state('queued submitted included safe finalized reconciled reverted dropped replaced unknown'), errorCode: nil(str(100)), updatedAt: time }));
put('RefundRequest', obj({ subscriptionId: id, exceptionCaseId: id, reason }));
put('RefundCase', obj({ id, ...schemas.RefundRequest.properties, policyVersionId: id, refundAssetId: id, refundableAmountMinor: ref('UnsignedInteger'), retainedFees: arr(money,20), state: state('proposed approved rejected dispatch_pending submitted reconciled failed unknown'), reviewDecisionId: nil(id), payoutAttemptIds: ids(), revision: ref('RevisionControl') }));

put('CaseRequest', obj({ kind: state('quote payment conversion closing refund distribution claim reporting recovery'), resourceId: id, description: reason, evidenceVersionIds: ids() }));
put('Case', obj({ id, ownerPartyId: id, ...schemas.CaseRequest.properties, state: state('open reviewing awaiting_evidence resolved rejected'), resolution: nil(reason), revision: ref('RevisionControl') }));
put('CaseUpdate', obj({ action: en('start_review','request_evidence','resolve','reject'), note: reason, resolutionEvidenceVersionIds: ids() }));
put('ReconciliationRequest', obj({ offeringId: id, period: ref('Period'), scope: state('input settlement allocation collection distribution claim refund chain'), resourceIds: ids() }));
put('ReconciliationRun', obj({ id, ...schemas.ReconciliationRequest.properties, state: state('queued running balanced breaks_found failed'), breakIds: ids(), startedAt: nil(time), completedAt: nil(time) }));
put('ReconciliationBreak', obj({ id, runId: id, resourceId: id, kind: state('amount_mismatch duplicate missing_evidence reorg unknown_transfer register_mismatch'), state: state('open investigating resolved'), expected: nil(money), observed: nil(money), evidenceVersionIds: ids(), revision: ref('RevisionControl') }));
put('BreakResolution', obj({ reason, evidenceVersionIds: ids(), correctingJournalId: nil(id) }));
put('JournalEntry', obj({ id, journalId: id, poolId: id, resourceId: id, accountCode: str(100), side: en('debit','credit'), amount: money, reversalOfEntryId: nil(id), postedAt: time }));
put('RecoveryRequest', obj({ partyId: id, positionIds: ids(), oldBindingId: id, newAddress: ref('EvmAddress'), sameOwnerEvidenceVersionIds: ids(), caseId: id, reason }));
put('RecoveryCase', obj({ id, ...schemas.RecoveryRequest.properties, state: state('proposed evidence_review approved freezing_old replacing reconciled rejected failed unknown'), issuerReviewDecisionId: nil(id), oldDisabledAt: nil(time), replacementBindingId: nil(id), reconciliationId: nil(id), revision: ref('RevisionControl') }));
put('GrantRequest', obj({ accountId: id, partyId: id, capability: str(100), scope: obj({ projectId: nil(id), offeringId: nil(id), organizationPartyId: nil(id) }), mandateEvidenceVersionIds: ids(), expiresAt: time, reason }));
put('Grant', obj({ id, ...schemas.GrantRequest.properties, state: state('pending_review active revoked expired rejected'), approvedByAccountId: nil(id), revision: ref('RevisionControl') }));
put('AuditEvent', obj({ id, actorAccountId: id, actingPartyId: nil(id), action: str(120), resourceId: id, resourceVersionId: nil(id), requestId: id, reason: nil(reason), recordedAt: time }));
put('Activity', obj({ id, kind: state('subscription allocation report distribution claim refund case'), resourceId: id, offeringId: nil(id), status: str(100), occurredAt: time }));
put('Overview', obj({ actingPartyId: id, positionCount: int(), netCostsByCurrency: arr(money,10), distributionsByCurrency: arr(money,10), claimableByCurrency: arr(money,10), pendingSubscriptionIds: ids(), unresolvedCaseIds: ids() }));
put('FeatureInfo', obj({ feature: en('rewards','points','gen-z-token'), availability: {type:'string',const:'coming_soon'}, informationalOnly: {type:'boolean',const:true} }));
put('AccessContext', obj({ accountId: id, availableParties: arr(ref('Party'),50), grants: arr(ref('Grant'),200), recipientBindings: arr(ref('RecipientBinding'),50) }));
put('LiveGates', obj({ financialTransactionsEnabled: {type:'boolean',const:false}, gates: arr(obj({ code: state('counterparties legal eligibility_provider custody_fx payout_refund security mandate continuity'), status: state('missing under_review verified expired'), evidenceVersionIds: ids(), reviewedAt: nil(time) }),20) }));
put('ProviderEvent', obj({ eventId: str(160), kind: state('payment_observed conversion_updated funding_observed payout_updated'), businessResourceId: id, occurredAt: time, chainId: {type:'integer',const:84532}, txHash: nil(ref('TxHash')), externalReference: str(160) }));
put('ProviderReceipt', obj({ eventId: str(160), ingestionId: id, state: en('accepted','duplicate'), receivedAt: time }));
put('DemoScenario', obj({ id, name: str(120), datasetVersionId: id, description: str(2000), synthetic: {type:'boolean',const:true} }));
put('DemoRunRequest', obj({ scenarioId: id, datasetVersionId: id }));
put('DemoRun', obj({ id, ownerPartyId: id, scenarioId: id, datasetVersionId: id, generation: version, state: state('active completed reset'), resourceIds: ids(), createdAt: time, revision: ref('RevisionControl') }));
put('DemoCommand', obj({ action: state('confirm_input settle_net advance_reporting fund_distribution simulate_failure reset'), resourceId: nil(id), failure: nil(state('quote_expired conversion_failed closing_failed funding_shortfall transfer_unknown')) }));

// Write payloads tidak menerima publication timestamps atau version IDs buatan client.
const modelInput = { ...schemas.EconomicModel.properties };
delete modelInput.versionId;
put('EconomicModelInput', obj(modelInput));
const termsInput = { ...schemas.Terms.properties };
for (const key of ['versionId','modelVersionId','publishedAt']) delete termsInput[key];
put('TermsInput', obj(termsInput));
put('OfferingDraftRequest', obj({ ...schemas.OfferingFacts.properties, model: ref('EconomicModelInput'), terms: ref('TermsInput') }));
schemas.Terms.properties.publishedAt = nil(time);
schemas.RevisionRequest.properties.factVersions = arr(obj({ kind: en('project','asset','offering'), resourceId: id, version }),100);
schemas.RevisionRequest.required.push('factVersions');
const visibleDocument = { ...schemas.Document.properties };
for (const key of ['objectId','evidenceId','revision','supersedesVersionId']) delete visibleDocument[key];
visibleDocument.variant = { type:'string',const:'investor_copy' };
visibleDocument.state = en('published','superseded');
put('InvestorDocument', obj(visibleDocument));
schemas.Metric.allOf = [{ if: { properties: { status: en('missing','overdue','unavailable') }, required:['status'] }, then: { properties: { value: {type:'null'} } } }];
schemas.ChainAsset.allOf = [
  { if:{properties:{symbol:{const:'ETH'}},required:['symbol']},then:{properties:{kind:{const:'native'},tokenAddress:{type:'null'},decimals:{const:18}}} },
  ...[['TEST_USDC',6],['MOCK_IDRX',2]].map(([symbol,decimals])=>({if:{properties:{symbol:{const:symbol}},required:['symbol']},then:{properties:{kind:{const:'erc20'},tokenAddress:ref('EvmAddress'),decimals:{const:decimals}}}})),
];
for (const [key,value] of Object.entries({payoutAmountMinor:ref('UnsignedInteger'),payoutPolicyVersionId:id,payoutQuoteId:nil(id),payoutQuoteExpiresAt:nil(time)})) {
  schemas.Entitlement.properties[key]=value; schemas.Entitlement.required.push(key);
}
for (const [key,value] of Object.entries({expectedPayoutAssetId:id,expectedPayoutAmountMinor:ref('UnsignedInteger'),payoutPolicyVersionId:id,payoutQuoteId:nil(id)})) {
  schemas.ClaimRequest.properties[key]=value; schemas.ClaimRequest.required.push(key);
}
put('InquiryPolicy', obj({ privacyNoticeVersionId:id, noticeUrl:{type:'string',format:'uri'}, sensitiveUploadsAllowed:{type:'boolean',const:false}, marketingOptIn:{type:'boolean',const:false} }));
put('PrivateDownloadPath', {type:'string',format:'uri-reference',pattern:'^/api/v1/(documents|media)/[0-9a-fA-F-]{36}/content\\?accessGrantId=[0-9a-fA-F-]{36}$',description:'Same-origin app proxy; access grant session/party/version-bound, maksimum 60 detik. Sesi dan resource authorization diperiksa lagi saat GET bytes.'});
put('BinaryContent', {type:'string',format:'binary',description:'Raw bytes melalui app proxy, bukan JSON atau base64.'});
schemas.DocumentAccess.properties.downloadUrl=ref('PrivateDownloadPath');
schemas.DocumentAccess.properties.accessGrantId=id;schemas.DocumentAccess.required.push('accessGrantId');
schemas.Media.properties.accessUrl=ref('PrivateDownloadPath');
schemas.Media.properties.accessGrantId=id;schemas.Media.required.push('accessGrantId');
put('PartyRequest', obj({ kind:en('person','organization'), displayName:str(240), countryCode:{type:'string',pattern:'^[A-Z]{2}$'}, authorityEvidenceVersionIds:ids() }));
put('PoolRequest', obj({ projectId:id, issuerPartyId:id, name:str(160), rightsCurrency:{type:'string',const:'IDR'} }));
put('Pool', obj({ id,...schemas.PoolRequest.properties, revision:ref('RevisionControl') }));
put('MediaRequest', obj({ objectId:id, projectId:id, sourceName:str(240), alt:str(500) }));
put('UploadStatus', obj({ id, projectId:id, state:state('awaiting_upload pending_verification pending_scan verified rejected expired'), objectId:nil(id), errorCode:nil(str(100)), expiresAt:time }));
put('PolicyVersion', obj({ id, kind:state('payout refund assumptions privacy'), environment:ref('Environment'), state:state('approved expired disabled'), description:str(4000), assetIds:ids(), documentVersionIds:ids(), effectiveAt:time }));
put('RightsMoney', {allOf:[ref('Money'),{type:'object',properties:{currency:{const:'IDR'},scale:{const:0}}}],description:'Hak kontraktual MVP berdenominasi IDR, terpisah dari token input/payout.'});
for(const [name,keys]of Object.entries({Terms:['minInvestment','maxInvestment','cap'],TermsInput:['minInvestment','maxInvestment','cap'],Quote:['grossRights','netRights','minNetRights'],SettlementRequest:['netRights'],Settlement:['netRights'],Allocation:['netCost'],Position:['netCost'],DistributionBatch:['grossCollected','deductions','reserves','netDistributable','funded','reserved','claimed'],Entitlement:['income','deductions','net','claimable'],InvoiceRequest:['amount'],Invoice:['amount','collected'],CollectionRequest:['amount'],Collection:['amount','unmatchedAmount'],CollectionMatchRequest:['amount'],CollectionMatch:['amount']})) {
  for(const key of keys)schemas[name].properties[key]=ref('RightsMoney');
}
schemas.Subscription.properties.netSettledRights=nil(ref('RightsMoney'));
for(const [name,keys]of Object.entries({Position:['initialPrincipal','outstandingPrincipal'],Obligation:['incomeDue','principalDue'],Entitlement:['capitalRecovery']}))for(const key of keys)schemas[name].properties[key]=nil(ref('RightsMoney'));
schemas.Page.allOf=[{if:{properties:{hasMore:{const:false}},required:['hasMore']},then:{properties:{nextCursor:{type:'null'}}},else:{properties:{nextCursor:str(2048)}}}];
const modelRules=[
  {if:{properties:{kind:{const:'hybrid'}},required:['kind']},then:{properties:{fixed:{type:'object'},variable:{type:'object'}}}},
  {if:{properties:{kind:{const:'revenue_participation'}},required:['kind']},then:{properties:{fixed:{type:'null'},variable:{type:'object'}}}},
  {if:{properties:{kind:{const:'note'}},required:['kind']},then:{properties:{fixed:{type:'object'},variable:{type:'null'}}}},
];
schemas.EconomicModel.allOf=modelRules;schemas.EconomicModelInput.allOf=modelRules;
schemas.ClaimRequest.properties.expectedPayoutAmountMinor=ref('PositiveInteger');

export const errorCatalog = {
  400: ['INVALID_JSON','INVALID_CURSOR','INVALID_QUERY'], 401: ['UNAUTHENTICATED','INVALID_PROVIDER_SIGNATURE'],
  403: ['INVALID_ORIGIN','FORBIDDEN','DEMO_ONLY','LIVE_DISABLED'], 404: ['RESOURCE_NOT_FOUND'],
  409: ['IDEMPOTENCY_CONFLICT','COMMAND_IN_PROGRESS','STATE_CONFLICT','QUOTE_EXPIRED','TERMS_CHANGED','CAP_EXCEEDED','ELIGIBILITY_REQUIRED','OFFERING_UNAVAILABLE','INSUFFICIENT_FUNDING','ALREADY_CLAIMED','RECIPIENT_CHANGED','RECONCILIATION_REQUIRED','UPLOAD_NOT_VERIFIED','REVIEW_REQUIRED'],
  412: ['VERSION_MISMATCH'], 413: ['BODY_TOO_LARGE'], 415: ['JSON_REQUIRED'],
  422: ['INVALID_INPUT','EXCESS_PRECISION','WRONG_ASSET','EVIDENCE_INVALID'], 428: ['VERSION_REQUIRED'],
  429: ['TOO_MANY_ATTEMPTS'], 503: ['SERVICE_UNAVAILABLE','PROVIDER_UNAVAILABLE'],
};

export function op(method, path, operationId, tag, summary, request, response, options = {}) {
  const access=options.access??(options.binding?'Exact challenge dan browser binding yang valid; Origin app.':options.provider?'Signature internal provider adapter yang dikonfigurasi.':options.public?'Publik; tetap mengikuti Origin/rate limit yang disebutkan.':'Sesi + current resource scope; actor/party diputuskan server.');
  operations.push({ method, path, operationId, tag, summary, request, response, status: 200, requirements: [], phase: 'D0', implemented: false, access, ...options });
}
const live = (source, requirements) => ({ implemented:true, source, requirements, raw:true });
op('get','/api/health','getHealth','auth','Liveness platform',null,'Health',{...live('apps/platform/src/app/api/health/route.ts',[]),public:true,errors:{}});
op('get','/api/ready','getReadiness','auth','Readiness domain platform',null,'Readiness',{...live('apps/platform/src/app/api/ready/route.ts',[]),public:true,status:503,errors:{}});
op('post','/api/v1/auth/challenges','createChallenge','auth','Buat challenge SIWE', 'ChallengeRequest','ChallengeResponse',{...live('apps/platform/src/app/api/v1/auth/challenges/route.ts',['M03']),public:true,origin:true,errors:{400:['INVALID_JSON'],403:['INVALID_ORIGIN'],413:['BODY_TOO_LARGE'],415:['JSON_REQUIRED'],422:['INVALID_INPUT'],429:['TOO_MANY_ATTEMPTS'],503:['SERVICE_UNAVAILABLE']},effect:'Simpan challenge 5 menit; cookie genz_login 600 detik. Single use; tanpa idempotency key.'});
op('post','/api/v1/auth/verify','verifyWallet','auth','Verifikasi proof dan buat sesi','ProofRequest','ProofResponse',{...live('apps/platform/src/app/api/v1/auth/verify/route.ts',['M03']),public:true,binding:true,origin:true,errors:{400:['INVALID_JSON'],401:['INVALID_WALLET_PROOF'],403:['INVALID_ORIGIN'],413:['BODY_TOO_LARGE'],415:['JSON_REQUIRED'],422:['INVALID_INPUT'],429:['TOO_MANY_ATTEMPTS'],503:['SERVICE_UNAVAILABLE','WRONG_RPC_CHAIN']},effect:'Consume nonce atomik dan rotate sesi lama; EOA 8 jam, contract 1 jam. Replay ditolak 401.'});
op('get','/api/v1/session','getSession','auth','Baca sesi yang tersedia',null,'SessionResponse',{...live('apps/platform/src/app/api/v1/session/route.ts',['M03','M04']),errors:{401:['UNAUTHENTICATED'],503:['SERVICE_UNAVAILABLE']},effect:'Workspaces sekarang kosong; tidak memberi role/eligibility.'});
op('post','/api/v1/auth/logout','logout','auth','Cabut sesi dan challenge binding',null,null,{...live('apps/platform/src/app/api/v1/auth/logout/route.ts',['M03']),public:true,origin:true,status:204,errors:{403:['INVALID_ORIGIN'],503:['SERVICE_UNAVAILABLE']},effect:'Hapus sesi current dan cookie; tanpa sesi pun 204 bila service tersedia.'});

const api = (method,path,...args) => op(method,'/api/v1'+path,...args);
const list = { list:true };
const cap = (capability,...requirements) => ({ capability, requirements });
const command = (capability,...requirements) => ({ ...cap(capability,...requirements), idem:true });
const edit = (capability,...requirements) => ({ ...command(capability,...requirements), match:true });
const get = (p,id,t,s,r,opt={})=>api('get',p,id,t,s,null,r,opt);
const post = (p,id,t,s,q,r,opt={})=>api('post',p,id,t,s,q,r,{status:201,...opt});

post('/inquiries','createInquiry','intake','Terima inquiry publik','InquiryRequest','InquiryReceipt',{public:true,origin:true,idem:true,requirements:['M01','M02'],access:'Publik; allowed marketing Origin, rate limit; tidak dapat membaca inquiry.',effect:'Commit inquiry + reference + outbox satu transaksi sebelum 201. Notification retry tidak mengubah penerimaan/retensi.'});
get('/public/inquiry-policy','getInquiryPolicy','intake','Privacy notice version untuk intake publik','InquiryPolicy',{public:true,requirements:['M01','M02']});
get('/admin/inquiries','listInquiries','intake','Daftar inquiry','Inquiry',{...list,...cap('inquiry:read','M02')});
get('/admin/inquiries/{inquiryId}','getInquiry','intake','Detail inquiry','Inquiry',cap('inquiry:read','M02'));
api('patch','/admin/inquiries/{inquiryId}','updateInquiry','intake','Screening dan status inquiry','InquiryUpdate','Inquiry',{...edit('inquiry:screen','M02'),effect:'Transisi tervalidasi; project link tidak mengubah inquiry menjadi evidence investasi.'});
post('/admin/inquiries/{inquiryId}/interactions','recordInquiryInteraction','intake','Catat interaksi bermakna','InquiryInteractionRequest','Interaction',edit('inquiry:screen','M02'));
post('/admin/inquiries/{inquiryId}/notification-retries','retryInquiryNotification','intake','Antrekan ulang notifikasi','ReasonRequest','Job',{...command('inquiry:screen','M01','M02'),status:202,effect:'Retry satu outbox existing; tidak membuat inquiry baru atau mereset lastInteractionAt.'});
post('/admin/inquiries/{inquiryId}/retention-reviews','reviewInquiryRetention','intake','Review retensi inquiry aktif','RetentionDecision','Inquiry',edit('inquiry:retain','M02'));
post('/admin/retention-runs','runInquiryRetention','intake','Jalankan kebijakan retensi jatuh tempo','RetentionRunRequest','Job',{...command('inquiry:retain','M02'),status:202,effect:'Hanya inquiry sesuai due date/policy; dryRun tanpa penghapusan; investasi/ledger tidak ikut.'});
get('/jobs/{jobId}','getJob','operations','Status job yang diizinkan','Job',{requirements:['M01','M12','M13'],access:'Owner resource atau scoped staff; ID job bukan capability.'});

get('/me/access-context','getAccessContext','access','Party, grant dan recipient terverifikasi','AccessContext',{requirements:['M04','M13'],effect:'Tambahan target; tidak mengubah response GET /session existing.'});
get('/me/overview','getOverview','investor','Ringkasan posisi per currency','Overview',{requirements:['M09','M11'],effect:'Scope acting party; jangan menjumlah lintas currency atau menyebut net cost sebagai principal otomatis.'});
get('/me/features','getFeatureInfo','investor','Informasi Rewards Points dan Token','FeatureInfo',{...list,requirements:['M16'],effect:'Hanya tiga Coming soon; tidak ada balance/award/redeem/buy/stake.'});
get('/assets','listAssets','catalog','Katalog privat Energy/Infrastructure','Asset',{...list,requirements:['M04','M05'],filters:{category:en('energy','infrastructure'),availability:en('active_demo','coming_soon')}});
get('/assets/{assetId}','getAsset','catalog','Detail identitas aset','Asset',{requirements:['M04','M05']});
get('/projects/{projectId}','getProject','catalog','Fakta proyek dan pihak berwenang','Project',{requirements:['M04','M07'],effect:'Investor projection hanya fakta approved; internal contact/PII tidak disertakan.'});
get('/offerings/{offeringId}','getOffering','catalog','Offering dan model/terms approved','Offering',{requirements:['M04','M05','M07']});
get('/offerings/{offeringId}/tabs','getOfferingTabs','catalog','Tujuh tab published','OfferingTabs',{requirements:['M04','M06'],filters:{locale:en('en','id')}});
get('/offerings/{offeringId}/terms-versions/{versionId}','getTermsVersion','catalog','Terms version historis yang diizinkan','Terms',{requirements:['M07','M09'],effect:'Hanya published read scope/versi terikat consent owner; tidak mengungkap draft.'});
get('/offerings/{offeringId}/model-versions/{versionId}','getModelVersion','catalog','Model version terikat offering','EconomicModel',{requirements:['M07','M09']});
get('/offerings/{offeringId}/documents','listOfferingDocuments','evidence','Metadata investor copy approved','InvestorDocument',{...list,requirements:['M04','M06'],effect:'Metadata tanpa object key/raw original; original sensitif tidak ikut listing umum.'});
get('/documents/{documentId}/access','getDocumentAccess','evidence','Akses copy atau original berizin','DocumentAccess',{requirements:['M04','M06'],filters:{versionId:id,variant:en('investor_copy','original')},effect:'Default investor_copy; versi published exact. Grant download session/party/version-bound maksimum 60 detik melalui app proxy; original membutuhkan document:original:read dan access audit. Tidak mengekspos private storage URL.'});
get('/documents/{documentId}/content','downloadDocument','evidence','Unduh bytes dengan auth saat download','BinaryContent',{binary:true,requirements:['M04','M06'],filters:{accessGrantId:id},requiredFilters:['accessGrantId'],effect:'Wajib current session + resource/original scope + grant bound ke session/party/version/document; expired/revoked ditolak. Proxy membaca private storage dan mencatat akses; tanpa cookie tidak ada bytes.'});
get('/media/{mediaId}/access','getMediaAccess','evidence','Media referensi yang telah disetujui','Media',{requirements:['M04','M06'],effect:'Akses media mengikuti published offering scope; bukan arbitrary remote URL.'});
get('/media/{mediaId}/content','downloadMedia','evidence','Baca media privat melalui app proxy','BinaryContent',{binary:true,requirements:['M04','M06'],filters:{accessGrantId:id},requiredFilters:['accessGrantId'],effect:'Sesi/current published resource policy dan short-lived session-bound access grant diperiksa pada setiap request.'});
get('/projects/{projectId}/performance','getPerformance','reporting','Data produksi dan impact dengan quality','Performance',{requirements:['M10'],filters:{from:ref('Date'),to:ref('Date')},effect:'Maximum rentang 366 hari; missing/stale null bukan nol; telemetry bukan kas.'});
get('/projects/{projectId}/reports','listReports','reporting','Laporan bulanan published','Report',{...list,requirements:['M10'],filters:{offeringId:id}});
get('/reports/{reportId}','getReport','reporting','Detail laporan/versi published','Report',{requirements:['M10'],filters:{versionId:id}});
post('/offering-scenarios','calculateScenario','investor','Hitung forecast dari model approved','ScenarioRequest','ScenarioResult',{status:200,requirements:['M07'],effect:'Read-only calculation; tidak menciptakan hak/balance/persistence. Revision/model mismatch ditolak.'});
get('/chain-assets','listChainAssets','investment','Registry aset aktif per environment','ChainAsset',{...list,requirements:['M08'],effect:'Testnet hanya registry test tokens/ETH; address mock dicatat saat deploy, bukan diciptakan di kontrak docs.'});
get('/me/eligibility','listMyEligibility','investment','Status eligibility per offering','Eligibility',{...list,requirements:['M08'],filters:{offeringId:id}});
post('/eligibility/applications','applyEligibility','investment','Ajukan eligibility sandbox','EligibilityApplication','Eligibility',command('eligibility:apply','M08'));
post('/investment-quotes','createQuote','investment','Quote exact input ke net IDR rights','QuoteRequest','Quote',{...command('investment:subscribe','M08'),effect:'Periksa eligibility/cap/showcase/model dan registry; amount > 0. D0 synthetic; executable hanya untuk adapter environment yang tersedia.'});
get('/investment-quotes/{quoteId}','getQuote','investment','Baca quote milik acting party','Quote',{requirements:['M08']});
post('/subscriptions','createSubscription','investment','Consent dan cap reservation','SubscriptionRequest','Subscription',{...command('investment:subscribe','M08','M09'),effect:'Server stamps consent; exact terms/model/docs/quote/eligibility/cap atomik. Payment instructions tidak langsung membuat allocation.'});
get('/me/subscriptions','listSubscriptions','investment','Riwayat subscription owner','Subscription',{...list,requirements:['M09','M12'],filters:{offeringId:id}});
get('/subscriptions/{subscriptionId}','getSubscription','investment','Status payment sampai allocation/refund','Subscription',{requirements:['M09','M12']});
post('/subscriptions/{subscriptionId}/payment-notifications','notifyPayment','investment','Terima petunjuk pembayaran yang belum dipercaya','PaymentHint','Observation',{...command('investment:subscribe','M08','M09'),status:202,effect:'Verifikasi escrow binding, receipt, asset, amount, finality dan reconciliation di worker. Hint bukan paid=true atau net settlement.'});
get('/me/positions','listPositions','investor','Portfolio milik acting party','Position',{...list,requirements:['M09'],filters:{offeringId:id}});
get('/positions/{positionId}','getPosition','investor','Posisi dan versi hak','Position',{requirements:['M09']});
get('/positions/{positionId}/schedule','getPositionSchedule','investor','Kewajiban/forecast sesuai terms','Obligation',{...list,requirements:['M07','M09'],effect:'Principal/income nullable sesuai model; due/forecast berbeda dari received.'});
get('/me/distributions','listMyEntitlements','distribution','Hak distribusi dan pendanaan','Entitlement',{...list,requirements:['M11'],filters:{positionId:id}});
get('/distribution-entitlements/{entitlementId}','getEntitlement','distribution','Detail hak distribusi owner','Entitlement',{requirements:['M11']});
get('/me/recipient-bindings','listRecipientBindings','distribution','Recipient owner yang terverifikasi','RecipientBinding',{...list,requirements:['M11','M14']});
post('/distribution-entitlements/{entitlementId}/claims','createClaim','distribution','Reservasi full available entitlement owner','ClaimRequest','Claim',{...command('distribution:claim','M11'),status:202,effect:'Jumlah penuh outstanding net dihitung server; current recipient version, funding/reserve/claimed diperiksa atomik. Insufficient funding tidak menghasilkan pembayaran parsial diam-diam.'});
get('/claims/{claimId}','getClaim','distribution','Status claim dan attempts','Claim',{requirements:['M11','M12']});
get('/claims/{claimId}/receipt','getClaimReceipt','distribution','Receipt setelah finalized dan reconciled','Receipt',{requirements:['M11'],effect:'Pending/unknown menghasilkan 409 STATE_CONFLICT; synthetic receipt ditandai, bukan on-chain issuance.'});
get('/payout-attempts/{attemptId}','getPayoutAttempt','distribution','Status attempt tanpa blind resend','PayoutAttempt',{requirements:['M11','M12']});
get('/allocations/{allocationId}','getAllocation','investment','Poll allocation synthetic/testnet milik owner','Allocation',{requirements:['M09']});
get('/observations/{observationId}','getObservation','investment','Poll hint pembayaran dan finality','Observation',{requirements:['M09']});
get('/me/activity','listActivity','investor','Aktivitas domain owner','Activity',{...list,requirements:['M09','M11','M12'],filters:{offeringId:id}});
post('/cases','createCase','exceptions','Laporkan exception pada resource owner','CaseRequest','Case',command('case:create','M12','M14'));
get('/cases/{caseId}','getCase','exceptions','Status case owner atau assigned staff','Case',{requirements:['M12']});
get('/me/cases','listMyCases','exceptions','Daftar case owner','Case',{...list,requirements:['M12']});
get('/refund-cases/{refundId}','getRefund','exceptions','Refund asset amount fees dan liability','RefundCase',{requirements:['M12']});

post('/admin/projects','createProject','editorial','Buat fakta proyek draft','ProjectFacts','Project',command('project:write','M06','M13'));
post('/admin/parties','createParty','editorial','Daftarkan pihak dengan authority evidence','PartyRequest','Party',command('project:write','M06','M13'));
get('/admin/parties','listParties','editorial','Pihak yang tersedia dalam scope admin','Party',{...list,...cap('project:read','M06')});
post('/admin/project-pools','createProjectPool','editorial','Buat pool terpisah satu proyek','PoolRequest','Pool',command('offering:write','M07'));
get('/admin/policy-versions','listPolicyVersions','editorial','Versi policy/config yang telah direview','PolicyVersion',{...list,...cap('project:read','M06','M07'),filters:{kind:state('payout refund assumptions privacy')},effect:'Policy/config ditetapkan melalui review konfigurasi; tidak ada endpoint edit vendor/kurs/mandat live bebas.'});
get('/admin/projects','listAdminProjects','editorial','Proyek draft dan published dalam scope','Project',{...list,...cap('project:read','M06')});
get('/admin/projects/{projectId}','getAdminProject','editorial','Fakta proyek internal versioned','Project',cap('project:read','M06'));
get('/admin/assets','listAdminAssets','editorial','Aset dalam scope admin','Asset',{...list,...cap('project:read','M05','M06')});
get('/admin/assets/{assetId}','getAdminAsset','editorial','Fakta aset internal versioned','Asset',cap('project:read','M06'));
get('/admin/offerings','listAdminOfferings','editorial','Offering draft dan published dalam scope','Offering',{...list,...cap('project:read','M06')});
get('/admin/offerings/{offeringId}','getAdminOffering','editorial','Draft terms/model offering internal','Offering',cap('project:read','M06','M07'));
api('patch','/admin/projects/{projectId}','updateProject','editorial','Revisi fakta proyek','ProjectFacts','Project',edit('project:write','M06','M13'));
post('/admin/assets','createAsset','editorial','Buat fakta aset draft','AssetFacts','Asset',command('project:write','M05','M06'));
api('patch','/admin/assets/{assetId}','updateAsset','editorial','Revisi fakta aset','AssetFacts','Asset',edit('project:write','M05','M06'));
post('/admin/offerings','createOffering','editorial','Buat draft offering model dan terms','OfferingDraftRequest','Offering',command('offering:write','M06','M07'));
api('patch','/admin/offerings/{offeringId}','updateOffering','editorial','Buat versi draft facts terms/model','OfferingDraftRequest','Offering',{...edit('offering:write','M06','M07'),effect:'Published terms/model tidak ditimpa; update menghasilkan versi draft baru, tidak mengubah historical consent.'});
post('/admin/projects/{projectId}/revisions','createRevision','editorial','Draft konten typed tujuh tab','RevisionRequest','Revision',command('content:write','M06'));
get('/admin/revisions/{revisionId}','getRevision','editorial','Baca draft/review version','Revision',cap('content:read','M06'));
get('/admin/revisions','listRevisions','editorial','Daftar versi editorial dalam scope','Revision',{...list,...cap('content:read','M06'),filters:{projectId:id,offeringId:id}});
post('/admin/revisions/{revisionId}/submissions','submitRevision','editorial','Kirim exact revision untuk review','ReasonRequest','Revision',edit('content:write','M06'));
post('/admin/revisions/{revisionId}/review','reviewRevision','editorial','Review exact revision','ReviewRequest','ReviewDecision',edit('content:review','M06','M13'));
post('/admin/revisions/{revisionId}/publications','publishRevision','editorial','Publish revision approved','PublicationRequest','Publication',{...edit('content:publish','M06'),effect:'Review decision harus approve exact version, reference valid dan seluruh 7 tab published tersedia per locale. Publish atomik, histori/correction tetap.'});
post('/admin/offerings/{offeringId}/terms-reviews','reviewTerms','editorial','Review exact terms/model version','ReviewRequest','ReviewDecision',edit('terms:review','M06','M07','M13'));
post('/admin/offerings/{offeringId}/terms-publications','publishTerms','editorial','Publish terms/model approved','PublicationRequest','Publication',edit('content:publish','M06','M07'));
post('/admin/uploads','createUpload','evidence','Buat private upload intent','UploadRequest','UploadIntent',{...command('evidence:write','M06','M13'),effect:'Admin/assigned staff saja. Signed PUT 5 menit, <=25MiB, MIME allowlist; objek quarantined. Tidak tersedia pada contact publik.'});
post('/admin/uploads/{uploadId}/completions','completeUpload','evidence','Verifikasi size hash MIME scan','UploadCompleteRequest','UploadedObject',{...command('evidence:write','M06'),status:202,effect:'Server baca objek dan verifikasi hash/size/MIME+scan; client sha256 bukan bukti verifikasi.'});
get('/admin/uploads/{uploadId}','getUploadStatus','evidence','Poll verifikasi upload privat','UploadStatus',cap('evidence:read','M06'));
post('/admin/media','createMedia','evidence','Daftarkan gambar terverifikasi untuk editor','MediaRequest','Media',command('evidence:write','M06'));
post('/admin/evidence','createEvidence','evidence','Hubungkan verified object ke sumber/period','EvidenceRequest','Evidence',command('evidence:write','M06','M10'));
get('/admin/evidence','listEvidence','evidence','Daftar evidence internal per proyek','Evidence',{...list,...cap('evidence:read','M06'),filters:{projectId:id,offeringId:id}});
get('/admin/evidence/{evidenceId}','getEvidence','evidence','Detail evidence internal','Evidence',cap('evidence:read','M06'));
post('/admin/evidence/{evidenceId}/review','reviewEvidence','evidence','Review evidence dan authority','ReviewRequest','ReviewDecision',edit('evidence:review','M06','M13'));
post('/admin/documents','createDocumentVersion','evidence','Buat versi original atau investor copy','DocumentRequest','Document',command('document:write','M04','M06'));
get('/admin/documents','listAdminDocuments','evidence','Daftar versi dokumen draft/original/copy','Document',{...list,...cap('document:read','M06'),filters:{offeringId:id}});
get('/admin/documents/{documentId}','getAdminDocument','evidence','Baca metadata draft/original internal','Document',cap('document:read','M06'));
post('/admin/documents/{documentId}/review','reviewDocument','evidence','Review exact document version','ReviewRequest','ReviewDecision',edit('document:review','M04','M06','M13'));
post('/admin/documents/{documentId}/publications','publishDocument','evidence','Publish reviewed investor copy','PublicationRequest','Publication',{...edit('content:publish','M04','M06'),effect:'Original tetap privileged walaupun approved; redaction reason dan source/version terlihat pada investor copy.'});

post('/admin/operation-records','createOperationRecord','reporting','Catat operasi ber-source','OperationRecordRequest','OperationRecord',command('report:write','M10'));
post('/admin/invoices','createInvoice','reporting','Catat invoice atau koreksi versioned','InvoiceRequest','Invoice',command('finance:record','M10','M12'));
get('/admin/invoices','listInvoices','reporting','Daftar invoice dan aging','Invoice',{...list,...cap('finance:read','M10'),filters:{projectId:id}});
post('/admin/collections','createCollection','reporting','Catat collection evidence pending','CollectionRequest','Collection',{...command('finance:record','M10'),effect:'Record pending verification; tidak langsung kas cleared atau claimable.'});
get('/admin/collections','listCollections','reporting','Daftar cleared/unmatched collection','Collection',{...list,...cap('finance:read','M10'),filters:{projectId:id}});
post('/admin/collections/{collectionId}/review','reviewCollection','reporting','Review collection dengan evidence/reconciliation','ReviewRequest','ReviewDecision',edit('finance:review','M10','M13'));
post('/admin/collection-matches','matchCollection','reporting','Match partial atau multi-invoice collection','CollectionMatchRequest','CollectionMatch',{...command('finance:record','M10'),effect:'Hanya cleared collection, same project/currency, no over-match; reconciliation ID server, bukan dari client.'});
post('/admin/projects/{projectId}/reports','createReport','reporting','Buat monthly report/correction draft','ReportRequest','Report',command('report:write','M06','M10'));
get('/admin/reports/{reportId}','getAdminReport','reporting','Baca report draft/versions','Report',cap('report:read','M10'));
get('/admin/reports','listAdminReports','reporting','Laporan draft dan published dalam scope','Report',{...list,...cap('report:read','M10'),filters:{projectId:id,offeringId:id}});
post('/admin/reports/{reportId}/submissions','submitReport','reporting','Kirim report exact version','ReasonRequest','Report',edit('report:write','M10'));
post('/admin/reports/{reportId}/review','reviewReport','reporting','Review report exact version','ReviewRequest','ReviewDecision',edit('report:review','M10','M13'));
post('/admin/reports/{reportId}/publications','publishReport','reporting','Publish report approved/correction','PublicationRequest','Publication',edit('content:publish','M06','M10'));

get('/admin/eligibility-cases','listEligibilityCases','access','Daftar eligibility cases','Eligibility',{...list,...cap('eligibility:review','M08'),filters:{offeringId:id}});
post('/admin/eligibility-cases/{eligibilityId}/decisions','decideEligibility','access','Keputusan eligibility exact scope','EligibilityDecisionRequest','Eligibility',{...edit('eligibility:review','M08','M13'),effect:'D0 sandbox:true; scope country/party/offering dan expiry. Tidak membuka live atau memberikan read privilege original.'});
post('/admin/subscriptions/{subscriptionId}/settlements','recordSettlement','servicing','Submit net settlement evidence','SettlementRequest','Settlement',{...command('finance:record','M09','M12'),effect:'Amount proposal dicek evidence/FX fees; net settlement belum verified pada create.'});
post('/admin/settlements/{settlementId}/review','reviewSettlement','servicing','Review dan reconcile net settlement','ReviewRequest','ReviewDecision',{...edit('finance:review','M09','M13'),effect:'Approve butuh matching input/conversion/ledger/evidence dan finalized policy D1; tidak mengesahkan net bank settle hanya dari receipt.'});
post('/admin/offerings/{offeringId}/closings','createClosing','servicing','Propose successful/failed closing','ClosingRequest','Closing',edit('offering:close','M09','M12'));
post('/admin/closings/{closingId}/review','reviewClosing','servicing','Review closing sesuai terms/cap','ReviewRequest','ReviewDecision',edit('finance:review','M09','M13'));
post('/admin/subscriptions/{subscriptionId}/allocations','allocateSubscription','servicing','Allocation dari settled rights dan approved closing','AllocationRequest','Allocation',{...command('allocation:execute','M09'),status:202,effect:'Server derive units. Unique subscription/settlement/closing economics; tidak boleh full refund atas dana sama. D0 registered synthetic; D1 mint finalized+register reconciliation.'});
post('/admin/distribution-batches','calculateDistribution','servicing','Hitung hak/periode dari reviewed collected cash','DistributionRequest','DistributionBatch',{...command('distribution:calculate','M10','M11'),effect:'Server derive snapshots/amount/deductions/units. Tidak menerima arbitrary entitlement amount; collection belum pernah dikonsumsi ganda.'});
get('/admin/distribution-batches/{batchId}','getDistributionBatch','servicing','Baca calculation dan funding state','DistributionBatch',cap('finance:read','M11'));
get('/admin/distribution-batches/{batchId}/entitlements','listBatchEntitlements','servicing','Periksa snapshot hak dan net distribution','Entitlement',{...list,...cap('finance:read','M11')});
post('/admin/distribution-batches/{batchId}/approve','reviewDistribution','servicing','Approve exact calculation version','ReviewRequest','ReviewDecision',{...edit('distribution:approve','M11','M13'),effect:'Actor terpisah sesuai mandate; approved tidak otomatis funded/claimable.'});
post('/admin/distribution-batches/{batchId}/funding-notifications','notifyDistributionFunding','servicing','Antrekan verifikasi dana batch','FundingHint','Funding',{...command('distribution:fund','M11'),status:202,effect:'Hint tidak dipercaya; finalized verified funding/reservation per batch dan reconciliation wajib sebelum claimable.'});
get('/admin/fundings/{fundingId}','getFunding','servicing','Poll verifikasi funding batch','Funding',cap('finance:read','M11'));
post('/admin/claims/{claimId}/reconciliations','reconcileClaim','servicing','Rekonsiliasi transfer claim pending/unknown','ReasonRequest','Job',{...command('finance:reconcile','M11','M12'),status:202,effect:'Cari attempt sender/nonce/replacement/canonical logs. Tidak membuat pembayaran baru atau menghapus claimed history.'});
post('/admin/refund-cases','createRefund','exceptions','Propose refund dari exception dan bound terms','RefundRequest','RefundCase',{...command('refund:propose','M12'),effect:'Currency/fees/amount diturunkan dari bound refundPolicy/net funds; jangan menjanjikan USD awal sesudah conversion.'});
post('/admin/refund-cases/{refundId}/approve','reviewRefund','exceptions','Review exact refund liability','ReviewRequest','ReviewDecision',edit('refund:approve','M12','M13'));
post('/admin/refund-cases/{refundId}/executions','executeRefund','exceptions','Dispatch approved refund secara durable','ReasonRequest','RefundCase',{...edit('refund:execute','M12'),status:202,effect:'Reservation terhadap unallocated funds; unknown tetap liability dan direconcile, bukan blind resend.'});
get('/admin/cases','listAdminCases','exceptions','Daftar assigned exception cases','Case',{...list,...cap('case:read','M12')});
api('patch','/admin/cases/{caseId}','updateCase','exceptions','Review dan resolusi case','CaseUpdate','Case',edit('case:review','M12'));
post('/admin/reconciliation-runs','createReconciliation','operations','Mulai rekonsiliasi domain/register/chain','ReconciliationRequest','ReconciliationRun',{...command('finance:reconcile','M09','M11','M12'),status:202});
get('/admin/reconciliation-runs/{runId}','getReconciliation','operations','Status dan breaks run','ReconciliationRun',cap('finance:read','M12'));
get('/admin/reconciliation-breaks','listReconciliationBreaks','operations','Daftar discrepancy tidak terselesaikan','ReconciliationBreak',{...list,...cap('finance:read','M12'),filters:{runId:id}});
post('/admin/reconciliation-breaks/{breakId}/resolutions','resolveReconciliationBreak','operations','Catat resolusi evidence/reversal','BreakResolution','ReconciliationBreak',{...edit('finance:reconcile','M12','M13'),effect:'Resolve hanya sesudah invariant kembali benar; correcting journal posted/reviewed. Tidak overwrite journal atau membuat selisih hilang tanpa evidence.'});
get('/admin/ledger-entries','listLedgerEntries','operations','Baca immutable entries per pool/currency','JournalEntry',{...list,...cap('ledger:read','M09','M11','M12'),filters:{poolId:id,currency:en('IDR','IDRX','USDC','ETH'),resourceId:id}});
get('/admin/audit-events','listAuditEvents','operations','Audit actor resource version request','AuditEvent',{...list,...cap('audit:read','M13'),filters:{resourceId:id}});
get('/admin/grants','listGrants','access','Daftar grant scope dan expiry','Grant',{...list,...cap('grant:read','M13')});
post('/admin/grants','proposeGrant','access','Propose capability grant berbasis mandate','GrantRequest','Grant',{...command('grant:propose','M13'),effect:'Capability harus dalam delegable authority actor; tidak self-grant; create pending_review.'});
post('/admin/grants/{grantId}/review','reviewGrant','access','Review grant oleh authority berbeda','ReviewRequest','ReviewDecision',edit('grant:approve','M13'));
post('/admin/grants/{grantId}/revocations','revokeGrant','access','Cabut grant dan invalidasi current permissions','ReasonRequest','Grant',edit('grant:revoke','M13'));
post('/admin/recovery-cases','proposeRecovery','recovery','Propose same-owner wallet recovery','RecoveryRequest','RecoveryCase',{...command('recovery:propose','M14'),phase:'D1',effect:'Evidence ownership lama/baru dan issuer mandate; address baru tidak otomatis verified karena dicantumkan. Bukan assignment hak/private-key recovery.'});
get('/admin/recovery-cases/{recoveryId}','getRecovery','recovery','Lacak recovery old/new binding','RecoveryCase',{...cap('recovery:read','M14'),phase:'D1'});
post('/admin/recovery-cases/{recoveryId}/review','reviewRecovery','recovery','Issuer/security review exact recovery','ReviewRequest','ReviewDecision',{...edit('recovery:approve','M14','M13'),phase:'D1'});
post('/admin/recovery-cases/{recoveryId}/executions','executeRecovery','recovery','Freeze old lalu replace/reconcile binding','ReasonRequest','RecoveryCase',{...edit('recovery:execute','M14'),status:202,phase:'D1',effect:'Old recipient/representation disabled sebelum replacement. Position IDs dan record-date entitlement/claimed history tetap; failure/unknown fail closed.'});
get('/admin/live-gates','getLiveGates','operations','Status bukti dependency sebelum live','LiveGates',{...cap('readiness:read','M15'),phase:'live-gate',effect:'Read-only tracking. Tidak ada endpoint enable live; status gate bukan persetujuan legal baru.'});

post('/webhooks/providers/{providerKey}','ingestProviderEvent','integration','Ingest event dari adapter terotentikasi','ProviderEvent','ProviderReceipt',{public:true,provider:true,requirements:['M09','M11','M12'],phase:'D1-adapter',status:202,effect:'Contract adapter internal, bukan signature wire vendor yang belum dipilih. HMAC raw bytes + timestamp + event id; durable inbox/dedupe sebelum 202; reconciliation menetapkan outcome.'});
get('/demo/scenarios','listDemoScenarios','demo','Daftar fixture investasi synthetic','DemoScenario',{...list,...cap('demo:control','M05','M09','M11'),demo:true});
post('/demo/scenario-runs','createDemoRun','demo','Buat run synthetic terisolasi owner','DemoRunRequest','DemoRun',{...command('demo:control','M05','M09','M11'),demo:true,effect:'Fixture version pinned, login/grant tetap nyata; tidak ada dana/testnet transfer otomatis.'});
get('/demo/scenario-runs/{demoRunId}','getDemoRun','demo','Status dan resource IDs fixture run','DemoRun',{...cap('demo:control','M09','M11'),demo:true});
post('/demo/scenario-runs/{demoRunId}/commands','advanceDemo','demo','Jalankan langkah/failure fixture','DemoCommand','Job',{...edit('demo:control','M08','M09','M10','M11','M12'),demo:true,status:202,effect:'Jalankan domain services yang sama via synthetic adapter, bukan force arbitrary status. Reset membuat generation baru, tidak menghapus auth/grants/audit/history atau memberi double claim.'});

schemas.GrantRequest.properties.capability = en(...[...new Set(operations.map(o=>o.capability).filter(Boolean))].sort());
schemas.GrantRequest.properties.capability.enum.push('document:original:read');
schemas.Grant.properties.capability = schemas.GrantRequest.properties.capability;
for (const operation of operations) {
  if (['createInquiry','getOfferingTabs','getQuote','getClaim'].includes(operation.operationId)) operation.requirements.push('M17');
  if(!operation.implemented&&!operation.public&&operation.method!=='get')operation.origin=true;
}
