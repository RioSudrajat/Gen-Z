# Quote, subscription dan allocation

> Dihasilkan dari [contract.mjs](contract.mjs); edit sumber lalu jalankan `node scripts/build-api-contract.mjs`. Baseline 18 Oktober 2026.

[Indeks API](../api.md) · [OpenAPI](openapi.json) · [Konvensi](conventions.md) · [M01–M17](coverage.md). Contoh JSON request/response lengkap beserta schemas nested ada di OpenAPI. Status **proposed** berarti belum diimplementasikan.

| Operation | Method/path | Status | Acceptance |
|---|---|---|---|
| [listChainAssets](#listchainassets) | `GET /api/v1/chain-assets` | proposed | M08 |
| [listMyEligibility](#listmyeligibility) | `GET /api/v1/me/eligibility` | proposed | M08 |
| [applyEligibility](#applyeligibility) | `POST /api/v1/eligibility/applications` | proposed | M08 |
| [createQuote](#createquote) | `POST /api/v1/investment-quotes` | proposed | M08 |
| [getQuote](#getquote) | `GET /api/v1/investment-quotes/{quoteId}` | proposed | M08, M17 |
| [createSubscription](#createsubscription) | `POST /api/v1/subscriptions` | proposed | M08, M09 |
| [listSubscriptions](#listsubscriptions) | `GET /api/v1/me/subscriptions` | proposed | M09, M12 |
| [getSubscription](#getsubscription) | `GET /api/v1/subscriptions/{subscriptionId}` | proposed | M09, M12 |
| [notifyPayment](#notifypayment) | `POST /api/v1/subscriptions/{subscriptionId}/payment-notifications` | proposed | M08, M09 |
| [getAllocation](#getallocation) | `GET /api/v1/allocations/{allocationId}` | proposed | M09 |
| [getObservation](#getobservation) | `GET /api/v1/observations/{observationId}` | proposed | M09 |

## listChainAssets

**Registry aset aktif per environment** — `GET /api/v1/chain-assets`

Status: **proposed [R]**; fase D0; sukses 200 → `ChainAsset` (list).

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.

Pagination `limit` 1–100 (default 20), cursor opaque. 

Testnet hanya registry test tokens/ETH; address mock dicatat saat deploy, bukan diciptakan di kontrak docs.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## listMyEligibility

**Status eligibility per offering** — `GET /api/v1/me/eligibility`

Status: **proposed [R]**; fase D0; sukses 200 → `Eligibility` (list).

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.

Pagination `limit` 1–100 (default 20), cursor opaque. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

Query filters: `offeringId`: Id.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## applyEligibility

**Ajukan eligibility sandbox** — `POST /api/v1/eligibility/applications`

Status: **proposed [R]**; fase D0; sukses 201 → `Eligibility`.

Akses: session cookie dan scope resource; capability `eligibility:apply`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `offeringId` | Ya | Id |
| `countryCode` | Ya | string |
| `applicantKind` | Ya | `person` / `organization` |
| `evidenceVersionIds` | Ya | array<Id>; maks 100 item |
| `disclosureAccepted` | Ya | true |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## createQuote

**Quote exact input ke net IDR rights** — `POST /api/v1/investment-quotes`

Status: **proposed [R]**; fase D0; sukses 201 → `Quote`.

Akses: session cookie dan scope resource; capability `investment:subscribe`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Periksa eligibility/cap/showcase/model dan registry; amount > 0. D0 synthetic; executable hanya untuk adapter environment yang tersedia.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `offeringId` | Ya | Id |
| `termsVersionId` | Ya | Id |
| `modelVersionId` | Ya | Id |
| `inputAssetId` | Ya | Id |
| `inputAmountMinor` | Ya | PositiveInteger |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **409** `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`, `STATE_CONFLICT`, `QUOTE_EXPIRED`, `TERMS_CHANGED`, `CAP_EXCEEDED`, `ELIGIBILITY_REQUIRED`, `OFFERING_UNAVAILABLE`, `INSUFFICIENT_FUNDING`, `ALREADY_CLAIMED`, `RECIPIENT_CHANGED`, `RECONCILIATION_REQUIRED`, `UPLOAD_NOT_VERIFIED`, `REVIEW_REQUIRED`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## getQuote

**Baca quote milik acting party** — `GET /api/v1/investment-quotes/{quoteId}`

Status: **proposed [R]**; fase D0; sukses 200 → `Quote`.

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.



Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## createSubscription

**Consent dan cap reservation** — `POST /api/v1/subscriptions`

Status: **proposed [R]**; fase D0; sukses 201 → `Subscription`.

Akses: session cookie dan scope resource; capability `investment:subscribe`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Server stamps consent; exact terms/model/docs/quote/eligibility/cap atomik. Payment instructions tidak langsung membuat allocation.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `quoteId` | Ya | Id |
| `termsVersionId` | Ya | Id |
| `modelVersionId` | Ya | Id |
| `documentVersionIds` | Ya | array<Id>; maks 100 item |
| `riskAcknowledged` | Ya | true |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **409** `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`, `STATE_CONFLICT`, `QUOTE_EXPIRED`, `TERMS_CHANGED`, `CAP_EXCEEDED`, `ELIGIBILITY_REQUIRED`, `OFFERING_UNAVAILABLE`, `INSUFFICIENT_FUNDING`, `ALREADY_CLAIMED`, `RECIPIENT_CHANGED`, `RECONCILIATION_REQUIRED`, `UPLOAD_NOT_VERIFIED`, `REVIEW_REQUIRED`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## listSubscriptions

**Riwayat subscription owner** — `GET /api/v1/me/subscriptions`

Status: **proposed [R]**; fase D0; sukses 200 → `Subscription` (list).

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.

Pagination `limit` 1–100 (default 20), cursor opaque. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

Query filters: `offeringId`: Id.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## getSubscription

**Status payment sampai allocation/refund** — `GET /api/v1/subscriptions/{subscriptionId}`

Status: **proposed [R]**; fase D0; sukses 200 → `Subscription`.

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.



Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## notifyPayment

**Terima petunjuk pembayaran yang belum dipercaya** — `POST /api/v1/subscriptions/{subscriptionId}/payment-notifications`

Status: **proposed [R]**; fase D0; sukses 202 → `Observation`.

Akses: session cookie dan scope resource; capability `investment:subscribe`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Verifikasi escrow binding, receipt, asset, amount, finality dan reconciliation di worker. Hint bukan paid=true atau net settlement.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `chainId` | Ya | 84532 |
| `txHash` | Ya | TxHash |
| `inputAssetId` | Ya | Id |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`, `STATE_CONFLICT`, `QUOTE_EXPIRED`, `TERMS_CHANGED`, `CAP_EXCEEDED`, `ELIGIBILITY_REQUIRED`, `OFFERING_UNAVAILABLE`, `INSUFFICIENT_FUNDING`, `ALREADY_CLAIMED`, `RECIPIENT_CHANGED`, `RECONCILIATION_REQUIRED`, `UPLOAD_NOT_VERIFIED`, `REVIEW_REQUIRED`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.

Poll: [getObservation](investment.md#getobservation); baca `Location`/`Retry-After`. 202 bukan final accounting/payment.


## getAllocation

**Poll allocation synthetic/testnet milik owner** — `GET /api/v1/allocations/{allocationId}`

Status: **proposed [R]**; fase D0; sukses 200 → `Allocation`.

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.



Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## getObservation

**Poll hint pembayaran dan finality** — `GET /api/v1/observations/{observationId}`

Status: **proposed [R]**; fase D0; sukses 200 → `Observation`.

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.



Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## Model respons

Schema nested, constraints dan contoh nilai lengkap ada di [OpenAPI](openapi.json). Domain proposed dibungkus envelope; auth existing raw.

### ChainAsset

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `environment` | Ya | Environment |
| `chainId` | Ya | 84532 |
| `symbol` | Ya | `TEST_USDC` / `MOCK_IDRX` / `ETH` |
| `kind` | Ya | `erc20` / `native` |
| `tokenAddress` | Ya | EvmAddress atau null |
| `decimals` | Ya | `2` / `6` / `18` |
| `enabled` | Ya | boolean |
| `sourceReference` | Ya | string; maks 500 karakter |
| `verifiedAt` | Ya | Timestamp |

### Eligibility

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `partyId` | Ya | Id |
| `offeringId` | Ya | Id |
| `countryCode` | Ya | string |
| `state` | Ya | `pending` / `approved` / `rejected` / `expired` / `revoked` |
| `sandbox` | Ya | boolean |
| `reasons` | Ya | array<string>; maks 30 item |
| `expiresAt` | Ya | Timestamp atau null |
| `reviewerAccountId` | Ya | Id atau null |
| `revision` | Ya | RevisionControl |

### Quote

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `offeringId` | Ya | Id |
| `partyId` | Ya | Id |
| `termsVersionId` | Ya | Id |
| `modelVersionId` | Ya | Id |
| `inputAsset` | Ya | ChainAsset |
| `inputAmountMinor` | Ya | UnsignedInteger |
| `fx` | Ya | object |
| `fees` | Ya | array<object>; maks 30 item |
| `grossRights` | Ya | RightsMoney |
| `netRights` | Ya | RightsMoney |
| `minNetRights` | Ya | RightsMoney |
| `expiresAt` | Ya | Timestamp |
| `state` | Ya | `active` / `expired` / `consumed` / `unavailable` |
| `executable` | Ya | boolean |
| `refundPolicyVersionId` | Ya | Id |
| `payoutPolicyVersionId` | Ya | Id |

### Subscription

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `partyId` | Ya | Id |
| `offeringId` | Ya | Id |
| `quoteId` | Ya | Id |
| `termsVersionId` | Ya | Id |
| `modelVersionId` | Ya | Id |
| `documentVersionIds` | Ya | array<Id>; maks 100 item |
| `consentedAt` | Ya | Timestamp |
| `state` | Ya | `payment_pending` / `input_confirmed` / `conversion_pending` / `net_settled` / `allocated` / `quote_expired` / `unmatched` / `underpaid` / `overpaid` / `conversion_failed` / `closing_failed` / `refund_pending` / `refunded` |
| `inputAssetId` | Ya | Id |
| `expectedInputAmountMinor` | Ya | UnsignedInteger |
| `receivedInputAmountMinor` | Ya | UnsignedInteger |
| `netSettledRights` | Ya | RightsMoney atau null |
| `settlementIds` | Ya | array<Id>; maks 100 item |
| `allocationIds` | Ya | array<Id>; maks 100 item |
| `positionIds` | Ya | array<Id>; maks 100 item |
| `refundCaseIds` | Ya | array<Id>; maks 100 item |
| `paymentInstructions` | Ya | PaymentInstructions |
| `revision` | Ya | RevisionControl |

### Observation

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `businessResourceId` | Ya | Id |
| `chainId` | Ya | 84532 |
| `txHash` | Ya | TxHash |
| `state` | Ya | `received` / `pending_verification` / `included` / `safe` / `finalized` / `reconciled` / `rejected` / `orphaned` / `replaced` / `unknown` |
| `receivedAt` | Ya | Timestamp |

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
