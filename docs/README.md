# Dokumentasi Gen-Z

Mulai dari **[PRD](PRD.md)** untuk memahami produk, lalu **[Architecture](ARCHITECTURE.md)** dan **[ERD](ERD.md)** untuk memahami sistem serta datanya. Dokumen utama memakai nama tetap; tanggal dan versi dicatat di dalam file.

Baseline: 18 Oktober 2026, Asia/Jakarta. Gen-Z sedang pre-pilot. Marketing dan fondasi login tersedia di source; inquiry persisten dan lifecycle investasi belum dibuat. Status implementasi di bawah berasal dari inspeksi source, bukan pengujian runtime baru.

## Dokumen inti

| Dokumen | Menjawab | Kapan dibaca |
|---|---|---|
| [PRD](PRD.md) | Mengapa produk dibuat, untuk siapa, scope dan ukuran berhasil | Mulai di sini |
| [Requirements MVP](product/requirements.md) | Stories dan acceptance M01–M17 | Menentukan pekerjaan dan UAT |
| [Architecture](ARCHITECTURE.md) | Batas sistem, komponen, runtime dan deployment | Implementasi/integrasi |
| [ERD](ERD.md) | Entitas, relasi dan model fisik vs target | Perubahan data |
| [API contract](engineering/api.md) | Request/response, auth/error, idempotency dan transisi HTTP seluruh MVP | Integrasi frontend/backend |
| [Security](SECURITY.md) | Auth, authorization, trust boundary dan retensi | Setiap resource/API privat |
| [Testing](TESTING.md) | Apa yang harus dibuktikan dan dengan cara apa | Verifikasi/delivery |
| [Roadmap](ROADMAP.md) | Urutan, dependency dan syarat selesai tiap fase | Prioritas pekerjaan |
| [Glossary](../GLOSSARY.md) | Arti istilah domain | Istilah ambigu |

## Detail menurut kebutuhan

| Area | Isi |
|---|---|
| [Product](product/README.md) | Requirements, finance, strategi, metrik, register keputusan, risiko/dependency |
| [Engineering](engineering/README.md) | API auth aktif, target routes/API, kamus data, flows |
| [ADR](adr/README.md) | Alasan keputusan arsitektur yang berdampak panjang |
| [Operations](operations/README.md) | Setup/runbook lokal dan due diligence aset |
| [Design](design/README.md) | Referensi visual, warna, storyboard dan eksplorasi; arah utama di [DESIGN](../DESIGN.md) |
| [Research](research/README.md) | Riset bertanggal, sumber dan bukti |
| [History](history/README.md) | Laporan implementasi dan hasil verifikasi pada sesi asal |
| [Archive](archive/README.md) | Dokumen lama utuh; [peta lokasi lama → baru](archive/MIGRATION.md) |

## Cara menentukan acuan

PRD menetapkan outcome/scope; requirements merinci perilaku dan acceptance. Architecture, ERD dan engineering menerjemahkan scope menjadi rancangan. ADR menjelaskan alasan pilihan teknis, tanpa memperluas scope produk. Kode/migrasi menunjukkan apa yang sudah diimplementasikan; hasil uji membuktikan perilakunya pada lingkungan yang diuji. Bila berbeda, catat gap dan perbaiki dokumen atau implementasi yang relevan.

Label **[F]** berarti keputusan founder, **[R]** rancangan/rekomendasi, **[A]** asumsi atau fixture sintetis, **[V]** bukti pada tanggal sumber, **[O]** belum diputuskan. Keputusan diterima tidak berarti fitur selesai. Riset, history dan archive tidak mengalahkan scope aktif hanya karena nama atau tanggal file.

Panduan isi setiap jenis dokumen dan pemeliharaan: [CONTRIBUTING](CONTRIBUTING.md). Dasar riset pemilihan struktur: [struktur dokumentasi](research/documentation-structure-2026-10-18.md).
