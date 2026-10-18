---
status: accepted
decision_date: 2026-10-18
recorded: 2026-10-18
---
# Drizzle di atas PostgreSQL dengan satu runner migrasi SQL

Query/schema bertipe dipilih untuk pertumbuhan relasi identity, offering, subscription dan ledger, menggantikan arah SQL manual sebagai pilihan jangka panjang. Platform memakai Drizzle di atas pool `pg` yang sama; Drizzle Kit menghasilkan SQL untuk review. Runner existing `scripts/migrations.mjs` di platform tetap satu-satunya pelaksana, dengan checksum dan advisory transaction lock, sehingga tidak ada dua ledger migrasi yang saling berbeda. Sumber keputusan dan alasan: [README database](../../apps/platform/README.md#pilihan-database-18-oktober-2026).

## Konsekuensi

Migrasi `0001` yang sudah diterapkan dipertahankan; metadata baseline memetakan schema lama tanpa CREATE TABLE ulang. Perubahan baru: edit schema → generate SQL → review → runner `db:migrate`. Jangan memakai `drizzle-kit push/migrate` atau migrator kedua. ORM tidak menggantikan FK/check/unique PostgreSQL, authorization, precision uang atau idempotency. Uji platform memeriksa drift antara schema TypeScript, snapshot dan hasil migrasi pada PostgreSQL terisolasi. Entitas investasi pada ERD tetap rancangan, belum ditambahkan melalui ADR ini.
