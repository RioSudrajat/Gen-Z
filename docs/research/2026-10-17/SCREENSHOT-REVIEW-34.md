# Review 34 screenshot ReFi Hub untuk Gen-Z

Tanggal: 17 Oktober 2026 (Asia/Jakarta).

Seluruh 34 lampiran telah dibaca dan diarsipkan tanpa modifikasi. Nomor di bawah sama dengan urutan lampiran pengguna; manifest menyimpan ukuran dan SHA-256. Analisis ini menilai informasi yang terlihat. Login, claim, transaksi, keyboard, mobile dan source CMS tidak dibuktikan oleh gambar. Pemeriksaan browser publik dicatat dalam laporan utama. Review bukan audit legal atau keamanan.

## Temuan lintas layar

Dua keluarga tab hidup berdampingan: FLP II memakai Deal Terms / Performance / Risks / Asset & Operator / Documents; CRN dan Surya memakai Reports / Overview / Details / Impact / Calculate Your Returns. Ini belum membuktikan urutan migrasi desain. Variasi konten juga belum membuktikan CMS tertentu: bisa block editor, rich text, Markdown, HTML atau komponen khusus.

## Screenshot 1: Dashboard akun

![Screenshot 1: Dashboard akun](D:/Projekan/GenZ/docs/research/2026-10-17/screenshots/01-dashboard.png)

**Yang terlihat:** Ringkasan yield, onboarding email/profil, featured asset, project updates, dan notifikasi.

**Implikasi untuk Gen-Z:** Pisahkan angka portofolio pribadi dari angka aset featured. Untuk akun tanpa holding, tampilkan penjelasan saat metrik yield atau dampak belum dapat dihitung; jangan membuat angka nol tampak sebagai hasil pengukuran. Panel notifikasi perlu empty state.

## Screenshot 2: Portfolio

![Screenshot 2: Portfolio](D:/Projekan/GenZ/docs/research/2026-10-17/screenshots/02-portfolio.png)

**Yang terlihat:** Yield tahunan, total earned, next payout, default rate, grafik earnings/allocation, daftar proyek dan Claim Yield USDC.

**Implikasi untuk Gen-Z:** Struktur ini cocok sebagai referensi. Gen-Z perlu memisahkan principal outstanding, income received, claimable, dan claimed. Definisi yield/default rate harus menjelaskan periode serta pembaginya. Claim disabled perlu alasan yang terlihat.

## Screenshot 3: Katalog Energy Assets

![Screenshot 3: Katalog Energy Assets](D:/Projekan/GenZ/docs/research/2026-10-17/screenshots/03-assets-list.png)

**Yang terlihat:** FLP II sebagai featured asset dan enam baris proyek dengan status, yield, tenor, kapasitas serta tautan detail.

**Implikasi untuk Gen-Z:** Perbandingan cepat adalah kekuatannya. Bedakan minimum investasi dari target pendanaan; jangan menyebut keduanya Ticket Size. Gunakan unit sesuai kelas aset: kW/kWp, kWh, jumlah charger atau ukuran lainnya. Status operasi, penawaran, pembayaran, dan data perlu dipisahkan.

## Screenshot 4: FLP II: Deal Terms

![Screenshot 4: FLP II: Deal Terms](D:/Projekan/GenZ/docs/research/2026-10-17/screenshots/04-flp-deal-terms.png)

**Yang terlihat:** Banner offering baru atas aset yang juga memiliki Series 1; operating history, fixed payment USD9.722 per tahun, share35%, distribusi bulanan, USDC Solana, collateral dan insurance in transition.

**Implikasi untuk Gen-Z:** Pisahkan physical asset dari offering series. Angka111,69kWp adalah funded capacity, bukan seluruh plant. Temuan dokumen menunjukkan41.196,10 pada invoice berada di kolom Savings(SGD), sedangkan UI menamainya energy generated(kWh); ini perlu sumber dan validasi unit sebelum dianggap benar. Lihat review PDF untuk rincian.

## Screenshot 5: FLP II: How Cashflow Works

![Screenshot 5: FLP II: How Cashflow Works](D:/Projekan/GenZ/docs/research/2026-10-17/screenshots/05-flp-cashflow.png)

**Yang terlihat:** Narasi fixed payment dan variable share atas gross energy/REC, disertai diagram dari plant ke operator lalu wallet.

**Implikasi untuk Gen-Z:** Diagram memudahkan pembacaan, tetapi tidak memperlihatkan seluruh fee, revenue support dan basis deemed REC dalam schedule. Untuk Gen-Z, diagram cash flow sebaiknya dihasilkan dari model terms yang sama dengan kalkulator. Transaksi on-chain tidak membuktikan invoice telah ditagih dan dibayar.

## Screenshot 6: FLP II: estimator input

![Screenshot 6: FLP II: estimator input](D:/Projekan/GenZ/docs/research/2026-10-17/screenshots/06-flp-calculator.png)

**Yang terlihat:** Investment amount50.000; target return21,5%; opsi tanpa reinvestasi serta asumsi reinvestasi4%/8%.

**Implikasi untuk Gen-Z:** Ini scenario engine, bukan performance aktual. Reinvestasi hipotetis tidak boleh terkesan sebagai fasilitas atau tingkat bunga yang ditawarkan platform. Periode, nilai minimum, model, fees dan terms version perlu terlihat.

## Screenshot 7: FLP II: estimator hasil

![Screenshot 7: FLP II: estimator hasil](D:/Projekan/GenZ/docs/research/2026-10-17/screenshots/07-flp-calculator-outcome.png)

**Yang terlihat:** Total cashflow96.750 selama9tahun; nilai dengan reinvestasi116.614,16; fixed405,08/bulan dan variable490,75/bulan untuk contoh50.000.

**Implikasi untuk Gen-Z:** Perhitungan50.000×21,5%×9 menghasilkan96.750 sebagai cashflow ilustratif. Jangan menyebut semuanya laba atau menambahkan pengembalian pokok50.000 di akhir tanpa dasar kontrak. TSA menyatakan expiry dan tidak ada hak residual atas proceeds peralatan; principal semantics harus eksplisit.

## Screenshot 8: FLP II: Performance History

![Screenshot 8: FLP II: Performance History](D:/Projekan/GenZ/docs/research/2026-10-17/screenshots/08-flp-history.png)

**Yang terlihat:** Tabel2025 memisahkan energy revenue, REC,35%share, fixed810,18, distribution dan annualised yield.

**Implikasi untuk Gen-Z:** Pengantar menyatakan apa yang akan diterima jika FLP II sudah berlaku, sehingga tabel ini backtest, bukan histori payout aktual FLP II. Pisahkan dari pembayaran2026 di sidebar. Basis deemed/accrued REC juga harus dibedakan dari uang penjualan REC yang telah diterima.

## Screenshot 9: FLP II: Revenue Model

![Screenshot 9: FLP II: Revenue Model](D:/Projekan/GenZ/docs/research/2026-10-17/screenshots/09-flp-revenue-model.png)

**Yang terlihat:** Penjelasan PPA25tahun dan penjualan REC sebagai sumber pendapatan.

**Implikasi untuk Gen-Z:** Masa PPA, tenor offering9tahun, dan umur aset adalah horizon berbeda. Perhitungan gross revenue dalam schedule lebih rinci daripada ringkasan UI. Gen-Z perlu membedakan generated, billed, accrued, collected dan deemed value.

## Screenshot 10: FLP II: Risks bagian awal

![Screenshot 10: FLP II: Risks bagian awal](D:/Projekan/GenZ/docs/research/2026-10-17/screenshots/10-flp-risks-counterparty.png)

**Yang terlihat:** Counterparty/payment risk, production variability, equipment risk, target transisi insurance dan letter of undertaking.

**Implikasi untuk Gen-Z:** Kewajiban pembayaran tetap bergantung kemampuan counterparties. Frasa fully insured dan in transition perlu direkonsiliasi berdasarkan policy yang berlaku. Letter of undertaking bukan certificate insurer, dan target aktivasi yang sudah lewat tidak membuktikan polis aktif.

## Screenshot 11: FLP II: Risks liquidity/technology

![Screenshot 11: FLP II: Risks liquidity/technology](D:/Projekan/GenZ/docs/research/2026-10-17/screenshots/11-flp-risks-liquidity.png)

**Yang terlihat:** P2P disebut planned/in development; ekspektasi hold9tahun; risiko smart contract, jaringan Solana dan USDC.

**Implikasi untuk Gen-Z:** Tokenisasi tidak otomatis membuat posisi liquid. Transfer policy, maturity dan recovery perlu ditulis per series. Jika audit ditampilkan, tautkan report, scope, tanggal, program/version dan temuan yang belum ditutup; jangan hanya badge umum.

## Screenshot 12: FLP II: Asset Profile

![Screenshot 12: FLP II: Asset Profile](D:/Projekan/GenZ/docs/research/2026-10-17/screenshots/12-flp-asset-profile.png)

**Yang terlihat:** Total267,85kWp, funded111,69kWp, Singapore, operasi sejakSep2024, offtaker, PPA25tahun, REC dan grid.

**Implikasi untuk Gen-Z:** Key-value profile cocok menjadi fixed schema. PPA menyebut265,96kWp±10%;267,85 masih berada dalam rentangnya, sehingga ini bukan kontradiksi kapasitas yang terbukti. Tetap catat basis kontrak versus as-built serta pembagian kapasitas per series.

## Screenshot 13: FLP II: Operator & team

![Screenshot 13: FLP II: Operator & team](D:/Projekan/GenZ/docs/research/2026-10-17/screenshots/13-flp-operator-team.png)

**Yang terlihat:** Profil Pivot Green, foto, nama, role, pengalaman tim dan tautan sosial.

**Implikasi untuk Gen-Z:** Operator upfront meningkatkan akuntabilitas. Tambahkan legal entity, registration jurisdiction, issuer relationship, mandate dan tanggal pemeriksaan. Team profile atau link sosial tidak menggantikan bukti kewenangan, ownership atau security.

## Screenshot 14: FLP II: Off-taker & contract

![Screenshot 14: FLP II: Off-taker & contract](D:/Projekan/GenZ/docs/research/2026-10-17/screenshots/14-flp-offtaker.png)

**Yang terlihat:** Freight Links/Vibrant Group, PPA25tahun, REC dan urutan penerimaan/distribusi.

**Implikasi untuk Gen-Z:** Nama legal pada kontrak perlu dipertahankan walaupun UI memakai nama singkat/grup. Status anak perusahaan dari grup listed tidak otomatis berarti parent guarantee. Narasi payment priority harus sesuai kontrak, bukan hanya gambar alur.

## Screenshot 15: FLP II: Documents bagian awal

![Screenshot 15: FLP II: Documents bagian awal](D:/Projekan/GenZ/docs/research/2026-10-17/screenshots/15-flp-documents.png)

**Yang terlihat:** PPA dan Token Sale Agreement pada Contracts&Legal; invoice history dan insurance side letter pada Performance Data.

**Implikasi untuk Gen-Z:** Dokumen benar-benar upfront: root mengonfirmasi tautan keenam file terlihat tanpa login pada17Okt2026. Tambahkan tipe dokumen, signed/redacted status, version, effective date, source, scope dan review state. Kategori insurance lebih tepat pada Insurance&Security.

## Screenshot 16: FLP II: Documents bagian bawah

![Screenshot 16: FLP II: Documents bagian bawah](D:/Projekan/GenZ/docs/research/2026-10-17/screenshots/16-flp-documents-financial.png)

**Yang terlihat:** REC issuance dan Commercial Terms Schedule1 ditempatkan di Financials.

**Implikasi untuk Gen-Z:** Schedule yang mengatur economics harus terhubung jelas ke TSA/offering, bukan menjadi attachment yang mudah terlewat. REC certificate evidence perlu dibedakan dari financial receipt. Semua enam PDF user telah diperiksa secara terpisah.

## Screenshot 17: CRN: Reports terbaru

![Screenshot 17: CRN: Reports terbaru](D:/Projekan/GenZ/docs/research/2026-10-17/screenshots/17-crn-reports-latest.png)

**Yang terlihat:** Update operasi/payment/relay repair, tiga tahap generation→recognition→payment, pending settlement dan technical PDF.

**Implikasi untuk Gen-Z:** Ini menunjukkan produksi energi tidak sama dengan kas masuk. Under Maintenance dan narasi operational mungkin merujuk komponen berbeda; tampilkan status per dimensi dan incident. Report yang memperkirakan pembayaran di masa lalu perlu tanggal pembaruan serta status hasilnya.

## Screenshot 18: CRN: Reports historis

![Screenshot 18: CRN: Reports historis](D:/Projekan/GenZ/docs/research/2026-10-17/screenshots/18-crn-reports-history.png)

**Yang terlihat:** Interim payment, construction progress, penjelasan hujan serta foto lapangan.

**Implikasi untuk Gen-Z:** Timeline membutuhkan blok paragraf, gambar dan lampiran yang dapat dipilih sesuai kejadian. Interim payment perlu menyebut sumber dan konteks; jangan menganggap seluruh pembayaran berasal dari operating revenue.

## Screenshot 19: CRN: Overview & team

![Screenshot 19: CRN: Overview & team](D:/Projekan/GenZ/docs/research/2026-10-17/screenshots/19-crn-overview-team.png)

**Yang terlihat:** Narasi masih menyebut proyek under development, disertai litepaper dan team profile.

**Implikasi untuk Gen-Z:** Overview tampak tidak sejajar dengan report yang lebih baru. Pisahkan company profile yang relatif tetap dari status proyek yang bersumber dari lifecycle records. Perubahan status perlu memicu pemeriksaan narasi lama.

## Screenshot 20: CRN: Details

![Screenshot 20: CRN: Details](D:/Projekan/GenZ/docs/research/2026-10-17/screenshots/20-crn-details.png)

**Yang terlihat:** Problem/solution, maintenance, serta model bisnis operator: instalasi, O&M dan development.

**Implikasi untuk Gen-Z:** Konteks perusahaan berguna, tetapi berbeda dari arus kas aset yang diinvestasikan. Beri scope pada setiap blok: operator-level, physical asset atau offering. Fleksibilitas narasi tidak menghilangkan kebutuhan schema.

## Screenshot 21: CRN: Impact

![Screenshot 21: CRN: Impact](D:/Projekan/GenZ/docs/research/2026-10-17/screenshots/21-crn-impact.png)

**Yang terlihat:** Proyeksi lifetime15.722MWh dan6.682tonCO2 selama30tahun; faktor0,425tCO2/MWh dan SDG.

**Implikasi untuk Gen-Z:** 15.722×0,425=6.681,85; pembulatan6.682 konsisten. Ini proyeksi lifetime, bukan realized impact atau hak environmental attributes investor. Wajib periode, methodology, source factor, vintage dan batas atribusi, khususnya bila REC dijual.

## Screenshot 22: CRN: Calculator

![Screenshot 22: CRN: Calculator](D:/Projekan/GenZ/docs/research/2026-10-17/screenshots/22-crn-calculator.png)

**Yang terlihat:** Input100 selama1tahun menghasilkan10,90; expected first year10,9%; rata-rata30tahun37,1%; deskripsi hasil menyebut Exodos1.

**Implikasi untuk Gen-Z:** Nama proyek yang salah adalah copy/template residue yang terlihat. Selisih10,9% dan11,29% belum otomatis bug karena basisnya bisa berbeda. Nama, horizon, model dan source version harus berasal dari entity yang benar.

## Screenshot 23: Surya: Reports terbaru

![Screenshot 23: Surya: Reports terbaru](D:/Projekan/GenZ/docs/research/2026-10-17/screenshots/23-surya-reports-latest.png)

**Yang terlihat:** Peralihan cycle16th–15th ke calendar month; bridge period; feed API masih preview sebagian charger; electricity costs direkonsiliasi bulanan.

**Implikasi untuk Gen-Z:** Jangan menganggap semua data sudah streaming live. Tanda**terlihat literal di tanggal; ini menunjukkan formatting artefact, bukan bukti bahwa backend pasti Markdown. Reporting window, source coverage dan cadence per metrik harus menjadi data terstruktur.

## Screenshot 24: Surya: Reports Mei–Maret

![Screenshot 24: Surya: Reports Mei–Maret](D:/Projekan/GenZ/docs/research/2026-10-17/screenshots/24-surya-reports-history.png)

**Yang terlihat:** kWh, gross revenue, costs, net profit, distribusi investor, annualised rate, utilisation dan downtime.

**Implikasi untuk Gen-Z:** Report baik untuk menghubungkan operasi ke unit economics. Gen-Z harus mengambil semua angka dari periode/model yang sama. Definisi gross/net, fee, currency dan annualisation wajib jelas; narasi tidak menjadi sumber utama ledger.

## Screenshot 25: Surya: First Full Cycle & correction

![Screenshot 25: Surya: First Full Cycle & correction](D:/Projekan/GenZ/docs/research/2026-10-17/screenshots/25-surya-first-cycle.png)

**Yang terlihat:** Fee yang terlewat pada initial payout disebut dikoreksi24Feb; reportJan menautkan blog dan foto.

**Implikasi untuk Gen-Z:** Perlu correction log yang menghubungkan versi laporan, alasan, adjustment dan transaction reference. Pembetulan transaksi finansial tidak cukup dengan mengganti paragraf/angka historis.

## Screenshot 26: Surya: Overview & asset details

![Screenshot 26: Surya: Overview & asset details](D:/Projekan/GenZ/docs/research/2026-10-17/screenshots/26-surya-overview.png)

**Yang terlihat:** India highway charging,19charger, sumber listrik grid,4DC+15Beast dan delivery timeline.

**Implikasi untuk Gen-Z:** Schema EV berbeda dari solar: charger identity, site, rating, connector, status dan utilisation diperlukan. Report lain menyebut DC30/60kW; jangan menyamakan semua perangkat. Energi grid yang dispensed tidak otomatis berarti renewable generation.

## Screenshot 27: Surya: Profit Distribution

![Screenshot 27: Surya: Profit Distribution](D:/Projekan/GenZ/docs/research/2026-10-17/screenshots/27-surya-distribution.png)

**Yang terlihat:** Donut60%investor,10%platform,30%DeCharge setelah energy costs dan operating costs.

**Implikasi untuk Gen-Z:** Ini model net-profit share, berbeda dari FLP II. Rumus tidak boleh disederhanakan menjadi satu APY global. Chart harus dihasilkan dari components yang sum100%, dengan deduction basis dan fee ordering yang dapat diperiksa.

## Screenshot 28: Surya: Details & team

![Screenshot 28: Surya: Details & team](D:/Projekan/GenZ/docs/research/2026-10-17/screenshots/28-surya-details-team.png)

**Yang terlihat:** Infrastructure gaps, traffic estimates, strategi deployment dan histori penggunaan/track record operator.

**Implikasi untuk Gen-Z:** Pisahkan operator-level track record dari kinerja funded project. Cantumkan source, tanggal dan scope, supaya statistik perusahaan tidak tampil seolah hasil proyek yang dibeli investor.

## Screenshot 29: Surya: Revenue & costs

![Screenshot 29: Surya: Revenue & costs](D:/Projekan/GenZ/docs/research/2026-10-17/screenshots/29-surya-costs.png)

**Yang terlihat:** Estimasi tarifDC0,31/AC0,28perkWh; operating cap0,05; energy cost0,10 atau0,08 secara conditional.

**Implikasi untuk Gen-Z:** Bedakan forecast dari actual tariff, cap dari actual cost, serta izin yang masih conditional. Nilai ini perlu field bertipe dan versioned economic model, bukan hanya rich text.

## Screenshot 30: Surya: Use of Funds daftar

![Screenshot 30: Surya: Use of Funds daftar](D:/Projekan/GenZ/docs/research/2026-10-17/screenshots/30-surya-use-of-funds.png)

**Yang terlihat:** Hardware62k,design25k,civil35k,labour20k,software8k terhadap target150k.

**Implikasi untuk Gen-Z:** Jumlahnya150k dan konsisten. Anggaran bukan bukti dana telah dipakai; bila Gen-Z menampilkan realisasi, bedakan planned, committed dan spent dengan sumber/evidence.

## Screenshot 31: Surya: Use of Funds chart

![Screenshot 31: Surya: Use of Funds chart](D:/Projekan/GenZ/docs/research/2026-10-17/screenshots/31-surya-funds-chart.png)

**Yang terlihat:** Persentase41%,17%,23%,13%,5%.

**Implikasi untuk Gen-Z:** Hasil pembulatan menjumlah99%; ini tidak otomatis berarti budget hilang. Tampilkan nominal sebagai sumber utama dan aturan rounding. Generated chart mengurangi perbedaan antara tabel, gambar dan total.

## Screenshot 32: Surya: Impact

![Screenshot 32: Surya: Impact](D:/Projekan/GenZ/docs/research/2026-10-17/screenshots/32-surya-impact.png)

**Yang terlihat:** Angka3.687mWh tertulis,28,7juta km,821tonCO2 dan ekuivalen pohon; basis historical+projection.

**Implikasi untuk Gen-Z:** Satuan energi case-sensitive: mWh berbeda dari MWh. Grid-powered charging tidak otomatis clean energy generated. Faktor emisi, alternative transport baseline, periode dan attribution perlu terlihat.

## Screenshot 33: Surya: Calculator & contoh sesi

![Screenshot 33: Surya: Calculator & contoh sesi](D:/Projekan/GenZ/docs/research/2026-10-17/screenshots/33-surya-calculator.png)

**Yang terlihat:** Input100 selama1tahun menampilkan43,25; contoh35kWh×0,31=10,85 dengan biaya3,50+1,75.

**Implikasi untuk Gen-Z:** 43,25% adalah hasil model ilustratif, berbeda dari realized yield12,27% sidebar. Contoh sesi memberi net5,60 dan share60%=3,36 sebelum komponen lain jika berlaku. Investment duration bukan janji bisa keluar pada waktu yang dipilih.

## Screenshot 34: Surya: Forecast5tahun

![Screenshot 34: Surya: Forecast5tahun](D:/Projekan/GenZ/docs/research/2026-10-17/screenshots/34-surya-forecast.png)

**Yang terlihat:** 737.300kWh/tahun; revenue216.500; operating costs36.865; energy costs73.730; net108.113; investor yield43,25%.

**Implikasi untuk Gen-Z:** 216.500−36.865−73.730=105.905, berbeda dari net yang ditampilkan. Asumsi campuran charger pada layar menghasilkan revenue218.708/tahun; dikurangi biaya menjadi108.113 dan investor60% terhadap150k≈43,25%. Jadi model internal konsisten dengan218.708, bukan sel revenue216.500. Tenor3tahun dan tabel5tahun juga memerlukan horizon yang jelas.

## Health per langkah

| Langkah | Bukti | Health informasi/visual |
|---|---|---|
| 1. Dashboard | SS1 | Struktur berguna; empty state dan definisi metrik perlu perhatian |
| 2. Portfolio | SS2 | Ringkasan/grafik/claim terkelompok; principal-income dan basis yield belum jelas dari screenshot |
| 3. Katalog | SS3 | Perbandingan cepat; unit dan beberapa lifecycle perlu dipisahkan |
| 4. FLP II | SS4–16 | Dokumen upfront dan disclosure menjadi pola kuat; basis angka dan lapisan terms perlu rekonsiliasi |
| 5. CRN | SS17–22 | Reporting insiden bernilai; stale overview dan nama calculator mengurangi kejelasan |
| 6. Surya | SS23–34 | Model biaya dan reporting berguna; rumus, horizon dan formatting memerlukan validasi |

Risiko aksesibilitas yang terlihat: teks sekunder pucat/kecil, inner scroll untuk panel panjang, diagram/grafik sebagai gambar, dan status berwarna. Rasio kontras, keyboard, ARIA, screen reader, touch target, mobile dan zoom **belum diverifikasi**. Gen-Z sebaiknya menyediakan status tekstual, alternatif tabel untuk chart, deep link tab, focus yang jelas dan scroll yang mudah dipahami. Temuan sumber PDF dirinci dalam FLP-II-DOCUMENT-REVIEW.md; temuan live/docs dalam dua memo riset situs.
