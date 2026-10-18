# Operasi, invoice, collection dan laporan

> Dihasilkan dari [contract.mjs](contract.mjs); edit sumber lalu jalankan `node scripts/build-api-contract.mjs`. Baseline 18 Oktober 2026.

[Indeks API](../api.md) · [OpenAPI](openapi.json) · [Konvensi](conventions.md) · [M01–M17](coverage.md). Contoh JSON request/response lengkap beserta schemas nested ada di OpenAPI. Status **proposed** berarti belum diimplementasikan.

| Operation | Method/path | Status | Acceptance |
|---|---|---|---|
| [getPerformance](#getperformance) | `GET /api/v1/projects/{projectId}/performance` | proposed | M10 |
| [listReports](#listreports) | `GET /api/v1/projects/{projectId}/reports` | proposed | M10 |
| [getReport](#getreport) | `GET /api/v1/reports/{reportId}` | proposed | M10 |
| [createOperationRecord](#createoperationrecord) | `POST /api/v1/admin/operation-records` | proposed | M10 |
| [createInvoice](#createinvoice) | `POST /api/v1/admin/invoices` | proposed | M10, M12 |
| [listInvoices](#listinvoices) | `GET /api/v1/admin/invoices` | proposed | M10 |
| [createCollection](#createcollection) | `POST /api/v1/admin/collections` | proposed | M10 |
| [listCollections](#listcollections) | `GET /api/v1/admin/collections` | proposed | M10 |
| [reviewCollection](#reviewcollection) | `POST /api/v1/admin/collections/{collectionId}/review` | proposed | M10, M13 |
| [matchCollection](#matchcollection) | `POST /api/v1/admin/collection-matches` | proposed | M10 |
| [createReport](#createreport) | `POST /api/v1/admin/projects/{projectId}/reports` | proposed | M06, M10 |
| [getAdminReport](#getadminreport) | `GET /api/v1/admin/reports/{reportId}` | proposed | M10 |
| [listAdminReports](#listadminreports) | `GET /api/v1/admin/reports` | proposed | M10 |
| [submitReport](#submitreport) | `POST /api/v1/admin/reports/{reportId}/submissions` | proposed | M10 |
| [reviewReport](#reviewreport) | `POST /api/v1/admin/reports/{reportId}/review` | proposed | M10, M13 |
| [publishReport](#publishreport) | `POST /api/v1/admin/reports/{reportId}/publications` | proposed | M06, M10 |

## getPerformance

**Data produksi dan impact dengan quality** — `GET /api/v1/projects/{projectId}/performance`

Status: **proposed [R]**; fase D0; sukses 200 → `Performance`.

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.



Maximum rentang 366 hari; missing/stale null bukan nol; telemetry bukan kas.

Query filters: `from`: Date; `to`: Date.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## listReports

**Laporan bulanan published** — `GET /api/v1/projects/{projectId}/reports`

Status: **proposed [R]**; fase D0; sukses 200 → `Report` (list).

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.

Pagination `limit` 1–100 (default 20), cursor opaque. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

Query filters: `offeringId`: Id.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## getReport

**Detail laporan/versi published** — `GET /api/v1/reports/{reportId}`

Status: **proposed [R]**; fase D0; sukses 200 → `Report`.

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.



Read/model atau command tunduk pada invariant dan akses di konvensi.

Query filters: `versionId`: Id.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## createOperationRecord

**Catat operasi ber-source** — `POST /api/v1/admin/operation-records`

Status: **proposed [R]**; fase D0; sukses 201 → `OperationRecord`.

Akses: session cookie dan scope resource; capability `report:write`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `projectId` | Ya | Id |
| `assetId` | Ya | Id |
| `period` | Ya | Period |
| `metricId` | Ya | Id |
| `value` | Ya | Decimal atau null |
| `unit` | Ya | `kWh` / `MWh` / `kW` / `MW` / `percent` / `count` / `IDR` / `tCO2e` |
| `quality` | Ya | `provisional` / `reviewed` / `missing` |
| `evidenceVersionIds` | Ya | array<Id>; maks 100 item |
| `sourceName` | Ya | string; maks 240 karakter |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## createInvoice

**Catat invoice atau koreksi versioned** — `POST /api/v1/admin/invoices`

Status: **proposed [R]**; fase D0; sukses 201 → `Invoice`.

Akses: session cookie dan scope resource; capability `finance:record`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `projectId` | Ya | Id |
| `payerPartyId` | Ya | Id |
| `invoiceReference` | Ya | string; maks 160 karakter |
| `period` | Ya | Period |
| `amount` | Ya | RightsMoney |
| `dueDate` | Ya | Date |
| `evidenceVersionIds` | Ya | array<Id>; maks 100 item |
| `supersedesInvoiceId` | Ya | Id atau null |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## listInvoices

**Daftar invoice dan aging** — `GET /api/v1/admin/invoices`

Status: **proposed [R]**; fase D0; sukses 200 → `Invoice` (list).

Akses: session cookie dan scope resource; capability `finance:read`. Sesi + current resource scope; actor/party diputuskan server.

Pagination `limit` 1–100 (default 20), cursor opaque. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

Query filters: `projectId`: Id.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## createCollection

**Catat collection evidence pending** — `POST /api/v1/admin/collections`

Status: **proposed [R]**; fase D0; sukses 201 → `Collection`.

Akses: session cookie dan scope resource; capability `finance:record`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Record pending verification; tidak langsung kas cleared atau claimable.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `projectId` | Ya | Id |
| `payerPartyId` | Ya | Id |
| `amount` | Ya | RightsMoney |
| `receivedAt` | Ya | Timestamp |
| `externalReference` | Ya | string; maks 160 karakter |
| `evidenceVersionIds` | Ya | array<Id>; maks 100 item |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## listCollections

**Daftar cleared/unmatched collection** — `GET /api/v1/admin/collections`

Status: **proposed [R]**; fase D0; sukses 200 → `Collection` (list).

Akses: session cookie dan scope resource; capability `finance:read`. Sesi + current resource scope; actor/party diputuskan server.

Pagination `limit` 1–100 (default 20), cursor opaque. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

Query filters: `projectId`: Id.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## reviewCollection

**Review collection dengan evidence/reconciliation** — `POST /api/v1/admin/collections/{collectionId}/review`

Status: **proposed [R]**; fase D0; sukses 201 → `ReviewDecision`.

Akses: session cookie dan scope resource; capability `finance:review`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `If-Match` exact revision. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `decision` | Ya | `approve` / `reject` / `request_changes` |
| `reason` | Ya | string; maks 2000 karakter |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **412** `VERSION_MISMATCH`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **428** `VERSION_REQUIRED`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## matchCollection

**Match partial atau multi-invoice collection** — `POST /api/v1/admin/collection-matches`

Status: **proposed [R]**; fase D0; sukses 201 → `CollectionMatch`.

Akses: session cookie dan scope resource; capability `finance:record`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Hanya cleared collection, same project/currency, no over-match; reconciliation ID server, bukan dari client.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `invoiceId` | Ya | Id |
| `collectionId` | Ya | Id |
| `amount` | Ya | RightsMoney |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## createReport

**Buat monthly report/correction draft** — `POST /api/v1/admin/projects/{projectId}/reports`

Status: **proposed [R]**; fase D0; sukses 201 → `Report`.

Akses: session cookie dan scope resource; capability `report:write`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `offeringId` | Ya | Id |
| `period` | Ya | Period |
| `operationRecordIds` | Ya | array<Id>; maks 100 item |
| `invoiceIds` | Ya | array<Id>; maks 100 item |
| `collectionIds` | Ya | array<Id>; maks 100 item |
| `documentVersionIds` | Ya | array<Id>; maks 100 item |
| `blocks` | Ya | array<EditorialBlock>; maks 100 item |
| `correctionReason` | Ya | string atau null |
| `supersedesVersionId` | Ya | Id atau null |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## getAdminReport

**Baca report draft/versions** — `GET /api/v1/admin/reports/{reportId}`

Status: **proposed [R]**; fase D0; sukses 200 → `Report`.

Akses: session cookie dan scope resource; capability `report:read`. Sesi + current resource scope; actor/party diputuskan server.



Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## listAdminReports

**Laporan draft dan published dalam scope** — `GET /api/v1/admin/reports`

Status: **proposed [R]**; fase D0; sukses 200 → `Report` (list).

Akses: session cookie dan scope resource; capability `report:read`. Sesi + current resource scope; actor/party diputuskan server.

Pagination `limit` 1–100 (default 20), cursor opaque. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

Query filters: `projectId`: Id; `offeringId`: Id.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## submitReport

**Kirim report exact version** — `POST /api/v1/admin/reports/{reportId}/submissions`

Status: **proposed [R]**; fase D0; sukses 201 → `Report`.

Akses: session cookie dan scope resource; capability `report:write`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `If-Match` exact revision. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `reason` | Ya | string; maks 2000 karakter |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **412** `VERSION_MISMATCH`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **428** `VERSION_REQUIRED`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## reviewReport

**Review report exact version** — `POST /api/v1/admin/reports/{reportId}/review`

Status: **proposed [R]**; fase D0; sukses 201 → `ReviewDecision`.

Akses: session cookie dan scope resource; capability `report:review`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `If-Match` exact revision. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `decision` | Ya | `approve` / `reject` / `request_changes` |
| `reason` | Ya | string; maks 2000 karakter |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **412** `VERSION_MISMATCH`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **428** `VERSION_REQUIRED`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## publishReport

**Publish report approved/correction** — `POST /api/v1/admin/reports/{reportId}/publications`

Status: **proposed [R]**; fase D0; sukses 201 → `Publication`.

Akses: session cookie dan scope resource; capability `content:publish`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `If-Match` exact revision. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `reviewDecisionId` | Ya | Id |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **412** `VERSION_MISMATCH`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **428** `VERSION_REQUIRED`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## Model respons

Schema nested, constraints dan contoh nilai lengkap ada di [OpenAPI](openapi.json). Domain proposed dibungkus envelope; auth existing raw.

### Performance

| Field | Wajib | Tipe / batas |
|---|---|---|
| `projectId` | Ya | Id |
| `datasetVersionId` | Ya | Id |
| `metrics` | Ya | array<Metric>; maks 500 item |
| `asOf` | Ya | Timestamp |

### Report

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `versionId` | Ya | Id |
| `offeringId` | Ya | Id |
| `period` | Ya | Period |
| `operationRecordIds` | Ya | array<Id>; maks 100 item |
| `invoiceIds` | Ya | array<Id>; maks 100 item |
| `collectionIds` | Ya | array<Id>; maks 100 item |
| `documentVersionIds` | Ya | array<Id>; maks 100 item |
| `blocks` | Ya | array<EditorialBlock>; maks 100 item |
| `correctionReason` | Ya | string atau null |
| `supersedesVersionId` | Ya | Id atau null |
| `state` | Ya | `draft` / `submitted` / `approved` / `rejected` / `published` / `superseded` |
| `reviewDecisionId` | Ya | Id atau null |
| `publishedAt` | Ya | Timestamp atau null |
| `revision` | Ya | RevisionControl |

### OperationRecord

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `projectId` | Ya | Id |
| `assetId` | Ya | Id |
| `period` | Ya | Period |
| `metricId` | Ya | Id |
| `value` | Ya | Decimal atau null |
| `unit` | Ya | `kWh` / `MWh` / `kW` / `MW` / `percent` / `count` / `IDR` / `tCO2e` |
| `quality` | Ya | `provisional` / `reviewed` / `missing` |
| `evidenceVersionIds` | Ya | array<Id>; maks 100 item |
| `sourceName` | Ya | string; maks 240 karakter |
| `recordedAt` | Ya | Timestamp |

### Invoice

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `projectId` | Ya | Id |
| `payerPartyId` | Ya | Id |
| `invoiceReference` | Ya | string; maks 160 karakter |
| `period` | Ya | Period |
| `amount` | Ya | RightsMoney |
| `dueDate` | Ya | Date |
| `evidenceVersionIds` | Ya | array<Id>; maks 100 item |
| `supersedesInvoiceId` | Ya | Id atau null |
| `state` | Ya | `unpaid` / `partially_paid` / `paid` / `overdue` / `disputed` / `corrected` |
| `collected` | Ya | RightsMoney |
| `revision` | Ya | RevisionControl |

### Collection

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `projectId` | Ya | Id |
| `payerPartyId` | Ya | Id |
| `amount` | Ya | RightsMoney |
| `receivedAt` | Ya | Timestamp |
| `externalReference` | Ya | string; maks 160 karakter |
| `evidenceVersionIds` | Ya | array<Id>; maks 100 item |
| `state` | Ya | `pending_verification` / `cleared` / `rejected` / `reversed` |
| `clearedAt` | Ya | Timestamp atau null |
| `unmatchedAmount` | Ya | RightsMoney |
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

### CollectionMatch

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `invoiceId` | Ya | Id |
| `collectionId` | Ya | Id |
| `amount` | Ya | RightsMoney |
| `reconciliationId` | Ya | Id |
| `createdAt` | Ya | Timestamp |

### Publication

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `subjectId` | Ya | Id |
| `subjectVersionId` | Ya | Id |
| `reviewDecisionId` | Ya | Id |
| `publishedAt` | Ya | Timestamp |
| `supersedesPublicationId` | Ya | Id atau null |
