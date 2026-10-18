# Kontrak API MVP

**Baseline:** kontrak `0.1.0-draft` [R], 18 Oktober 2026. Kontrak mencakup seluruh area MVP: **150 operasi**, **6 tersedia di source** dan **144 proposed**. Ini kelengkapan spesifikasi interface, bukan implementasi seluruh backend atau hasil uji transaksi.

Mulai dari **[konvensi integrasi](api/conventions.md)** dan **[OpenAPI JSON](api/openapi.json)**. Kontrak memuat request/response nested, parameters, required fields, auth, success/error status, contoh synthetic, idempotency, concurrency dan mapping requirement. **[Contoh alur](api/examples.md)** menjelaskan IDRX/USDC → subscription → funded claim serta failure paths. **[Coverage M01–M17](api/coverage.md)** mencatat bagian yang tetap memerlukan domain/UI/legal verification.

| Area | Reference |
|---|---|
| Auth/health yang tersedia | [Auth](api/auth.md) |
| Intake operator, screening, notifikasi dan retensi | [Inquiry](api/intake.md) |
| Party, grants, eligibility review | [Access](api/access.md) |
| Assets, offering, terms/model dan tujuh tab | [Catalog](api/catalog.md) |
| Upload privat, review evidence, dokumen/media dan download | [Evidence](api/evidence.md) |
| Operasi, invoice, kas dan monthly reports | [Reporting](api/reporting.md) |
| Overview, portfolio, jadwal dan Coming soon | [Investor](api/investor.md) |
| Registry, eligibility, quote, subscription dan allocation | [Investment](api/investment.md) |
| Entitlement, claim, receipt dan payout attempts | [Distribution](api/distribution.md) |
| Draft facts, revisions, review dan publication | [Editorial](api/editorial.md) |
| Settlement, closing, allocation dan funding | [Servicing](api/servicing.md) |
| Cases, refund dan liability | [Exceptions](api/exceptions.md) |
| Jobs, reconciliation, ledger, audit dan live gates | [Operations](api/operations.md) |
| Same-owner recovery D1 | [Recovery](api/recovery.md) |
| Provider adapter D1 yang belum dipilih | [Integration](api/integration.md) |
| Scenario controls D0 terisolasi | [Demo](api/demo.md) |

Jumlah logical operations tidak mewajibkan membangun seluruh route/admin UI sekaligus. Public marketing bisa tetap file/SSR; tidak ada full operator portal, functional rewards/TGE, secondary transfer atau API enable-live. Runtime auth mempertahankan raw payload existing; proposed domain memakai envelope baru. Vendor, issuer, live payout/refund dan mandat yang belum dipilih tetap terbuka.

Sumber yang diedit: [contract.mjs](api/contract.mjs). Reference per area dan OpenAPI dihasilkan lewat `npm run docs:api:build`; periksa dengan `npm run docs:api:check` dan `node scripts/check-docs.mjs`. [Laporan verifikasi](../history/2026-10-18-api-contract.md) membedakan pemeriksaan kontrak dari runtime testing.

## Ringkasan auth yang sudah tersedia

**Baseline:** inspeksi handlers source 18 Oktober 2026. Tidak menguji HTTP ulang pada reorganisasi ini. Origin platform lokal default `http://localhost:3001`; origin deployment mengikuti konfigurasi. Target API investasi/inquiry belum diimplementasikan; lihat [manifest target](routes-and-api.md).

## Endpoint dan akses

| Method/path | Akses | Request | Response berhasil |
|---|---|---|---|
| `GET /api/health` | Publik | Tidak ada | 200; foundation/liveness, bukan readiness investasi |
| `GET /api/ready` | Publik | Tidak ada | Saat ini selalu 503 overall, dengan `walletAuthenticationReady` terpisah |
| `POST /api/v1/auth/challenges` | Publik, Origin valid | `{ address, chainId: 84532 }` | 200 `{ challengeId, message, chainId }`; cookie browser binding |
| `POST /api/v1/auth/verify` | Binding cookie, Origin valid | `{ challengeId, address, message, signature }` | 200 `{ address, expiresAt }`; cookie sesi opaque |
| `GET /api/v1/session` | Session cookie valid | Tidak ada | 200 identity/session, environment dan `workspaces: []` |
| `POST /api/v1/auth/logout` | Origin valid | Tidak ada body wajib | 204; revoke current session/binding challenge, hapus cookies |

Mutation auth membutuhkan `Origin` sama persis dengan configured app origin. Challenge/verify memakai `application/json`, schema strict dan body maksimum 8192 bytes. Address EVM dinormalisasi; chain challenge harus 84532. Proof message harus cocok persis challenge; signature berupa hex. Tidak ada field role/eligibility/admin.

## Contoh payload

```json
{
  "address": "0x0000000000000000000000000000000000000001",
  "chainId": 84532
}
```

Alamat di atas hanya contoh bentuk payload; proof valid memerlukan kontrol wallet yang menandatangani challenge persis. Simpan cookie binding dari respons challenge dan kirim bersama verify pada browser yang sama. Jangan mengubah nonce/domain/URI/message dari server.

Session berhasil mengembalikan `accountId`, `address`, `namespace`, `chainId`, `proofMethod`, `expiresAt`, `environment`, dan `workspaces`. `workspaces: []` berarti belum ada grants/workspaces yang diimplementasikan; bukan admin/investor eligibility otomatis.

## Error dan side effect

| Status/code | Penyebab |
|---|---|
| 400 `INVALID_JSON` | Body bukan JSON valid |
| 401 `INVALID_WALLET_PROOF` | Binding/proof/expiry/context/signature invalid, disabled account atau nonce sudah consumed |
| 401 `UNAUTHENTICATED` | Session read tanpa sesi valid |
| 403 `INVALID_ORIGIN` | Mutation dari origin yang tidak cocok |
| 413 `BODY_TOO_LARGE` | JSON auth melebihi batas |
| 415 `JSON_REQUIRED` | Content-Type challenge/verify bukan JSON |
| 422 `INVALID_INPUT` | Schema strict tidak cocok |
| 429 `TOO_MANY_ATTEMPTS` | Bucket rate limit terlampaui |
| 503 `WRONG_RPC_CHAIN` | Contract-account RPC berada di chain salah |
| 503 `SERVICE_UNAVAILABLE` | Error service/database/configuration yang tidak diekspos rinci |

Auth error memakai `{ "error": { "code": "...", "message": "..." } }`; health/readiness memiliki payload tersendiri. Response auth/session private `no-store`, `Vary: Cookie`. Verify mengonsumsi challenge sekali secara atomik dan membuat session; bukan idempotent replay yang mengembalikan sesi baru. Logout tanpa current session tetap dapat 204 jika service tersedia. Browser `paid=true` tidak menjadi API konfirmasi investasi.

## Sumber kontrak

[Handlers auth](../../apps/platform/src/app/api/v1/auth/), [session](../../apps/platform/src/app/api/v1/session/route.ts), [validasi payload](../../apps/platform/src/server/auth/validation.ts), [service](../../apps/platform/src/server/auth/service.ts), [HTTP wrapper](../../apps/platform/src/server/http.ts). Kebijakan auth/security: [Security](../SECURITY.md). Saat interface domain benar-benar dibuat, dokumentasikan method/path, current authorization, request/response, error, idempotency, persistence/side effects dan source/OpenAPI aktual.
