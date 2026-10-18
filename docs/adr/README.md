# Architecture Decision Records

ADR menyimpan konteks dan konsekuensi pilihan yang berpengaruh panjang. Catatan berikut mendokumentasikan ulang keputusan yang sudah ada; tanggal penulisan ulang bukan persetujuan baru.

| ADR | Status | Keputusan asal |
|---|---|---|
| [0001 — Application boundaries](0001-application-boundaries.md) | Accepted; batas dasar diimplementasikan | Astro marketing + Next.js app/auth, satu workspace |
| [0002 — Base wallet identity](0002-base-wallet-identity.md) | Accepted; auth/cutover diimplementasikan | Founder memilih Base/EVM 18 Oktober; identity legacy terpisah |
| [0003 — PostgreSQL/Drizzle migrations](0003-postgres-drizzle-migrations.md) | Accepted; diimplementasikan | Drizzle query/schema, satu runner SQL checksum/lock |

Keputusan produk seperti reward informational dan tujuh tab ada di [register produk](../product/decisions.md). Usulan restricted token/escrow/distributor D1 belum menjadi kontrak produksi accepted. Jangan membuat ADR untuk semua library atau detail rutin. Nomor berikutnya `0004`; keputusan tergantikan tetap disimpan dengan link pengganti.
