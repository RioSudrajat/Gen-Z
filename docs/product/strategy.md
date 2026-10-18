# Strategi dan hipotesis bisnis

**Status: arah founder dan hipotesis bisnis bertanggal.** Pricing, persona dan GTM usulan belum tervalidasi komersial. Scope implementasi tetap [PRD](../PRD.md); snapshot pasar ada di [riset](../research/README.md).

Sumber pemisahan: [dokumen asal](../archive/prd-2026-10-18.md). Dipisahkan 18 Oktober 2026; label [F]/[R]/[A]/[O]/[V] mengikuti [panduan](../CONTRIBUTING.md).

## Visi, misi, tujuan dan batas

**[F/R] Vision:** akses investasi yang bertanggung jawab untuk memperluas infrastruktur energi produktif Indonesia, lalu ASEAN.

**[R] Mission:** menyeleksi proyek, memperjelas hak ekonomi investor, menghubungkan pendanaan dengan penggunaan dana, serta memverifikasi kinerja aset dan distribusi kas.

| Horizon | Goal yang diusulkan | Bukti keberhasilan |
|---|---|---|
| MVP | Memvalidasi siklus proyek dan investasi end-to-end | UAT sukses, term sheet, data room, rekonsiliasi simulasi |
| Pilot live | Membuktikan hak dan pembayaran berjalan | Satu closing sah dan tiga siklus laporan/distribusi |
| Beta | Membuktikan proses dapat diulang | Beberapa proyek lolos, biaya layanan terukur, operator repeat |
| Scale | Memperluas aset secara terkendali | Kualitas portofolio dan ekonomi membaik tanpa subsidi token |

**Non-goals MVP:** dana/payout live, token sale/TGE native, functional rewards/points/redemption/reversal, konversi otomatis poin, swap, lending/borrowing, staking, secondary trading, transfer rutin, exit instan, bridging/multi-chain, portal operator self-service penuh, IoT wajib, fractionalization tanpa wrapper legal, aplikasi charger baru, pembangunan pembangkit besar/SMR dan klaim zero-emission otomatis.

Nama Gen-Z adalah identitas brand. Label “Zero Emission” tidak boleh menjadi klaim kinerja setiap aset. Charging dari grid dan baterai tidak otomatis bebas emisi; ukur asal energi, batas sistem, dan lifecycle sesuai metodologi yang disepakati.

## Pengguna dan persona

Persona berikut **[A] hipotesis segmen**, bukan hasil wawancara atau pengguna nyata.

**[F] Investor target global; belum ada calon anchor. Target produk individu dan institusi global; prioritas discovery baseline institutional/family-office yang eligible, qualified individual/HNWI kandidat sekunder.** Allowed jurisdictions mengikuti review; nama family office tidak otomatis menentukan qualification. Lokasi aset Indonesia tidak berarti semua investor harus resident Indonesia, dan global target tidak otomatis membuka subscription semua negara.

| Persona | Job to be done | Pain utama | Kebutuhan produk | Prioritas |
|---|---|---|---|---|
| Retail investor eligible | Mengalokasikan dana jangka menengah ke proyek yang dipahami | Sulit menilai risiko, bingung hak token dan exit | Ringkasan risiko, KYC, minimum ticket jelas, distribusi dan pajak | Beta setelah jalur retail disahkan |
| Institusi/family office | Mendapat eksposur aset dengan due diligence dan governance | Data tidak standar, enforcement, currency mismatch | Data room, KYB/UBO, covenants, reporting, ukuran ticket | Anchor pilot |
| Pemilik UMKM dengan surplus kas | Diversifikasi dana yang tidak dibutuhkan untuk modal kerja | Tenor tidak cocok, likuiditas, kapasitas menanggung rugi | Suitability dan cash planning; status badan usaha tidak otomatis qualified investor | Selektif, bukan sasaran massal |
| Pengguna layanan mitra | Mendapat manfaat dari layanan eligible dan reward yang dapat ditelusuri | Account linking sulit, poin tidak jelas, transaksi tidak terverifikasi | Wallet terverifikasi, account link, bukti layanan/pembayaran dari mitra, status poin dan dispute | Ekspansi reward ditunda; tidak wajib investor |
| Fleet operator | Menjamin energi tersedia untuk rute operasional | Ketidakpastian kapasitas dan biaya | Kontrak volume/SLA, laporan biaya per kendaraan, depot charging | Demand anchor untuk fase EV |
| Asset operator/developer | Membiayai ekspansi atau refinancing secara efisien | Biaya modal, kelengkapan dokumen, reporting | Intake proyek, checklist DD, milestone, akses investor | Supply anchor |

Investor, pengguna layanan mitra, dan operator adalah peran berbeda. Charging, swap, atau subscription AI merupakan kategori layanan sesuai fase, bukan pembatas persona reward. Satu pihak dapat memiliki beberapa peran, tetapi kepemilikan investasi tidak otomatis memberi hak mengubah settlement atau menyetujui data operasionalnya sendiri.

## Model bisnis dan sumber pendapatan

**[R] Gen-Z menghasilkan pendapatan dari jasa origination dan servicing, bukan dari kenaikan harga native token.** Semua fee berikut hipotesis pricing untuk divalidasi, bukan benchmark pasar.

**[F] Mandat founder:** pilih rancangan bisnis paling fit. **[R] Pilihan kerja PM:** managed marketplace untuk mitra penerbit, dengan pekerjaan origination/DD/closing dan servicing sepanjang tenor. Tarif, payer contract dan minimum deal size masih **[O]**. Alternatif operator SaaS/bring-your-own-anchor mengurangi kebutuhan acquisition investor bila operator membawa investor sendiri, tetapi value dan izin aktivitas tetap perlu diuji; dieksplorasi setelah workflow inti terbukti. Menjadi lender dari balance sheet atau pooled asset manager menambah kewajiban berbeda dan bukan arah default founder.

Benchmark resmi [Maple](https://docs.maple.finance/technical-resources/protocol-overview/fees) memisahkan origination/service/management fee; [Centrifuge](https://docs.centrifuge.io/user/manager/) memisahkan manager offering dari infrastructure platform. Fee [Ondo OUSG](https://ondo.finance/ousg) merupakan produk Treasury fund dan bukan patokan DD energi. Pola, cost model dan trade-off lengkap ada di memo chain/bisnis. Tidak ada angka pricing baru yang dianggap disetujui founder.

| Revenue | Payer/basis | Opsi harga awal [A] | Trade-off |
|---|---|---|---|
| Origination/arrangement | Operator/penerbit, successful closing; gross/net deployable funds transparan | Belum ditetapkan; quotation dan cap disepakati | Menutup pekerjaan closing; conflict incentive perlu kontrol |
| Servicing/reporting | Operator/penerbit; beban proyek disclosed; basis outstanding atau fixed minimum | Belum ditetapkan; minimum + scalable formula yang eksplisit | Recurring; jika ada amortisasi outstanding menurun, biaya monitoring tetap |
| Operator analytics | Operator, subscription layanan data | Belum ditetapkan | Tidak bergantung pada token; harus punya manfaat operasional |
| Performance fee | Sesuai kontrak atas excess return yang terdefinisi | Tunda MVP | Konflik dan kompleksitas perhitungan |
| On/off-ramp referral atau spread | Sesuai izin dan perjanjian mitra | Pass-through transparan dahulu | Hidden spread menurunkan trust; jangan merangkap aktivitas tanpa izin |

Contoh **[A]**: pool Rp2 miliar, origination 1,5% memberi Rp30 juta sekali; servicing 0,75% atas outstanding rata-rata Rp1,8 miliar memberi Rp13,5 juta/tahun. Ini **gross revenue**, belum biaya legal, engineer, KYC, custody, audit, support dan loss management. Satu pool kecil hampir pasti tidak cukup menjadi dasar proyeksi profit tanpa validasi biaya.

Contribution margin per proyek = collected fees − biaya pihak ketiga − alokasi servicing/support − incentive subsidy terkait. Tetapkan minimum deal size dari biaya ini, bukan demi jumlah proyek. Origination fee diungkap sebagai use of proceeds bila dibayar dari dana penggalangan; investor harus tahu berapa yang benar-benar menjadi aset produktif.

**[R] Stress-test fee:** bila offering memakai principal/amortisasi, outstanding principal berkurang selama amortisasi; recurring fee berbasis outstanding bisa tidak menutup fixed monitoring costs. Uji minimum servicing yang transparan dan terjangkau proyek, quotation DD/legal/custody serta willingness-to-pay operator. Pisahkan biaya platform sekali, biaya per closing, biaya selama tenor dan run-off/default servicing. Grant, prize, project principal dan marketing budget bukan recurring platform revenue.

**[R] Struktur komersial best-fit:** prescreen dibatasi; vendor DD hanya setelah budget tertulis disetujui mitra, dengan penggunaan/cancellation/refund deposit jelas; origination saat successful closing; servicing minimum transparan dan continuity budget selama tenor. Pembayaran DD tidak menjamin proyek lolos. Fee priority, reserve, shortfall/default costs dan kewajiban platform memerlukan kontrak; angka ilustrasi di atas bukan tarif. Operator SaaS merupakan opsi ekspansi setelah workflow terbukti. Rancangan lengkap ada di bagian 8 memo chain/bisnis.

Mitigasi konflik: investment committee terpisah dari sales incentive, disclosure pihak terkait, tidak menurunkan DD karena sponsor membayar fee, dan tidak memasarkan token native sebagai sumber pembiayaan permanen biaya operasi.

## Strategi go-to-market

### Wedge pilot

**[F] Mulai dari infrastruktur energi operasional milik mitra dengan kontrak monetisasi dan histori collection**, mendukung renewable energy dan dapat melayani AI/compute, PLN atau pelanggan lain. **[R] Kandidat awal:** solar ber-PPA atau storage/energy service berkontrak dengan bukti kas. Teknologi dan lokasi final mengikuti kualitas proyek; greenfield ditunda sesuai keputusan founder.

Proposisi mitra aset: pembiayaan proyek dengan pelaporan terstruktur. Proposisi anchor investor: hak revenue share yang dapat diunderwrite dan dimonitor. Program pengguna layanan mitra memakai poin usage-first sebagai perluasan; bukti account-link dan pembayaran harus tersedia sebelum aktivasi.

### Urutan peluncuran

1. Discovery: wawancara usulan 5 mitra/operator energi, calon off-taker dan 5 calon anchor investor; minta data dan willingness to pay, bukan hanya minat verbal.
2. Design partner: pilih satu operator dan satu calon partner regulated rail; dapatkan akses dataset dan indikasi terms tanpa menganggap LOI sebagai PPA bankable.
3. Closed demo: wallet login sejak workspace pertama, satu solar hybrid sintetis, quote/settlement/portfolio/report/funded claim dan failure cases; testnet/test funds hanya setelah engineering review.
4. Controlled live pilot: investor eligible, cap sesuai struktur legal, exposure terkendali, satu proyek, komunikasi berkala.
5. Beta: ulang proses dengan operator/proyek kedua; uji apakah kualitas tetap sama dan biaya turun.
6. Scale melalui SCF sesuai pilihan founder, setelah kesesuaian instrumen terpilih dan izin diverifikasi; ekspansi aset ASEAN dan country access investor mengikuti jalur hukum masing-masing.

Akuisisi awal melalui operator, fleet, asosiasi industri dan jaringan investor institusional. Konten edukasi menunjukkan data proyek dan downside, bukan APY tertinggi atau iming-iming airdrop. Investor referral hanya setelah aturan pemasaran dan insentif diperiksa.

**GTM stop criteria [R]:** tidak ada akses collection data, proyek hanya layak dengan token subsidy, biaya hukum melebihi willingness to pay, atau tidak ada jalur legal yang realistis. Hentikan fundraising dan lanjutkan sebagai layanan data/servicing bila manfaat B2B terbukti.
