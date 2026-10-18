---
status: accepted
decision_date: 2026-10-18
recorded: 2026-10-18
---
# Base/EVM dengan identity wallet terpisah dari legacy Solana

Founder memilih Base menggantikan Solana pada 18 Oktober, dengan scope produk 17 Oktober tetap. Fondasi login menggunakan SIWE dan sesi PostgreSQL pada Base Sepolia 84532. Identity unik memakai `(namespace, chain_id, normalized address)` agar akun legacy dan EVM tidak digabung tanpa proof/mandat; migrasi baru mempertahankan akun Solana, mencabut sesi legacy dan mengonsumsi challenge lama. Sumber: [riset/arah founder](../research/base-evm-2026-10-18.md), [laporan implementasi](../history/2026-10-18-base-foundation.md), [SQL cutover](../../apps/platform/db/migrations/20261017175425_base_siwe_identity.sql).

## Konsekuensi

Wallet connection harus dilanjutkan proof server. Login tidak memberi eligibility, admin atau kewenangan institusi. Contract-account verification memerlukan RPC dan support yang diuji. Namespace identity memungkinkan menyimpan histori tanpa menganggap dua address pihak legal yang sama. Base mainnet/live dan kontrak investasi belum diaktifkan; pilihan chain tidak membuktikan custody/FX/rights legal siap. Alasan pemilihan Base yang tercatat adalah arahan founder; dokumen ini tidak menambahkan klaim komparasi biaya/performance.
