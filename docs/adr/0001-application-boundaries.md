---
status: accepted
recorded: 2026-10-18
---
# Astro marketing dan Next.js app dalam satu workspace

Marketing membutuhkan konten publik/media, sementara investasi memerlukan auth dan resource privat. Baseline founder memilih Astro untuk marketing dan Next.js/TypeScript untuk app/auth; kurasi 17 Oktober menyatukan platform langsung di `apps/platform` dengan root workspace/lockfile. Pemisahan app menjaga tanggung jawab publik/privat; packages domain/content/tokens tetap pure untuk dipakai bersama. Sumber: [spec terkonfirmasi](../archive/mvp-spec-2026-10-18.md), [laporan kurasi](../history/2026-10-17-platform-alignment.md), dan [migrasi marketing](../history/2026-10-17-marketing-migration.md).

## Konsekuensi

Dua app memerlukan konfigurasi origin/handoff dan deployment masing-masing. Shared types tidak menggantikan validasi/authorization server; rahasia tidak masuk shared packages. Alternatif mempertahankan aplikasi React/Vite lama atau platform starter terpisah ditinggalkan saat migrasi/kurasi. Worker persisten tetap boundary target; handler bisnisnya belum ada. Rincian status saat ini: [Architecture](../ARCHITECTURE.md).
