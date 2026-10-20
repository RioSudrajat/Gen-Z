# Architecture Decision Records

ADR menyimpan konteks dan konsekuensi pilihan yang berpengaruh panjang. ADR 0001–0003 mendokumentasikan ulang keputusan yang sudah ada; ADR berikutnya mencatat tanggal persetujuan dan batas implementasinya.

| ADR | Status | Keputusan asal |
|---|---|---|
| [0001 — Application boundaries](0001-application-boundaries.md) | Accepted; batas dasar diimplementasikan | Astro marketing + Next.js app/auth, satu workspace |
| [0002 — Base wallet identity](0002-base-wallet-identity.md) | Accepted; auth/cutover diimplementasikan | Founder memilih Base/EVM 18 Oktober; identity legacy terpisah |
| [0003 — PostgreSQL/Drizzle migrations](0003-postgres-drizzle-migrations.md) | Accepted; diimplementasikan | Drizzle query/schema, satu runner SQL checksum/lock |
| [0004 — Project rights lifecycle](0004-project-rights-lifecycle.md) | Accepted 20 Oktober; belum diimplementasikan | Unit hak tetap, payout/modal terpisah, burn menurut penyelesaian hak dan boundary data/admin |

Keputusan produk seperti reward informational dan tujuh tab ada di [register produk](../product/decisions.md). Arah lifecycle token/escrow/distributor D1 diterima pada ADR 0004; ABI, kontrak dan authority produksi belum disahkan atau diimplementasikan. Jangan membuat ADR untuk semua library atau detail rutin. Nomor berikutnya `0005`; keputusan tergantikan tetap disimpan dengan link pengganti.
