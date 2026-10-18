# Routes dan API target

**Status: rancangan [R].** Manifest ini target, bukan kontrak runtime. API yang benar-benar tersedia dijelaskan di [API auth aktif](api.md).

**Kontrak rinci sekarang:** [indeks API MVP](api.md), [OpenAPI](api/openapi.json) dan [konvensi](api/conventions.md). Nama/path/schema lengkap di OpenAPI menjadi baseline kontrak; tabel di bawah dipertahankan sebagai ringkasan rancangan asal. Dokumen/file download saat ini dirancang melalui session-bound app proxy agar auth/resource checks tetap berlaku saat bytes diunduh.

Sumber pemisahan: [dokumen asal](../archive/app-architecture-2026-10-18.md). Dipisahkan 18 Oktober 2026; label [F]/[R]/[A]/[O]/[V] mengikuti [panduan](../CONTRIBUTING.md).

## Manifest route dan slug [R]

Nama route adalah rancangan, bukan bukti file/page tersedia. `assetSlug` human-readable; IDs project/asset/offering/subscription/position stabil dan tidak menjadi authorization boundary. Prefix app berikut diasumsikan pada origin Next.js; domain produksi belum dipilih.

| Route | Pemilik / akses | Perilaku MVP |
|---|---|---|
| `/` | Astro, publik | Penjelasan produk/stage, Discuss your asset dan Launch app |
| `/contact` | Astro, publik | Intake profil/kontak, kategori/lokasi/status aset dan kebutuhan pembiayaan; tanpa upload sensitif |
| `/how-it-works`, `/partners` | Astro, publik jika dibuat | Penjelasan tahap/peran; boleh berupa section landing; tanpa klaim partner nyata |
| `/legal/[documentSlug]` | Astro, publik | Privacy/terms/disclaimer produk; berbeda dari dokumen offering privat |
| `/auth` | Next.js, entry publik | Wallet challenge sign-in sejak D0; tanpa approval token/transfer |
| `/auth/workspace` | Next.js, sesi | Chooser grant server jika multi-role |
| `/app` | Next.js, sesi | Dashboard investor |
| `/app/assets` | Next.js, sesi | Katalog Energy/Infrastructure |
| `/app/assets/[assetSlug]` | Next.js, sesi + resource scope | Tujuh tab melalui validated `?tab=`; approved investor docs tanpa syarat eligibility transaksi |
| `/app/invest/[offeringId]` | Next.js, sesi + eligibility + offering gate | Quote/consent IDRX/USDC, net IDR rights, biaya dan expiry |
| `/app/subscriptions/[subscriptionId]` | Next.js, owner/org mandate | Pending/confirmed/conversion/settlement/allocation/refund status |
| `/app/portfolio` | Next.js, owner/org mandate | Posisi dan histori; model-specific principal/income |
| `/app/portfolio/[positionId]` | Next.js, owner/org mandate | Terms terikat, schedule jika ada, reports, distribusi, claim dan receipt |
| `/app/rewards`, `/app/points`, `/app/gen-z` | Next.js, sesi | Informasi/Coming soon; functional reward tidak diaktifkan |
| `/app/activity`, `/app/account`, `/app/support` | Next.js, owner | Aktivitas, session/wallet dan exception/case; dapat digabung untuk MVP |
| `/admin/inquiries` | Next.js, founder/admin berwenang | Penerimaan, screening, kebutuhan bukti, interaksi terakhir dan retensi |
| `/admin/projects/[projectId]` | Next.js, scoped reviewer/editor | Fakta, tujuh tab, evidence dan review/publikasi |
| `/admin/funding`, `/admin/servicing` | Next.js, finance capability | Reconciliation, approval, pendanaan distribusi, claim/refund exceptions |
| `/admin/access`, `/admin/audit` | Next.js, restricted capability | Grant, revocation dan histori; bukan role self-selection |
| `/operator/projects/[projectId]` | Next.js, assigned operator jika diperlukan | Submission terbatas; portal self-service penuh ditunda |

Tidak ada route partner reward/account linking/redemption aktif pada MVP. Contoh slug fixture: `solar-hybrid-demo`, `bess-showcase`, `ev-infra-showcase`; bukan catatan operating partner nyata.

Batas komponen, repo dan deployment dipelihara di [Architecture](../ARCHITECTURE.md). Marketing tidak memerlukan cookie app untuk rendering publik; inquiry memakai endpoint server dengan Origin/rate-limit controls.

## Manifest kontrak API [R]

Logical app prefix `/api/v1`; command finansial synthetic dapat dipisah `/api/demo/v1` dengan auth/resource checks yang sama. Auth/inquiry sungguhan tidak disebut simulated. Server-rendered reads boleh memanggil domain services langsung. Manifest merupakan kontrak rancangan, bukan kewajiban membuat seluruh endpoint terpisah sekaligus.

| Method / resource | Akses | Perilaku |
|---|---|---|
| `POST /inquiries` | Publik, validated/rate-limited | Simpan inquiry + reference + outbox atomik; sukses setelah commit; idempotency/retry tidak membuat duplikat |
| `GET /admin/inquiries`, `PATCH /admin/inquiries/{id}` | Founder/admin berwenang | Screening, bukti kurang, status, interaksi terakhir; bukan publik atau auto marketing enrollment |
| `POST /auth/challenges`, `POST /auth/verify` | Anonymous/challenge holder | Challenge sekali pakai, proof SIWE/EVM server-side, sesi; tanpa grant dari browser |
| `GET /session`, `POST /auth/logout` | Pemilik sesi | Authorized workspaces/env/expiry; revoke server session |
| `GET /assets`, `GET /assets/{id}` | Sesi + resource scope | Katalog/detail privat; category/availability, approved content versions |
| `GET /offerings/{id}` | Sesi + read scope | Terms/model terstruktur, tujuh tab, provenance; eligibility transaksi tidak menjadi read gate umum |
| `GET /documents/{id}/access` | Sesi + document permission | Approved/redacted copy atau privileged original; reason, version, short expiry dan log |
| `GET /projects/{id}/performance`, `GET /projects/{id}/reports` | Sesi + read scope | Production/invoice/cash/distribution terpisah; monthly reviewed + labelled provisional data |
| `POST /offering-scenarios` | Sesi + offering read scope | Calculator memakai model/version dan asumsi; output forecast, tidak membuat hak/saldo |
| `GET /me/eligibility`, `POST /eligibility/applications` | Owner/org mandate | Decision per offering/country/expiry; sandbox demo jelas |
| `POST /investment-quotes` | Sesi + eligibility + offering open | Input IDRX/USDC, chain ID/token contract/decimals authoritative, fees/min_net/expiry/net IDR rights |
| `POST /subscriptions` | Eligible owner/org mandate | Cap reservation atomik, quote/terms/model/consent bound, idempotent; belum issuance |
| `GET /subscriptions/{id}` | Owner/org mandate | Expected/received/converted/settled/allocated serta refund/exception |
| `POST /subscriptions/{id}/payment-notifications` | Owner, untrusted hint | Worker verifikasi receipt sukses/event escrow, chain/token contract, subscription binding, amount, recipient dan canonical finality; tanpa client `paid=true` |
| `GET /me/positions`, `GET /positions/{id}` | Owner/org mandate | Holdings/hak dan breakdown sesuai model; tidak menganggap semua offering debt |
| `GET /me/distributions`, `GET /me/activity` | Owner/org mandate | Approved/funded/claimable/claimed/failed, units dan receipt refs |
| `POST /distribution-entitlements/{id}/claims` | Entitled owner + verified recipient | Hak dan funding cukup, reserve claim secara atomik, dispatch/reconcile; repeat tidak membayar dua kali |
| `GET /claims/{id}` | Owner/org mandate | Pending/submitted/confirmed/reconciled/failed; retry terkontrol |
| `POST /admin/projects/{id}/revisions` | Scoped editor | Fakta/blok tervalidasi; draft belum tampil |
| `POST /admin/revisions/{id}/review` | Scoped reviewer | Approve/reject versi persis; publish hanya versi approved; correction reason/history |
| `POST /admin/projects/{id}/reports` | Assigned submitter | Monthly report/evidence/invoice/collection terpisah; tidak self-approve |
| `POST /admin/distribution-batches` | Finance maker | Hitung hak/periode sesuai model dan kas; tidak langsung membuat claimable |
| `POST /admin/distribution-batches/{id}/approve` | Independent approver | Model/record date/funding checks; live mandat nyata |
| `POST /admin/distribution-batches/{id}/funding-notifications` | Finance, untrusted hint | Verifikasi dana tersedia dan reconciliation sebelum claimable |
| `POST /admin/refund-cases/{id}/approve` | Scoped approver | Sebelum/sesudah conversion sesuai terms; failure tetap liability |
| `POST /webhooks/providers/{providerKey}` | Authenticated provider | Signature/timestamp/replay check, durable ingestion dan reconciliation |
| `POST /cases`, `GET /cases/{id}` | Owner/assigned staff | Quote/funding/refund/claim/data/recovery exceptions, evidence dan histori |

Tidak ada API reward award/redemption/partner webhook aktif pada MVP. Scenario reset/advance demo hanya mengubah fixture investasi yang diotorisasi; tidak membuat admin role, dana nyata atau login bypass.

Envelope: `data`, `requestId`, `environment`, `provenance`, `asOf`; errors berkode stabil dengan langkah aman. 401 tanpa sesi, 403/resource-safe 404 tanpa izin, 409 state/version/cap conflict, 422 validation, 429 rate-limit, 503 route/provider unavailable. Uang sebagai integer/decimal string dengan currency, precision, chain ID/token address dan basis FX terkontrol; tidak memakai floating point settlement.

Idempotency key di-scope actor/resource/command dan body hash; key sama dengan body berbeda ditolak. Log canonical didedupe `(chain_id, tx_hash, log_index)`; block hash/finality/cursor dan histori reorg disimpan. Business IDs subscription/allocation/entitlement ditegakkan juga pada kontrak agar hash replacement/reorg tidak menggandakan efek. Worker backfill dan memeriksa receipt sukses + canonical finalized head sebelum final accounting/allocation/funding activation/claimed; safe/included hanya intermediate. Unknown/dropped/replaced transaction direkonsiliasi berdasarkan attempt/sender+nonce sebelum retry.
