# Gen-Z

**Dokumentasi:** mulai dari [indeks docs](docs/README.md), [PRD](docs/PRD.md), [Architecture](docs/ARCHITECTURE.md), [ERD](docs/ERD.md), dan [API contract MVP](docs/engineering/api.md). Detail scope ada di [requirements MVP](docs/product/requirements.md); alasan keputusan teknis di [ADR](docs/adr/README.md).

**Fondasi Base diperbarui 18 Oktober 2026:** login EVM/SIWE pada Base Sepolia sudah diimplementasikan dengan wagmi/viem dan sesi PostgreSQL. Discovery mendukung provider EIP-6963/injected tanpa batas merek. Akun Solana lama disimpan terpisah; proof legacy dicabut oleh migrasi baru. [Riset dan rencana implementasi](docs/research/base-evm-2026-10-18.md) mendukung [scope MVP](docs/product/requirements.md); kontrak investasi dan transaksi finansial belum aktif.

**Platform canonical:** satu workspace Next.js di `apps/platform`, masuk build/check/lockfile root. Jalankan `npm run setup:platform`, lalu `npm run dev:platform` dan buka `http://localhost:3001/auth`. Login memakai proof wallet EVM/SIWE, tanpa email/password. [Panduan platform](apps/platform/README.md) dan [hasil penyelarasan arsitektur](docs/history/2026-10-17-platform-alignment.md) menjelaskan fondasi yang tersedia serta batas fitur yang belum dibuat.

Fondasi npm workspaces sesuai [arsitektur app](docs/ARCHITECTURE.md) dan [scope MVP](docs/product/requirements.md). Landing publik sudah dimigrasikan ke Astro di `apps/marketing`, termasuk sebelas section, media, React islands dan contact. [Panduan marketing](apps/marketing/README.md) menjelaskan struktur dan integrasi. Platform menyediakan challenge/proof/sesi wallet; inquiry persisten, resource authorization dan lifecycle investasi belum tersedia.

## Kontribusi dan CI

Instruksi agent ada di [AGENTS.md](AGENTS.md); alur branch, PR, hook, pemeriksaan dan deployment di [panduan GitHub](docs/engineering/github-workflow.md). Setelah clone, jalankan `npm ci` dan `npm run hooks:install`. Untuk verifikasi source/dependency/CI, jalankan `npm run verify:ci` dengan Docker tersedia. GitHub Actions menjalankan pemeriksaan pada PR dan push `main`; deploy hosting belum dikonfigurasi.

## Struktur

```text
apps/
  marketing/                 Astro, public marketing/contact/legal
  platform/                  Next.js, auth dan protected workspaces/API
packages/
  domain/                    Tujuh tab canonical, environment, tipe bersama
  content-schema/            Draft editorial bertipe, referensi metric/document/media
  design-tokens/             Palette dari docs/design/colors.css
workers/
  operations/                Entry worker dan health; job handlers belum terpasang
tests/                       Batas payload editorial
scripts/                     HTTP smoke untuk hasil production build
compose.yaml                 Satu PostgreSQL development untuk platform
motion/                      Produksi motion existing, bukan workspace app
```

Enam workspace memakai satu `package-lock.json`. `apps/marketing` adalah satu-satunya aplikasi landing Gen-Z; aplikasi React/Vite lama telah dihapus. `motion/` mempertahankan package/lockfile produksinya sendiri. Workspace packages dibuild sesuai urutan dependensi pada root `package.json`.

## Menjalankan lokal

Gunakan Node.js 24.11+ pada major 24 dan npm 11; `.nvmrc` merekam versi lokal saat setup. Dari root:

```sh
npm ci
npm run setup:platform
npm run check
npm test
npm run build
npm run smoke
```

Jalankan setiap service di terminal terpisah:

```sh
npm run dev:marketing
npm run dev:platform
npm run dev:worker
```

| Service | URL awal | Respons |
|---|---|---|
| Astro | `http://127.0.0.1:4321/health.json` | 200, `status: scaffold`, `ready: false` |
| Next.js | `http://localhost:3001/auth` | Wallet sign-in, tanpa email/password |
| Next.js health | `http://localhost:3001/api/health` | 200, liveness tanpa data privat |
| Next.js readiness | `http://localhost:3001/api/ready` | 503 untuk fitur platform lengkap; kesiapan auth dilaporkan terpisah |
| Operations | `http://127.0.0.1:4800/health` | 200, `activeHandlers: 0` |
| Operations readiness | `http://127.0.0.1:4800/ready` | 503, job handlers belum tersedia |

Marketing `/` dan `/contact/` tersedia. `/auth/`, `/dashboard/` dan `/assets/` hanya handoff ke platform yang dikonfigurasi, atau menampilkan status belum terhubung. Marketing tidak membuat sesi atau membuka resource privat. Platform `/auth` membuat proof wallet; `/app` baru shell sesi, dan route app/admin/operator tanpa sesi diarahkan ke auth. Private API yang belum dibuat tetap 404. `npm run smoke` menyalakan production build pada port sementara, memeriksa halaman marketing, health/readiness serta batas akses, kemudian menghentikan proses miliknya. `npm run test:platform` menguji proof/sesi dengan database terisolasi setelah build.

Jalankan landing dengan `npm run dev:marketing`, buka `http://127.0.0.1:4321/`. Folder `motion` mengikuti perintah di package-nya dan mengirim video ke `apps/marketing/public/assets`. Unit test marketing ikut `npm test`; QA browser tersedia melalui `npm run verify:marketing` setelah production preview berjalan.

## Environment dan PostgreSQL lokal

`npm run setup:platform` otomatis menyiapkan konfigurasi privat lokal; tidak perlu menyalin env atau membuat password. Next.js membaca `apps/platform/.env.local`; worker memuat `workers/operations/.env.local` secara eksplisit lewat Node. Astro memakai environment milik `apps/marketing`; file `.env` root hanya untuk Compose. `.env.example` boleh dilacak; file privat diabaikan Git. Semua `PUBLIC_*`/`NEXT_PUBLIC_*` dianggap terbaca browser, sehingga credential tetap server-only.

Untuk PostgreSQL lokal:

1. Pastikan Docker Desktop/Linux engine berjalan.
2. Jalankan `npm run setup:platform`; perintah ini menyiapkan database, menerapkan migrasi dan memeriksa koneksi.
3. Default database `genz_demo`, user `genz`, host `127.0.0.1`, port `5433` (port kosong lain dipilih jika perlu saat setup awal). URL privat dibuat otomatis.
4. Container `gen-z-platform-postgres`, volume `gen-z-platform-postgres-data`. `npm run db:down` menghentikannya dan mempertahankan data; `npm run db:up` menyalakan kembali.

Platform memakai PostgreSQL + Drizzle ORM di atas pool `pg`; Drizzle Kit menyusun SQL migrasi yang ditinjau sebelum diterapkan oleh runner checksum tunggal. [Pilihan dan alur database](apps/platform/README.md#pilihan-database-18-oktober-2026) menjelaskan alasan dan kompatibilitas migrasi lama. SIWE menangani proof login EVM; `GENZ_EVM_CHAIN_ID=84532` menetapkan Base Sepolia dan RPC contract-account bersifat opsional/server-only. Private object storage, persistence inquiry dan outbox belum dibuat. Image database tetap image resmi PostgreSQL; image aplikasi memakai `gen-z/platform:local`.

## Batas implementasi berikutnya

- Resource-scoped authorization dan grant server sebelum workspace investasi; proof wallet/sesi sudah tersedia, tetapi login tidak memberi eligibility/admin.
- Inquiry transaction + reference + outbox, notifikasi satu inbox, admin screening dan kebijakan retensi 90 hari; sukses sesudah commit server.
- Resource-scoped DAL, private documents/cache dan publication review sebelum katalog/detail offering ditampilkan.
- Tujuh tab, calculator/model dan solar hybrid sintetis; input IDRX/native USDC, net settlement, allocation/portfolio, report/distribution/funded owner claim sesuai spec.
- Durable worker adapter untuk notifikasi, retensi, ingestion dan reconciliation. Worker scaffold sekarang idle; belum mengonsumsi queue/database.
- Rewards, Points dan Gen-Z Token hanya informasi/Coming soon pada MVP. Tidak ada functional reward atau transaksi live.

Schema editorial saat ini subset awal: heading, paragraph serta referensi media/document/metric. Metric block mengacu dataset/version, bukan nilai return/formula editable; schema tidak menyediakan approval field dari editor. Ini validasi bentuk payload, belum authorization, sanitasi/rendering, review/publikasi atau jaminan angka di narasi benar. Packages pure tidak mengimpor app/server/credential.

## Referensi setup

[Astro endpoints](https://docs.astro.build/en/guides/endpoints/), [Next.js Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers), [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces) dan [PostgreSQL official image](https://hub.docker.com/_/postgres). Next.js juga menyediakan dokumentasi sesuai versi pada `node_modules/next/dist/docs/`.
