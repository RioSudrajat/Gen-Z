# Risiko dan dependency

**Baseline:** 18 Oktober 2026. Tidak ada pilihan vendor, peran tim, tanggal delivery atau terms proyek baru yang ditetapkan di sini. Register asal dan status [F]/[R]/[O] tetap di [decisions](decisions.md); konteks risiko lengkap tersimpan di [PRD arsip bagian 19](../archive/prd-2026-10-18.md#19-risks--mitigations).

## Blocker teknis dan produk

| ID | Kondisi saat ini | Dampak/fase | Tindak lanjut | Fungsi owner |
|---|---|---|---|---|
| DEP-01 | Sesi ada; grant/resource authorization belum | M1–M3: tidak boleh membuka resource investasi hanya dengan shell login | Tetapkan scoped policies dan uji anonim/owner lain/revocation | Engineering; implementasi berikutnya |
| DEP-02 | Inquiry/outbox/retensi belum | M1 belum selesai | Commit+reference+outbox, satu inbox, retry, screening dan clock retensi | Engineering + founder untuk konfigurasi |
| DEP-03 | CMS/storage/renderer/review belum | M2 evidence/publikasi belum | Pilih vendor saat perlu, typed blocks, policy original/copy dan versioning | Engineering; reviewer berwenang belum ditunjuk |
| DEP-04 | Model fixture dan lifecycle belum | M3 belum bisa didemokan lengkap | Deterministic solar fixture; money precision dan net-settle/allocation/distribution tests | Product/engineering dalam scope |
| DEP-05 | Contract/indexer/test deployments belum | M4 belum | Engineering review, registry test tokens, finality/dedupe/recovery, test funding | Engineering; mandat/signers belum ditunjuk |
| DEP-06 | RPC, queue/email/storage/backup lifecycle belum dipilih | Operasi integrasi terkait belum ready | Tetapkan kebutuhan minimum, biaya dan support; jangan menganggap kandidat terpasang | Engineering + founder |
| DEP-07 | Belum ada angka target UAT/conversion yang disetujui | Validasi tujuan belum terukur sebagai KPI numerik | Catat baseline dan hasil discovery; sepakati threshold saat data tersedia | Founder/product |

## Blocker sebelum dana nyata [O]

| ID | Bukti yang belum tersedia | Keputusan/tindakan pembuka | Fungsi yang diperlukan; belum otomatis terisi |
|---|---|---|---|
| LIVE-01 | Mitra/operator/aset/anchor aktual, izin data, kontrak dan collection history | Sourcing, DD dan consent akses data | Founder/partnership + asset/credit reviewer |
| LIVE-02 | Issuer/wrapper/hak enforceable, jurisdiction/allowed investors, tax/marketing review | Classification/terms dan eligibility per offering/country | Legal/compliance counsel |
| LIVE-03 | KYC/KYB/UBO, custody/escrow, FX/conversion capacity, payout/refund currencies/fees | Provider diligence, executable quote/contract dan fund-flow review | Compliance/finance/treasury |
| LIVE-04 | Production contract/recovery/upgrade/pause authority, independent approvals | Mandat nyata, signers, security review/audit serta rehearsal | Security/engineering + issuer/finance mandate |
| LIVE-05 | Monitoring, reconciliation, incident response, backups/restore dan backup servicing | Runbooks dan evidence latihan/continuity | Operations/finance |
| LIVE-06 | Actual fees, willingness-to-pay, minimum deal size, risk limits dan continuity budget | Quote biaya serta economics proyek yang teruji | Founder/product/finance |

Global investor target bukan izin semua negara. Berhasil testnet bukan persetujuan dana nyata. Riset regulasi lama disimpan sebagai [snapshot](../research/legal-context-2026-10-18.md), perlu pemeriksaan terbaru sebelum dipakai untuk keputusan legal.

## Risiko dan respons yang perlu diuji

| Risiko | Trigger | Respons target |
|---|---|---|
| Hak/izin tidak jelas | Classification, assignment atau izin aktivitas belum terbukti | Tahan transaksi live sampai bukti/mandat lengkap |
| Double economics atau kas tidak cocok | Duplicate IDs, concurrent claim, reconciliation break | Atomic reserve/uniqueness, tahan dispatch dan rekonsiliasi |
| Salah baca angka/bukti | Forecast dianggap actual, meter dianggap kas, draft dianggap approved | Model/data lineage, label status/version/source, publication review |
| Operator/offtaker gagal | Koleksi menunggak, bukti tidak cocok, covenant breach | Exception/workout, disclosure dan approval sesuai mandat |
| Depeg/freeze/FX/vendor outage | Route tidak executable, quote stale atau transfer unknown | Expire quote, exception/liability, rekonsiliasi sebelum retry |
| Key compromise/data leak | Akses atau transfer tidak sah | Pause sesuai authority, preserve evidence, incident response |
| Unit economics tidak layak | DD/servicing lebih mahal dari collected fee | Validasi pricing/minimum size sebelum scale; tanpa subsidi native token sebagai asumsi |

Kriteria diterapkan lewat [Testing](../TESTING.md); urutan kerja ada di [Roadmap](../ROADMAP.md).
