# Fakta, editorial dan publication

> Dihasilkan dari [contract.mjs](contract.mjs); edit sumber lalu jalankan `node scripts/build-api-contract.mjs`. Baseline 18 Oktober 2026.

[Indeks API](../api.md) · [OpenAPI](openapi.json) · [Konvensi](conventions.md) · [M01–M17](coverage.md). Contoh JSON request/response lengkap beserta schemas nested ada di OpenAPI. Status **proposed** berarti belum diimplementasikan.

| Operation | Method/path | Status | Acceptance |
|---|---|---|---|
| [createProject](#createproject) | `POST /api/v1/admin/projects` | proposed | M06, M13 |
| [createParty](#createparty) | `POST /api/v1/admin/parties` | proposed | M06, M13 |
| [listParties](#listparties) | `GET /api/v1/admin/parties` | proposed | M06 |
| [createProjectPool](#createprojectpool) | `POST /api/v1/admin/project-pools` | proposed | M07 |
| [listPolicyVersions](#listpolicyversions) | `GET /api/v1/admin/policy-versions` | proposed | M06, M07 |
| [listAdminProjects](#listadminprojects) | `GET /api/v1/admin/projects` | proposed | M06 |
| [getAdminProject](#getadminproject) | `GET /api/v1/admin/projects/{projectId}` | proposed | M06 |
| [listAdminAssets](#listadminassets) | `GET /api/v1/admin/assets` | proposed | M05, M06 |
| [getAdminAsset](#getadminasset) | `GET /api/v1/admin/assets/{assetId}` | proposed | M06 |
| [listAdminOfferings](#listadminofferings) | `GET /api/v1/admin/offerings` | proposed | M06 |
| [getAdminOffering](#getadminoffering) | `GET /api/v1/admin/offerings/{offeringId}` | proposed | M06, M07 |
| [updateProject](#updateproject) | `PATCH /api/v1/admin/projects/{projectId}` | proposed | M06, M13 |
| [createAsset](#createasset) | `POST /api/v1/admin/assets` | proposed | M05, M06 |
| [updateAsset](#updateasset) | `PATCH /api/v1/admin/assets/{assetId}` | proposed | M05, M06 |
| [createOffering](#createoffering) | `POST /api/v1/admin/offerings` | proposed | M06, M07 |
| [updateOffering](#updateoffering) | `PATCH /api/v1/admin/offerings/{offeringId}` | proposed | M06, M07 |
| [createRevision](#createrevision) | `POST /api/v1/admin/projects/{projectId}/revisions` | proposed | M06 |
| [getRevision](#getrevision) | `GET /api/v1/admin/revisions/{revisionId}` | proposed | M06 |
| [listRevisions](#listrevisions) | `GET /api/v1/admin/revisions` | proposed | M06 |
| [submitRevision](#submitrevision) | `POST /api/v1/admin/revisions/{revisionId}/submissions` | proposed | M06 |
| [reviewRevision](#reviewrevision) | `POST /api/v1/admin/revisions/{revisionId}/review` | proposed | M06, M13 |
| [publishRevision](#publishrevision) | `POST /api/v1/admin/revisions/{revisionId}/publications` | proposed | M06 |
| [reviewTerms](#reviewterms) | `POST /api/v1/admin/offerings/{offeringId}/terms-reviews` | proposed | M06, M07, M13 |
| [publishTerms](#publishterms) | `POST /api/v1/admin/offerings/{offeringId}/terms-publications` | proposed | M06, M07 |

## createProject

**Buat fakta proyek draft** — `POST /api/v1/admin/projects`

Status: **proposed [R]**; fase D0; sukses 201 → `Project`.

Akses: session cookie dan scope resource; capability `project:write`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `name` | Ya | string; maks 240 karakter |
| `slug` | Ya | string; maks 120 karakter |
| `countryCode` | Ya | "ID" |
| `description` | Ya | string; maks 4000 karakter |
| `partyRoles` | Ya | array<PartyRole>; maks 30 item |
| `assetIds` | Ya | array<Id>; maks 100 item |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## createParty

**Daftarkan pihak dengan authority evidence** — `POST /api/v1/admin/parties`

Status: **proposed [R]**; fase D0; sukses 201 → `Party`.

Akses: session cookie dan scope resource; capability `project:write`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `kind` | Ya | `person` / `organization` |
| `displayName` | Ya | string; maks 240 karakter |
| `countryCode` | Ya | string |
| `authorityEvidenceVersionIds` | Ya | array<Id>; maks 100 item |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## listParties

**Pihak yang tersedia dalam scope admin** — `GET /api/v1/admin/parties`

Status: **proposed [R]**; fase D0; sukses 200 → `Party` (list).

Akses: session cookie dan scope resource; capability `project:read`. Sesi + current resource scope; actor/party diputuskan server.

Pagination `limit` 1–100 (default 20), cursor opaque. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## createProjectPool

**Buat pool terpisah satu proyek** — `POST /api/v1/admin/project-pools`

Status: **proposed [R]**; fase D0; sukses 201 → `Pool`.

Akses: session cookie dan scope resource; capability `offering:write`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `projectId` | Ya | Id |
| `issuerPartyId` | Ya | Id |
| `name` | Ya | string; maks 160 karakter |
| `rightsCurrency` | Ya | "IDR" |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## listPolicyVersions

**Versi policy/config yang telah direview** — `GET /api/v1/admin/policy-versions`

Status: **proposed [R]**; fase D0; sukses 200 → `PolicyVersion` (list).

Akses: session cookie dan scope resource; capability `project:read`. Sesi + current resource scope; actor/party diputuskan server.

Pagination `limit` 1–100 (default 20), cursor opaque. 

Policy/config ditetapkan melalui review konfigurasi; tidak ada endpoint edit vendor/kurs/mandat live bebas.

Query filters: `kind`: `payout` / `refund` / `assumptions` / `privacy`.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## listAdminProjects

**Proyek draft dan published dalam scope** — `GET /api/v1/admin/projects`

Status: **proposed [R]**; fase D0; sukses 200 → `Project` (list).

Akses: session cookie dan scope resource; capability `project:read`. Sesi + current resource scope; actor/party diputuskan server.

Pagination `limit` 1–100 (default 20), cursor opaque. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## getAdminProject

**Fakta proyek internal versioned** — `GET /api/v1/admin/projects/{projectId}`

Status: **proposed [R]**; fase D0; sukses 200 → `Project`.

Akses: session cookie dan scope resource; capability `project:read`. Sesi + current resource scope; actor/party diputuskan server.



Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## listAdminAssets

**Aset dalam scope admin** — `GET /api/v1/admin/assets`

Status: **proposed [R]**; fase D0; sukses 200 → `Asset` (list).

Akses: session cookie dan scope resource; capability `project:read`. Sesi + current resource scope; actor/party diputuskan server.

Pagination `limit` 1–100 (default 20), cursor opaque. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## getAdminAsset

**Fakta aset internal versioned** — `GET /api/v1/admin/assets/{assetId}`

Status: **proposed [R]**; fase D0; sukses 200 → `Asset`.

Akses: session cookie dan scope resource; capability `project:read`. Sesi + current resource scope; actor/party diputuskan server.



Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## listAdminOfferings

**Offering draft dan published dalam scope** — `GET /api/v1/admin/offerings`

Status: **proposed [R]**; fase D0; sukses 200 → `Offering` (list).

Akses: session cookie dan scope resource; capability `project:read`. Sesi + current resource scope; actor/party diputuskan server.

Pagination `limit` 1–100 (default 20), cursor opaque. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## getAdminOffering

**Draft terms/model offering internal** — `GET /api/v1/admin/offerings/{offeringId}`

Status: **proposed [R]**; fase D0; sukses 200 → `Offering`.

Akses: session cookie dan scope resource; capability `project:read`. Sesi + current resource scope; actor/party diputuskan server.



Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## updateProject

**Revisi fakta proyek** — `PATCH /api/v1/admin/projects/{projectId}`

Status: **proposed [R]**; fase D0; sukses 200 → `Project`.

Akses: session cookie dan scope resource; capability `project:write`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `If-Match` exact revision. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `name` | Ya | string; maks 240 karakter |
| `slug` | Ya | string; maks 120 karakter |
| `countryCode` | Ya | "ID" |
| `description` | Ya | string; maks 4000 karakter |
| `partyRoles` | Ya | array<PartyRole>; maks 30 item |
| `assetIds` | Ya | array<Id>; maks 100 item |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **412** `VERSION_MISMATCH`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **428** `VERSION_REQUIRED`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## createAsset

**Buat fakta aset draft** — `POST /api/v1/admin/assets`

Status: **proposed [R]**; fase D0; sukses 201 → `Asset`.

Akses: session cookie dan scope resource; capability `project:write`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `name` | Ya | string; maks 240 karakter |
| `category` | Ya | `energy` / `infrastructure` |
| `technology` | Ya | `solar` / `bess` / `ev_charging` / `battery_swap` / `other` |
| `countryCode` | Ya | "ID" |
| `region` | Ya | string; maks 160 karakter |
| `capacity` | Ya | array<object>; maks 10 item |
| `operationsState` | Ya | `operational` / `maintenance` / `planned` / `unknown` |
| `showcaseAvailability` | Ya | `active_demo` / `coming_soon` / `hidden` |
| `tags` | Ya | array<string>; maks 20 item |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## updateAsset

**Revisi fakta aset** — `PATCH /api/v1/admin/assets/{assetId}`

Status: **proposed [R]**; fase D0; sukses 200 → `Asset`.

Akses: session cookie dan scope resource; capability `project:write`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `If-Match` exact revision. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `name` | Ya | string; maks 240 karakter |
| `category` | Ya | `energy` / `infrastructure` |
| `technology` | Ya | `solar` / `bess` / `ev_charging` / `battery_swap` / `other` |
| `countryCode` | Ya | "ID" |
| `region` | Ya | string; maks 160 karakter |
| `capacity` | Ya | array<object>; maks 10 item |
| `operationsState` | Ya | `operational` / `maintenance` / `planned` / `unknown` |
| `showcaseAvailability` | Ya | `active_demo` / `coming_soon` / `hidden` |
| `tags` | Ya | array<string>; maks 20 item |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **412** `VERSION_MISMATCH`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **428** `VERSION_REQUIRED`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## createOffering

**Buat draft offering model dan terms** — `POST /api/v1/admin/offerings`

Status: **proposed [R]**; fase D0; sukses 201 → `Offering`.

Akses: session cookie dan scope resource; capability `offering:write`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `projectId` | Ya | Id |
| `poolId` | Ya | Id |
| `issuerPartyId` | Ya | Id |
| `name` | Ya | string; maks 240 karakter |
| `series` | Ya | string; maks 120 karakter |
| `model` | Ya | EconomicModelInput |
| `terms` | Ya | TermsInput |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## updateOffering

**Buat versi draft facts terms/model** — `PATCH /api/v1/admin/offerings/{offeringId}`

Status: **proposed [R]**; fase D0; sukses 200 → `Offering`.

Akses: session cookie dan scope resource; capability `offering:write`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `If-Match` exact revision. Wajib `Origin` yang diizinkan. 

Published terms/model tidak ditimpa; update menghasilkan versi draft baru, tidak mengubah historical consent.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `projectId` | Ya | Id |
| `poolId` | Ya | Id |
| `issuerPartyId` | Ya | Id |
| `name` | Ya | string; maks 240 karakter |
| `series` | Ya | string; maks 120 karakter |
| `model` | Ya | EconomicModelInput |
| `terms` | Ya | TermsInput |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **412** `VERSION_MISMATCH`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **428** `VERSION_REQUIRED`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## createRevision

**Draft konten typed tujuh tab** — `POST /api/v1/admin/projects/{projectId}/revisions`

Status: **proposed [R]**; fase D0; sukses 201 → `Revision`.

Akses: session cookie dan scope resource; capability `content:write`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `reason` | Ya | string; maks 2000 karakter |
| `supersedesRevisionId` | Ya | Id atau null |
| `tabs` | Ya | array<TabDraft>; maks 14 item |
| `factVersions` | Ya | array<object>; maks 100 item |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## getRevision

**Baca draft/review version** — `GET /api/v1/admin/revisions/{revisionId}`

Status: **proposed [R]**; fase D0; sukses 200 → `Revision`.

Akses: session cookie dan scope resource; capability `content:read`. Sesi + current resource scope; actor/party diputuskan server.



Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## listRevisions

**Daftar versi editorial dalam scope** — `GET /api/v1/admin/revisions`

Status: **proposed [R]**; fase D0; sukses 200 → `Revision` (list).

Akses: session cookie dan scope resource; capability `content:read`. Sesi + current resource scope; actor/party diputuskan server.

Pagination `limit` 1–100 (default 20), cursor opaque. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

Query filters: `projectId`: Id; `offeringId`: Id.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## submitRevision

**Kirim exact revision untuk review** — `POST /api/v1/admin/revisions/{revisionId}/submissions`

Status: **proposed [R]**; fase D0; sukses 201 → `Revision`.

Akses: session cookie dan scope resource; capability `content:write`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `If-Match` exact revision. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `reason` | Ya | string; maks 2000 karakter |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **412** `VERSION_MISMATCH`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **428** `VERSION_REQUIRED`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## reviewRevision

**Review exact revision** — `POST /api/v1/admin/revisions/{revisionId}/review`

Status: **proposed [R]**; fase D0; sukses 201 → `ReviewDecision`.

Akses: session cookie dan scope resource; capability `content:review`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `If-Match` exact revision. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `decision` | Ya | `approve` / `reject` / `request_changes` |
| `reason` | Ya | string; maks 2000 karakter |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **412** `VERSION_MISMATCH`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **428** `VERSION_REQUIRED`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## publishRevision

**Publish revision approved** — `POST /api/v1/admin/revisions/{revisionId}/publications`

Status: **proposed [R]**; fase D0; sukses 201 → `Publication`.

Akses: session cookie dan scope resource; capability `content:publish`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `If-Match` exact revision. Wajib `Origin` yang diizinkan. 

Review decision harus approve exact version, reference valid dan seluruh 7 tab published tersedia per locale. Publish atomik, histori/correction tetap.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `reviewDecisionId` | Ya | Id |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **412** `VERSION_MISMATCH`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **428** `VERSION_REQUIRED`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## reviewTerms

**Review exact terms/model version** — `POST /api/v1/admin/offerings/{offeringId}/terms-reviews`

Status: **proposed [R]**; fase D0; sukses 201 → `ReviewDecision`.

Akses: session cookie dan scope resource; capability `terms:review`. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Idempotency-Key`. Wajib `If-Match` exact revision. Wajib `Origin` yang diizinkan. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `decision` | Ya | `approve` / `reject` / `request_changes` |
| `reason` | Ya | string; maks 2000 karakter |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **404** `RESOURCE_NOT_FOUND`; **409** `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `COMMAND_IN_PROGRESS`; **412** `VERSION_MISMATCH`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **428** `VERSION_REQUIRED`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## publishTerms

**Publish terms/model approved** — `POST /api/v1/admin/offerings/{offeringId}/terms-publications`

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

### Project

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `facts` | Ya | ProjectFacts |
| `state` | Ya | `draft` / `evidence_review` / `approved` / `servicing` / `paused` / `resolved` |
| `revision` | Ya | RevisionControl |

### Party

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `kind` | Ya | `person` / `organization` |
| `displayName` | Ya | string; maks 240 karakter |
| `countryCode` | Ya | string |

### Pool

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `projectId` | Ya | Id |
| `issuerPartyId` | Ya | Id |
| `name` | Ya | string; maks 160 karakter |
| `rightsCurrency` | Ya | "IDR" |
| `revision` | Ya | RevisionControl |

### PolicyVersion

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `kind` | Ya | `payout` / `refund` / `assumptions` / `privacy` |
| `environment` | Ya | Environment |
| `state` | Ya | `approved` / `expired` / `disabled` |
| `description` | Ya | string; maks 4000 karakter |
| `assetIds` | Ya | array<Id>; maks 100 item |
| `documentVersionIds` | Ya | array<Id>; maks 100 item |
| `effectiveAt` | Ya | Timestamp |

### Asset

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `facts` | Ya | AssetFacts |
| `projectIds` | Ya | array<Id>; maks 100 item |
| `offeringIds` | Ya | array<Id>; maks 100 item |
| `revision` | Ya | RevisionControl |

### Offering

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `facts` | Ya | OfferingFacts |
| `state` | Ya | `draft` / `demo_open` / `open` / `closed` / `servicing` / `paused` / `default` / `resolved` |
| `showcaseAvailability` | Ya | `active_demo` / `coming_soon` / `hidden` |
| `synthetic` | Ya | boolean |
| `revision` | Ya | RevisionControl |

### Revision

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `projectId` | Ya | Id |
| `offeringId` | Ya | Id |
| `version` | Ya | integer |
| `state` | Ya | `draft` / `submitted` / `approved` / `rejected` / `changes_requested` / `published` / `superseded` |
| `reason` | Ya | string; maks 2000 karakter |
| `supersedesRevisionId` | Ya | Id atau null |
| `tabs` | Ya | array<TabDraft>; maks 14 item |
| `reviewDecisionId` | Ya | Id atau null |
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

### Publication

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `subjectId` | Ya | Id |
| `subjectVersionId` | Ya | Id |
| `reviewDecisionId` | Ya | Id |
| `publishedAt` | Ya | Timestamp |
| `supersedesPublicationId` | Ya | Id atau null |
