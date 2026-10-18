# Katalog dan offering

> Dihasilkan dari [contract.mjs](contract.mjs); edit sumber lalu jalankan `node scripts/build-api-contract.mjs`. Baseline 18 Oktober 2026.

[Indeks API](../api.md) · [OpenAPI](openapi.json) · [Konvensi](conventions.md) · [M01–M17](coverage.md). Contoh JSON request/response lengkap beserta schemas nested ada di OpenAPI. Status **proposed** berarti belum diimplementasikan.

| Operation | Method/path | Status | Acceptance |
|---|---|---|---|
| [listAssets](#listassets) | `GET /api/v1/assets` | proposed | M04, M05 |
| [getAsset](#getasset) | `GET /api/v1/assets/{assetId}` | proposed | M04, M05 |
| [getProject](#getproject) | `GET /api/v1/projects/{projectId}` | proposed | M04, M07 |
| [getOffering](#getoffering) | `GET /api/v1/offerings/{offeringId}` | proposed | M04, M05, M07 |
| [getOfferingTabs](#getofferingtabs) | `GET /api/v1/offerings/{offeringId}/tabs` | proposed | M04, M06, M17 |
| [getTermsVersion](#gettermsversion) | `GET /api/v1/offerings/{offeringId}/terms-versions/{versionId}` | proposed | M07, M09 |
| [getModelVersion](#getmodelversion) | `GET /api/v1/offerings/{offeringId}/model-versions/{versionId}` | proposed | M07, M09 |

## listAssets

**Katalog privat Energy/Infrastructure** — `GET /api/v1/assets`

Status: **proposed [R]**; fase D0; sukses 200 → `Asset` (list).

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.

Pagination `limit` 1–100 (default 20), cursor opaque. 

Read/model atau command tunduk pada invariant dan akses di konvensi.

Query filters: `category`: `energy` / `infrastructure`; `availability`: `active_demo` / `coming_soon`.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## getAsset

**Detail identitas aset** — `GET /api/v1/assets/{assetId}`

Status: **proposed [R]**; fase D0; sukses 200 → `Asset`.

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.



Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## getProject

**Fakta proyek dan pihak berwenang** — `GET /api/v1/projects/{projectId}`

Status: **proposed [R]**; fase D0; sukses 200 → `Project`.

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.



Investor projection hanya fakta approved; internal contact/PII tidak disertakan.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## getOffering

**Offering dan model/terms approved** — `GET /api/v1/offerings/{offeringId}`

Status: **proposed [R]**; fase D0; sukses 200 → `Offering`.

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.



Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## getOfferingTabs

**Tujuh tab published** — `GET /api/v1/offerings/{offeringId}/tabs`

Status: **proposed [R]**; fase D0; sukses 200 → `OfferingTabs`.

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.



Read/model atau command tunduk pada invariant dan akses di konvensi.

Query filters: `locale`: `en` / `id`.

Error: **400** `INVALID_JSON`, `INVALID_CURSOR`, `INVALID_QUERY`; **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## getTermsVersion

**Terms version historis yang diizinkan** — `GET /api/v1/offerings/{offeringId}/terms-versions/{versionId}`

Status: **proposed [R]**; fase D0; sukses 200 → `Terms`.

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.



Hanya published read scope/versi terikat consent owner; tidak mengungkap draft.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## getModelVersion

**Model version terikat offering** — `GET /api/v1/offerings/{offeringId}/model-versions/{versionId}`

Status: **proposed [R]**; fase D0; sukses 200 → `EconomicModel`.

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.



Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: **401** `UNAUTHENTICATED`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## Model respons

Schema nested, constraints dan contoh nilai lengkap ada di [OpenAPI](openapi.json). Domain proposed dibungkus envelope; auth existing raw.

### Asset

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `facts` | Ya | AssetFacts |
| `projectIds` | Ya | array<Id>; maks 100 item |
| `offeringIds` | Ya | array<Id>; maks 100 item |
| `revision` | Ya | RevisionControl |

### Project

| Field | Wajib | Tipe / batas |
|---|---|---|
| `id` | Ya | Id |
| `facts` | Ya | ProjectFacts |
| `state` | Ya | `draft` / `evidence_review` / `approved` / `servicing` / `paused` / `resolved` |
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

### OfferingTabs

Schema: `OfferingTabs` (array<TabView>).

### Terms

| Field | Wajib | Tipe / batas |
|---|---|---|
| `versionId` | Ya | Id |
| `modelVersionId` | Ya | Id |
| `denomination` | Ya | "IDR" |
| `minInvestment` | Ya | RightsMoney |
| `maxInvestment` | Ya | RightsMoney |
| `cap` | Ya | RightsMoney |
| `tenorMonths` | Ya | integer |
| `transferPolicy` | Ya | "restricted_closed_end" |
| `instantExitAvailable` | Ya | false |
| `requiredDocumentVersionIds` | Ya | array<Id>; maks 100 item |
| `payoutPolicyVersionId` | Ya | Id |
| `refundPolicyVersionId` | Ya | Id |
| `publishedAt` | Ya | Timestamp atau null |

### EconomicModel

| Field | Wajib | Tipe / batas |
|---|---|---|
| `versionId` | Ya | Id |
| `kind` | Ya | `hybrid` / `revenue_participation` / `note` |
| `rightsCurrency` | Ya | "IDR" |
| `fixed` | Ya | object atau null |
| `variable` | Ya | object atau null |
| `principalPolicy` | Ya | object |
| `rounding` | Ya | object |
| `fees` | Ya | array<FeeRule>; maks 30 item |
| `assumptionsVersionId` | Ya | Id |
