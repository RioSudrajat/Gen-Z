# Gen-Z Platform

**Fondasi Base, 18 Oktober 2026:** login memakai EVM/SIWE dengan konteks Base Sepolia 84532. wagmi/viem menangani discovery wallet dan tanda tangan; sesi opaque berada di PostgreSQL. [Riset](../../docs/research/base-evm-2026-10-18.md) tetap acuan tahap berikutnya. Kontrak investasi, conversion dan funded claim belum diimplementasikan melalui fondasi login ini. Intake publik sudah menyimpan inquiry dan outbox; delivery notifikasi, admin inbox dan otomasi retensi belum tersedia.

Satu aplikasi Next.js/TypeScript di workspace `@gen-z/platform`. Marketing tetap berada di `apps/marketing` (Astro). Dependency aplikasi mengikuti satu `package-lock.json` di root repo.

## Menjalankan

Dari root `D:\Projekan\GenZ`:

```sh
npm ci
npm run setup:platform
npm run dev:platform
```

Buka `http://localhost:3001/auth`. Gunakan extension EVM atau browser dalam wallet yang mendukung Base Sepolia. Wallet ditemukan melalui EIP-6963 atau injected provider; tidak ada pembatasan merek. Pilih wallet, setujui pergantian ke Base Sepolia bila diperlukan, lalu tanda tangani pesan login. Tidak membutuhkan ETH atau transfer untuk login. Akun dibuat server hanya setelah proof SIWE valid. Tanpa wallet tersedia, gunakan Refresh wallet list. QR/WalletConnect belum dikonfigurasi; jangan mengklaim setiap versi aplikasi wallet sudah teruji.

Setup membuat `.env` root untuk Compose dan `.env.local` aplikasi secara otomatis. PostgreSQL default memakai port 5433, atau port kosong saat setup pertama jika 5433 terpakai. Dev app memakai port 3001 karena 3000 telah dipakai proses lain. `GENZ_APP_ORIGIN` harus cocok dengan URL browser, termasuk hostname dan port; permintaan dari origin lain ditolak.

## Peta kode

Halaman `/auth` mengikuti komposisi referensi login yang diberikan founder: autentikasi di kolom kiri dan ilustrasi energi di kanan pada desktop. Runtime ilustrasi ada di `src/components/InteractiveGenZEcosystem.tsx`; aset SVG interaktif diadaptasi dari `InteractiveEVEcosystem.tsx` yang diberikan, bukan gambar baru. Login tetap EVM/SIWE, tanpa email OTP simulasi dari referensi. Animasi dapat dijeda, berhenti saat tab tersembunyi, dan mengikuti reduced motion. Font Plus Jakarta Sans disimpan lokal beserta lisensi OFL.

`GENZ_MARKETING_ORIGIN` mengatur tautan logo dan tautan kembali dari login ke marketing. Setup lokal mengisi `http://localhost:4321`, termasuk pada instalasi yang sudah memiliki DATABASE_URL, sehingga preview hasil build juga kembali ke landing. Development memakai alamat yang sama bila variabel kosong. Pada deployment production, isi origin marketing yang sebenarnya; domain produksi tidak ditebak. [Laporan UI dan verifikasi](../../docs/history/2026-10-18-login-ui.md).

```text
src/app/auth/               Entry wallet dan returnTo yang dibatasi
src/app/(protected)/        Layout sesi; halaman akun dan route yang belum tersedia
src/app/api/v1/auth/        HTTP challenge, verify, logout
src/app/api/v1/session/     Sesi pemilik saat ini; tanpa grant rekaan
src/server/auth/            Konfigurasi, validasi, proof verifier dan sesi
src/server/database.ts     Satu pool pg dan client Drizzle, server-only
src/server/db/schema.ts    Schema identity bertipe untuk query dan generator
src/server/http.ts         Origin, batas payload, error JSON dan private caching
src/components/            UI wallet dan feedback; tanpa query database
src/lib/return-to.ts        Allowlist redirect internal
db/migrations/             SQL berurutan dengan checksum dan transaction lock
scripts/                   Setup/database/migrasi/diagnosis/tes terisolasi
tests/                     Signature nyata EVM, HTTP, cutover legacy, persistence dan browser
```

Route handler mengurus HTTP/validasi/cookie; service identity mengurus query Drizzle, nonce, signature dan sesi. Shared `packages/domain`, `content-schema` dan `design-tokens` tetap dipakai, tanpa memindahkan kode server atau credential ke package bersama.

## Pilihan database, 18 Oktober 2026

PostgreSQL tetap menjadi database. `pg` adalah driver/pool koneksinya; Drizzle ORM 0.45.4 menyediakan schema TypeScript, query bertipe dan transaksi di atas pool yang sama. Drizzle Kit 0.31.11 menyusun SQL migrasi. Keduanya dipilih untuk memudahkan pengembangan relasi identity, offering, subscription dan ledger sesuai spec, tanpa menggandakan definisi tabel dan tipe hasil query secara manual. Belum ada tabel investasi baru pada tahap ini.

Pilihan SQL manual pada 17 Oktober terlalu sempit bila dijadikan arah jangka panjang. ORM tidak menggantikan constraint PostgreSQL, otorisasi resource, ketepatan angka uang/unit, idempotensi atau review transaksi. Gunakan query builder untuk operasi biasa dan tagged `sql` untuk ekspresi PostgreSQL yang diperlukan; jangan memakai interpolasi SQL dari input pengguna.

Alur perubahan schema dari root repo:

```sh
# Edit src/server/db/schema.ts, lalu susun SQL tanpa mengakses database
npm run db:generate --workspace=@gen-z/platform -- --name=nama_perubahan
npm run db:check --workspace=@gen-z/platform
# Review SQL yang dihasilkan sebelum menerapkannya
npm run db:migrate --workspace=@gen-z/platform
```

`db:check` memeriksa konsistensi metadata migrasi, bukan database hidup. Tes platform membandingkan snapshot dengan schema TypeScript dan melakukan introspeksi PostgreSQL terisolasi untuk mendeteksi drift. Review SQL tetap diperlukan, khususnya rename, perubahan tipe dan backfill.

Migrasi `0001_wallet_identity.sql` tetap utuh. Snapshot awal Drizzle di `db/migrations/meta/20261017171755_snapshot.json` memetakan schema yang sama; tag journal menunjuk ke migrasi lama tersebut. Tidak ada migrasi CREATE TABLE kedua, reset volume, atau penandaan ulang database. Migrasi baru memakai prefix timestamp agar urut setelah `0001`. Satu pelaksana migrasi tetap `scripts/migrations.mjs`, dengan ledger `public.genz_schema_migrations`, checksum dan advisory transaction lock. Drizzle Kit menghasilkan SQL; jangan menjalankan `drizzle-kit push`, `drizzle-kit migrate` atau migrator ORM sebagai jalur kedua. SQL hasil generator boleh ditinjau/disesuaikan sebelum pertama kali diterapkan; migrasi yang sudah diterapkan tidak boleh diedit.

Catatan dependency, 19 Oktober 2026: `overrides` di `package.json` root mengganti esbuild milik `@esbuild-kit/core-utils` pada jalur Drizzle Kit 0.31.11 menjadi 0.25.12 untuk mengatasi [GHSA-67mh-4wv8-2f99](https://github.com/advisories/GHSA-67mh-4wv8-2f99). Loader 3.3.2 juga ditambatkan sebagai devDependency root agar npm 11.6.1 menerapkan override pada dependency workspace. Override dibatasi pada loader tersebut; 0.25.12 juga memenuhi dependency esbuild langsung Drizzle Kit. Audit lengkap sesudah perbaikan melaporkan nol vulnerability. Loader lama masih meminta 0.18.x pada rilis stable ini, sehingga override memerlukan verifikasi CLI generate/check dan tes schema/database setiap kali tooling diperbarui. Tinjau dan hapus pin loader root beserta override ketika upstream stable tidak lagi membawa jalur rentan; audit ulang sebelum menghapusnya.

## Batas autentikasi

- Wallet connection bukan login. Server memeriksa exact SIWE challenge dengan viem: address, origin/URI/domain, chain, nonce, intent, waktu, request ID dan environment. Akun dinormalisasi lowercase untuk identity key, checksum untuk tampilan.
- Challenge mengikat alamat, domain/origin, nonce, waktu, chain context, environment dan intent. Cookie browser HttpOnly mengikat challenge ke browser pembuatnya.
- Nonce dikonsumsi lewat conditional write dalam transaksi; dua permintaan paralel tidak membuat dua sesi dari proof yang sama.
- Cookie sesi opaque HttpOnly, SameSite=Lax, Secure pada HTTPS, berlaku delapan jam. Database hanya menyimpan hash token; expired, revoked atau disabled account tidak mendapat akses.
- Origin wajib untuk challenge, verify dan logout. Payload dibatasi 8 KiB dan schema strict; input role/admin tidak diterima. Rate limit berada di PostgreSQL.
- Ganti wallet memerlukan proof baru dan merotasi sesi lama; tidak menggabungkan akun/posisi. Disconnect extension bukan pencabutan sesi server; gunakan Sign out. Sesi tetap terikat ke alamat yang terakhir terbukti, tidak mengikuti alamat extension secara diam-diam.
- Login tidak memberikan membership, admin, KYC, eligibility atau izin transfer. `workspaces` pada API masih kosong. Route admin/operator dan resource investasi yang belum diimplementasikan tidak memberikan akses.
- `GENZ_EVM_CHAIN_ID=84532` adalah konteks login Base Sepolia; chain lain dan environment live ditolak. Database terkelola hanya untuk demo. `GENZ_SOLANA_CHAIN` lama tidak dibaca. Registry `src/lib/base.ts` memisahkan token Base/Sepolia, IDRX 2 dan USDC 6 decimals; belum ada alamat Mock IDRX atau transaksi finansial aktif.
- `GENZ_BASE_RPC_URL` opsional dan server-only untuk verifikasi contract-account ERC-1271/6492 melalui viem. EOA proof tidak membutuhkan RPC. Server mengecek chain RPC dan memakai timeout/retry terbatas; tanpa RPC, proof contract gagal tertutup. Sesi contract maksimal satu jam, EOA delapan jam; compatibility Safe/counterfactual nyata tetap perlu diuji sebelum dinyatakan didukung.
- Migrasi baru `20261017175425_base_siwe_identity.sql` mempertahankan akun lama sebagai `namespace=solana, chain_id=legacy`, karena chain historis akun tidak direkam pada schema awal. Sesi legacy dihapus dan challenge lama dikonsumsi sekali saat cutover. Akun EVM unik menurut namespace + chain + normalized address; tidak ada account linking otomatis atau reset database. `0001` tetap utuh.

## Database dan Docker

Compose canonical hanya di root `compose.yaml`:

| Resource             | Nama                                       |
| -------------------- | ------------------------------------------ |
| Compose project      | `gen-z-local`                              |
| PostgreSQL container | `gen-z-platform-postgres`                  |
| Data volume          | `gen-z-platform-postgres-data`             |
| Database / user      | `genz_demo` / `genz`                       |
| Image database       | `postgres:17-alpine`, image upstream resmi |
| Image aplikasi       | `gen-z/platform:local`                     |

`npm run db:up`, `npm run db:down` (stop, data tetap ada), `npm run db:status`, dan `npm run doctor --workspace=@gen-z/platform` mengelola koneksi lokal. Koneksi PostgreSQL eksternal yang disediakan pengguna tidak diganti dan tidak dikendalikan dengan Docker lokal.

Build image dari root repo:

```sh
docker build -f apps/platform/Dockerfile -t gen-z/platform:local .
```

Dev Next.js berjalan di host; tidak perlu container app kedua. Dockerfile untuk runtime Node standalone; supply DATABASE_URL, GENZ_APP_ORIGIN dan environment saat menjalankannya. `.dockerignore` mengecualikan konfigurasi privat dan arsip. Migrasi dijalankan terpisah sebelum server, melalui `db:migrate`; jangan mengubah migrasi yang sudah diterapkan.

## Verifikasi

UI platform mengikuti `DESIGN.md`: tema light saja, heading GenZ Display dan body/UI GenZ UI yang sama dengan landing. Halaman login menampilkan satu tombol **Connect Wallet**, lalu modal **pilih network → pilih provider** dengan tombol Back. Base Sepolia aktif, Solana/BNB berstatus Coming soon. Logo memakai aset asli; provider populer yang belum terdeteksi mengarah ke download resmi, sementara provider EIP-6963 lain tetap muncul. Modal mendukung keyboard, Escape, klik backdrop, penutupan lewat tombol dan pengembalian focus. Catatan implementasi/proof masuk laporan, bukan copy login.

```sh
npm run check
npm test
npm run build
npm run smoke
npm exec --workspace=@gen-z/platform -- playwright install chromium
npm run test:platform
```

Untuk menguji modal, light-only (termasuk sistem dark dan preferensi dark lama), font, responsive layout, keyboard, reduced motion dan penolakan koneksi wallet tanpa database: jalankan `npm run build:platform`, lalu `npm run test:ui --workspace=@gen-z/platform`. Runner memakai server sementara dengan konfigurasi database kosong dan hanya memilih tes UI; pengujian proof/sesi lengkap tetap memakai `test:platform` di atas. Screenshot disimpan di `.cache/platform-verification/`.

Tes platform membuat container/database PostgreSQL sementara bernama `gen-z-platform-test-*`, memakai port kosong, dan membersihkan resource miliknya. Fixture provider EIP-6963 hanya diinjeksi ke browser pengujian; signature EVM sungguhan diverifikasi endpoint yang sama. Tes juga membangun database legacy untuk membuktikan data lama dipertahankan saat cutover. Tidak ada test wallet atau login bypass yang dikirim ke aplikasi. Uji extension vendor nyata masih membutuhkan konfirmasi pada extension.

Script dev/build memakai Webpack bawaan Next.js karena Turbopack lokal gagal menjalankan worker CSS pada mesin ini. Tidak ada perubahan framework atau bundler eksternal. Build dapat menampilkan warning dependency dinamis `ox/tempo` dari barrel chains viem; tidak ada integrasi Tempo di aplikasi.

Hasil perubahan database, 18 Oktober: `npm run check`, build platform, 16 tes root, 13 tes platform, smoke dan doctor lulus. Tes schema membandingkan snapshot terbaru dengan TypeScript serta membandingkan dua schema yang sudah melalui PostgreSQL: hasil seluruh migrasi dan hasil DDL Drizzle. Dua bentuk SQL CHECK/index yang setara dinormalisasi oleh PostgreSQL sebelum dibandingkan; tidak ada perbedaan schema. Rerun migrasi mempertahankan record wallet, dan nonce paralel tetap hanya menghasilkan satu sesi.

Image `gen-z/platform:local` dibangun ulang; container smoke sementara membalas health/auth 200 dan sesi anonim 401, lalu dibersihkan. Dev app `http://localhost:3001/auth` merespons 200; `/api/ready` tetap 503 untuk fitur platform yang belum tersedia, dengan `walletAuthenticationReady: true`.

Delivery Gate untuk perubahan ini:

- Hard Gate PASS: tidak mengubah UI/aset/copy produk; browser test wallet, penolakan proof, logout, keyboard, tema, kontras dan viewport lulus.
- Purpose Gate PASS: tidak menambah teknik visual; perubahan terbatas pada schema, query, tooling dan panduan.
- Liveliness PASS: arah dan dials UI existing 1/1/1 dipertahankan; lihat laporan penyelarasan 17 Oktober.
- Craftsmanship PASS: check/build, 13 tes platform dan smoke lulus; tidak ada fitur investasi atau dukungan Base yang diklaim telah tersedia.

`/api/health` adalah liveness. `/api/ready` tetap 503 karena fitur platform lengkap, private storage, inquiry/outbox dan lifecycle investasi belum tersedia; `walletAuthenticationReady` melaporkan kesiapan schema/config auth secara terpisah.

## Asal template dan arsip

Source starter sebelumnya, Git awal, konfigurasi privat dan referensi upstream disimpan di `.cache/platform-source-backup-20261017-170204`, di luar aplikasi/workspace aktif. Atribusi MIT dan notis pihak ketiga dipertahankan pada LICENSE/THIRD_PARTY_NOTICES; nama pemegang copyright tidak diganti menjadi Gen-Z.

Auth email/password, Better Auth, Notes, admin contoh, generator varian, konfigurasi MCP starter dan lockfile kedua tidak menjadi bagian platform aktif. Drizzle dipakai kembali dengan schema identity Gen-Z sendiri setelah evaluasi kebutuhan proyek. Database starter terbukti kosong pada lima tabel aplikasi sebelum container/volume milik setup ini dibersihkan; tidak ada akun yang dimigrasikan atau ditautkan ke wallet.

Perbandingan terhadap requirement dan sisa pekerjaan: [laporan penyelarasan](../../docs/history/2026-10-17-platform-alignment.md).
