# Konteks pasar dari PRD lama

**Status: snapshot riset lama, tidak diverifikasi ulang saat reorganisasi.** Tahun/definisi, sumber, asumsi TAM/SAM/SOM dan keterbatasan dipertahankan. Ini bukan requirement atau klaim traction Gen-Z.

Sumber pemisahan: [dokumen asal](../archive/prd-2026-10-18.md). Dipisahkan 18 Oktober 2026; label [F]/[R]/[A]/[O]/[V] mengikuti [panduan](../CONTRIBUTING.md).

## Problem Statement & Market Opportunity

### Tesis energi: valid sebagai arah, perlu diperbaiki sebagai klaim

**[F] Tesis awal:** kemajuan ekonomi berbanding lurus dengan konsumsi listrik per kapita; tidak ada high-income economy dengan konsumsi listrik rendah.

**[R] Formulasi yang lebih defensible:** listrik yang andal, terjangkau, dan cukup merupakan prasyarat penting bagi banyak aktivitas produktif. Konsumsi per kapita dapat menjadi indikator kapasitas ekonomi, tetapi bukan hubungan proporsional universal atau bukti kausal tunggal. Struktur jasa/manufaktur, iklim, efisiensi, outsourcing industri, dan perdagangan listrik memengaruhi perbandingan. Klaim “tidak ada” belum dibuktikan melalui analisis seluruh negara dan tidak boleh masuk pitch sebagai fakta.

Gen-Z harus mengejar **listrik produktif dengan cash flow sehat dan dampak emisi terukur**, bukan sekadar konsumsi listrik yang lebih tinggi. Ukuran kemajuan nasional bukan KPI yang secara langsung dapat diatribusikan ke platform.

### Verifikasi angka pembanding

Gunakan 2024 sebagai baseline ekonomi/kapasitas bila tersedia; tahun konsumsi listrik ditampilkan per sel. Tabel ini merupakan komparasi indikatif, bukan dataset untuk regresi karena definisi dan tahun belum seragam.

| Negara | Penduduk | Kapasitas pembangkit | Konsumsi listrik per kapita | PDB per kapita nominal USD | Hasil pemeriksaan terhadap brief |
|---|---:|---:|---:|---:|---|
| Indonesia | ±281,6 juta, 2024 [V] | 100,649 GW, 2024 [V] | 1.411 kWh, 2024, ESDM [V] | 4.960,3, 2024 [V] | Rentang founder dekat untuk 2024; kapasitas sudah sedikit di atas 100 GW |
| China | 1.408,28 juta, akhir 2024 [V] | 3.348,62 GW, 2024 [V] | ±6.996 kWh, 2024, hasil hitung konsumsi 9.852,1 TWh / penduduk akhir tahun | 13.445, 2024, rilis pemerintah [V] | Sekitar 7.000 didukung; 9.500 bukan angka 2024 yang terbukti dalam riset ini |
| Singapura | 6,0369 juta, 2024 [V] | 12,445 GW, 2024 [V]; 13,261 GW pada semester I 2025 [V] | 9.750 kWh, 2023, World Bank/IEA [V] | 85.000–90.000 dalam brief **[perlu verifikasi]** untuk tahun yang dimaksud | 13–15 GW tidak cocok dengan kapasitas akhir 2024; PDB perlu snapshot seri konsisten |
| Amerika Serikat | ±340,1 juta, Juli 2024 [V] | 1.250–1.300 GW **[perlu verifikasi]**: harus tentukan nameplate/net summer serta cakupan small-scale solar | 12.839 kWh, 2024, World Bank/IEA [V] | ±84.492, 2024, UNCTAD [V] | Populasi, konsumsi, dan PDB sejalan secara kasar; kapasitas belum disahkan |

Sumber Indonesia: [Statistik Ketenagalistrikan ESDM 2024](https://gatrik.esdm.go.id/assets/uploads/download_index/files/91fa8-buku-statistik-ketenagalistrikan-2024.pdf), [BPS, PDB 2024](https://www.bps.go.id/id/pressrelease/2025/02/05/2408/ekonomi-indonesia-tahun-2024-tumbuh-5-03-persen--c-to-c-.html), dan [publikasi pemerintah yang merujuk proyeksi penduduk BPS](https://satudata.pertanian.go.id/assets/docs/publikasi/Buletin_Konsumsi_Pangan_Semester_I_2024.pdf).

Sumber China: [NBS, statistik 2024](https://www.stats.gov.cn/english/PressRelease/202502/t20250228_1958822.html), [NEA, konsumsi listrik 2024](https://www.nea.gov.cn/20250120/4f7f249bac714e7693adecac996d742f/c.html), [pemerintah China, PDB per kapita](https://english.www.gov.cn/english.www.gov.cn/news/202510/20/content_WS68f62084c6d00ca5f9a06efc.html). Hasil hitung memakai populasi akhir tahun, bukan rata-rata tahunan.

Sumber Singapura: [SingStat, populasi](https://www.singstat.gov.sg/find-data/search-by-theme/population/population-and-population-structure/latest-data), [EMA, kapasitas](https://www.ema.gov.sg/resources/singapore-energy-statistics/chapter2), [World Bank/IEA, konsumsi listrik](https://data.worldbank.org/indicator/EG.USE.ELEC.KH.PC?view=null). Seri PDB yang ditemukan memiliki revisi berbeda; angka founder tidak dipertahankan sebagai angka terbaru yang telah terkonfirmasi.

Sumber AS: [US Census, populasi 2024](https://www.census.gov/library/stories/2024/12/population-estimates.html), [World Bank/IEA, konsumsi listrik](https://data.worldbank.org/indicator/EG.USE.ELEC.KH.PC?view=null), [UNCTAD, profil AS](https://unctadstat.unctad.org/CountryProfile/GeneralProfile/en-GB/840/index.html), [EIA, Electric Power Annual](https://www.eia.gov/electricity/annual). Nilai UNCTAD terindeks dalam pencarian; pengambilan halaman penuh gagal, sehingga arsip tabel perlu dilampirkan sebelum publikasi eksternal.

**Koreksi tambahan:**

- Dunia: **3.558 kWh/kapita pada 2023**, bukan langsung memakai ±3.300 tanpa tahun. Malaysia: **5.084 kWh/kapita pada 2023**, mendukung pembulatan ±5.000. [World Bank/IEA](https://data.worldbank.org/indicator/EG.USE.ELEC.KH.PC?locations=null)
- World Bank/IEA menampilkan Indonesia **1.445 kWh pada 2023**, sementara seri ESDM untuk tahun yang sama adalah **1.337 kWh**. Ini harus direkonsiliasi secara metodologis; jangan menyimpulkan perubahan tahunan dari perpindahan sumber. [World Bank](https://data.worldbank.org/indicator/EG.USE.ELEC.KH.PC?view=null), [ESDM](https://gatrik.esdm.go.id/assets/uploads/download_index/files/91fa8-buku-statistik-ketenagalistrikan-2024.pdf)
- Pembaruan Indonesia 2025: kapasitas **107,51 GW**, sehingga brief 95–100 GW bukan baseline terkini. Tabel tetap menggunakan 2024 agar tahun tidak tercampur diam-diam. [ESDM, kinerja 2025](https://www.esdm.go.id/en/media-center/news-archives/kapasitas-pembangkit-naik-7-gw-akses-listrik-masyarakat-meningkat)
- Penjualan PLN 2025 menunjukkan rumah tangga **42,36%** dan industri **29,94%**. Rumah tangga adalah kelompok terbesar, bukan mayoritas absolut; penjualan PLN tidak sama dengan seluruh konsumsi nasional karena pembangkit captive/non-PLN. Data ini juga tidak memisahkan industri high-tech. [Statistik PLN 2025](https://web.pln.co.id/statics/uploads/2026/03/Statistik-2025-16.3-c.pdf)

### Kebutuhan investasi: skenario, bukan angka tunggal

**[A] Skenario founder:** penambahan 30 GW/tahun dan belanja USD30–40 miliar/tahun mengimplikasikan sekitar **USD1.000–1.333/kW**. Itu asumsi biaya rata-rata, bukan estimasi engineering terverifikasi; tidak cukup untuk menyatakan biaya pembangkit, grid, BESS, lahan, bunga konstruksi, dan cadangan sekaligus.

Dengan **asumsi kurs Rp16.000/USD**, USD30–40 miliar menjadi **Rp480–640 triliun**, bukan tepat Rp500–600 triliun. Kurs ini hanya input skenario. Teknologi, capacity factor, kebutuhan firming, dan lokasi harus menentukan model biaya.

Pembanding resmi: RUPTL PLN 2025–2034 memuat tambahan kapasitas **69,5 GW**, termasuk storage dalam komposisi program, dan peluang investasi **Rp2.967,4 triliun**: pembangkit Rp2.133,7 triliun, penyaluran Rp565,3 triliun, dan lainnya Rp268,4 triliun. Cakupan dan horizon berbeda dari skenario 30 GW/tahun. [ESDM EBTKE](https://ebtke.esdm.go.id/artikel/berita/peluang-investasi-dan-green-jobs-di-sektor-ebt-terbuka-lebar-lewat-ruptl-pln-2025-2034)

**[R] Dua pilar makro tetap relevan:** modal swasta/global membutuhkan kepastian hak dan kontrak bankable; ekspansi teknologi membutuhkan pembangkit, interkoneksi antarpulau, BESS, surya/EBT, dan kajian firm low-carbon power termasuk SMR. Gen-Z berkontribusi pada pembiayaan proyek terpilih; pembangunan super-grid dan SMR berada di luar kemampuan MVP.

### Problem A: AI, compute, dan industri

IEA memperkirakan konsumsi data center global sekitar **415 TWh pada 2024**, dengan **945 TWh pada 2030 dalam base case**. Itu proyeksi global untuk data center, bukan TAM Indonesia dan bukan seluruhnya AI. [IEA, Energy and AI](https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai), [ringkasan IEA](https://www.iea.org/reports/energy-and-ai/executive-summary%C2%A0)

**[R] Masalah yang dapat dilayani Gen-Z:** proyek energi skala lebih kecil di dekat demand anchor kesulitan membiayai aset karena kontrak, kualitas data, ticket size, atau biaya transaksi. Pernyataan “Indonesia belum punya fondasi energi” terlalu menyeluruh. Uji per lokasi: daya tersambung, waktu interkoneksi, kualitas tegangan, outage, tarif efektif, cooling, dan akses energi rendah emisi.

Data center, fab semikonduktor, serta smelter nikel/besi tidak memiliki underwriting yang identik. Data center membutuhkan kontinuitas dan redundansi; fab juga sangat sensitif terhadap kualitas daya; smelter membutuhkan energi proses besar dan menghadapi risiko komoditas. MVP tidak membiayai GPU, membangun data center, atau menanggung risiko harga nikel.

### Problem B: EV

**[F] Pemicu founder:** risiko Selat Hormuz, kenaikan harga minyak, tekanan biaya BBM, dan dorongan beralih ke EV. Dokumen EIA Mei 2026 membahas gangguan produksi terkait penutupan Selat Hormuz, tetapi kondisi dan harga pada tanggal peluncuran harus diperbarui. Hubungan langsung dengan adopsi EV Indonesia belum terbukti. [EIA, outlook Mei 2026](https://www.eia.gov/outlooks/steo/pdf/steo_full.pdf?lv=true)

**[perlu riset lanjutan]** Tidak tepat menyatakan EV belum memiliki jaringan sama sekali. ESDM menyebut **3.558 SPKLU disiapkan untuk periode mudik 2025** pada wilayah yang disebut dalam rilis. Angka ini bukan ukuran utilisasi, availability, jumlah konektor unik, atau cakupan nasional terkini. [ESDM, SPKLU mudik 2025](https://esdm.go.id/en/media-center/news-archives/siapkan-3-ribu-spklu-menteri-esdm-pastikan-pemudik-nyaman-berkendara)

Masalah produk yang diuji: apakah ada lokasi dengan demand terikat tetapi kekurangan modal untuk charger/storage, dan apakah investasi tetap layak tanpa subsidi token? Analogi Pertamina membantu menjelaskan kebutuhan jaringan, tetapi operator EV, charging rumah, destination charging, dan PLN menciptakan struktur pasar yang berbeda.

| Riset wajib | Metrik dan pemisahan | Sumber/owner yang diusulkan | Pengaruh pada keputusan |
|---|---|---|---|
| Demand kendaraan | Stok aktif BEV roda 2/4, fleet vs pribadi, wilayah, km/hari; pisahkan penjualan dan stok | Product research; registrasi resmi, asosiasi, fleet | Memilih cluster pilot |
| Supply infrastruktur | Site, charger, connector, daya AC/DC, SPBKLU, compatibility, availability aktual | Energy lead; ESDM, PLN, operator | Menghindari hitung ganda dan lokasi oversupplied |
| Utilisasi | kWh/connector/hari, session/hari, durasi, peak occupancy, antrean, musim | Operator export minimal 6–12 bulan | Basis pendapatan |
| Unit economics | Tarif bersih, biaya listrik, sewa, demand charge bila berlaku, maintenance, payment fee, replacement | Finance dan operator | Break-even, DSCR, pricing |
| EV affordability | TCO kendaraan, pembiayaan, biaya/km, penghematan pengguna EV, willingness to pay | Interview pengguna EV/fleet dan data transaksi | Apakah insentif mengubah perilaku |
| Battery swap/storage | Swaps/baterai/hari, SoH, kehilangan, spare inventory, round-trip efficiency, keselamatan | OEM/operator dan engineer | Besar reserve dan masa manfaat |
| Konversi insentif | Repeat usage vs control, biaya per incremental session, fraud rate | Product analytics | Layak/tidaknya program poin |

### TAM, SAM, SOM

**[R] Jangan menyamakan belanja energi nasional dengan market revenue Gen-Z.** TAM pembiayaan = kebutuhan modal aset yang berpotensi cocok; SAM = bagian yang memenuhi yurisdiksi, jenis instrumen, ukuran, dan standar underwriting; SOM = nilai proyek yang realistis dioriginate dan ditutup oleh tim.

**[V] Konteks pasar:** ESDM mencatat PLTS terpasang **1.494,1 MW** akhir 2025 dan tambahan **584,7 MW** selama 2025. Total EBT 15.630 MW di laporan termasuk 468 MW gasifikasi batubara/WHB, sehingga tidak otomatis seluruhnya renewable/eligible. RUPTL 2025–2034 memuat investasi EBT melalui IPP **Rp1.341,8 triliun**, tetapi banyak proyek greenfield dan capex multi-tahun. Angka tersebut bukan annual financing market atau revenue Gen-Z. [ESDM LKj EBTKE 2025](https://www.esdm.go.id/assets/media/content/content-laporan-kinerja-ditjen-ebtke-tahun-2025.pdf), [ESDM RUPTL](https://www.esdm.go.id/id/media-center/arsip-berita/dongkrak-energi-bersih-menteri-esdm-tekankan-pentingnya-komitmen-laksanakan-ruptl).

**[R] Horizon sizing: 12 bulan.** TAM = jumlah net financing/refinancing need aset operasional berkontrak dalam ruang produk; SAM = bagian yang lolos service/legal/credit/rail filters; SOM = closed/disbursed capital, dibatasi verified demand, committed eligible anchor capital dan execution capacity. National TAM sesuai definisi produk masih **[perlu verifikasi]**, karena data asset-level debt/funding need belum tersedia. Global investor target memperluas sumber modal, bukan otomatis ukuran aset Indonesia.

| Skenario sourcing 12 bulan, seluruh angka [A] | Rendah | Basis | Tinggi |
|---|---:|---:|---:|
| Universe hipotetis dipetakan | 100 proyek | 100 proyek | 100 proyek |
| Punya funding need × lolos filters | 20% × 30% | 30% × 40% | 40% × 50% |
| Eligible hasil model | 6 proyek | 12 proyek | 20 proyek |
| Serviceable capital/proyek | Rp2 miliar | Rp5 miliar | Rp10 miliar |
| **SAM sourcing model** | **Rp12 miliar** | **Rp60 miliar** | **Rp200 miliar** |
| Closing capacity jika gates/anchor tersedia | 1 proyek | 2 proyek | 3 proyek |
| **SOM capital model** | **Rp2 miliar** | **Rp10 miliar** | **Rp30 miliar** |

**Ini sensitivity, bukan national TAM, pipeline nyata, forecast atau target founder. Downside wajib: 0 closing / Rp0 funding.** Belum ada mitra/anchor nyata; nominal satu pilot mengikuti kas/debt capacity. Contoh revenue [A]: funding Rp10miliar × fee2% + average outstanding Rp5miliar × servicing1% × satu tahun = **gross fee Rp250juta**, sebelum semua biaya/tax/run-off, bukan profit atau accepted pricing. Fee prorata dan average outstanding mengikuti amortisasi.

Sourcing register wajib memuat owner/COD/technology, contracts/currency, collections, CFADS, existing debt/security/lender consent, net funding need/date dan operator data permission. Dedupe refinancing agar uang yang sama tidak dihitung ulang. Bukti pasar/operator, semua sumber, formulas dan data gaps ada pada [riset market sizing](market-features-2026-10-12.md). Jangan memakai capex/MW, token RWA market cap atau pemilik kripto sebagai dana yang sudah bersedia masuk Gen-Z.

## Competitive Landscape

Snapshot situs publik per tanggal riset. Klaim pemasaran milik kompetitor bukan hasil audit independen. Tidak ada klaim bahwa platform tertentu sudah memperoleh izin Indonesia. Angka pipeline bukan funded AUM dan target yield bukan realized return.

| Dimensi | ReFi Hub | Habitat Protocol | GEN / ge.network |
|---|---|---|---|
| Model bisnis | Akses investasi aset energi operasional dan distribusi cash flow; detail fee perlu konfirmasi | Mengubah surplus energi terbarukan menjadi layanan compute/storage dan marketplace | Infrastruktur tokenisasi dengan lapisan GEN Core, GEN Network, GEN Invest; tarif komersial belum terkonfirmasi |
| Aset/eksposur | Solar dan kategori EV charging; proyek individual dan produk portofolio Volt | Green Credits dan Energy Vouchers yang mewakili compute; bukan otomatis saham proyek energi | Solar, EV charging, storage, data center disebut sebagai kategori aset |
| Yield/manfaat | Pendapatan aset; Volt mengiklankan target 6% dan withdrawal mingguan | Utility compute dan akses voucher; cash yield investor tidak terverifikasi | Instrumen yield dari offtake energi dan distribusi bulanan menurut situs |
| Token | Volt disebut SPL token portofolio dengan komposisi 70% aset energi/30% likuid; jangan disamakan dengan token governance native | $HABITAT, Green Credits, Energy Vouchers; litepaper memuat alokasi 75/10/10/5% | Bentuk legal token proyek dan native token belum cukup terungkap di halaman yang ditinjau **[perlu verifikasi]** |
| Kekuatan yang tampak | Penjelasan kontrak, operating assets, dan distribusi; pembanding dekat untuk Gen-Z | Hubungan energi-surplus dengan demand compute konkret | Integrasi telemetry dengan produk investasi; vertikal sudah luas |
| Kelemahan/hal belum terbukti | Buffer likuiditas tidak menjamin redemption saat stress; fee dan implementasi withdrawal perlu diuji | Eksekusi compute, utilization, SLA, dan economics voucher perlu pembuktian; bukan pembanding yield langsung | Telemetry tidak membuktikan penerimaan kas atau hak hukum; klaim on-chain ownership perlu validasi dokumen |

Sumber: [ReFi Hub](https://www.refihub.io/), [Volt](https://www.refihub.io/volt), [Habitat](https://www.habitatprotocol.com/), [Habitat Litepaper](https://www.habitatprotocol.com/litepaper), [GEN](https://www.ge.network/), [GEN Invest](https://invest.ge.network/). Akses yang sempat gagal telah diulang pada 12 Oktober; halaman utama Habitat dan litepaper dapat ditinjau. Status operasional mutakhir tetap memerlukan bukti di luar halaman pemasaran.

**Pembaruan benchmark 12 Oktober:** revenue participation ReFi berbeda menurut proyek. FLP II mempunyai fixed/variable payment serta operator support; Surya melaporkan pembagian kas net. Laporan CRN membedakan interim development payments dari generation revenue. Benchmark bisnis lebih mapan seperti Maple/Ondo/Centrifuge digunakan untuk menguji issuer, principal recovery, servicing dan pemisahan native/project rights, bukan menyalin underlying risk atau headline yield. Detail bukti bertanggal, ketidaksesuaian data dan sumber tersedia di [memo riset](rwa-product-fit-2026-10-12.md).

**Audit fitur terbaru:** ReFi public app list/detail dapat ditinjau: Deal Terms, Performance, Risks, Asset & Operator, Documents, historical distributions dan calculator; authenticated portfolio/checkout belum diuji. **GEN /invest dan /network WIP**, sedangkan Habitat marketplace/compute banyak berupa litepaper/roadmap; jangan memperlakukan ilustrasi landing sebagai production app. [GEN Invest](https://www.ge.network/invest), [GEN Network](https://www.ge.network/network), [ReFi public detail](https://app.refihub.io/investments/9). Kurasi fitur ReFi/Ondo/GEN/Habitat/Glow/SunContract beserta scope observasi ada pada [memo fitur](market-features-2026-10-12.md).

**[R] Celah Gen-Z yang perlu dibuktikan:**

- Origination lokal: kontrak, bank, operator, dan collection rupiah yang bisa diverifikasi.
- Hak investor dan proses default yang ditulis dalam bahasa Indonesia dan dapat dijalankan melalui struktur lokal.
- Pelaporan tiga bukti: energi dikirim, invoice diterbitkan, kas diterima. Jangan menyamakan ketiganya.
- Energy-first origination dengan kontrak pendapatan dan mitra kredibel, dilanjutkan pembiayaan/layanan EV dan infrastruktur lain sesuai kesiapan.

“EV + AI” bukan keunikan yang sudah terbukti karena GEN menyebut kategori serupa. Kepatuhan juga belum menjadi moat sebelum Gen-Z memiliki jalur operasional yang sah. Substitusi utama meliputi kredit bank, leasing peralatan, modal operator, dan SCF konvensional; Gen-Z harus unggul pada biaya total, kecepatan, atau akses modal dibanding opsi tersebut.
