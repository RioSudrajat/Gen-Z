# Same-owner recovery D1

> Dihasilkan dari [contract.mjs](contract.mjs); edit sumber lalu jalankan `node scripts/build-api-contract.mjs`. Baseline 18 Oktober 2026.

[Indeks API](../api.md) · [OpenAPI](openapi.json) · [Konvensi](conventions.md) · [M01–M17](coverage.md). Contoh JSON request/response lengkap beserta schemas nested ada di OpenAPI. Status **proposed** berarti belum diimplementasikan.

| Operation | Method/path | Status | Acceptance |
|---|---|---|---|
| [proposeRecovery](#proposerecovery) | `POST /api/v1/admin/recovery-cases` | proposed | M14 |
| [getRecovery](#getrecovery) | `GET /api/v1/admin/recovery-cases/{recoveryId}` | proposed | M14 |
| [reviewRecovery](#reviewrecovery) | `POST /api/v1/admin/recovery-cases/{recoveryId}/review` | proposed | M14, M13 |
| [executeRecovery](#executerecovery) | `POST /api/v1/admin/recovery-cases/{recoveryId}/executions` | proposed | M14 |

## proposeRecovery

**Propose same-owner wallet recovery** — `POST /api/v1/admin/recovery-cases`

Status: **proposed [R]**; fase D1; sukses 201 → `RecoveryCase`.

Akses: session cookie dan scope resource; capability `recovery:propose`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Evidence ownership lama/baru dan issuer mandate; address baru tidak otomatis verified karena dicantumkan. Bukan assignment hak/private-key recovery.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `partyId` | Ya | Id |
| `positionIds` | Ya | array<Id>; maks 100 item |
| `oldBindingId` | Ya | Id |
| `newAddress` | Ya | EvmAddress |
| `sameOwnerEvidenceVersionIds` | Ya | array<Id>; maks 100 item |
| `caseId` | Ya | Id |
| `reason` | Ya | string; maks 2000 karakter |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## getRecovery

**Lacak recovery old/new binding** — `GET /api/v1/admin/recovery-cases/{recoveryId}`

Status: **proposed [R]**; fase D1; sukses 200 → `RecoveryCase`.

Akses: session cookie dan scope resource; capability `recovery:read`. Sesi + current resource scope; actor/party diputuskan server.



Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## reviewRecovery

**Issuer/security review exact recovery** — `POST /api/v1/admin/recovery-cases/{recoveryId}/review`

Status: **proposed [R]**; fase D1; sukses 201 → `ReviewDecision`.

Akses: session cookie dan scope resource; capability `recovery:approve`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `If-Match` exact revision. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `decision` | Ya | `approve` / `reject` / `request_changes` |
| `reason` | Ya | string; maks 2000 karakter |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **412** `VERSION_MISMATCH`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **428** `VERSION_REQUIRED`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## executeRecovery

**Freeze old lalu replace/reconcile binding** — `POST /api/v1/admin/recovery-cases/{recoveryId}/executions`

Status: **proposed [R]**; fase D1; sukses 202 → `RecoveryCase`.

Akses: session cookie dan scope resource; capability `recovery:execute`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `If-Match` exact revision. Wajib `Origin` yang diizinkan. 

Old recipient/representation disabled sebelum replacement. Position IDs dan record-date entitlement/claimed history tetap; failure/unknown fail closed.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `reason` | Ya | string; maks 2000 karakter |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`, `STATE_CONFLICT`, `QUOTE_EXPIRED`, `TERMS_CHANGED`, `CAP_EXCEEDED`, `ELIGIBILITY_REQUIRED`, `OFFERING_UNAVAILABLE`, `INSUFFICIENT_FUNDING`, `ALREADY_CLAIMED`, `RECIPIENT_CHANGED`, `RECONCILIATION_REQUIRED`, `UPLOAD_NOT_VERIFIED`, `REVIEW_REQUIRED`; **412** `VERSION_MISMATCH`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **428** `VERSION_REQUIRED`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.

Poll: [getRecovery](recovery.md#getrecovery); baca `Location`/`Retry-After`. 202 bukan final accounting/payment.


## Model respons

Schema nested, constraints dan contoh nilai lengkap ada di [OpenAPI](openapi.json). Domain proposed dibungkus envelope; auth existing raw.

### RecoveryCase

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `partyId` | Ya | Id |
| `positionIds` | Ya | array<Id>; maks 100 item |
| `oldBindingId` | Ya | Id |
| `newAddress` | Ya | EvmAddress |
| `sameOwnerEvidenceVersionIds` | Ya | array<Id>; maks 100 item |
| `caseId` | Ya | Id |
| `reason` | Ya | string; maks 2000 karakter |
| `state` | Ya | `proposed` / `evidence_review` / `approved` / `freezing_old` / `replacing` / `reconciled` / `rejected` / `failed` / `unknown` |
| `issuerReviewDecisionId` | Ya | Id atau null |
| `oldDisabledAt` | Ya | Timestamp atau null |
| `replacementBindingId` | Ya | Id atau null |
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
