# Adapter provider D1

> Dihasilkan dari [contract.mjs](contract.mjs); edit sumber lalu jalankan `node scripts/build-api-contract.mjs`. Baseline 18 Oktober 2026.

[Indeks API](../api.md) · [OpenAPI](openapi.json) · [Konvensi](conventions.md) · [M01–M17](coverage.md). Contoh JSON request/response lengkap beserta schemas nested ada di OpenAPI. Status **proposed** berarti belum diimplementasikan.

| Operation | Method/path | Status | Acceptance |
|---|---|---|---|
| [ingestProviderEvent](#ingestproviderevent) | `POST /api/v1/webhooks/providers/{providerKey}` | proposed | M09, M11, M12 |

## ingestProviderEvent

**Ingest event dari adapter terotentikasi** — `POST /api/v1/webhooks/providers/{providerKey}`

Status: **proposed [R]**; fase D1-adapter; sukses 202 → `ProviderReceipt`.

Akses: signature adapter provider. Signature internal provider adapter yang dikonfigurasi.



Contract adapter internal, bukan signature wire vendor yang belum dipilih. HMAC raw bytes + timestamp + event id; durable inbox/dedupe sebelum 202; reconciliation menetapkan outcome.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `eventId` | Ya | string; maks 160 karakter |
| `kind` | Ya | `payment_observed` / `conversion_updated` / `funding_observed` / `payout_updated` |
| `businessResourceId` | Ya | Id |
| `occurredAt` | Ya | Timestamp |
| `chainId` | Ya | 84532 |
| `txHash` | Ya | TxHash atau null |
| `externalReference` | Ya | string; maks 160 karakter |

Error: **400** `INVALID_JSON`; **401** `INVALID_PROVIDER_SIGNATURE`; **403** `FORBIDDEN`; **404** `RESOURCE_NOT_FOUND`; **409** `IDEMPOTENCY_CONFLICT`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`, `EXCESS_PRECISION`, `WRONG_ASSET`, `EVIDENCE_INVALID`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `PROVIDER_UNAVAILABLE`.


## Model respons

Schema nested, constraints dan contoh nilai lengkap ada di [OpenAPI](openapi.json). Domain proposed dibungkus envelope; auth existing raw.

### ProviderReceipt

| Field | Wajib | Tipe / batas |
|---|---|---|
| `eventId` | Ya | string; maks 160 karakter |
| `ingestionId` | Ya | Id |
| `state` | Ya | `accepted` / `duplicate` |
| `receivedAt` | Ya | Timestamp |
