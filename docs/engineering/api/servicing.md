# Settlement, closing dan distribution servicing

> Dihasilkan dari [contract.mjs](contract.mjs); edit sumber lalu jalankan `node scripts/build-api-contract.mjs`. Baseline 18 Oktober 2026.

[Indeks API](../api.md) · [OpenAPI](openapi.json) · [Konvensi](conventions.md) · [M01–M17](coverage.md). Contoh JSON request/response lengkap beserta schemas nested ada di OpenAPI. Status **proposed** berarti belum diimplementasikan.

| Operation | Method/path | Status | Acceptance |
|---|---|---|---|
| [recordSettlement](#recordsettlement) | `POST /api/v1/admin/subscriptions/{subscriptionId}/settlements` | proposed | M09, M12 |
| [reviewSettlement](#reviewsettlement) | `POST /api/v1/admin/settlements/{settlementId}/review` | proposed | M09, M13 |
| [createClosing](#createclosing) | `POST /api/v1/admin/offerings/{offeringId}/closings` | proposed | M09, M12 |
| [reviewClosing](#reviewclosing) | `POST /api/v1/admin/closings/{closingId}/review` | proposed | M09, M13 |
| [allocateSubscription](#allocatesubscription) | `POST /api/v1/admin/subscriptions/{subscriptionId}/allocations` | proposed | M09 |
| [calculateDistribution](#calculatedistribution) | `POST /api/v1/admin/distribution-batches` | proposed | M10, M11 |
| [getDistributionBatch](#getdistributionbatch) | `GET /api/v1/admin/distribution-batches/{batchId}` | proposed | M11 |
| [listBatchEntitlements](#listbatchentitlements) | `GET /api/v1/admin/distribution-batches/{batchId}/entitlements` | proposed | M11 |
| [reviewDistribution](#reviewdistribution) | `POST /api/v1/admin/distribution-batches/{batchId}/approve` | proposed | M11, M13 |
| [notifyDistributionFunding](#notifydistributionfunding) | `POST /api/v1/admin/distribution-batches/{batchId}/funding-notifications` | proposed | M11 |
| [getFunding](#getfunding) | `GET /api/v1/admin/fundings/{fundingId}` | proposed | M11 |
| [reconcileClaim](#reconcileclaim) | `POST /api/v1/admin/claims/{claimId}/reconciliations` | proposed | M11, M12 |

## recordSettlement

**Submit net settlement evidence** — `POST /api/v1/admin/subscriptions/{subscriptionId}/settlements`

Status: **proposed [R]**; fase D0; sukses 201 → `Settlement`.

Akses: session cookie dan scope resource; capability `finance:record`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Amount proposal dicek evidence/FX fees; net settlement belum verified pada create.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `inputObservationIds` | Ya | array<Id>; maks 100 item |
| `netRights` | Ya | RightsMoney |
| `conversionReference` | Ya | string atau null |
| `evidenceVersionIds` | Ya | array<Id>; maks 100 item |
| `refundPolicyVersionId` | Ya | Id |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## reviewSettlement

**Review dan reconcile net settlement** — `POST /api/v1/admin/settlements/{settlementId}/review`

Status: **proposed [R]**; fase D0; sukses 201 → `ReviewDecision`.

Akses: session cookie dan scope resource; capability `finance:review`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `If-Match` exact revision. Wajib `Origin` yang diizinkan. 

Approve butuh matching input/conversion/ledger/evidence dan finalized policy D1; tidak mengesahkan net bank settle hanya dari receipt.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `decision` | Ya | `approve` / `reject` / `request_changes` |
| `reason` | Ya | string; maks 2000 karakter |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **412** `VERSION_MISMATCH`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **428** `VERSION_REQUIRED`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## createClosing

**Propose successful/failed closing** — `POST /api/v1/admin/offerings/{offeringId}/closings`

Status: **proposed [R]**; fase D0; sukses 201 → `Closing`.

Akses: session cookie dan scope resource; capability `offering:close`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `If-Match` exact revision. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `decision` | Ya | `close_success` / `closing_failed` |
| `reason` | Ya | string; maks 2000 karakter |
| `termsVersionId` | Ya | Id |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **412** `VERSION_MISMATCH`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **428** `VERSION_REQUIRED`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## reviewClosing

**Review closing sesuai terms/cap** — `POST /api/v1/admin/closings/{closingId}/review`

Status: **proposed [R]**; fase D0; sukses 201 → `ReviewDecision`.

Akses: session cookie dan scope resource; capability `finance:review`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `If-Match` exact revision. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `decision` | Ya | `approve` / `reject` / `request_changes` |
| `reason` | Ya | string; maks 2000 karakter |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **412** `VERSION_MISMATCH`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **428** `VERSION_REQUIRED`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## allocateSubscription

**Allocation dari settled rights dan approved closing** — `POST /api/v1/admin/subscriptions/{subscriptionId}/allocations`

Status: **proposed [R]**; fase D0; sukses 202 → `Allocation`.

Akses: session cookie dan scope resource; capability `allocation:execute`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Server derive units. Unique subscription/settlement/closing economics; tidak boleh full refund atas dana sama. D0 registered synthetic; D1 mint finalized+register reconciliation.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `settlementId` | Ya | Id |
| `closingId` | Ya | Id |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`, `STATE_CONFLICT`, `QUOTE_EXPIRED`, `TERMS_CHANGED`, `CAP_EXCEEDED`, `ELIGIBILITY_REQUIRED`, `OFFERING_UNAVAILABLE`, `INSUFFICIENT_FUNDING`, `ALREADY_CLAIMED`, `RECIPIENT_CHANGED`, `RECONCILIATION_REQUIRED`, `UPLOAD_NOT_VERIFIED`, `REVIEW_REQUIRED`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.

Poll: [getAllocation](investment.md#getallocation); baca `Location`/`Retry-After`. 202 bukan final accounting/payment.


## calculateDistribution

**Hitung hak/periode dari reviewed collected cash** — `POST /api/v1/admin/distribution-batches`

Status: **proposed [R]**; fase D0; sukses 201 → `DistributionBatch`.

Akses: session cookie dan scope resource; capability `distribution:calculate`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Server derive snapshots/amount/deductions/units. Tidak menerima arbitrary entitlement amount; collection belum pernah dikonsumsi ganda.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `offeringId` | Ya | Id |
| `modelVersionId` | Ya | Id |
| `period` | Ya | Period |
| `recordDate` | Ya | Timestamp |
| `collectionIds` | Ya | array<Id>; maks 100 item |
| `reportVersionId` | Ya | Id |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **409** `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`, `STATE_CONFLICT`, `QUOTE_EXPIRED`, `TERMS_CHANGED`, `CAP_EXCEEDED`, `ELIGIBILITY_REQUIRED`, `OFFERING_UNAVAILABLE`, `INSUFFICIENT_FUNDING`, `ALREADY_CLAIMED`, `RECIPIENT_CHANGED`, `RECONCILIATION_REQUIRED`, `UPLOAD_NOT_VERIFIED`, `REVIEW_REQUIRED`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## getDistributionBatch

**Baca calculation dan funding state** — `GET /api/v1/admin/distribution-batches/{batchId}`

Status: **proposed [R]**; fase D0; sukses 200 → `DistributionBatch`.

Akses: session cookie dan scope resource; capability `finance:read`. Sesi + current resource scope; actor/party diputuskan server.



Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## listBatchEntitlements

**Periksa snapshot hak dan net distribution** — `GET /api/v1/admin/distribution-batches/{batchId}/entitlements`

Status: **proposed [R]**; fase D0; sukses 200 → `Entitlement` (list).

Akses: session cookie dan scope resource; capability `finance:read`. Sesi + current resource scope; actor/party diputuskan server.

Pagination `limit` 1–100 (default 20), cursor opaque. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## reviewDistribution

**Approve exact calculation version** — `POST /api/v1/admin/distribution-batches/{batchId}/approve`

Status: **proposed [R]**; fase D0; sukses 201 → `ReviewDecision`.

Akses: session cookie dan scope resource; capability `distribution:approve`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `If-Match` exact revision. Wajib `Origin` yang diizinkan. 

Actor terpisah sesuai mandate; approved tidak otomatis funded/claimable.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `decision` | Ya | `approve` / `reject` / `request_changes` |
| `reason` | Ya | string; maks 2000 karakter |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **412** `VERSION_MISMATCH`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **428** `VERSION_REQUIRED`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## notifyDistributionFunding

**Antrekan verifikasi dana batch** — `POST /api/v1/admin/distribution-batches/{batchId}/funding-notifications`

Status: **proposed [R]**; fase D0; sukses 202 → `Funding`.

Akses: session cookie dan scope resource; capability `distribution:fund`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Hint tidak dipercaya; finalized verified funding/reservation per batch dan reconciliation wajib sebelum claimable.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `chainId` | Ya | 84532 |
| `txHash` | Ya | TxHash |
| `assetId` | Ya | Id |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`, `STATE_CONFLICT`, `QUOTE_EXPIRED`, `TERMS_CHANGED`, `CAP_EXCEEDED`, `ELIGIBILITY_REQUIRED`, `OFFERING_UNAVAILABLE`, `INSUFFICIENT_FUNDING`, `ALREADY_CLAIMED`, `RECIPIENT_CHANGED`, `RECONCILIATION_REQUIRED`, `UPLOAD_NOT_VERIFIED`, `REVIEW_REQUIRED`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.

Poll: [getFunding](servicing.md#getfunding); baca `Location`/`Retry-After`. 202 bukan final accounting/payment.


## getFunding

**Poll verifikasi funding batch** — `GET /api/v1/admin/fundings/{fundingId}`

Status: **proposed [R]**; fase D0; sukses 200 → `Funding`.

Akses: session cookie dan scope resource; capability `finance:read`. Sesi + current resource scope; actor/party diputuskan server.



Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## reconcileClaim

**Rekonsiliasi transfer claim pending/unknown** — `POST /api/v1/admin/claims/{claimId}/reconciliations`

Status: **proposed [R]**; fase D0; sukses 202 → `Job`.

Akses: session cookie dan scope resource; capability `finance:reconcile`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Cari attempt sender/nonce/replacement/canonical logs. Tidak membuat pembayaran baru atau menghapus claimed history.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `reason` | Ya | string; maks 2000 karakter |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.

Poll: [getJob](operations.md#getjob); baca `Location`/`Retry-After`. 202 bukan final accounting/payment.


## Model respons

Schema nested, constraints dan contoh nilai lengkap ada di [OpenAPI](openapi.json). Domain proposed dibungkus envelope; auth existing raw.

### Settlement

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `subscriptionId` | Ya | Id |
| `inputObservationIds` | Ya | array<Id>; maks 100 item |
| `netRights` | Ya | RightsMoney |
| `conversionReference` | Ya | string atau null |
| `evidenceVersionIds` | Ya | array<Id>; maks 100 item |
| `refundPolicyVersionId` | Ya | Id |
| `state` | Ya | `pending_review` / `approved` / `reconciled` / `rejected` / `reversed` |
| `reconciliationId` | Ya | Id atau null |
| `revision` | Ya | RevisionControl |

### ReviewDecision

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `subjectId` | Ya | Id |
| `subjectVersionId` | Ya | Id |
| `decision` | Ya | `approve` / `reject` / `request_changes` |
| `reason` | Ya | string; maks 2000 karakter |
| `reviewerAccountId` | Ya | Id |
| `reviewedAt` | Ya | Timestamp |

### Closing

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `offeringId` | Ya | Id |
| `decision` | Ya | `close_success` / `closing_failed` |
| `state` | Ya | `pending_review` / `approved` / `completed` / `rejected` |
| `reason` | Ya | string; maks 2000 karakter |
| `termsVersionId` | Ya | Id |
| `reviewDecisionId` | Ya | Id atau null |
| `revision` | Ya | RevisionControl |

### Allocation

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `subscriptionId` | Ya | Id |
| `settlementId` | Ya | Id |
| `closingId` | Ya | Id |
| `positionId` | Ya | Id atau null |
| `units` | Ya | Decimal |
| `netCost` | Ya | RightsMoney |
| `state` | Ya | `pending` / `registered` / `submitted` / `finalized` / `reconciled` / `rejected` |
| `contractAddress` | Ya | EvmAddress atau null |
| `txHash` | Ya | TxHash atau null |
| `createdAt` | Ya | Timestamp |

### DistributionBatch

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `offeringId` | Ya | Id |
| `modelVersionId` | Ya | Id |
| `period` | Ya | Period |
| `recordDate` | Ya | Timestamp |
| `collectionIds` | Ya | array<Id>; maks 100 item |
| `reportVersionId` | Ya | Id |
| `calculationVersionId` | Ya | Id |
| `state` | Ya | `calculated` / `reviewed` / `approved` / `funding_pending` / `funded` / `claimable` / `partially_claimed` / `completed` / `rejected` / `shortfall` / `paused` / `reconciliation_break` |
| `grossCollected` | Ya | RightsMoney |
| `deductions` | Ya | RightsMoney |
| `reserves` | Ya | RightsMoney |
| `netDistributable` | Ya | RightsMoney |
| `funded` | Ya | RightsMoney |
| `reserved` | Ya | RightsMoney |
| `claimed` | Ya | RightsMoney |
| `reviewDecisionId` | Ya | Id atau null |
| `revision` | Ya | RevisionControl |

### Entitlement

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `batchId` | Ya | Id |
| `positionId` | Ya | Id |
| `partyId` | Ya | Id |
| `snapshotUnits` | Ya | Decimal |
| `calculationVersionId` | Ya | Id |
| `income` | Ya | RightsMoney |
| `capitalRecovery` | Ya | RightsMoney atau null |
| `deductions` | Ya | RightsMoney |
| `net` | Ya | RightsMoney |
| `claimable` | Ya | RightsMoney |
| `state` | Ya | `calculated` / `approved` / `awaiting_funding` / `claimable` / `reserved` / `claimed` / `paused` |
| `payoutAssetId` | Ya | Id |
| `recipientBindingId` | Ya | Id |
| `recipientBindingVersion` | Ya | integer |
| `revision` | Ya | RevisionControl |
| `payoutAmountMinor` | Ya | UnsignedInteger |
| `payoutPolicyVersionId` | Ya | Id |
| `payoutQuoteId` | Ya | Id atau null |
| `payoutQuoteExpiresAt` | Ya | Timestamp atau null |

### Funding

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `batchId` | Ya | Id |
| `assetId` | Ya | Id |
| `amountMinor` | Ya | UnsignedInteger |
| `state` | Ya | `pending` / `verified` / `finalized` / `reconciled` / `rejected` / `shortfall` |
| `txHash` | Ya | TxHash atau null |
| `reconciliationId` | Ya | Id atau null |
| `recordedAt` | Ya | Timestamp |

### Job

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `kind` | Ya | `notification_retry` / `retention` / `reconciliation` / `closing` / `allocation` / `refund` / `demo_command` / `recovery` |
| `state` | Ya | `queued` / `running` / `succeeded` / `failed` / `blocked` |
| `resourceId` | Ya | Id atau null |
| `resultIds` | Ya | array<Id>; maks 100 item |
| `errorCode` | Ya | string atau null |
| `createdAt` | Ya | Timestamp |
| `updatedAt` | Ya | Timestamp |
