# Party, grant dan eligibility review

> Dihasilkan dari [contract.mjs](contract.mjs); edit sumber lalu jalankan `node scripts/build-api-contract.mjs`. Baseline 18 Oktober 2026.

[Indeks API](../api.md) · [OpenAPI](openapi.json) · [Konvensi](conventions.md) · [M01–M17](coverage.md). Contoh JSON request/response lengkap beserta schemas nested ada di OpenAPI. Status **proposed** berarti belum diimplementasikan.

| Operation | Method/path | Status | Acceptance |
|---|---|---|---|
| [getAccessContext](#getaccesscontext) | `GET /api/v1/me/access-context` | proposed | M04, M13 |
| [listEligibilityCases](#listeligibilitycases) | `GET /api/v1/admin/eligibility-cases` | proposed | M08 |
| [decideEligibility](#decideeligibility) | `POST /api/v1/admin/eligibility-cases/{eligibilityId}/decisions` | proposed | M08, M13 |
| [listGrants](#listgrants) | `GET /api/v1/admin/grants` | proposed | M13 |
| [proposeGrant](#proposegrant) | `POST /api/v1/admin/grants` | proposed | M13 |
| [reviewGrant](#reviewgrant) | `POST /api/v1/admin/grants/{grantId}/review` | proposed | M13 |
| [revokeGrant](#revokegrant) | `POST /api/v1/admin/grants/{grantId}/revocations` | proposed | M13 |

## getAccessContext

**Party, grant dan recipient terverifikasi** — `GET /api/v1/me/access-context`

Status: **proposed [R]**; fase D0; sukses 200 → `AccessContext`.

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.



Tambahan target; tidak mengubah response GET /session existing.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## listEligibilityCases

**Daftar eligibility cases** — `GET /api/v1/admin/eligibility-cases`

Status: **proposed [R]**; fase D0; sukses 200 → `Eligibility` (list).

Akses: session cookie dan scope resource; capability `eligibility:review`. Sesi + current resource scope; actor/party diputuskan server.

Pagination `limit` 1–100 (default 20), cursor opaque. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

Query filters: `offeringId`: Id.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## decideEligibility

**Keputusan eligibility exact scope** — `POST /api/v1/admin/eligibility-cases/{eligibilityId}/decisions`

Status: **proposed [R]**; fase D0; sukses 201 → `Eligibility`.

Akses: session cookie dan scope resource; capability `eligibility:review`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `If-Match` exact revision. Wajib `Origin` yang diizinkan. 

D0 sandbox:true; scope country/party/offering dan expiry. Tidak membuka live atau memberikan read privilege original.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `decision` | Ya | `approve` / `reject` / `revoke` |
| `reason` | Ya | string; maks 2000 karakter |
| `expiresAt` | Ya | Timestamp atau null |
| `evidenceVersionIds` | Ya | array<Id>; maks 100 item |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **412** `VERSION_MISMATCH`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **428** `VERSION_REQUIRED`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## listGrants

**Daftar grant scope dan expiry** — `GET /api/v1/admin/grants`

Status: **proposed [R]**; fase D0; sukses 200 → `Grant` (list).

Akses: session cookie dan scope resource; capability `grant:read`. Sesi + current resource scope; actor/party diputuskan server.

Pagination `limit` 1–100 (default 20), cursor opaque. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## proposeGrant

**Propose capability grant berbasis mandate** — `POST /api/v1/admin/grants`

Status: **proposed [R]**; fase D0; sukses 201 → `Grant`.

Akses: session cookie dan scope resource; capability `grant:propose`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Capability harus dalam delegable authority actor; tidak self-grant; create pending_review.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `accountId` | Ya | Id |
| `partyId` | Ya | Id |
| `capability` | Ya | `allocation:execute` / `audit:read` / `case:create` / `case:read` / `case:review` / `content:publish` / `content:read` / `content:review` / `content:write` / `demo:control` / `distribution:approve` / `distribution:calculate` / `distribution:claim` / `distribution:fund` / `document:read` / `document:review` / `document:write` / `eligibility:apply` / `eligibility:review` / `evidence:read` / `evidence:review` / `evidence:write` / `finance:read` / `finance:reconcile` / `finance:record` / `finance:review` / `grant:approve` / `grant:propose` / `grant:read` / `grant:revoke` / `inquiry:read` / `inquiry:retain` / `inquiry:screen` / `investment:subscribe` / `ledger:read` / `offering:close` / `offering:write` / `project:read` / `project:write` / `readiness:read` / `recovery:approve` / `recovery:execute` / `recovery:propose` / `recovery:read` / `refund:approve` / `refund:execute` / `refund:propose` / `report:read` / `report:review` / `report:write` / `terms:review` / `document:original:read` |
| `scope` | Ya | object |
| `mandateEvidenceVersionIds` | Ya | array<Id>; maks 100 item |
| `expiresAt` | Ya | Timestamp |
| `reason` | Ya | string; maks 2000 karakter |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## reviewGrant

**Review grant oleh authority berbeda** — `POST /api/v1/admin/grants/{grantId}/review`

Status: **proposed [R]**; fase D0; sukses 201 → `ReviewDecision`.

Akses: session cookie dan scope resource; capability `grant:approve`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `If-Match` exact revision. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `decision` | Ya | `approve` / `reject` / `request_changes` |
| `reason` | Ya | string; maks 2000 karakter |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **412** `VERSION_MISMATCH`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **428** `VERSION_REQUIRED`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## revokeGrant

**Cabut grant dan invalidasi current permissions** — `POST /api/v1/admin/grants/{grantId}/revocations`

Status: **proposed [R]**; fase D0; sukses 201 → `Grant`.

Akses: session cookie dan scope resource; capability `grant:revoke`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `If-Match` exact revision. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `reason` | Ya | string; maks 2000 karakter |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **412** `VERSION_MISMATCH`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **428** `VERSION_REQUIRED`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## Model respons

Schema nested, constraints dan contoh nilai lengkap ada di [OpenAPI](openapi.json). Domain proposed dibungkus envelope; auth existing raw.

### AccessContext

| Field | Wajib | Tipe / batas |
|---|---|---|
| `accountId` | Ya | Id |
| `availableParties` | Ya | array<Party>; maks 50 item |
| `grants` | Ya | array<Grant>; maks 200 item |
| `recipientBindings` | Ya | array<RecipientBinding>; maks 50 item |

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

### Grant

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `accountId` | Ya | Id |
| `partyId` | Ya | Id |
| `capability` | Ya | `allocation:execute` / `audit:read` / `case:create` / `case:read` / `case:review` / `content:publish` / `content:read` / `content:review` / `content:write` / `demo:control` / `distribution:approve` / `distribution:calculate` / `distribution:claim` / `distribution:fund` / `document:read` / `document:review` / `document:write` / `eligibility:apply` / `eligibility:review` / `evidence:read` / `evidence:review` / `evidence:write` / `finance:read` / `finance:reconcile` / `finance:record` / `finance:review` / `grant:approve` / `grant:propose` / `grant:read` / `grant:revoke` / `inquiry:read` / `inquiry:retain` / `inquiry:screen` / `investment:subscribe` / `ledger:read` / `offering:close` / `offering:write` / `project:read` / `project:write` / `readiness:read` / `recovery:approve` / `recovery:execute` / `recovery:propose` / `recovery:read` / `refund:approve` / `refund:execute` / `refund:propose` / `report:read` / `report:review` / `report:write` / `terms:review` / `document:original:read` |
| `scope` | Ya | object |
| `mandateEvidenceVersionIds` | Ya | array<Id>; maks 100 item |
| `expiresAt` | Ya | Timestamp |
| `reason` | Ya | string; maks 2000 karakter |
| `state` | Ya | `pending_review` / `active` / `revoked` / `expired` / `rejected` |
| `approvedByAccountId` | Ya | Id atau null |
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
