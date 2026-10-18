# Entitlement, claim dan receipt

> Dihasilkan dari [contract.mjs](contract.mjs); edit sumber lalu jalankan `node scripts/build-api-contract.mjs`. Baseline 18 Oktober 2026.

[Indeks API](../api.md) · [OpenAPI](openapi.json) · [Konvensi](conventions.md) · [M01–M17](coverage.md). Contoh JSON request/response lengkap beserta schemas nested ada di OpenAPI. Status **proposed** berarti belum diimplementasikan.

| Operation | Method/path | Status | Acceptance |
|---|---|---|---|
| [listMyEntitlements](#listmyentitlements) | `GET /api/v1/me/distributions` | proposed | M11 |
| [getEntitlement](#getentitlement) | `GET /api/v1/distribution-entitlements/{entitlementId}` | proposed | M11 |
| [listRecipientBindings](#listrecipientbindings) | `GET /api/v1/me/recipient-bindings` | proposed | M11, M14 |
| [createClaim](#createclaim) | `POST /api/v1/distribution-entitlements/{entitlementId}/claims` | proposed | M11 |
| [getClaim](#getclaim) | `GET /api/v1/claims/{claimId}` | proposed | M11, M12, M17 |
| [getClaimReceipt](#getclaimreceipt) | `GET /api/v1/claims/{claimId}/receipt` | proposed | M11 |
| [getPayoutAttempt](#getpayoutattempt) | `GET /api/v1/payout-attempts/{attemptId}` | proposed | M11, M12 |

## listMyEntitlements

**Hak distribusi dan pendanaan** — `GET /api/v1/me/distributions`

Status: **proposed [R]**; fase D0; sukses 200 → `Entitlement` (list).

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.

Pagination `limit` 1–100 (default 20), cursor opaque. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

Query filters: `positionId`: Id.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## getEntitlement

**Detail hak distribusi owner** — `GET /api/v1/distribution-entitlements/{entitlementId}`

Status: **proposed [R]**; fase D0; sukses 200 → `Entitlement`.

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.



Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## listRecipientBindings

**Recipient owner yang terverifikasi** — `GET /api/v1/me/recipient-bindings`

Status: **proposed [R]**; fase D0; sukses 200 → `RecipientBinding` (list).

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.

Pagination `limit` 1–100 (default 20), cursor opaque. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## createClaim

**Reservasi full available entitlement owner** — `POST /api/v1/distribution-entitlements/{entitlementId}/claims`

Status: **proposed [R]**; fase D0; sukses 202 → `Claim`.

Akses: session cookie dan scope resource; capability `distribution:claim`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Jumlah penuh outstanding net dihitung server; current recipient version, funding/reserve/claimed diperiksa atomik. Insufficient funding tidak menghasilkan pembayaran parsial diam-diam.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `recipientBindingId` | Ya | Id |
| `recipientBindingVersion` | Ya | integer |
| `expectedPayoutAssetId` | Ya | Id |
| `expectedPayoutAmountMinor` | Ya | PositiveInteger |
| `payoutPolicyVersionId` | Ya | Id |
| `payoutQuoteId` | Ya | Id atau null |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`, `STATE_CONFLICT`, `QUOTE_EXPIRED`, `TERMS_CHANGED`, `CAP_EXCEEDED`, `ELIGIBILITY_REQUIRED`, `OFFERING_UNAVAILABLE`, `INSUFFICIENT_FUNDING`, `ALREADY_CLAIMED`, `RECIPIENT_CHANGED`, `RECONCILIATION_REQUIRED`, `UPLOAD_NOT_VERIFIED`, `REVIEW_REQUIRED`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.

Poll: [getClaim](distribution.md#getclaim); baca `Location`/`Retry-After`. 202 bukan final accounting/payment.


## getClaim

**Status claim dan attempts** — `GET /api/v1/claims/{claimId}`

Status: **proposed [R]**; fase D0; sukses 200 → `Claim`.

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.



Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## getClaimReceipt

**Receipt setelah finalized dan reconciled** — `GET /api/v1/claims/{claimId}/receipt`

Status: **proposed [R]**; fase D0; sukses 200 → `Receipt`.

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.



Pending/unknown menghasilkan 409 STATE_CONFLICT; synthetic receipt ditandai, bukan on-chain issuance.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## getPayoutAttempt

**Status attempt tanpa blind resend** — `GET /api/v1/payout-attempts/{attemptId}`

Status: **proposed [R]**; fase D0; sukses 200 → `PayoutAttempt`.

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.



Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## Model respons

Schema nested, constraints dan contoh nilai lengkap ada di [OpenAPI](openapi.json). Domain proposed dibungkus envelope; auth existing raw.

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

### RecipientBinding

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `partyId` | Ya | Id |
| `address` | Ya | EvmAddress |
| `chainId` | Ya | 84532 |
| `state` | Ya | `active` / `disabled` |
| `version` | Ya | integer |
| `verifiedAt` | Ya | Timestamp |
| `recoveryCaseId` | Ya | Id atau null |

### Claim

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `entitlementId` | Ya | Id |
| `partyId` | Ya | Id |
| `recipientBindingId` | Ya | Id |
| `recipientBindingVersion` | Ya | integer |
| `assetId` | Ya | Id |
| `amountMinor` | Ya | UnsignedInteger |
| `state` | Ya | `reserved` / `submitted` / `confirmed` / `reconciled` / `claimed` / `denied` / `failed` / `retry_pending` / `unknown` |
| `payoutAttemptIds` | Ya | array<Id>; maks 100 item |
| `receiptId` | Ya | Id atau null |
| `errorCode` | Ya | string atau null |
| `revision` | Ya | RevisionControl |

### Receipt

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `claimId` | Ya | Id |
| `assetId` | Ya | Id |
| `amountMinor` | Ya | UnsignedInteger |
| `recipientAddress` | Ya | EvmAddress |
| `txHash` | Ya | TxHash atau null |
| `finalizedAt` | Ya | Timestamp |
| `reconciledAt` | Ya | Timestamp |
| `synthetic` | Ya | boolean |
| `finalityPolicyVersion` | Ya | string; maks 80 karakter |

### PayoutAttempt

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `claimId` | Ya | Id atau null |
| `refundCaseId` | Ya | Id atau null |
| `senderAddress` | Ya | EvmAddress |
| `nonce` | Ya | UnsignedInteger |
| `txHash` | Ya | TxHash atau null |
| `replacedByAttemptId` | Ya | Id atau null |
| `state` | Ya | `queued` / `submitted` / `included` / `safe` / `finalized` / `reconciled` / `reverted` / `dropped` / `replaced` / `unknown` |
| `errorCode` | Ya | string atau null |
| `updatedAt` | Ya | Timestamp |
