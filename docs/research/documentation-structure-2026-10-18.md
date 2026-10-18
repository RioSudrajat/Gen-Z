# Riset struktur dokumentasi untuk Gen-Z

**Tanggal akses:** 18 Oktober 2026, Asia/Jakarta. **Pertanyaan:** bagaimana menjaga PRD ringkas dan menyediakan dokumentasi inti yang sesuai tahap pre-pilot Gen-Z? Struktur di bawah adalah sintesis proyek [R], bukan satu standar universal atau keputusan scope baru.

## Temuan sumber primer

| Sumber | Temuan yang relevan | Penerapan pada Gen-Z |
|---|---|---|
| [Atlassian — PRD](https://www.atlassian.com/agile/product-management/requirements) | PRD memusatkan purpose, kebutuhan, scope dan success criteria; cukup ringkas agar shared understanding mudah dipelihara | PRD sebagai halaman pengarah; field DB, daftar API dan kronologi riset dipisah |
| [Atlassian — template](https://www.atlassian.com/software/confluence/templates/product-requirements) | Objective, success metrics, asumsi dan stories/prioritas membuat kebutuhan bisa dibahas | Pertahankan masalah/pengguna/outcome, scope, metrik, non-goals, constraint dan dependency; detail acceptance tetap punya ID |
| [arc42 — overview](https://arc42.org/overview/) | Dokumentasi arsitektur mencakup goals/constraints, context, building blocks, runtime, deployment, cross-cutting concepts, decisions, quality, risks dan glossary | Architecture memakai cakupan tersebut secara ringkas, menautkan security/testing/ADR/glossary agar tidak menyalin semua isi |
| [C4 — diagrams](https://c4model.com/diagrams) | Pilih tingkat diagram yang memberi nilai; context dan container mencukupi bagi banyak tim | Diagram konteks dan komponen deployable, ditambah satu sequence login; tidak memaksakan empat level |
| [Nygard — ADR](https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions) | Satu keputusan signifikan disimpan bersama konteks, status dan konsekuensi; record lama tetap ada saat tergantikan | Tiga ADR dari keputusan existing: batas app, Base identity, Drizzle/satu runner migrasi |
| [Diátaxis](https://diataxis.fr/) | Panduan belajar, how-to, reference dan explanation melayani kebutuhan pembaca berbeda | Setup/runbook terpisah dari API/data reference, alasan arsitektur, riset dan hasil implementasi; folder tidak harus menyalin empat kategori secara literal |
| [Mermaid — ERD](https://mermaid.js.org/syntax/entityRelationshipDiagram.html) | Diagram mendeskripsikan entity, attributes dan cardinality | ERD fisik auth dan model logis target dipisah; hubungan belum diterapkan tidak disajikan sebagai FK nyata |

## Mengapa ini cocok untuk proyek ini

Gen-Z memiliki dua kebutuhan sekaligus: founder perlu melihat produk utama dengan cepat; engineering perlu membedakan fondasi wallet/sesi yang ada dari investasi dan workflow yang masih rancangan. Karena hak/uang/evidence menjadi inti produk, ERD, finance, security, test mapping serta dependency legal/operasi lebih relevan daripada menambahkan banyak template enterprise.

PRD lama mencampur 21 bagian, termasuk pasar, tokenomics, due diligence, arsitektur, pajak, model bisnis, roadmap dan wawancara. [Peta migrasi](../archive/MIGRATION.md) menunjukkan tempat setiap kelompok isi. Keseluruhan PRD sumber disimpan, sehingga ringkasan tidak membuang konteks.

Tidak ada batas halaman PRD wajib dari sintesis ini. Ukur keberhasilannya dengan kemampuan menemukan scope, acceptance, model data dan alasan keputusan tanpa membaca seluruh arsip. Tanggal riset pasar/hukum lama dipertahankan; reorganisasi ini tidak memverifikasi ulang klaim pasar, tarif atau aturan.

## Aturan yang dihasilkan

Dokumen inti bernama stabil; supporting docs menurut tanggung jawab; tanggal untuk snapshot/history; nomor untuk ADR/requirement. Setiap dokumen membedakan [F]/[R]/[A]/[V]/[O] dan actual vs target. [Panduan pemeliharaan](../CONTRIBUTING.md) menetapkan isi tiap jenis dokumen. Riset/history/archive menyimpan bukti serta konteks, tanpa menjadi acuan scope kedua.
