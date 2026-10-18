# Runbook development lokal

**Baseline:** 18 Oktober 2026, merujuk scripts/README yang tersedia. Tidak menjalankan setup, migrasi, build atau mengubah database saat reorganisasi docs. Detail command milik app dipelihara di README app agar tidak ada dua panduan yang berbeda.

## 1. Setup dan start

Prasyarat: Node.js major 24 versi 24.11+, npm 11, Docker Desktop/Linux engine untuk PostgreSQL lokal. Dari root:

```sh
npm ci
npm run setup:platform
```

Setup membuat konfigurasi privat lokal, database dan migrasi melalui script proyek; mempertahankan credentials/data existing. Environment privat service tidak disalin ke docs/log. [README root](../../README.md) dan [platform](../../apps/platform/README.md) memuat opsi koneksi eksternal dan resource Compose.

Jalankan terpisah:

```sh
npm run dev:marketing
npm run dev:platform
npm run dev:worker
```

| Service | Alamat/indikator |
|---|---|
| Marketing | `http://localhost:4321/`; landing/contact tersedia |
| Platform auth | `http://localhost:3001/auth`; proof wallet SIWE, bukan email/password |
| Platform health | `/api/health` 200 berarti liveness |
| Platform readiness | `/api/ready` 503 untuk fitur domain belum ada; auth readiness terpisah |
| Worker | `http://localhost:4800/health`; `activeHandlers: 0`; `/ready` 503 |

## 2. Database dan perubahan schema

`npm run db:up` menyalakan PostgreSQL; `npm run db:down` menghentikan tanpa menghapus volume. Jangan reset volume untuk menyelesaikan dokumentasi atau mismatch konfigurasi. Default lokal `genz_demo`, port 5433 atau port kosong yang dipilih setup. Jalankan doctor sesuai [README platform](../../apps/platform/README.md).

Alur schema: edit TypeScript → `db:generate` → review SQL → `db:migrate` melalui runner checksum/lock tunggal. Perintah lengkap dan baseline metadata: [pilihan database](../../apps/platform/README.md#pilihan-database-18-oktober-2026). Jangan mengedit migrasi applied atau memakai migrator kedua. [ERD](../ERD.md) harus diperbarui bila schema fisik berubah.

## 3. Verifikasi

Perintah dan coverage ada di [Testing](../TESTING.md). Build diperlukan sebelum `test:platform`; tes platform membuat database/container sementara miliknya, bukan database aplikasi. Browser vendor wallet/contract-account nyata memerlukan lingkungan support yang sesuai; fixture test bukan klaim kompatibilitas seluruh wallet.

## 4. Diagnosis umum

| Gejala | Pemeriksaan/tindakan |
|---|---|
| Auth/DB unavailable | Pastikan Docker/DB berjalan, jalankan doctor, periksa env service tanpa membocorkan credential |
| SIWE ditolak | Periksa configured origin/port, chain 84532, expiry, exact message dan binding cookie browser yang sama |
| Contract-account gagal | Periksa configured RPC server-only dan chain; jangan menambahkan bypass proof |
| Login berhasil, tidak ada workspace/domain | Saat ini memang hanya shell/session; grant dan investasi belum dibuat |
| Ready 503, health 200 | Baca readiness detail; jangan mengganti flag agar dianggap siap |
| Inquiry tidak persisten | Backend inquiry/outbox belum ada; form publik bukan bukti penerimaan server |
| Launch app handoff belum terhubung | Ikuti konfigurasi origin pada [README marketing](../../apps/marketing/README.md) dan platform |

## 5. Batas operasi produksi

Backup/restore dan disaster recovery produksi, incident contact/authority, signing mandates, queue monitoring, reconciliation alerts dan deployment/rollback belum memiliki runbook yang teruji. Buat saat integrasi/hosting nyata dipilih, dengan owner, command, expected outcome, rollback boundary dan bukti latihan. [Roadmap](../ROADMAP.md) dan [live gates](../product/risks-and-dependencies.md) menentukan kapan dibutuhkan.
