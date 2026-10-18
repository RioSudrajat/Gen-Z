# Kurasi platform dan keselarasan arsitektur

> **Pembaruan persistence, 18 Oktober:** pilihan tanpa ORM pada laporan historis ini telah digantikan PostgreSQL + Drizzle ORM, dengan schema identity Gen-Z dan riwayat migrasi yang dipertahankan. [Panduan database aktif](../../apps/platform/README.md#pilihan-database-18-oktober-2026) menjelaskan alasan dan alurnya. Hasil verifikasi di bawah tetap snapshot 17 Oktober.

> **Pembaruan target, 18 Oktober:** **Pembaruan aktif, 18 Oktober 2026:** [F] Base menggantikan Solana atas arahan founder. Scope produk 17 Oktober tetap, dengan detail teknis [R] pada [riset Base/EVM 18 Oktober](../research/base-evm-2026-10-18.md) dan spec versi `1.1-base`. Pilihan Base tidak mengaktifkan kembali mock wallet D0, public deal detail, note wajib atau functional rewards. Fondasi login EVM/SIWE pada Base Sepolia kini diimplementasikan, dengan akun Solana historis tetap terpisah; kontrak/lifecycle investasi masih rancangan. Lihat [laporan fondasi Base](2026-10-18-base-foundation.md) untuk scope serta bukti verifikasi. Bagian riset dan snapshot lama tetap bertanggal. Hasil verifikasi dan peta kode di bawah tetap laporan implementasi 17 Oktober; bukan bukti SIWE atau Base sudah terpasang.

Tanggal: 17 Oktober 2026, Asia/Jakarta. Scope: menyatukan fondasi platform Next.js dengan spec/PRD/arsitektur yang disepakati, memperbaiki auth starter yang salah arah, dan merapikan identitas runtime. Ini bukan implementasi seluruh MVP investasi.

## Kesimpulan

Setup sebelumnya memang bertabrakan: scaffold Next.js `@gen-z/platform` tetap ada, tetapi perintah dev diarahkan ke app starter independen di subfolder. Starter memakai lockfile/Compose/database sendiri, email/password, Better Auth, Drizzle, Notes, serta contoh role admin. Hasil tes starter saat itu membuktikan starter berjalan, bukan membuktikan kesesuaian terhadap requirement Gen-Z.

Sekarang hanya ada satu aplikasi aktif di `apps/platform`, satu workspace `@gen-z/platform`, satu lockfile root, dan satu Compose root. Login menggunakan proof wallet Solana dan sesi PostgreSQL; tidak tersedia jalur email/password atau role yang dipilih browser. Source starter lengkap beserta Git awal dan private settings diarsipkan di `.cache/platform-source-backup-20261017-170204`.

## Perbandingan terhadap requirement

| Area | Requirement aktif | Kondisi sebelum kurasi | Hasil kurasi |
|---|---|---|---|
| Stack | Astro marketing, Next.js app/auth, shared packages | Dua Next.js dengan jalur build/dev berbeda | Satu workspace Next.js; build/check root mencakup app yang benar |
| Dependency | Satu struktur repo yang bisa dipelihara | Lockfile/dependency starter terpisah; React berbeda dari workspace | Lockfile root, Next.js 16.4.2 dan React 19.3.1 sama dengan baseline workspace |
| Auth D0 | Connect → challenge → proof server → sesi | Email/password Better Auth | Wallet Standard/SIWS, Ed25519 verifier resmi, nonce atomik dan sesi opaque PostgreSQL |
| Nama runtime | Gen-Z | Subfolder dan Compose/container/volume memakai nama sumber template | `apps/platform`, `@gen-z/platform`, `gen-z-local`, `gen-z-platform-postgres`, `gen-z-platform-postgres-data`, image `gen-z/platform:local` |
| Persistence | PostgreSQL; ORM belum dipilih | Drizzle diadopsi otomatis bersama auth contoh | Driver `pg` + SQL migrations berurutan; tidak ada Drizzle atau Better Auth pada dependency aktif |
| Route | Entry `/auth`, private `/app`, API `/api/v1` | `/sign-in`, `/sign-up`, Notes/admin contoh | Route auth/session sesuai prefix rancangan; route email/password/Notes tidak tersedia |
| Authorization | Login bukan grant/eligibility/admin | Role user/admin dari starter | Sesi tidak memberikan role/grant; API mengembalikan `workspaces: []`; resource admin/operator/investasi belum dibuka |
| Private resource | Server/API/cache wajib menjaga akses | Contoh Notes bukan domain Gen-Z | Data boundary sesi di server; API no-store, Origin wajib untuk mutation; resource yang belum dibuat tetap ditolak/tidak tersedia |
| Environment | Demo terisolasi dari transaksi live | Database starter baru tanpa konteks produk | Database lokal terkelola demo; chain/env terikat pada challenge; live ditolak; tidak ada RPC/program/mint/transfer |
| Marketing handoff | Publik Astro, login di Next.js | Origin platform sekaligus mengaktifkan inquiry frontend | Auth origin dan aktivasi inquiry dipisahkan; Launch app dapat berfungsi tanpa mengklaim inquiry backend siap |
| UX | English-first, responsive, honest states | Teks pengenalan starter dan form email | Wallet unavailable/pending/rejected, sesi terverifikasi, ganti wallet/logout, tema dan reduced motion |

### Drizzle: bukan pelanggaran PRD, tetapi juga bukan kewajiban

PRD/arsitektur memilih PostgreSQL, bukan ORM tertentu. Drizzle sebenarnya dapat menjadi keputusan teknis yang sah bila ada alasan. Masalah sebelumnya adalah mengadopsi schema, layanan auth dan contoh domain starter tanpa kurasi. Untuk schema identity awal yang kecil, SQL eksplisit dan `pg` mengurangi konsep/dependency yang perlu dipelajari. Pilihan ini [R], bukan keputusan produk founder baru dan bukan larangan memakai ORM pada fase berikutnya. Migrasi sekarang memakai transaction lock + checksum agar perubahan applied SQL tidak diam-diam mengubah database.

## Peta kode dan batas tanggung jawab

```text
apps/platform/
  package.json                 @gen-z/platform, memakai lockfile root
  next.config.mjs              Monorepo root tracing dan standalone output
  src/app/auth/                Entry wallet, allowlisted returnTo
  src/app/(protected)/         Shell sesi; fitur lain belum tersedia
  src/app/api/v1/auth/         HTTP challenge / verify / logout
  src/app/api/v1/session/      Read sesi pemilik; tidak mengarang grant
  src/server/auth/             Validation, SIWS proof, challenge, sesi
  src/server/database.ts      Satu pg pool server-only
  src/server/http.ts          Origin, bounded JSON, error response, no-store
  src/components/             UI dan feedback, tanpa SQL/credential
  db/migrations/              Schema identity dengan SQL berurutan
  scripts/                    Setup, DB, migrasi, doctor, test harness
  tests/                      Cryptographic proof + HTTP + browser
compose.yaml                  Satu PostgreSQL lokal untuk platform
packages/                     Domain/editorial/tokens bersama tetap pure
apps/marketing/               Astro publik; tidak mengimpor server platform
workers/operations/           Worker scaffold; job domain belum dibuat
```

Handler HTTP mengurus Origin, validasi, cookie dan response. Service identity mengurus database dan aturan proof/sesi. Page/component tidak berisi query aplikasi. Layout sesi tidak dianggap sebagai authorization API. Penggunaan query ringan di readiness hanya memeriksa keberadaan schema, bukan menyediakan data domain.

Tidak dibuat schema Offering/Investment/CMS secara spekulatif. Penamaan dan definisi produk tetap mengacu glossary dan spec yang ada; tidak ada istilah domain baru yang memerlukan glossary/ADR tambahan pada kurasi ini.

## Bukti autentikasi

- Input challenge berasal dari server: address, domain/origin, version, nonce, issue/expiry, chain context, request ID dan environment. Browser binding disimpan sebagai cookie HttpOnly; database menyimpan hash binding.
- Verifier menggunakan [implementasi SIWS Solana Wallet Standard](https://github.com/anza-xyz/wallet-standard/blob/master/packages/core/util/src/signIn.ts), bukan pembanding address dari browser atau verifier EVM.
- Nonce dikonsumsi dalam transaksi melalui conditional update. Uji dua proof paralel menghasilkan tepat satu sukses dan satu penolakan.
- Cookie sesi random 256-bit HttpOnly, SameSite=Lax dan Secure pada HTTPS. Database menyimpan SHA-256 token, bukan token yang dapat direplay. Sesi kedaluwarsa, logout, disabled wallet dan session rotation diuji.
- Pergantian wallet memerlukan proof baru dan merotasi sesi lama. Tidak ada account linking otomatis, pemindahan posisi, KYC, role self-promotion atau approval transaksi.
- Mutation membutuhkan origin canonical; schema strict menolak input role/admin, body dibatasi 8 KiB dan rate limit dipersistenkan di PostgreSQL.
- Default `solana:devnet` adalah konteks pesan login lokal, bukan keputusan chain/mint transaksi demo. Institutional/multisig wallet, production session policy dan security review produksi tetap perlu dibahas sebelum live.

## Data dan resource lama

Sebelum dibersihkan, tabel starter `user`, `account`, `session`, `verification` dan `notes` diperiksa lewat count dan seluruhnya berisi **0 record**. Setelah memastikan identitas project dan mount volume tepat, hanya container/volume/network milik setup Gen-Z lama yang dihapus; database Gen-Z baru tetap sehat. Tidak ada pengaitan email lama ke wallet.

Rencana awal untuk dump/restore seluruh database ditolak automatic approval review karena berpotensi memindahkan data sensitif. Rencana tersebut tidak dijalankan. Pemeriksaan read-only membuktikan database kosong, sehingga pembersihan resource kosong yang terverifikasi menjadi alternatif aman yang disetujui, tanpa migrasi data sensitif.

Container NgodingPakeAI lain ditemukan milik `D:\Projekan\MacMood` dan `D:\Projekan\Reaksan`; tidak diubah. Image PostgreSQL tetap image resmi upstream, bukan diberi nama seolah-olah image database milik Gen-Z. Nama produk/source aktif dan image aplikasi memakai Gen-Z. Atribusi copyright/lisensi sumber template dipertahankan, bukan ditulis ulang sebagai kepemilikan Gen-Z.

## Apa yang belum dibuat

Fondasi wallet bukan keseluruhan D0. Inquiry persistence/reference/outbox/retensi, membership/capability resource, private storage/document access, editorial review, tujuh tab dan fixture solar, calculator, quote/subscription/net settlement/allocation/portfolio, laporan/distribusi/funded claim, serta worker domain belum diimplementasikan. Tidak ada role admin dari login, saldo/portfolio sintetis yang menyamar sebagai data nyata, atau transaksi live.

`/api/ready` tetap mengembalikan 503 dengan `PLATFORM_FEATURES_NOT_IMPLEMENTED`, sedangkan kesiapan auth dilaporkan lewat `walletAuthenticationReady`. Tombol/menu fitur investasi tidak dibuat sekadar untuk menyerupai platform lengkap.

## Verifikasi

- `npm run check`: seluruh workspace lulus; Astro melaporkan 0 errors/warnings/hints.
- `npm test`: 13 tes shared-domain/marketing lulus, termasuk auth handoff tanpa mengaktifkan inquiry yang belum tersedia.
- `npm run build`: seluruh workspace lulus, termasuk Astro dan Next.js canonical.
- `npm run smoke`: batas publik Astro, route wallet, penolakan sesi anonim, resource belum tersedia dan worker lulus. Smoke memakai port terpisah dan [flag resmi Astro --ignore-lock](https://github.com/withastro/docs/blob/main/src/content/docs/en/reference/cli-reference.mdx) agar tidak mengganti preview pengguna yang sudah berjalan.
- `npm run test:platform`: 11 tes lulus, termasuk proof/signature, replay paralel, mismatch domain/URI/nonce/chain/environment, expiry, browser binding, session rotation, logout/revocation, JSON/origin/role/rate limits, migrasi berulang, serta browser.
- Browser menguji halaman auth dan sesi pada 320/390/1440px, light/dark, kontras AA pada teks, keyboard, reduced motion, empty/rejected state dan theme persistence. Screenshot diperiksa di `.cache/platform-verification`.
- Signature browser-test dibuat oleh fixture Ed25519 lokal, lalu diverifikasi endpoint produksi yang sama. Tidak ada fixture/bypass pada bundle aplikasi. Konfirmasi melalui extension wallet pengguna yang nyata belum dilakukan oleh agent.
- Image `gen-z/platform:local` berhasil dibuild dari konteks monorepo tanpa env/arsip. Container image uji merespons 200 pada health/auth/simbol/favicon dan 401 pada sesi anonim, lalu dihentikan.
- Audit dependency aktif root menghasilkan 0 vulnerabilities.
- Setup canonical diulang dan hash `.env` root serta `.env.local` aplikasi tetap identik. Database utama tetap memiliki 0 wallet account; semua fixture berada di database tes.

Docker Desktop sempat gagal mengekstrak snapshot saat rebuild image, sesuai kelas error [BuildKit parent snapshot missing](https://github.com/moby/buildkit/issues/6521). Rebuild `--no-cache` berhasil, lalu image final kembali lolos HTTP smoke. Tidak dilakukan global prune, reset Docker, atau penghapusan data proyek lain.

Build marketing masih menampilkan peringatan chunk besar bawaan bagian visual; ini tidak menghalangi build dan tidak berasal dari auth platform. Tidak ada klaim bahwa peringatan tersebut sudah dioptimalkan pada kurasi ini.

## Delivery Gate antislop

Arah UI meneruskan layar akses utilitas Gen-Z yang sudah dipilih pada sesi ini: palet mint/teal shared, simbol existing, font sistem yang mudah dibaca, satu tugas per layar. ENERGY 1 / RHYTHM 1 / MOTION 1. Tidak membuat logo, gambar, navigasi investasi, atau data bisnis baru.

| Item | Status dan bukti |
|---|---|
| R-02 | PASS: copy baru tidak memakai em dash |
| R-03 | PASS: auth dan sesi bebas overflow pada tiga viewport dan kedua tema |
| R-17/R-18 | PASS: tidak menambahkan statistik atau testimonial |
| R-23 | PASS: simbol Gen-Z existing dipakai ulang; tidak membuat aset visual baru |
| R-24/R-26 | PASS: brand, wallet list/refresh, theme, ganti wallet, logout dan redirect diuji melalui browser |
| R-25 | PASS: pemeriksaan computed color browser pada auth/sesi memenuhi batas AA |
| R-27 | PASS: wallet unavailable, pending/rejected, error fallback dan session shell tersedia; rejection diuji |
| R-28 | PASS: tidak menambahkan FAQ |
| R-32 | PASS: Tab/Enter skip link, label tombol dan indikator focus tersedia; tidak ada dialog custom yang membutuhkan Escape |
| R-33 | PASS: UI ditulis di source; injeksi wallet hanya ada di browser test terisolasi |
| R-34 | PASS: light/dark dan penyimpanan tema diuji |
| R-35 | PASS: build, production browser flow, dev server dan image smoke dijalankan |
| R-36/R-38 | PASS: status fondasi dan fitur belum tersedia dinyatakan; tidak mengarang klaim/data produk |
| R-37 | PASS: arah visual inherited dari brief/DESIGN dan pilihan sesi; dials tetap 1/1/1 |
| R-01/R-07/R-10/R-13/R-22 | PASS: tanpa gradient, pola, blur, glow atau ilustrasi dekoratif baru |
| R-04/R-08/R-09 | PASS: tidak menambah ikon generik/panah CTA/badge dekoratif; label demo menunjukkan konteks nyata |
| R-06 | PASS: font sistem mempertahankan keterbacaan form/feedback dan tidak membutuhkan CDN |
| R-12/R-14 | PASS: satu panel status, border menjelaskan batas konten; tidak membuat feature-card grid |
| R-19 | PASS: gerak hanya feedback; reduced motion menonaktifkan animasi/transisi |
| Liveliness | PASS: judul/aksi menjadi fokus, spasi memisahkan tugas/status, teal menunjukkan konteks/aksi, simbol dan nama Gen-Z konsisten |
| C-1/R-31 | PASS: alasan warna/layout/font/spasi/panel/simbol dicatat di atas |
| C-2/C-4 | PASS: alur akun dan state negatif diuji, termasuk keyboard/viewport/tema |
| C-3/R-05 | PASS: komposisi mengikuti akses wallet, tanpa section marketing isian |
| C-5 | PASS: tidak ada social proof atau data bisnis rekaan |
| R-11/R-15/R-16 | PASS: radius konsisten dan CTA menyebut aksi wallet; tidak memakai jargon marketing |
| R-20/R-21/R-29/R-30 | PASS: identitas Gen-Z existing, tema pilihan pengguna, satu keluarga aksen dan netral, tanpa meniru layout produk lain |

## Menjalankan kembali

`npm run dev:platform` dari root → `http://localhost:3001/auth`. Setup/database canonical: `npm run setup:platform`. Marketing lokal diarahkan ke origin ini untuk auth, sementara pengiriman inquiry tetap dinonaktifkan sampai backend-nya tersedia.
