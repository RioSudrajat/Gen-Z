# Scenario demo D0

> Dihasilkan dari [contract.mjs](contract.mjs); edit sumber lalu jalankan `node scripts/build-api-contract.mjs`. Baseline 18 Oktober 2026.

[Indeks API](../api.md) · [OpenAPI](openapi.json) · [Konvensi](conventions.md) · [M01–M17](coverage.md). Contoh JSON request/response lengkap beserta schemas nested ada di OpenAPI. Status **proposed** berarti belum diimplementasikan.

| Operation | Method/path | Status | Acceptance |
|---|---|---|---|
| [listDemoScenarios](#listdemoscenarios) | `GET /api/v1/demo/scenarios` | proposed | M05, M09, M11 |
| [createDemoRun](#createdemorun) | `POST /api/v1/demo/scenario-runs` | proposed | M05, M09, M11 |
| [getDemoRun](#getdemorun) | `GET /api/v1/demo/scenario-runs/{demoRunId}` | proposed | M09, M11 |
| [advanceDemo](#advancedemo) | `POST /api/v1/demo/scenario-runs/{demoRunId}/commands` | proposed | M08, M09, M10, M11, M12 |

## listDemoScenarios

**Daftar fixture investasi synthetic** — `GET /api/v1/demo/scenarios`

Status: **proposed [R]**; fase D0; sukses 200 → `DemoScenario` (list).

Akses: session cookie dan scope resource; capability `demo:control`. Sesi + current resource scope; actor/party diputuskan server.

Pagination `limit` 1–100 (default 20), cursor opaque. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `DEMO_ONLY`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## createDemoRun

**Buat run synthetic terisolasi owner** — `POST /api/v1/demo/scenario-runs`

Status: **proposed [R]**; fase D0; sukses 201 → `DemoRun`.

Akses: session cookie dan scope resource; capability `demo:control`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Fixture version pinned, login/grant tetap nyata; tidak ada dana/testnet transfer otomatis.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `scenarioId` | Ya | Id |
| `datasetVersionId` | Ya | Id |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`, `DEMO_ONLY`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## getDemoRun

**Status dan resource IDs fixture run** — `GET /api/v1/demo/scenario-runs/{demoRunId}`

Status: **proposed [R]**; fase D0; sukses 200 → `DemoRun`.

Akses: session cookie dan scope resource; capability `demo:control`. Sesi + current resource scope; actor/party diputuskan server.



Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `DEMO_ONLY`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## advanceDemo

**Jalankan langkah/failure fixture** — `POST /api/v1/demo/scenario-runs/{demoRunId}/commands`

Status: **proposed [R]**; fase D0; sukses 202 → `Job`.

Akses: session cookie dan scope resource; capability `demo:control`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `If-Match` exact revision. Wajib `Origin` yang diizinkan. 

Jalankan domain services yang sama via synthetic adapter, bukan force arbitrary status. Reset membuat generation baru, tidak menghapus auth/grants/audit/history atau memberi double claim.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `action` | Ya | `confirm_input` / `settle_net` / `advance_reporting` / `fund_distribution` / `simulate_failure` / `reset` |
| `resourceId` | Ya | Id atau null |
| `failure` | Ya | `quote_expired` / `conversion_failed` / `closing_failed` / `funding_shortfall` / `transfer_unknown` atau null |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`, `DEMO_ONLY`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **412** `VERSION_MISMATCH`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **428** `VERSION_REQUIRED`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.

Poll: [getJob](operations.md#getjob); baca `Location`/`Retry-After`. 202 bukan final accounting/payment.


## Model respons

Schema nested, constraints dan contoh nilai lengkap ada di [OpenAPI](openapi.json). Domain proposed dibungkus envelope; auth existing raw.

### DemoScenario

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `name` | Ya | string; maks 120 karakter |
| `datasetVersionId` | Ya | Id |
| `description` | Ya | string; maks 2000 karakter |
| `synthetic` | Ya | true |

### DemoRun

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `ownerPartyId` | Ya | Id |
| `scenarioId` | Ya | Id |
| `datasetVersionId` | Ya | Id |
| `generation` | Ya | integer |
| `state` | Ya | `active` / `completed` / `reset` |
| `resourceIds` | Ya | array<Id>; maks 100 item |
| `createdAt` | Ya | Timestamp |
| `revision` | Ya | RevisionControl |

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
