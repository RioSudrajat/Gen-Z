# Kontrak API seluruh MVP

**Tanggal:** 18 Oktober 2026, Asia/Jakarta. Scope: merinci interface sesuai requirements yang sudah disepakati; bukan membangun atau membuka endpoint domain.

## Deliverable

[Indeks API](../engineering/api.md), [OpenAPI 3.1.1 JSON](../engineering/api/openapi.json), [konvensi integrasi](../engineering/api/conventions.md), 16 reference area, [contoh alur](../engineering/api/examples.md)/JSON fixtures, dan [coverage M01–M17](../engineering/api/coverage.md).

Kontrak berisi 150 operations: enam source auth/health dan 144 proposed. Schema mendeskripsikan payload, nested types, enums/nullability, path/query/header, cookies/capability/party scope, errors, idempotency, ETag/concurrency, polling, privacy/download, precision, versioned consent/publication, net settlement, funded claim, refund, reconciliation dan recovery D1. Tidak ada API enable-live, functional reward, TGE, secondary trading atau full operator portal.

## Sumber dan pemeliharaan

`docs/engineering/api/contract.mjs` adalah sumber authoring; `scripts/build-api-contract.mjs` menghasilkan OpenAPI/reference/coverage, dan `scripts/api-contract-examples.mjs` menghasilkan fixture alur. Existing runtime auth payload tetap raw; target domain memakai envelope. Original/investor copy didownload melalui session-bound app proxy, bukan public storage read URL.

Root menambahkan `docs:api:build`/`docs:api:check`; Ajv 8.20.0 dan ajv-formats 3.0.1 yang sudah ada dalam lockfile dipin sebagai direct dev dependencies untuk validator. Tidak mengubah versi runtime app. `npm install --package-lock-only --offline --ignore-scripts --no-audit --no-fund` memastikan metadata lockfile konsisten tanpa install/menjalankan lifecycle scripts.

Schema struktur resmi disimpan utuh pada `scripts/schemas/openapi-3.1.schema.json`, sumber [OpenAPI schema 2025-09-15](https://spec.openapis.org/oas/3.1/schema/2025-09-15). Node checker menormalisasi resolusi `#meta` pada salinan in-memory agar sesuai target base schema pada Ajv, lalu memvalidasi setiap JSON Schema dan contoh terpisah. [Catatan validator](../../scripts/schemas/README.md) menjelaskan batasnya.

## Verifikasi

| Pemeriksaan | Hasil |
|---|---|
| `npm run docs:api:build` | 150 operations, 6 source/144 proposed, 294 schemas dan 16 reference area dihasilkan |
| Struktur OpenAPI | Lulus terhadap base schema resmi dengan resolusi lokal ekuivalen `#meta`; file schema sumber tetap utuh |
| JSON Schema/refs | 294 schemas compile; 3.180 local references valid |
| Contoh positif | 258 contoh OpenAPI serta 14 request/response worked-flow fixtures lolos schema |
| Kasus negatif | 29 payload invalid ditolak, termasuk precision, auth chain/role, client publication/version, hybrid tanpa fixed leg, wrong rights currency dan arbitrary claim amount/recipient |
| Parity auth existing | 12 kasus bentuk request dibandingkan langsung dengan Zod source melalui transpile modul TS pure; tanpa Next.js/database |
| Inventory/coverage | Semua 6 route operations source tercakup; operation IDs/path parameters/capabilities/poll links dan M01–M17 diperiksa |
| Generated freshness | SHA-256 authoring source/generator/examples cocok dengan generated OpenAPI |
| Docs links | 113 Markdown files, 1.171 local links; 0 gagal pada pemeriksaan terakhir |
| Dependency metadata | `npm ls --depth=0 ajv ajv-formats` dan lockfile-only offline check lulus; versi existing dipertahankan |

Schema/fixture validation tidak membuktikan business invariant sudah diimplementasikan. Source parity terbatas pada kasus request yang diperiksa; checksum EVM, signature, expiry dan business state tetap memerlukan verifier/domain/runtime tests.

Tidak menjalankan HTTP/backend E2E, database/migrasi, transaksi chain, provider signatures nyata, browser/UI atau live gates. Parity yang diperiksa adalah validasi bentuk request auth existing, bukan bukti cryptographic proof/session test baru. M15 tetap memerlukan bukti legal/operasi; M17 memerlukan UI/accessibility tests.
