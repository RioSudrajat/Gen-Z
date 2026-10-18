# Dokumen, evidence dan media

> Dihasilkan dari [contract.mjs](contract.mjs); edit sumber lalu jalankan `node scripts/build-api-contract.mjs`. Baseline 18 Oktober 2026.

[Indeks API](../api.md) · [OpenAPI](openapi.json) · [Konvensi](conventions.md) · [M01–M17](coverage.md). Contoh JSON request/response lengkap beserta schemas nested ada di OpenAPI. Status **proposed** berarti belum diimplementasikan.

| Operation | Method/path | Status | Acceptance |
|---|---|---|---|
| [listOfferingDocuments](#listofferingdocuments) | `GET /api/v1/offerings/{offeringId}/documents` | proposed | M04, M06 |
| [getDocumentAccess](#getdocumentaccess) | `GET /api/v1/documents/{documentId}/access` | proposed | M04, M06 |
| [downloadDocument](#downloaddocument) | `GET /api/v1/documents/{documentId}/content` | proposed | M04, M06 |
| [getMediaAccess](#getmediaaccess) | `GET /api/v1/media/{mediaId}/access` | proposed | M04, M06 |
| [downloadMedia](#downloadmedia) | `GET /api/v1/media/{mediaId}/content` | proposed | M04, M06 |
| [createUpload](#createupload) | `POST /api/v1/admin/uploads` | proposed | M06, M13 |
| [completeUpload](#completeupload) | `POST /api/v1/admin/uploads/{uploadId}/completions` | proposed | M06 |
| [getUploadStatus](#getuploadstatus) | `GET /api/v1/admin/uploads/{uploadId}` | proposed | M06 |
| [createMedia](#createmedia) | `POST /api/v1/admin/media` | proposed | M06 |
| [createEvidence](#createevidence) | `POST /api/v1/admin/evidence` | proposed | M06, M10 |
| [listEvidence](#listevidence) | `GET /api/v1/admin/evidence` | proposed | M06 |
| [getEvidence](#getevidence) | `GET /api/v1/admin/evidence/{evidenceId}` | proposed | M06 |
| [reviewEvidence](#reviewevidence) | `POST /api/v1/admin/evidence/{evidenceId}/review` | proposed | M06, M13 |
| [createDocumentVersion](#createdocumentversion) | `POST /api/v1/admin/documents` | proposed | M04, M06 |
| [listAdminDocuments](#listadmindocuments) | `GET /api/v1/admin/documents` | proposed | M06 |
| [getAdminDocument](#getadmindocument) | `GET /api/v1/admin/documents/{documentId}` | proposed | M06 |
| [reviewDocument](#reviewdocument) | `POST /api/v1/admin/documents/{documentId}/review` | proposed | M04, M06, M13 |
| [publishDocument](#publishdocument) | `POST /api/v1/admin/documents/{documentId}/publications` | proposed | M04, M06 |

## listOfferingDocuments

**Metadata investor copy approved** — `GET /api/v1/offerings/{offeringId}/documents`

Status: **proposed [R]**; fase D0; sukses 200 → `InvestorDocument` (list).

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.

Pagination `limit` 1–100 (default 20), cursor opaque. 

Metadata tanpa object key/raw original; original sensitif tidak ikut listing umum.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## getDocumentAccess

**Akses copy atau original berizin** — `GET /api/v1/documents/{documentId}/access`

Status: **proposed [R]**; fase D0; sukses 200 → `DocumentAccess`.

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.



Default investor_copy; versi published exact. Grant download session/party/version-bound maksimum 60 detik melalui app proxy; original membutuhkan document:original:read dan access audit. Tidak mengekspos private storage URL.

Query filters: `versionId`: Id; `variant`: `investor_copy` / `original`.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## downloadDocument

**Unduh bytes dengan auth saat download** — `GET /api/v1/documents/{documentId}/content`

Status: **proposed [R]**; fase D0; sukses 200 → `BinaryContent`.

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.



Wajib current session + resource/original scope + grant bound ke session/party/version/document; expired/revoked ditolak. Proxy membaca private storage dan mencatat akses; tanpa cookie tidak ada bytes.

Query filters: `accessGrantId`: Id.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## getMediaAccess

**Media referensi yang telah disetujui** — `GET /api/v1/media/{mediaId}/access`

Status: **proposed [R]**; fase D0; sukses 200 → `Media`.

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.



Akses media mengikuti published offering scope; bukan arbitrary remote URL.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## downloadMedia

**Baca media privat melalui app proxy** — `GET /api/v1/media/{mediaId}/content`

Status: **proposed [R]**; fase D0; sukses 200 → `BinaryContent`.

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.



Sesi/current published resource policy dan short-lived session-bound access grant diperiksa pada setiap request.

Query filters: `accessGrantId`: Id.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## createUpload

**Buat private upload intent** — `POST /api/v1/admin/uploads`

Status: **proposed [R]**; fase D0; sukses 201 → `UploadIntent`.

Akses: session cookie dan scope resource; capability `evidence:write`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Admin/assigned staff saja. Signed PUT 5 menit, <=25MiB, MIME allowlist; objek quarantined. Tidak tersedia pada contact publik.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `kind` | Ya | `document` / `media` |
| `fileName` | Ya | string; maks 200 karakter |
| `contentType` | Ya | `application/pdf` / `image/png` / `image/jpeg` / `image/webp` / `text/csv` |
| `sizeBytes` | Ya | integer |
| `sha256` | Ya | string |
| `projectId` | Ya | Id |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## completeUpload

**Verifikasi size hash MIME scan** — `POST /api/v1/admin/uploads/{uploadId}/completions`

Status: **proposed [R]**; fase D0; sukses 202 → `UploadedObject`.

Akses: session cookie dan scope resource; capability `evidence:write`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Server baca objek dan verifikasi hash/size/MIME+scan; client sha256 bukan bukti verifikasi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `sha256` | Ya | string |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.

Poll: [getUploadStatus](evidence.md#getuploadstatus); baca `Location`/`Retry-After`. 202 bukan final accounting/payment.


## getUploadStatus

**Poll verifikasi upload privat** — `GET /api/v1/admin/uploads/{uploadId}`

Status: **proposed [R]**; fase D0; sukses 200 → `UploadStatus`.

Akses: session cookie dan scope resource; capability `evidence:read`. Sesi + current resource scope; actor/party diputuskan server.



Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## createMedia

**Daftarkan gambar terverifikasi untuk editor** — `POST /api/v1/admin/media`

Status: **proposed [R]**; fase D0; sukses 201 → `Media`.

Akses: session cookie dan scope resource; capability `evidence:write`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `objectId` | Ya | Id |
| `projectId` | Ya | Id |
| `sourceName` | Ya | string; maks 240 karakter |
| `alt` | Ya | string; maks 500 karakter |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`, `UPLOAD_NOT_VERIFIED`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## createEvidence

**Hubungkan verified object ke sumber/period** — `POST /api/v1/admin/evidence`

Status: **proposed [R]**; fase D0; sukses 201 → `Evidence`.

Akses: session cookie dan scope resource; capability `evidence:write`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `projectId` | Ya | Id |
| `assetId` | Ya | Id atau null |
| `offeringId` | Ya | Id atau null |
| `period` | Ya | Period atau null |
| `kind` | Ya | `authority` / `ownership` / `ppa` / `operation` / `invoice` / `collection` / `insurance` / `other` |
| `sourceName` | Ya | string; maks 240 karakter |
| `objectId` | Ya | Id |
| `observedAt` | Ya | Timestamp atau null |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`, `UPLOAD_NOT_VERIFIED`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## listEvidence

**Daftar evidence internal per proyek** — `GET /api/v1/admin/evidence`

Status: **proposed [R]**; fase D0; sukses 200 → `Evidence` (list).

Akses: session cookie dan scope resource; capability `evidence:read`. Sesi + current resource scope; actor/party diputuskan server.

Pagination `limit` 1–100 (default 20), cursor opaque. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

Query filters: `projectId`: Id; `offeringId`: Id.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## getEvidence

**Detail evidence internal** — `GET /api/v1/admin/evidence/{evidenceId}`

Status: **proposed [R]**; fase D0; sukses 200 → `Evidence`.

Akses: session cookie dan scope resource; capability `evidence:read`. Sesi + current resource scope; actor/party diputuskan server.



Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## reviewEvidence

**Review evidence dan authority** — `POST /api/v1/admin/evidence/{evidenceId}/review`

Status: **proposed [R]**; fase D0; sukses 201 → `ReviewDecision`.

Akses: session cookie dan scope resource; capability `evidence:review`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `If-Match` exact revision. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `decision` | Ya | `approve` / `reject` / `request_changes` |
| `reason` | Ya | string; maks 2000 karakter |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **412** `VERSION_MISMATCH`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **428** `VERSION_REQUIRED`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## createDocumentVersion

**Buat versi original atau investor copy** — `POST /api/v1/admin/documents`

Status: **proposed [R]**; fase D0; sukses 201 → `Document`.

Akses: session cookie dan scope resource; capability `document:write`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `evidenceId` | Ya | Id |
| `offeringId` | Ya | Id |
| `title` | Ya | string; maks 240 karakter |
| `variant` | Ya | `investor_copy` / `original` |
| `redactionReason` | Ya | string atau null |
| `objectId` | Ya | Id |
| `supersedesVersionId` | Ya | Id atau null |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`, `UPLOAD_NOT_VERIFIED`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## listAdminDocuments

**Daftar versi dokumen draft/original/copy** — `GET /api/v1/admin/documents`

Status: **proposed [R]**; fase D0; sukses 200 → `Document` (list).

Akses: session cookie dan scope resource; capability `document:read`. Sesi + current resource scope; actor/party diputuskan server.

Pagination `limit` 1–100 (default 20), cursor opaque. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

Query filters: `offeringId`: Id.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## getAdminDocument

**Baca metadata draft/original internal** — `GET /api/v1/admin/documents/{documentId}`

Status: **proposed [R]**; fase D0; sukses 200 → `Document`.

Akses: session cookie dan scope resource; capability `document:read`. Sesi + current resource scope; actor/party diputuskan server.



Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## reviewDocument

**Review exact document version** — `POST /api/v1/admin/documents/{documentId}/review`

Status: **proposed [R]**; fase D0; sukses 201 → `ReviewDecision`.

Akses: session cookie dan scope resource; capability `document:review`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `If-Match` exact revision. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `decision` | Ya | `approve` / `reject` / `request_changes` |
| `reason` | Ya | string; maks 2000 karakter |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **412** `VERSION_MISMATCH`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **428** `VERSION_REQUIRED`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## publishDocument

**Publish reviewed investor copy** — `POST /api/v1/admin/documents/{documentId}/publications`

Status: **proposed [R]**; fase D0; sukses 201 → `Publication`.

Akses: session cookie dan scope resource; capability `content:publish`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `If-Match` exact revision. Wajib `Origin` yang diizinkan. 

Original tetap privileged walaupun approved; redaction reason dan source/version terlihat pada investor copy.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `reviewDecisionId` | Ya | Id |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **412** `VERSION_MISMATCH`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **428** `VERSION_REQUIRED`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## Model respons

Schema nested, constraints dan contoh nilai lengkap ada di [OpenAPI](openapi.json). Domain proposed dibungkus envelope; auth existing raw.

### InvestorDocument

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `versionId` | Ya | Id |
| `offeringId` | Ya | Id |
| `title` | Ya | string; maks 240 karakter |
| `variant` | Ya | "investor_copy" |
| `redactionReason` | Ya | string atau null |
| `state` | Ya | `published` / `superseded` |
| `sourceName` | Ya | string; maks 240 karakter |
| `sha256` | Ya | string |
| `publishedAt` | Ya | Timestamp atau null |

### DocumentAccess

| Field | Wajib | Tipe / batas |
|---|---|---|
| `documentVersionId` | Ya | Id |
| `variant` | Ya | `investor_copy` / `original` |
| `downloadUrl` | Ya | PrivateDownloadPath |
| `expiresAt` | Ya | Timestamp |
| `contentType` | Ya | `application/pdf` / `image/png` / `image/jpeg` / `image/webp` / `text/csv` |
| `sha256` | Ya | string |
| `accessGrantId` | Ya | Id |

### BinaryContent

Schema: `BinaryContent` (binary).

### Media

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `objectId` | Ya | Id |
| `contentType` | Ya | `image/png` / `image/jpeg` / `image/webp` |
| `sourceName` | Ya | string; maks 240 karakter |
| `alt` | Ya | string; maks 500 karakter |
| `accessUrl` | Ya | PrivateDownloadPath |
| `expiresAt` | Ya | Timestamp |
| `accessGrantId` | Ya | Id |

### UploadIntent

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `uploadUrl` | Ya | uri |
| `method` | Ya | "PUT" |
| `contentType` | Ya | `application/pdf` / `image/png` / `image/jpeg` / `image/webp` / `text/csv` |
| `maxBytes` | Ya | integer |
| `expiresAt` | Ya | Timestamp |

### UploadedObject

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `uploadId` | Ya | Id |
| `state` | Ya | `pending_scan` / `verified` / `rejected` |
| `sha256` | Ya | string |
| `sizeBytes` | Ya | integer |
| `contentType` | Ya | `application/pdf` / `image/png` / `image/jpeg` / `image/webp` / `text/csv` |

### UploadStatus

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `projectId` | Ya | Id |
| `state` | Ya | `awaiting_upload` / `pending_verification` / `pending_scan` / `verified` / `rejected` / `expired` |
| `objectId` | Ya | Id atau null |
| `errorCode` | Ya | string atau null |
| `expiresAt` | Ya | Timestamp |

### Evidence

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `projectId` | Ya | Id |
| `assetId` | Ya | Id atau null |
| `offeringId` | Ya | Id atau null |
| `period` | Ya | Period atau null |
| `kind` | Ya | `authority` / `ownership` / `ppa` / `operation` / `invoice` / `collection` / `insurance` / `other` |
| `sourceName` | Ya | string; maks 240 karakter |
| `objectId` | Ya | Id |
| `observedAt` | Ya | Timestamp atau null |
| `state` | Ya | `draft` / `submitted` / `reviewed` / `rejected` |
| `version` | Ya | integer |
| `createdAt` | Ya | Timestamp |

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

### Document

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `versionId` | Ya | Id |
| `evidenceId` | Ya | Id |
| `offeringId` | Ya | Id |
| `title` | Ya | string; maks 240 karakter |
| `variant` | Ya | `investor_copy` / `original` |
| `redactionReason` | Ya | string atau null |
| `objectId` | Ya | Id |
| `supersedesVersionId` | Ya | Id atau null |
| `state` | Ya | `draft` / `submitted` / `approved` / `rejected` / `published` / `superseded` |
| `sourceName` | Ya | string; maks 240 karakter |
| `sha256` | Ya | string |
| `publishedAt` | Ya | Timestamp atau null |
| `revision` | Ya | RevisionControl |

### Publication

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `subjectId` | Ya | Id |
| `subjectVersionId` | Ya | Id |
| `reviewDecisionId` | Ya | Id |
| `publishedAt` | Ya | Timestamp |
| `supersedesPublicationId` | Ya | Id atau null |
