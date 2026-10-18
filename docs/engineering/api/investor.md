# Dashboard, portfolio dan informasi

> Dihasilkan dari [contract.mjs](contract.mjs); edit sumber lalu jalankan `node scripts/build-api-contract.mjs`. Baseline 18 Oktober 2026.

[Indeks API](../api.md) · [OpenAPI](openapi.json) · [Konvensi](conventions.md) · [M01–M17](coverage.md). Contoh JSON request/response lengkap beserta schemas nested ada di OpenAPI. Status **proposed** berarti belum diimplementasikan.

| Operation | Method/path | Status | Acceptance |
|---|---|---|---|
| [getOverview](#getoverview) | `GET /api/v1/me/overview` | proposed | M09, M11 |
| [getFeatureInfo](#getfeatureinfo) | `GET /api/v1/me/features` | proposed | M16 |
| [calculateScenario](#calculatescenario) | `POST /api/v1/offering-scenarios` | proposed | M07 |
| [listPositions](#listpositions) | `GET /api/v1/me/positions` | proposed | M09 |
| [getPosition](#getposition) | `GET /api/v1/positions/{positionId}` | proposed | M09 |
| [getPositionSchedule](#getpositionschedule) | `GET /api/v1/positions/{positionId}/schedule` | proposed | M07, M09 |
| [listActivity](#listactivity) | `GET /api/v1/me/activity` | proposed | M09, M11, M12 |

## getOverview

**Ringkasan posisi per currency** — `GET /api/v1/me/overview`

Status: **proposed [R]**; fase D0; sukses 200 → `Overview`.

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.



Scope acting party; jangan menjumlah lintas currency atau menyebut net cost sebagai principal otomatis.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## getFeatureInfo

**Informasi Rewards Points dan Token** — `GET /api/v1/me/features`

Status: **proposed [R]**; fase D0; sukses 200 → `FeatureInfo` (list).

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.

Pagination `limit` 1–100 (default 20), cursor opaque. 

Hanya tiga Coming soon; tidak ada balance/award/redeem/buy/stake.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## calculateScenario

**Hitung forecast dari model approved** — `POST /api/v1/offering-scenarios`

Status: **proposed [R]**; fase D0; sukses 200 → `ScenarioResult`.

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.

Wajib `Origin` yang diizinkan. 

Read-only calculation; tidak menciptakan hak/balance/persistence. Revision/model mismatch ditolak.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `offeringId` | Ya | Id |
| `termsVersionId` | Ya | Id |
| `modelVersionId` | Ya | Id |
| `investment` | Ya | Money |
| `utilization` | Ya | Ratio |
| `collectionRate` | Ya | Ratio |
| `opexMultiplier` | Ya | Decimal |

Error: **400** `INVALID_JSON`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`, `INVALID_ORIGIN`; **409** `STATE_CONFLICT`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## listPositions

**Portfolio milik acting party** — `GET /api/v1/me/positions`

Status: **proposed [R]**; fase D0; sukses 200 → `Position` (list).

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.

Pagination `limit` 1–100 (default 20), cursor opaque. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

Query filters: `offeringId`: Id.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## getPosition

**Posisi dan versi hak** — `GET /api/v1/positions/{positionId}`

Status: **proposed [R]**; fase D0; sukses 200 → `Position`.

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.



Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## getPositionSchedule

**Kewajiban/forecast sesuai terms** — `GET /api/v1/positions/{positionId}/schedule`

Status: **proposed [R]**; fase D0; sukses 200 → `Obligation` (list).

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.

Pagination `limit` 1–100 (default 20), cursor opaque. 

Principal/income nullable sesuai model; due/forecast berbeda dari received.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## listActivity

**Aktivitas domain owner** — `GET /api/v1/me/activity`

Status: **proposed [R]**; fase D0; sukses 200 → `Activity` (list).

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.

Pagination `limit` 1–100 (default 20), cursor opaque. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

Query filters: `offeringId`: Id.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## Model respons

Schema nested, constraints dan contoh nilai lengkap ada di [OpenAPI](openapi.json). Domain proposed dibungkus envelope; auth existing raw.

### Overview

| Field | Wajib | Tipe / batas |
|---|---|---|
| `actingPartyId` | Ya | Id |
| `positionCount` | Ya | integer |
| `netCostsByCurrency` | Ya | array<Money>; maks 10 item |
| `distributionsByCurrency` | Ya | array<Money>; maks 10 item |
| `claimableByCurrency` | Ya | array<Money>; maks 10 item |
| `pendingSubscriptionIds` | Ya | array<Id>; maks 100 item |
| `unresolvedCaseIds` | Ya | array<Id>; maks 100 item |

### FeatureInfo

| Field | Wajib | Tipe / batas |
|---|---|---|
| `feature` | Ya | `rewards` / `points` / `gen-z-token` |
| `availability` | Ya | "coming_soon" |
| `informationalOnly` | Ya | true |

### ScenarioResult

| Field | Wajib | Tipe / batas |
|---|---|---|
| `offeringId` | Ya | Id |
| `modelVersionId` | Ya | Id |
| `assumptionsVersionId` | Ya | Id |
| `forecast` | Ya | true |
| `rows` | Ya | array<object>; maks 1200 item |
| `warnings` | Ya | array<string>; maks 30 item |

### Position

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `partyId` | Ya | Id |
| `offeringId` | Ya | Id |
| `termsVersionId` | Ya | Id |
| `modelVersionId` | Ya | Id |
| `units` | Ya | Decimal |
| `netCost` | Ya | RightsMoney |
| `initialPrincipal` | Ya | RightsMoney atau null |
| `outstandingPrincipal` | Ya | RightsMoney atau null |
| `state` | Ya | `active` / `expired` / `resolved` / `frozen` / `recovered` |
| `allocationIds` | Ya | array<Id>; maks 100 item |
| `recipientBindingId` | Ya | Id |
| `revision` | Ya | RevisionControl |

### Obligation

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `positionId` | Ya | Id |
| `period` | Ya | Period |
| `dueDate` | Ya | Date |
| `incomeDue` | Ya | RightsMoney atau null |
| `principalDue` | Ya | RightsMoney atau null |
| `state` | Ya | `forecast` / `due` / `partially_paid` / `paid` / `overdue` / `not_applicable` |
| `modelVersionId` | Ya | Id |

### Activity

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `kind` | Ya | `subscription` / `allocation` / `report` / `distribution` / `claim` / `refund` / `case` |
| `resourceId` | Ya | Id |
| `offeringId` | Ya | Id atau null |
| `status` | Ya | string; maks 100 karakter |
| `occurredAt` | Ya | Timestamp |
