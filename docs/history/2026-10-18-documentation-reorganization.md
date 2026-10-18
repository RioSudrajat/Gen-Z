# Reorganisasi dokumentasi

**Tanggal:** 18 Oktober 2026, Asia/Jakarta. Scope: struktur/nama/isi dokumentasi, pemisahan PRD dan backbone docs; tanpa perubahan runtime atau scope produk.

## Hasil

Pintu masuk baru [README docs](../README.md); PRD ringkas, architecture, ERD physical/target, security, testing dan roadmap memakai nama stabil. Detail produk/engineering/ops terpisah; tiga ADR mendokumentasikan keputusan existing. Riset, desain, history dan archive dikelompokkan. [Peta migrasi](../archive/MIGRATION.md) menyimpan path asal → baru serta pemisahan isi.

Semua file asal dipertahankan. Tautan relatif dan referensi README/AGENTS/DESIGN diperbarui. Catatan hasil uji lama tetap bertanggal; ringkasan actual/target diverifikasi terhadap source schema, auth services/handlers dan workspace scripts.

## Verifikasi

| Pemeriksaan | Hasil |
|---|---|
| File asal | 560/560 ditemukan di lokasi baru; tidak ada file asal dibuang |
| Non-Markdown | 525/525 SHA-256 identik, termasuk PDF, gambar, capture, teks ekstraksi, CSS dan manifest JSON |
| Markdown sumber | 35/35 dibandingkan dengan backup sebelum perubahan; isi dipertahankan dengan link/literal path direbase, notice arsip, dan satu keterangan missing evidence |
| Stories | 22/22 user stories identik dengan spec sumber |
| Acceptance | 17/17 baris M01–M17 identik dengan schema/flows sumber |
| Register keputusan | 31/31 D01–D31 dipertahankan; hanya relative link DESIGN direbase |
| PRD | 116.494 → 7.843 bytes; 93,3% lebih ringkas; detail dipisah dan sumber utuh di archive |
| Tautan Markdown | `node scripts/check-docs.mjs`: 90 file, 622 tautan lokal, 0 gagal; termasuk heading anchors lokal yang didukung checker |
| JavaScript checker | `node --check scripts/check-docs.mjs` lulus |
| Diagram | Struktur/sintaks source diperiksa manual; physical identity dibandingkan dengan schema/migrasi. Belum dirender atau divalidasi parser Mermaid |
| Actual vs target | Cocok dengan source auth/config/schema/handlers; tabel investasi/Party/grant/worker handlers tidak diklaim tersedia |

Tiga referensi QA sejak sebelum reorganisasi mengarah ke file yang sudah tidak ditemukan: dua bukti `landing/qa/marketing-refresh/` pada audit follow-up dan satu `landing/qa/who-we-serve/VERIFICATION.md` pada memo desain. Tautan mati diganti keterangan jujur mengenai lokasi/batas evidence, tanpa membuat pengganti seolah bukti asli pulih. Path absolut lama dalam manifest evidence tetap provenance saat capture; [panduan lokasi sekarang](../research/2026-10-17/README.md) menjelaskan penggantian prefix.

Folder lama yang kosong dibersihkan setelah seluruh file dipindah dan diperiksa. Perintah migrasi/backup/hash per-file tersimpan lokal di `.cache/docs-reorg-20261018/`; indeks/path publik pemindahan ada di [MIGRATION](../archive/MIGRATION.md).

Build aplikasi, database hidup, browser aplikasi, kontrak dan hasil riset pasar/legal lama tidak diuji/diverifikasi ulang dalam tugas dokumentasi ini.
