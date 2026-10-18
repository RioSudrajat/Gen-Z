# Exception dan refund

> Dihasilkan dari [contract.mjs](contract.mjs); edit sumber lalu jalankan `node scripts/build-api-contract.mjs`. Baseline 18 Oktober 2026.

[Indeks API](../api.md) · [OpenAPI](openapi.json) · [Konvensi](conventions.md) · [M01–M17](coverage.md). Contoh JSON request/response lengkap beserta schemas nested ada di OpenAPI. Status **proposed** berarti belum diimplementasikan.

| Operation | Method/path | Status | Acceptance |
|---|---|---|---|
| [createCase](#createcase) | `POST /api/v1/cases` | proposed | M12, M14 |
| [getCase](#getcase) | `GET /api/v1/cases/{caseId}` | proposed | M12 |
| [listMyCases](#listmycases) | `GET /api/v1/me/cases` | proposed | M12 |
| [getRefund](#getrefund) | `GET /api/v1/refund-cases/{refundId}` | proposed | M12 |
| [createRefund](#createrefund) | `POST /api/v1/admin/refund-cases` | proposed | M12 |
| [reviewRefund](#reviewrefund) | `POST /api/v1/admin/refund-cases/{refundId}/approve` | proposed | M12, M13 |
| [executeRefund](#executerefund) | `POST /api/v1/admin/refund-cases/{refundId}/executions` | proposed | M12 |
| [listAdminCases](#listadmincases) | `GET /api/v1/admin/cases` | proposed | M12 |
| [updateCase](#updatecase) | `PATCH /api/v1/admin/cases/{caseId}` | proposed | M12 |

## createCase

**Laporkan exception pada resource owner** — `POST /api/v1/cases`

Status: **proposed [R]**; fase D0; sukses 201 → `Case`.

Akses: session cookie dan scope resource; capability `case:create`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `kind` | Ya | `quote` / `payment` / `conversion` / `closing` / `refund` / `distribution` / `claim` / `reporting` / `recovery` |
| `resourceId` | Ya | Id |
| `description` | Ya | string; maks 2000 karakter |
| `evidenceVersionIds` | Ya | array<Id>; maks 100 item |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## getCase

**Status case owner atau assigned staff** — `GET /api/v1/cases/{caseId}`

Status: **proposed [R]**; fase D0; sukses 200 → `Case`.

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.



Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## listMyCases

**Daftar case owner** — `GET /api/v1/me/cases`

Status: **proposed [R]**; fase D0; sukses 200 → `Case` (list).

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.

Pagination `limit` 1–100 (default 20), cursor opaque. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## getRefund

**Refund asset amount fees dan liability** — `GET /api/v1/refund-cases/{refundId}`

Status: **proposed [R]**; fase D0; sukses 200 → `RefundCase`.

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.



Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## createRefund

**Propose refund dari exception dan bound terms** — `POST /api/v1/admin/refund-cases`

Status: **proposed [R]**; fase D0; sukses 201 → `RefundCase`.

Akses: session cookie dan scope resource; capability `refund:propose`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Currency/fees/amount diturunkan dari bound refundPolicy/net funds; jangan menjanjikan USD awal sesudah conversion.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `subscriptionId` | Ya | Id |
| `exceptionCaseId` | Ya | Id |
| `reason` | Ya | string; maks 2000 karakter |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## reviewRefund

**Review exact refund liability** — `POST /api/v1/admin/refund-cases/{refundId}/approve`

Status: **proposed [R]**; fase D0; sukses 201 → `ReviewDecision`.

Akses: session cookie dan scope resource; capability `refund:approve`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `If-Match` exact revision. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `decision` | Ya | `approve` / `reject` / `request_changes` |
| `reason` | Ya | string; maks 2000 karakter |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **412** `VERSION_MISMATCH`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **428** `VERSION_REQUIRED`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## executeRefund

**Dispatch approved refund secara durable** — `POST /api/v1/admin/refund-cases/{refundId}/executions`

Status: **proposed [R]**; fase D0; sukses 202 → `RefundCase`.

Akses: session cookie dan scope resource; capability `refund:execute`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `If-Match` exact revision. Wajib `Origin` yang diizinkan. 

Reservation terhadap unallocated funds; unknown tetap liability dan direconcile, bukan blind resend.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `reason` | Ya | string; maks 2000 karakter |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`, `STATE_CONFLICT`, `QUOTE_EXPIRED`, `TERMS_CHANGED`, `CAP_EXCEEDED`, `ELIGIBILITY_REQUIRED`, `OFFERING_UNAVAILABLE`, `INSUFFICIENT_FUNDING`, `ALREADY_CLAIMED`, `RECIPIENT_CHANGED`, `RECONCILIATION_REQUIRED`, `UPLOAD_NOT_VERIFIED`, `REVIEW_REQUIRED`; **412** `VERSION_MISMATCH`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **428** `VERSION_REQUIRED`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.

Poll: [getRefund](exceptions.md#getrefund); baca `Location`/`Retry-After`. 202 bukan final accounting/payment.


## listAdminCases

**Daftar assigned exception cases** — `GET /api/v1/admin/cases`

Status: **proposed [R]**; fase D0; sukses 200 → `Case` (list).

Akses: session cookie dan scope resource; capability `case:read`. Sesi + current resource scope; actor/party diputuskan server.

Pagination `limit` 1–100 (default 20), cursor opaque. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## updateCase

**Review dan resolusi case** — `PATCH /api/v1/admin/cases/{caseId}`

Status: **proposed [R]**; fase D0; sukses 200 → `Case`.

Akses: session cookie dan scope resource; capability `case:review`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `If-Match` exact revision. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `action` | Ya | `start_review` / `request_evidence` / `resolve` / `reject` |
| `note` | Ya | string; maks 2000 karakter |
| `resolutionEvidenceVersionIds` | Ya | array<Id>; maks 100 item |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **412** `VERSION_MISMATCH`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **428** `VERSION_REQUIRED`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## Model respons

Schema nested, constraints dan contoh nilai lengkap ada di [OpenAPI](openapi.json). Domain proposed dibungkus envelope; auth existing raw.

### Case

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `ownerPartyId` | Ya | Id |
| `kind` | Ya | `quote` / `payment` / `conversion` / `closing` / `refund` / `distribution` / `claim` / `reporting` / `recovery` |
| `resourceId` | Ya | Id |
| `description` | Ya | string; maks 2000 karakter |
| `evidenceVersionIds` | Ya | array<Id>; maks 100 item |
| `state` | Ya | `open` / `reviewing` / `awaiting_evidence` / `resolved` / `rejected` |
| `resolution` | Ya | string atau null |
| `revision` | Ya | RevisionControl |

### RefundCase

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `subscriptionId` | Ya | Id |
| `exceptionCaseId` | Ya | Id |
| `reason` | Ya | string; maks 2000 karakter |
| `policyVersionId` | Ya | Id |
| `refundAssetId` | Ya | Id |
| `refundableAmountMinor` | Ya | UnsignedInteger |
| `retainedFees` | Ya | array<Money>; maks 20 item |
| `state` | Ya | `proposed` / `approved` / `rejected` / `dispatch_pending` / `submitted` / `reconciled` / `failed` / `unknown` |
| `reviewDecisionId` | Ya | Id atau null |
| `payoutAttemptIds` | Ya | array<Id>; maks 100 item |
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
