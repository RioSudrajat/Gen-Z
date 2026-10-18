# Inquiry dan retensi

> Dihasilkan dari [contract.mjs](contract.mjs); edit sumber lalu jalankan `node scripts/build-api-contract.mjs`. Baseline 18 Oktober 2026.

[Indeks API](../api.md) · [OpenAPI](openapi.json) · [Konvensi](conventions.md) · [M01–M17](coverage.md). Contoh JSON request/response lengkap beserta schemas nested ada di OpenAPI. Status **proposed** berarti belum diimplementasikan.

| Operation | Method/path | Status | Acceptance |
|---|---|---|---|
| [createInquiry](#createinquiry) | `POST /api/v1/inquiries` | proposed | M01, M02, M17 |
| [getInquiryPolicy](#getinquirypolicy) | `GET /api/v1/public/inquiry-policy` | proposed | M01, M02 |
| [listInquiries](#listinquiries) | `GET /api/v1/admin/inquiries` | proposed | M02 |
| [getInquiry](#getinquiry) | `GET /api/v1/admin/inquiries/{inquiryId}` | proposed | M02 |
| [updateInquiry](#updateinquiry) | `PATCH /api/v1/admin/inquiries/{inquiryId}` | proposed | M02 |
| [recordInquiryInteraction](#recordinquiryinteraction) | `POST /api/v1/admin/inquiries/{inquiryId}/interactions` | proposed | M02 |
| [retryInquiryNotification](#retryinquirynotification) | `POST /api/v1/admin/inquiries/{inquiryId}/notification-retries` | proposed | M01, M02 |
| [reviewInquiryRetention](#reviewinquiryretention) | `POST /api/v1/admin/inquiries/{inquiryId}/retention-reviews` | proposed | M02 |
| [runInquiryRetention](#runinquiryretention) | `POST /api/v1/admin/retention-runs` | proposed | M02 |

## createInquiry

**Terima inquiry publik** — `POST /api/v1/inquiries`

Status: **proposed [R]**; fase D0; sukses 201 → `InquiryReceipt`.

Akses: publik. Publik; allowed marketing Origin, rate limit; tidak dapat membaca inquiry.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Commit inquiry + reference + outbox satu transaksi sebelum 201. Notification retry tidak mengubah penerimaan/retensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `contact` | Ya | Contact |
| `assetCategory` | Ya | `energy` / `infrastructure` |
| `location` | Ya | object |
| `operationsState` | Ya | `operational` / `maintenance` / `planned` / `unknown` |
| `assetDescription` | Ya | string; maks 4000 karakter |
| `financingNeed` | Ya | Money atau null |
| `privacyNoticeVersionId` | Ya | Id |
| `privacyAcknowledged` | Ya | true |

Error: **400** `INVALID_JSON`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## getInquiryPolicy

**Privacy notice version untuk intake publik** — `GET /api/v1/public/inquiry-policy`

Status: **proposed [R]**; fase D0; sukses 200 → `InquiryPolicy`.

Akses: publik. Publik; tetap mengikuti Origin/rate limit yang disebutkan.



Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **403** `FORBIDDEN`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## listInquiries

**Daftar inquiry** — `GET /api/v1/admin/inquiries`

Status: **proposed [R]**; fase D0; sukses 200 → `Inquiry` (list).

Akses: session cookie dan scope resource; capability `inquiry:read`. Sesi + current resource scope; actor/party diputuskan server.

Pagination `limit` 1–100 (default 20), cursor opaque. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## getInquiry

**Detail inquiry** — `GET /api/v1/admin/inquiries/{inquiryId}`

Status: **proposed [R]**; fase D0; sukses 200 → `Inquiry`.

Akses: session cookie dan scope resource; capability `inquiry:read`. Sesi + current resource scope; actor/party diputuskan server.



Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## updateInquiry

**Screening dan status inquiry** — `PATCH /api/v1/admin/inquiries/{inquiryId}`

Status: **proposed [R]**; fase D0; sukses 200 → `Inquiry`.

Akses: session cookie dan scope resource; capability `inquiry:screen`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `If-Match` exact revision. Wajib `Origin` yang diizinkan. 

Transisi tervalidasi; project link tidak mengubah inquiry menjadi evidence investasi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `action` | Ya | `start_screening` / `request_evidence` / `mark_active` / `mark_progressed` / `close` / `reject` / `not_proceeding` |
| `note` | Ya | string; maks 2000 karakter |
| `missingEvidence` | Ya | array<string>; maks 30 item |
| `projectId` | Ya | Id atau null |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **412** `VERSION_MISMATCH`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **428** `VERSION_REQUIRED`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## recordInquiryInteraction

**Catat interaksi bermakna** — `POST /api/v1/admin/inquiries/{inquiryId}/interactions`

Status: **proposed [R]**; fase D0; sukses 201 → `Interaction`.

Akses: session cookie dan scope resource; capability `inquiry:screen`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `If-Match` exact revision. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `kind` | Ya | `contact` / `screening` / `evidence_request` / `retention_review` |
| `note` | Ya | string; maks 2000 karakter |
| `occurredAt` | Ya | Timestamp |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **412** `VERSION_MISMATCH`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **428** `VERSION_REQUIRED`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## retryInquiryNotification

**Antrekan ulang notifikasi** — `POST /api/v1/admin/inquiries/{inquiryId}/notification-retries`

Status: **proposed [R]**; fase D0; sukses 202 → `Job`.

Akses: session cookie dan scope resource; capability `inquiry:screen`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Retry satu outbox existing; tidak membuat inquiry baru atau mereset lastInteractionAt.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `reason` | Ya | string; maks 2000 karakter |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.

Poll: [getJob](operations.md#getjob); baca `Location`/`Retry-After`. 202 bukan final accounting/payment.


## reviewInquiryRetention

**Review retensi inquiry aktif** — `POST /api/v1/admin/inquiries/{inquiryId}/retention-reviews`

Status: **proposed [R]**; fase D0; sukses 201 → `Inquiry`.

Akses: session cookie dan scope resource; capability `inquiry:retain`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `If-Match` exact revision. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `disposition` | Ya | `keep_active` / `not_proceeding` |
| `reason` | Ya | string; maks 2000 karakter |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **412** `VERSION_MISMATCH`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **428** `VERSION_REQUIRED`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## runInquiryRetention

**Jalankan kebijakan retensi jatuh tempo** — `POST /api/v1/admin/retention-runs`

Status: **proposed [R]**; fase D0; sukses 202 → `Job`.

Akses: session cookie dan scope resource; capability `inquiry:retain`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Hanya inquiry sesuai due date/policy; dryRun tanpa penghapusan; investasi/ledger tidak ikut.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `dryRun` | Ya | boolean |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.

Poll: [getJob](operations.md#getjob); baca `Location`/`Retry-After`. 202 bukan final accounting/payment.


## Model respons

Schema nested, constraints dan contoh nilai lengkap ada di [OpenAPI](openapi.json). Domain proposed dibungkus envelope; auth existing raw.

### InquiryReceipt

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `reference` | Ya | string; maks 64 karakter |
| `receivedAt` | Ya | Timestamp |
| `state` | Ya | "received" |
| `notificationState` | Ya | `pending` / `delivered` / `failed` |

### InquiryPolicy

| Field | Wajib | Tipe / batas |
|---|---|---|
| `privacyNoticeVersionId` | Ya | Id |
| `noticeUrl` | Ya | uri |
| `sensitiveUploadsAllowed` | Ya | false |
| `marketingOptIn` | Ya | false |

### Inquiry

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `reference` | Ya | string; maks 64 karakter |
| `contact` | Ya | Contact |
| `assetCategory` | Ya | `energy` / `infrastructure` |
| `location` | Ya | object |
| `operationsState` | Ya | `operational` / `maintenance` / `planned` / `unknown` |
| `assetDescription` | Ya | string; maks 4000 karakter |
| `financingNeed` | Ya | Money atau null |
| `privacyNoticeVersionId` | Ya | Id |
| `receivedAt` | Ya | Timestamp |
| `state` | Ya | `received` / `screening` / `awaiting_evidence` / `active` / `progressed` / `closed` / `rejected` / `not_proceeding` |
| `lastInteractionAt` | Ya | Timestamp |
| `retention` | Ya | object |
| `notificationState` | Ya | `pending` / `delivered` / `failed` |
| `linkedProjectId` | Ya | Id atau null |
| `revision` | Ya | RevisionControl |

### Interaction

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `inquiryId` | Ya | Id |
| `kind` | Ya | `contact` / `screening` / `evidence_request` / `retention_review` |
| `note` | Ya | string; maks 2000 karakter |
| `occurredAt` | Ya | Timestamp |
| `recordedAt` | Ya | Timestamp |
| `actorAccountId` | Ya | Id |

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
