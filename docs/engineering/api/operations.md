# Jobs, reconciliation, ledger dan audit

> Dihasilkan dari [contract.mjs](contract.mjs); edit sumber lalu jalankan `node scripts/build-api-contract.mjs`. Baseline 18 Oktober 2026.

[Indeks API](../api.md) · [OpenAPI](openapi.json) · [Konvensi](conventions.md) · [M01–M17](coverage.md). Contoh JSON request/response lengkap beserta schemas nested ada di OpenAPI. Status **proposed** berarti belum diimplementasikan.

| Operation | Method/path | Status | Acceptance |
|---|---|---|---|
| [getJob](#getjob) | `GET /api/v1/jobs/{jobId}` | proposed | M01, M12, M13 |
| [createReconciliation](#createreconciliation) | `POST /api/v1/admin/reconciliation-runs` | proposed | M09, M11, M12 |
| [getReconciliation](#getreconciliation) | `GET /api/v1/admin/reconciliation-runs/{runId}` | proposed | M12 |
| [listReconciliationBreaks](#listreconciliationbreaks) | `GET /api/v1/admin/reconciliation-breaks` | proposed | M12 |
| [resolveReconciliationBreak](#resolvereconciliationbreak) | `POST /api/v1/admin/reconciliation-breaks/{breakId}/resolutions` | proposed | M12, M13 |
| [listLedgerEntries](#listledgerentries) | `GET /api/v1/admin/ledger-entries` | proposed | M09, M11, M12 |
| [listAuditEvents](#listauditevents) | `GET /api/v1/admin/audit-events` | proposed | M13 |
| [getLiveGates](#getlivegates) | `GET /api/v1/admin/live-gates` | proposed | M15 |

## getJob

**Status job yang diizinkan** — `GET /api/v1/jobs/{jobId}`

Status: **proposed [R]**; fase D0; sukses 200 → `Job`.

Akses: session cookie dan scope resource. Owner resource atau scoped staff; ID job bukan capability.



Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## createReconciliation

**Mulai rekonsiliasi domain/register/chain** — `POST /api/v1/admin/reconciliation-runs`

Status: **proposed [R]**; fase D0; sukses 202 → `ReconciliationRun`.

Akses: session cookie dan scope resource; capability `finance:reconcile`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `offeringId` | Ya | Id |
| `period` | Ya | Period |
| `scope` | Ya | `input` / `settlement` / `allocation` / `collection` / `distribution` / `claim` / `refund` / `chain` |
| `resourceIds` | Ya | array<Id>; maks 100 item |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.

Poll: [getReconciliation](operations.md#getreconciliation); baca `Location`/`Retry-After`. 202 bukan final accounting/payment.


## getReconciliation

**Status dan breaks run** — `GET /api/v1/admin/reconciliation-runs/{runId}`

Status: **proposed [R]**; fase D0; sukses 200 → `ReconciliationRun`.

Akses: session cookie dan scope resource; capability `finance:read`. Sesi + current resource scope; actor/party diputuskan server.



Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## listReconciliationBreaks

**Daftar discrepancy tidak terselesaikan** — `GET /api/v1/admin/reconciliation-breaks`

Status: **proposed [R]**; fase D0; sukses 200 → `ReconciliationBreak` (list).

Akses: session cookie dan scope resource; capability `finance:read`. Sesi + current resource scope; actor/party diputuskan server.

Pagination `limit` 1–100 (default 20), cursor opaque. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

Query filters: `runId`: Id.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## resolveReconciliationBreak

**Catat resolusi evidence/reversal** — `POST /api/v1/admin/reconciliation-breaks/{breakId}/resolutions`

Status: **proposed [R]**; fase D0; sukses 201 → `ReconciliationBreak`.

Akses: session cookie dan scope resource; capability `finance:reconcile`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `If-Match` exact revision. Wajib `Origin` yang diizinkan. 

Resolve hanya sesudah invariant kembali benar; correcting journal posted/reviewed. Tidak overwrite journal atau membuat selisih hilang tanpa evidence.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `reason` | Ya | string; maks 2000 karakter |
| `evidenceVersionIds` | Ya | array<Id>; maks 100 item |
| `correctingJournalId` | Ya | Id atau null |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **412** `VERSION_MISMATCH`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **428** `VERSION_REQUIRED`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## listLedgerEntries

**Baca immutable entries per pool/currency** — `GET /api/v1/admin/ledger-entries`

Status: **proposed [R]**; fase D0; sukses 200 → `JournalEntry` (list).

Akses: session cookie dan scope resource; capability `ledger:read`. Sesi + current resource scope; actor/party diputuskan server.

Pagination `limit` 1–100 (default 20), cursor opaque. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

Query filters: `poolId`: Id; `currency`: `IDR` / `IDRX` / `USDC` / `ETH`; `resourceId`: Id.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## listAuditEvents

**Audit actor resource version request** — `GET /api/v1/admin/audit-events`

Status: **proposed [R]**; fase D0; sukses 200 → `AuditEvent` (list).

Akses: session cookie dan scope resource; capability `audit:read`. Sesi + current resource scope; actor/party diputuskan server.

Pagination `limit` 1–100 (default 20), cursor opaque. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

Query filters: `resourceId`: Id.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## getLiveGates

**Status bukti dependency sebelum live** — `GET /api/v1/admin/live-gates`

Status: **proposed [R]**; fase live-gate; sukses 200 → `LiveGates`.

Akses: session cookie dan scope resource; capability `readiness:read`. Sesi + current resource scope; actor/party diputuskan server.



Read-only tracking. Tidak ada endpoint enable live; status gate bukan persetujuan legal baru.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## Model respons

Schema nested, constraints dan contoh nilai lengkap ada di [OpenAPI](openapi.json). Domain proposed dibungkus envelope; auth existing raw.

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

### ReconciliationRun

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `offeringId` | Ya | Id |
| `period` | Ya | Period |
| `scope` | Ya | `input` / `settlement` / `allocation` / `collection` / `distribution` / `claim` / `refund` / `chain` |
| `resourceIds` | Ya | array<Id>; maks 100 item |
| `state` | Ya | `queued` / `running` / `balanced` / `breaks_found` / `failed` |
| `breakIds` | Ya | array<Id>; maks 100 item |
| `startedAt` | Ya | Timestamp atau null |
| `completedAt` | Ya | Timestamp atau null |

### ReconciliationBreak

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `runId` | Ya | Id |
| `resourceId` | Ya | Id |
| `kind` | Ya | `amount_mismatch` / `duplicate` / `missing_evidence` / `reorg` / `unknown_transfer` / `register_mismatch` |
| `state` | Ya | `open` / `investigating` / `resolved` |
| `expected` | Ya | Money atau null |
| `observed` | Ya | Money atau null |
| `evidenceVersionIds` | Ya | array<Id>; maks 100 item |
| `revision` | Ya | RevisionControl |

### JournalEntry

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `journalId` | Ya | Id |
| `poolId` | Ya | Id |
| `resourceId` | Ya | Id |
| `accountCode` | Ya | string; maks 100 karakter |
| `side` | Ya | `debit` / `credit` |
| `amount` | Ya | Money |
| `reversalOfEntryId` | Ya | Id atau null |
| `postedAt` | Ya | Timestamp |

### AuditEvent

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `actorAccountId` | Ya | Id |
| `actingPartyId` | Ya | Id atau null |
| `action` | Ya | string; maks 120 karakter |
| `resourceId` | Ya | Id |
| `resourceVersionId` | Ya | Id atau null |
| `requestId` | Ya | Id |
| `reason` | Ya | string atau null |
| `recordedAt` | Ya | Timestamp |

### LiveGates

| Field | Wajib | Tipe / batas |
|---|---|---|
| `financialTransactionsEnabled` | Ya | false |
| `gates` | Ya | array<object>; maks 20 item |
