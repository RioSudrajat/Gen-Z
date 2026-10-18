# Batas server platform

**Fondasi 18 Oktober 2026:** wallet proof memakai SIWE/EVM pada Base Sepolia 84532. Namespace/chain/address dan proof method sesi membatasi identity; migrasi baru mempertahankan akun Solana legacy dan mencabut proof lama, tanpa automatic account linking. [Riset Base](../../../../docs/research/base-evm-2026-10-18.md) memuat tahap kontrak/worker berikutnya.

Modul di sini memakai `server-only`. Config, database, object storage, wallet verifier dan resource authorization berada di server. Domain dan schema bersama tetap tidak bergantung pada Next.js atau credential.

Identity foundation: SIWE challenge terikat browser, proof EVM server, nonce sekali pakai, cookie sesi opaque dan PostgreSQL/Drizzle. RPC contract verification opsional tetap server-only; EOA tidak membutuhkan RPC. Lihat `auth/` dan `database.ts`. Handler HTTP berada di `src/app/api/v1`; query dan keputusan sesi tetap di service server-only.

Route `/app` hanya shell sesi wallet; admin/operator dan route investasi belum memberikan resource atau grant. Jangan menambahkan email/sessionStorage atau pemilih role browser sebagai jalur sementara. Layout tidak menggantikan auth/authorization API.

Milestone berikutnya: inquiry transaction+outbox dan resource-scoped DAL sebelum data offering/dokumen ditampilkan, kemudian lifecycle investasi sesuai spec. Marketing tidak mengimpor modul ini secara langsung. Proof tidak memberikan eligibility/privilege dan tidak mengotorisasi transaksi.
