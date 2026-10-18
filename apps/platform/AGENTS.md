# Panduan implementasi platform Gen-Z

Baca panduan root repo, README di folder ini, `docs/PRD.md`, `docs/product/requirements.md`, `docs/ARCHITECTURE.md`, dan `docs/ERD.md` dari root. Indeks utama `docs/README.md`; alasan teknis di `docs/adr/`. Scope founder mendahului template atau contoh upstream; arsip bukan acuan implementasi aktif.

- Ini satu workspace Next.js `@gen-z/platform`, memakai lockfile root. Jangan memasang aplikasi Next.js kedua di subfolder atau memakai starter sebagai sumber requirement produk.
- Local setup: `npm run setup:platform` dari root; dev: `npm run dev:platform`. Compose canonical hanya di root. Tidak meminta pengguna menyalin env atau membuat password lokal. Simpan existing credentials/data; jangan reset volume.
- Auth hanya proof wallet EVM/SIWE di `src/server/auth`, dengan chain 84532 (Base Sepolia) untuk demo/testnet. EIP-6963/injected wallets tidak dibatasi merek. Smart-account verification memerlukan RPC server-only; dukungan vendor tidak diklaim sebelum diuji. Jangan menambah email/password, sessionStorage authentication, role selector atau bypass demo. Akun Solana historis dipertahankan pada namespace legacy; jangan automatic merge. Migrasi identity baru dan tes proof/replay/sesi mengikuti checklist `docs/research/base-evm-2026-10-18.md`. Untuk API library, baca dokumentasi versi terpasang/Context7.
- Route handler tipis: Origin, validation, cookie, response. SQL dan proof/session logic di server-only service. Setiap data boundary perlu autentikasi dan otorisasi resource tersendiri; layout bukan perlindungan API.
- Login tidak memberikan grant, eligibility atau admin. Belum ada data offering, dokumen privat, inquiry atau lifecycle investasi yang boleh diklaim siap.
- Database: PostgreSQL + Drizzle ORM di atas satu pool `pg`. Definisi tabel bertipe ada di `src/server/db/schema.ts`; perubahan schema memakai `db:generate`, review SQL, lalu `db:migrate`. Pelaksana tunggal tetap runner checksum/transaction lock yang ada, bukan `drizzle-kit push/migrate`. Jangan rewrite migrasi yang sudah diterapkan. Alasan dan baseline metadata dijelaskan di README platform, bagian pilihan database 18 Oktober.
- Shared domain/editorial/tokens tetap pure; rahasia dan database tidak boleh masuk package/browser bundle.
- Setelah perubahan: check dan build workspace. Untuk auth/session/DB, jalankan `npm run test:platform` setelah build. Tes wajib memakai database terisolasi, bukan database aplikasi.
- Jangan menghapus atribusi lisensi upstream saat mengganti nama produk/runtime. Jangan mengubah resource Docker proyek lain hanya karena namanya mirip.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
