# Metrik produk dan definisi

**Status: rancangan pengukuran [R].** Ini definisi dan target usulan, bukan hasil analytics atau komitmen metrik baru. Prioritas pre-pilot di [PRD](../PRD.md); KPI live/loyalty baru relevan setelah fase tersebut aktif.

Sumber pemisahan: [dokumen asal](../archive/prd-2026-10-18.md). Dipisahkan 18 Oktober 2026; label [F]/[R]/[A]/[O]/[V] mengikuti [panduan](../CONTRIBUTING.md).

## Definisi metrik lintas fase

**Current pre-pilot [R]:** inquiry accepted/screened dengan reference, kelengkapan evidence, wallet-login completion, comprehension tujuh tab/rights/gross-net/principal-expiry, konsistensi quote→settlement→posisi→funded claim, reporting freshness/coverage, qualified operator/investor discovery, izin data serta actual provider/cost quotes. Target count/tanggal mengikuti capacity. Belum ada mitra/anchor berarti tidak mengklaim funded projects atau TVL sebagai traction.

**North-star [R]: cash flow proyek yang terverifikasi dan dialokasikan/diselesaikan dengan benar kepada pemegang hak, dengan default dan loss dilaporkan.** Jangan memaksimalkan TVL jika kualitas underwriting menurun.

| KPI | Definisi dan guardrail | Sumber/frekuensi | Target pilot usulan |
|---|---|---|---|
| Deployed principal | Dana investor yang benar-benar dicairkan ke proyek, net refund | Ledger, bulanan | Satu proyek; nilai sesuai underwriting, bukan target vanity |
| TVL on-chain | Saldo aset pada kontrak yang dikuasai untuk produk; bukan nilai pembangkit | Indexer, harian | Dilaporkan terpisah dari AUM; tidak dihitung ganda |
| AUM/outstanding | Hak/unit dan principal tersisa atau NAV jika didefinisikan instrumen; tidak ditambah TVL lagi bila merepresentasikan uang sama | Register/ledger, bulanan | Cocok dengan register |
| Jumlah proyek | Pisahkan sourced, approved, funded, operational, impaired | Project registry | 1 funded yang lolos gates |
| MW terbiayai | Kapasitas proyek × porsi pendanaan Gen-Z, dengan denominator dan metode disclosed | DD/ledger, kuartalan | Bedakan refinancing dan additional capacity |
| Storage/EV capacity | MW dan MWh BESS; connector serta kW charging; bukan semua dikonversi menjadi MW pembangkit | Asset register | Lengkap untuk pilot |
| Yield terdistribusi | Kas income dibayar, terpisah return of capital, gross/net investor tax | Distribution ledger | Tiga siklus sesuai kas/terms, bukan jaminan return |
| On-time payments | Kewajiban dibayar tepat waktu / kewajiban jatuh tempo | Servicing, bulanan | 100% target operasional; tunggakan tetap tampil |
| Reconciliation breaks | Selisih tak terselesaikan antara bank/custody, ledger, register, chain | Harian | Nol selisih tanpa penjelasan saat closing/payout |
| Collection/credit | Collection ratio, aging, covenant breach, DSCR, impairment, realized loss | Finance, bulanan | Seluruhnya dilaporkan; jangan hanya tampilkan yield |
| MAU | Investor verified yang melakukan aktivitas meaningful; admin/bot dikecualikan | Analytics, bulanan | Baseline dahulu; bukan indikator utama investasi pasif |
| Charging sessions, ekspansi | Completed and paid sessions eligible, deduplicated | Operator, harian | Baseline lalu incremental uplift vs control |
| Retention pengguna layanan mitra, ekspansi | Proporsi cohort eligible yang kembali bertransaksi dalam 30/90 hari, dipisah per kategori layanan | Verified service transaction cohort | Target ditetapkan setelah baseline |
| Retention investor | Repeat investment di antara yang eligible dan memiliki kesempatan berinvestasi | Ledger/cohort, kuartalan | Tidak disamakan dengan belum bisa redeem |
| Economics | Collected fee margin/proyek, CAC, servicing cost, incentive cost/incremental session | Finance, bulanan | Rencana margin positif tanpa token subsidy |
| Kualitas layanan | Payout failure, complaint resolution, uptime portal, stale data | Ops, mingguan | Sesuai SLA FR dan vendor |
| Impact | Renewable kWh, attributable capacity, avoided emissions dengan baseline dan additionality | Engineer, kuartalan | Klaim hanya jika metodologi dan data tersedia |

KPI charging/loyalty hanya berlaku jika program ekspansi diaktifkan; MVP tidak membuat points balance/retention atau funded traction sintetis seolah aktual.

**[R] Pilot continuation gate:** tiga siklus laporan dapat direkonsiliasi; tidak ada insiden dana/hak investor yang belum diselesaikan; pembayaran dan breach dijelaskan; biaya actual terukur; serta operator/investor bersedia mengulang. Satu default tidak boleh disembunyikan dengan menambah proyek baru agar rasio terlihat membaik.
