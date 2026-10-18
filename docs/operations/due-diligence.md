# Onboarding aset dan due diligence

**Status: rancangan proses [R] untuk pilot mendatang.** Belum ada data counterparties yang membuktikan checklist terpenuhi. Pengunggahan sensitif memakai kanal privat; inquiry publik hanya intake awal.

Sumber pemisahan: [dokumen asal](../archive/prd-2026-10-18.md). Dipisahkan 18 Oktober 2026; label [F]/[R]/[A]/[O]/[V] mengikuti [panduan](../CONTRIBUTING.md).

## Onboarding dan pemeriksaan aset

### Stage gate

```text
Server inquiry + reference → assisted screening → bukti privat/kewenangan → dokumen/data lengkap → technical + commercial + legal DD
→ financial model downside → investment committee → final terms
→ conditions precedent → funding → pencairan terkontrol → monitoring → repayment/workout
```

**[F] Pilot mengutamakan brownfield/operational assets**; greenfield ditunda. **[R] Data awal:** rekam operasi dan collection 6–12 bulan yang dapat diuji. Bila periode tersedia lebih pendek, itu exception material yang memerlukan alasan dan risk acceptance; bukan diisi data sintetis. Greenfield baru masuk setelah tim mampu mengelola completion guarantee, milestone, contingency, dan risiko konstruksi.

| Area | Bukti minimum | Red flag / alasan menolak |
|---|---|---|
| Identitas dan kepemilikan | Akta, izin, UBO, hak lahan/sewa, daftar aset dan serial number, existing liens | Pemilik tidak jelas; aset sudah dijaminkan tanpa consent |
| Proyek dan legal wrapper | Hak penerbit atas aset/cash flow; assignment, security dan enforcement review | Token memberi hak yang tidak dapat diberikan penerbit |
| Operator | Rekam operasi, laporan keuangan, tim teknis, SLA/O&M, perkara dan transaksi afiliasi | Operator tidak menyediakan bank statement atau akses meter |
| Off-taker/PPA | Kontrak ditandatangani, tenor, tarif, volume, termination, creditworthiness, collection history | LOI dianggap pendapatan pasti; offtaker tak mampu membayar |
| EV demand | Fleet agreement, minimum commitment bila ada, sesi historis, site catchment, kompetitor | Proyeksi hanya berdasarkan EV nasional; tanpa data lokasi |
| Valuasi | Independent capex check, replacement cost, cash-flow DCF, residual value konservatif | Harga aset ditentukan dari target APY; inflated related-party sale |
| Teknis | Independent engineer, commissioning, capacity, grid connection, downtime, degradation | Spesifikasi tidak sesuai produksi; keselamatan bermasalah |
| Baterai | MW dan MWh, SoH, cycle life, warranty exclusions, fire protection, replacement plan | Margin mengabaikan degradasi dan penggantian |
| Insurance | Polis, deductible, exclusions, insured party dan loss payee, business interruption bila tersedia | Menganggap semua downtime/default ditanggung asuransi |
| Keuangan | Invoice, bank receipt, OPEX, pajak, debt schedule, sensitivity, reserve policy | Yield dibayar dari subscription baru; arus kas tidak cocok |
| Lingkungan/sosial | Izin relevan, keselamatan, limbah baterai, grievance, sumber listrik dan baseline emisi | Klaim hijau tanpa bukti; risiko limbah dan kebakaran tak dikelola |
| Data/oracle | Meter calibration, source ownership, API/export rights, auditability | Operator dapat mengubah semua bukti tanpa jejak |

**[R] Underwriting awal:** seluruh syarat legal/ownership wajib lolos; tidak dikompensasi skor tinggi di aspek lain. Target DSCR base case ≥1,30×, downside ≥1,00× untuk struktur debt, reserve sesuai tenor collection dan debt service, serta tenor hak lahan/PPA cukup menutup masa instrumen plus buffer. Semua threshold harus dikalibrasi engineer, credit lead, dan investor; bukan standar regulator yang diklaim berlaku universal.

**[O] Sponsor co-investment, first-loss, jaminan, atau reserve:** berguna bila kapasitas sponsor nyata, bukan kata “guaranteed” di materi marketing. Periksa enforceability, sumber dana, prioritas kreditur, dan apakah reserve dibentuk dari proceeds investor sehingga modal produktif berkurang.

### Monitoring berbasis tiga bukti

1. **Operasi:** produksi/usage, kWh, uptime atau metric yang sesuai aset, period/unit/source dan quality.
2. **Invoice:** delivered/eligible service, tarif/kontrak, tagihan/due date, credit note dan dispute.
3. **Collection:** kas yang benar-benar diterima, payer/currency, tanggal, bank/custody evidence dan matching invoice; bukan screenshot meter.

**[F]** Laporan bulanan reviewed menjadi fallback MVP; API/IoT ditambahkan bila feasible dan izin data tersedia. Semua data memuat sumber, freshness, coverage, missing/overdue/stale serta status koneksi. Data hilang tidak dianggap pengukuran nol. Raw telemetry, aggregate, monthly report dan ledger terpisah; provisional telemetry berlabel tidak memicu distribusi atau claimable.

**[F/R]** Terms/laporan direview sebelum terbit; koreksi versi baru dengan alasan/histori. Chart/calculator memakai canonical model/dataset, bukan angka manual di editor. Impact berada di Performance & Data dan memerlukan baseline/metodologi/sumber, tanpa klaim zero-emission otomatis. Optional anchoring hanya commitment data, bukan bukti sensor akurat, invoice lunas atau hak legal.

**[R] Live cadence baseline:** rekonsiliasi kas harian, investor report bulanan dan covenant/inspeksi berbasis risiko; disesuaikan kontrak serta kapasitas nyata. Missing report tampil sebagai overdue/unavailable, bukan grafik normal buatan.
