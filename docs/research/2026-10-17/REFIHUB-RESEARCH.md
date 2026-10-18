# Riset primer ReFi Hub untuk Gen-Z

Tanggal observasi: **17 Oktober 2026, Asia/Jakarta**. Status: riset pembanding, bukan keputusan final produk atau pendapat hukum. Riset ini menilai klaim yang tersedia di situs dan dokumen primer; tidak memvalidasi registrasi perusahaan, enforceability jaminan, identitas operator, kelengkapan insurance, kode smart contract, atau keberhasilan transaksi.

## 1. Coverage dan batas bukti

- Diambil melalui HTTP publik: landing, index blog, **22 artikel yang seluruhnya terlihat di index blog**, **21 halaman isi GitBook** yang tercantum pada `llms.txt`, index GitBook, serta respons HTML app publik. Arsip HTML dan text tersedia di `refihub-evidence/`; `manifest.json` mencatat 68 request sukses termasuk duplikasi HTML/Markdown.
- Seluruh body 22 artikel dibaca; sebagian header/footer berulang dibuang untuk pemahaman. Seluruh halaman GitBook diambil; halaman substantif mekanisme, istilah, terms, privacy, fees, reporting dan default ditelaah. Publikasi yang tidak ditautkan index tersebut atau arsip lama di luar situs sekarang tidak dianggap tercakup.
- Tiga kontrak publik tambahan diambil dari link GitBook: Surya (23 halaman), CRN (34 halaman), FLP Series 1 (27 halaman). Review **selektif klausul ekonomi, hak, transfer, expiry, reporting dan refund**, bukan audit hukum seluruh klausul. Enam PDF FLP II dari pengguna ditangani laporan worker PDF terpisah.
- App HTTP awal mengembalikan shell JavaScript, sehingga bukan bukti UI kosong. **Root agent telah mengonfirmasi lewat browser anonim** bahwa `/energy-assets` dan `/investments/9` terbuka, dengan tombol Log In/Sign Up; kelima tab FLP II dan keenam link dokumen S3 dapat dilihat tanpa login. Bukti browser disimpan oleh root. Dashboard/portfolio pengguna ditinjau dari screenshot yang diberikan pengguna, bukan sesi transaksi yang dijalankan peneliti ini.
- Tidak ada wallet connect, KYC, tanda tangan, investasi, claim, atau transaksi P2P yang dilakukan. Tidak ada akses backend/admin/CMS. Tampilan tidak membuktikan mekanisme penyuntingan konten internal.
- `resources.refihub.io` gagal di web fetch (502); artikel yang bersangkutan tersedia dan dibaca di `www.refihub.io/blog/...`. GitBook `llms.txt` gagal melalui web tool tetapi sukses melalui HTTP langsung. Ini keterbatasan kanal akses, bukan bukti situs tak tersedia bagi semua orang.

## 2. Temuan inti mekanisme

ReFi Hub memakai aset tertentu, operator tertentu, dan perjanjian tertentu sebagai unit investasi. Token menjadi catatan hak pembayaran yang dapat dihitung serta disalurkan melalui blockchain. Infrastruktur tetap dimiliki/dioperasikan dan menghasilkan kas di dunia nyata. **Dana pembayaran harus benar-benar diterima smart contract lebih dahulu**; smart contract tidak membuat pendapatan dan tidak menarik otomatis piutang fiat dari offtaker. Alur: meter/usage -> tagihan -> penerimaan kas operator -> konversi/penyetoran USDC -> pemisahan fee dan entitlement -> saldo claimable -> transaksi claim investor. [How Solar Assets Generate Revenue](https://www.refihub.io/blog/how-solar-assets-generate-revenue-for-investors), [Technology & Settlement](https://refihub.gitbook.io/refi-hub/how-refi-hub-works/technology-and-settlement).

Menurut istilah dan T&C sekarang, issuer/obligor adalah **Recipient/operator proyek**; token bukan equity, hak voting, hak governance atau kepemilikan perusahaan. Definisi token adalah contractual yield participation rights. FAQ FLP II secara khusus juga menyatakan tidak memberikan kepemilikan aset solar. Ini harus dibedakan dari bahasa lama “own a piece” dan FAQ DeCharge yang menyebut partial ownership. Tidak aman menyamakan semua FIT sebagai sertifikat kepemilikan panel/charger. Kepanjangan FIT juga bervariasi antarartikel: Fractional Investment, Fractionalized Investment, Fractional Infrastructure Tokens. [Terminology](https://refihub.gitbook.io/refi-hub/additional/terminology), [FLP II FAQ](https://www.refihub.io/blog/investor-faq-flp-ii-solar-installation), [DeCharge FAQ](https://www.refihub.io/blog/decharge-project-surya-faqs).

**Native token dan asset token tidak sama.** Materi ReFi Hub yang dibaca tidak menunjukkan kewajiban membeli token native agar dapat memperoleh hak pembayaran proyek. Kontrak Surya §3.20 justru menyatakan SURYA bukan native token perusahaan. Gen-Z perlu memisahkan asset participation token, reward points, dan native ecosystem token dalam model domain dan penjelasan pengguna.

## 3. Funding, settlement, fee, claim, custody

Dokumentasi menentukan soft cap sebagai minimum keberhasilan round; jika gagal, kontribusi dikembalikan. Kontrak lama yang diperiksa merinci refund dengan burn token dan claim nilai pembelian, dikurangi biaya transaksi blockchain. Hard cap adalah target maksimum round; price, supply, closing date, minimum dan first payment merupakan parameter masing-masing round. Jadi “ticket size $100,000” pada kartu proyek perlu diartikan dengan hati-hati: contoh kontrak memiliki pembelian per token $1, bukan minimum per investor $100,000. [Terminology](https://refihub.gitbook.io/refi-hub/additional/terminology), kontrak pembanding di bagian 5.

Fee saat ini dideskripsikan sebagai **3% total raise yang ditagihkan kepada operator ketika round sukses**, serta servicing fee dari tiap Aggregate Payment dengan rate yang ditentukan dalam perjanjian deal. Fee servicing tetap mengurangi distribusi yang sampai ke investor secara ekonomi walaupun terms mengatakan tidak ada fee langsung berbasis performance/ad valorem yang ditagihkan kepada holder. Jangan terjemahkan menjadi “investasi tanpa fee”. [Fees](https://refihub.gitbook.io/refi-hub/how-refi-hub-works/fees-on-refi-hub).

T&C 13 Maret 2026 mendeskripsikan platform non-custodial: dana bergerak antara wallet dan Recipient-controlled smart contract. Urutan claim: Portfolio -> lihat claimable -> Claim -> approve transaksi -> wallet. Kompatibilitas Solana diperlukan; USDC/settlement stablecoin bukan bukti stabilitas harga dijamin. **“Distribusi otomatis” berarti alokasi setelah dana masuk, bukan pembayaran fiat operator selalu terjamin atau investor tak perlu claim.** [T&C §4, §7](https://refihub.gitbook.io/refi-hub/legal/terms-and-conditions).

Ini adalah deskripsi kontraktual, belum dibuktikan dengan inspeksi authority, signer, upgrade authority, custody atau source code. Beberapa kontrak lama menyebut perusahaan proyek sebagai custodian dana yang telah dihimpun. Itu berbeda dari mengatakan platform menyimpan dana, dan berbeda pula dari mengatakan aset/fund selalu berada dalam escrow sampai tenor habis.

## 4. Global access dan eligibility

Public discovery berbeda dari transaction eligibility. Halaman listing dan dokumen FLP II terbuka publik menurut pemeriksaan root. Namun T&C saat ini meminta umur minimal 18, KYC/KYB dan tidak masuk kategori terlarang; US Persons, Singapore, Panama, Ontario/Quebec dan daftar yurisdiksi lain dibatasi. Terms juga memiliki larangan berbasis kebutuhan izin lokal. Ini menunjukkan model **distribusi publik dengan pemeriksaan kelayakan transaksi**, bukan platform bebas pembatasan hanya karena URL-nya publik. Daftar ini adalah kebijakan ReFi Hub, bukan aturan otomatis yang harus ditiru Gen-Z. [T&C §3](https://refihub.gitbook.io/refi-hub/legal/terms-and-conditions).

Blog KYC 18 Juni 2025 menyebut Blockpass, dokumen ID, selfie/liveness, alamat bila diminta, screening sanctions/PEP dan perkiraan mayoritas approval 24 jam. Privacy 13 Maret 2026 menyebut **Synaps** sebagai provider. Vendor aktif tidak dapat ditentukan hanya dari dua publikasi berbeda tanggal itu. Rancangan Gen-Z sebaiknya membuat provider sebagai konfigurasi dan menyimpan status/verifikasi, bukan mengunci copy pada vendor yang belum dipilih. [KYC](https://www.refihub.io/blog/kyc-on-refi-hub), [Privacy](https://refihub.gitbook.io/refi-hub/legal/privacy-policy).

## 5. Mengapa tiga proyek berbeda secara substansi

| Aspek | FLP Series 1 | FLP II | Surya / DeCharge | CRN / Tab Energia |
|---|---|---|---|---|
| Fisik | Rooftop solar Singapore, bagian dari plant 267.85 kWp | Plant sama; round membiayai 111.69 kWp | EV charging Bangalore/corridor India | Solar Brazil |
| Raise yang disebut | $59,000 | $100,000 | $150,000 | $100,000 |
| Pendapatan | PPA dan REC | PPA dan REC | Pembayaran sesi charging | Penjualan listrik melalui struktur lokal |
| Basis pembayaran | Kontrak §3.12–3.13: hak atas Net Revenue | Fixed component + variable 35% gross revenue, revenue support menurut FAQ | §3.6: 60% Net Profit setelah actual electricity, OPEX $0.05/kWh, applicable taxes; operator 30%, platform 10% | §3.6: 33.33% net profits setelah operating expenses dan 15% management fee pada full subscription |
| Alokasi FLP I spesifik | Investor 20% seluruh Project Net Revenue, platform 2.5%, operator 77.5% pada full raise | Jangan salin rumus FLP I ke sini | Basisnya net, berbeda dengan FLP II gross | Memerlukan periode generation/recognition/payment yang bisa berbeda |
| Tenor yang tertulis | Kontrak sampai30Aug2049 | FAQ sekitar9tahun; Apr 2026–2035 | FAQ 3–5 tahun; kontrak §3.8 ambigu, lihat bawah | Kontrak end 20 Jul 2054 dan klausa30tahun; UI pengguna 2055 |
| Telemetri | Monitoring eksternal, direct API masih dikembangkan menurut FAQ 2025 | API atau documented reporting sesuai FAQ 2026 | Hardware/backend tersedia, investor API masih ditingkatkan menurut laporan Feb 2026 | Laporan dan perubahan lifecycle/pembayaran dalam screenshot |

Sumber: [FLP I FAQ](https://www.refihub.io/blog/flp-solar-project-faqs), [FLP II FAQ](https://www.refihub.io/blog/investor-faq-flp-ii-solar-installation), [Surya FAQ](https://www.refihub.io/blog/decharge-project-surya-faqs), [CRN baseline](https://www.refihub.io/blog/crn-build-and-cashflow-update); kontrak publik berikut:

- [FLP I TSA](https://refihub-public-resources.s3.eu-central-1.amazonaws.com/PivotGreen/FLP/FLP%2BToken%2BSale%2BAgreement.pdf), khusus p12–14, §3.10–3.18. Harga 1 USDC, supply 59,000, soft cap 29,500. API atau verifiable CSV dan bukti kWh/invoices/revenue diminta oleh platform; reporting bukan bukti live stream universal.
- [Surya TSA](https://refihub-public-resources.s3.eu-central-1.amazonaws.com/DeCharge/SURYA+Token+Sale+Agreement.pdf), khusus p7–11, §3.1–3.21. Harga 1 USDC, supply 150,000, soft cap 149,000. §3.6 meminta API/dashboard penggunaan charger dan bukti biaya listrik. §3.8 memuat “both conditions” berhentinya revenue dan 36 bulan, tetapi juga automatic termination saat 36 bulan, disertai Minimum Payback Guarantee 1.5x serta kewajiban repair atau shortfall payment dalam keadaan yang disebut. **Ambiguitas internal perlu review kontrak; jangan jadikan janji 1.5x/tenor otomatis Gen-Z.** §3.17 non-transferable. “Guarantee” adalah kewajiban pihak kontrak, bukan bukti mampu bayar atau jaminan platform.
- [CRN TSA](https://refihub-public-resources.s3.eu-central-1.amazonaws.com/CRN+Token+Sale+%26+Investment+Agreement.pdf), khusus p10–13, §3.1–3.17. Harga 1 USDC, supply 100,000, soft cap 75,000. §3.1 menyebut Solana **dan Moonbeam**; ini bukti versi historis, bukan alasan menyimpulkan app saat ini multi-chain. §3.17 memungkinkan transfer dengan pemenuhan KYC transferee; berbeda dari Surya/FLP I non-transferable. §5.1 menyatakan investor tidak memiliki environmental attributes; pendapatan REC/impact claim harus dipisahkan.

Model data Gen-Z perlu memisahkan **physical asset**, **operator**, **funding offering/series**, **token mint/participation record**, **cashflow model**, dan **reporting period**. Satu aset dapat memiliki beberapa series dengan economic rights yang berbeda. Kapasitas seluruh plant tidak sama dengan kapasitas yang dibiayai suatu series; investor share harus punya denominator yang dinyatakan.

## 6. Laporan operasi: pelajaran penting

CRN membuktikan bahwa pembayaran investor tidak selalu berarti listrik sudah dijual. Update 13 Agustus 2025 menyebut hambatan akses lahan, hujan dan batu bawah tanah, serta penundaan sekitar delapan minggu. Pada 29 Januari 2026, konstruksi disebut selesai dan tersambung grid, tetapi pembangkitan komersial belum dimulai. Enam pembayaran senilai $5,644.80 berasal dari pembayaran interim fase pengembangan. Screenshot pengguna yang lebih kemudian menunjukkan masalah relay, keterlambatan penerimaan kas dan transisi pengelolaan. Status harus memiliki tanggal dan dapat berubah. [Konstruksi CRN](https://www.refihub.io/blog/crn-solar-construction-update), [Baseline CRN](https://www.refihub.io/blog/crn-build-and-cashflow-update).

Surya juga menunjukkan perbedaan rencana dan realisasi. Update 3 Desember 2025 membedakan lokasi live, partial, commissioning dan planned. Update 21 Januari 2026 menyebut 21 charger terpasang: 15 × 7.4 kW AC, 2 × 60 kW DC dan 4 × 30 kW DC, berbeda dengan rencana awal 19. Laporan 23 Februari 2026 mencatat revenue $5,440, cost $2,315, net $3,125, serta alokasi investor $1,875, operator $937 dan platform $313 untuk 20,245 kWh. Namun angka unit economics dalam teks tidak konsisten: selling $0.269/kWh dikurangi cost $0.172/kWh adalah $0.097/kWh, sementara teks menyebut net $0.154/kWh; aggregate cost $2,315 / 20,245 kWh juga sekitar $0.1144/kWh. Gen-Z membutuhkan pemeriksaan rekonsiliasi sebelum publikasi. [Rollout Surya](https://www.refihub.io/blog/project-surya-update), [Januari](https://www.refihub.io/blog/project-surya-january-2026-investor-update), [Februari](https://www.refihub.io/blog/project-surya-second-month-operating-distribution-report).

FLP I baseline 29 Januari 2026 menyebut capital $59,000, cash $1,985.90 dari tiga pembayaran tanpa pembayaran terlewat. Itu snapshot historis awal, bukan kondisi 17 Oktober 2026. [FLP I baseline](https://www.refihub.io/blog/flp-pivot-green-solar-initial-asset-performance-summary).

VOX Month 2 memisahkan top-up kontraktual operator dari revenue operasional. Pengurangan $100 merupakan recovery advance bertahap. Update Desember memisahkan lokasi dengan penggunaan meningkat, kerusakan charger, visibilitas rendah dan usulan relokasi. Sumber distribusi Gen-Z perlu membedakan operating revenue, operator support, advance, adjustment dan collateral recovery. [VOX Month 2](https://www.refihub.io/blog/investor-update-month-2-performance-of-vox-ev-charging), [Operasi Desember](https://www.refihub.io/blog/ev-infrastructure-brazil-december-operational-update).

Exodos annual review menyebut 12 pembayaran tanpa terlewat, cash $4,237 atas capital $32,500 dan produksi 79.8 MWh selama 2025. Artikel memberi label sekitar 13.5% realized IRR. Memverifikasi metrik itu memerlukan seluruh cashflow bertanggal, bukan membagi cash tahunan dengan capital lalu menamainya IRR. [Exodos annual review](https://www.refihub.io/blog/exodos-ipe-annual-asset-performance-review).

## 7. Ketidakselarasan sumber yang harus dihindari Gen-Z

| Ketidakselarasan teramati | Implikasi Gen-Z |
|---|---|
| Landing saat riset: 20.6% Avg Annualised IRR; FLP II FAQ: cash yield 21.5% dan projected IRR 15.9%; screenshot: Avg Yield 21.4% | Simpan nama metrik, periode, sumber, actual/forecast, formula dan basis sebelum/sesudah fee. Yield, APY dan IRR bukan sinonim. |
| FAQ FLP II menyebut April 2026–Maret 2035 di satu jawaban, sampai April 2035 di jawaban lain | Kalender berasal dari start date, end date dan jumlah pembayaran terstruktur. |
| Investor Guide Februari mengatakan non-transferable; T&C 13 Maret menjelaskan P2P untuk pengguna KYC; screenshot mengatakan marketplace direncanakan | Model capability dan versi kontrak per offering. Terms yang mendeskripsikan fitur tidak membuktikan fitur sudah aktif di UI. |
| FLP II menyatakan hak kontraktual, FAQ DeCharge lama menyebut partial ownership | Hak investor harus merujuk klausul dan versi perjanjian yang berlaku. |
| Blog KYC menyebut Blockpass, Privacy menyebut Synaps | Provider dan versi kebijakan harus konsisten. |
| Landing/DD mengklaim independent verification; T&C §7 mengatakan informasi Recipient belum independently verified | Nyatakan apa yang direview, siapa yang mereview, kapan, bukti dan batasnya. |
| Blog perlindungan menyebut 15 business days grace; GitBook deviations memakai 5 hari grace, 30 hari first default, lalu 60 hari cure | Ambil aturan dari perjanjian spesifik, bukan satu artikel bantuan global. |
| CRN end date 2054 di kontrak versus 2055 pada UI, dan status berbeda antarperiode | Diperlukan versi, material-change review, serta penanda informasi terlambat. Tidak menyimpulkan pelanggaran tanpa memeriksa amendment. |

[Understanding Returns](https://www.refihub.io/blog/understanding-returns-and-irr) mengatakan IRR tidak menambahkan asumsi reinvestment di luar cashflow, sementara FAQ FLP II menjelaskan IRR dengan asumsi reinvestment. Rekomendasi Gen-Z: hitung IRR/XIRR dari cashflow bertanggal dan sajikan asumsi reinvestasi/MIRR secara terpisah. Ini pelajaran penyajian informasi, bukan pengesahan angka benchmark.

## 8. IoT sebagai pembeda

Bukti yang ditemukan tidak mendukung klaim bahwa seluruh ReFi Hub belum memakai IoT. Meter, backend operator dan API/dashboard sudah disebut dalam FAQ/kontrak. Laporan Surya Februari 2026 mengatakan akses real-time investor sedang ditingkatkan. Screenshot Juli 2026 dari pengguna menyebut preview live feed untuk sebagian charger dan biaya listrik direkonsiliasi bulanan. Pembeda Gen-Z sebaiknya berupa kualitas, cakupan, keterlacakan dan ketepatan waktu data, dengan status integrasi yang jujur.

Tahap yang diusulkan: laporan manual yang direview, API operator read-only, lalu integrasi meter/gateway jika tersedia. Setiap metrik mempunyai observed_at, received_at, published_at, timezone, unit, asset/device/source ID, interval agregasi, quality flag dan coverage. Status mencakup live, delayed, stale, offline, partial dan not connected. Sumber dapat manual, imported atau sensor reported, dengan status rekonsiliasi terpisah. Telemetri read-only tidak mengharuskan remote control perangkat.

Pisahkan empat lapisan: pengukuran operasional, tagihan, kas diterima dan distribusi on-chain. kWh meter tidak membuktikan invoice telah dibayar; transaksi payout tidak membuktikan energi asalnya telah diverifikasi. Gunakan ledger rekonsiliasi dan tautan sumber lintaslapisan. Raw stream dapat disimpan off-chain; hash, attestation atau referensi settlement dapat dicatat on-chain jika diperlukan, tanpa membocorkan device secrets atau PII. Ini rekomendasi Gen-Z berdasarkan temuan, bukan deskripsi backend ReFi Hub.

## 9. Dua keluarga tab dan konten yang bervariasi

Screenshot memperlihatkan dua keluarga tab. Artikel FLP II 10 Maret 2026 memang merujuk Performance dan Documents. FLP II memakai Deal Terms, Performance, Risks, Asset & Operator dan Documents; CRN/Surya memakai Reports, Overview, Details, Impact dan Calculate Your Returns. Ini mendukung adanya dua template. Belum ada bukti tanggal migrasi, changelog, atau keputusan bahwa seluruh proyek harus mengikuti format FLP II.

Usulan untuk dibahas root: Overview; Asset & Operator; Deal Terms; Performance & Data; Reports & Updates; Risks; Documents. Energy, Financial dan IoT dapat menjadi subview Performance & Data. Impact dapat berada di Overview/Performance dengan metode dan hak REC yang jelas. Calculator dapat berada di Deal Terms/Performance. Mobile perlu section selector atau anchor navigation agar tidak memaksa tujuh tab sempit. Ini rekomendasi Gen-Z.

Variasi isi tidak membuktikan ReFi Hub memakai Markdown. Rich-text CMS/block editor, JSON content blocks, custom React per proyek dan HTML/Markdown bersanitasi sama-sama mungkin. Tanpa admin/source, implementasi internal tidak diketahui.

Untuk Gen-Z, gunakan gabungan structured fields dan approved blocks. Angka, hak, fee, tanggal dan status memakai field bertipe. Narasi, gambar, tabel, diagram dan lampiran berupa blok berurutan dan berversi. Chart, calculator dan IoT mengambil data terstruktur. Admin dapat memilih Add Section, Image, Diagram atau Document, kemudian preview dan submit untuk review. Fakta wajib tidak dapat dihilangkan lewat narasi. PDF menjadi Document entity dengan type, version, effective/expiry date, source, review status, public/redacted/restricted visibility, checksum serta relasi offering. Upload arbitrary MDX/JavaScript tidak diperlukan.

## 10. Manifest sumber

Tanggal berikut adalah metadata publik yang dibaca pada 17 Oktober 2026. Tanggal publikasi tidak membuktikan isi belum pernah diperbarui. Semua URL dan nama berkas arsip terdapat dalam refihub-evidence/manifest.json; status seluruh 68 request arsip adalah 200. Tiga kontrak tambahan dicatat dalam contracts-manifest.json.

| Tanggal publikasi | Artikel yang dibaca |
|---|---|
| Jan 29, 2026 | [Crn Build And Cashflow Update](https://www.refihub.io/blog/crn-build-and-cashflow-update) |
| Aug 13, 2025 | [Crn Solar Construction Update](https://www.refihub.io/blog/crn-solar-construction-update) |
| Sep 2, 2025 | [Decharge Project Surya Faqs](https://www.refihub.io/blog/decharge-project-surya-faqs) |
| Aug 1, 2025 | [Ev Charging Us Risk Opportunity In A Shifting Market](https://www.refihub.io/blog/ev-charging-us-risk-opportunity-in-a-shifting-market) |
| Jan 21, 2026 | [Ev Infrastructure Brazil December Operational Update](https://www.refihub.io/blog/ev-infrastructure-brazil-december-operational-update) |
| Dec 31, 2025 | [Exodos Ipe Annual Asset Performance Review](https://www.refihub.io/blog/exodos-ipe-annual-asset-performance-review) |
| Jan 29, 2026 | [Flp Pivot Green Solar Initial Asset Performance Summary](https://www.refihub.io/blog/flp-pivot-green-solar-initial-asset-performance-summary) |
| Oct 13, 2025 | [Flp Solar Project Faqs](https://www.refihub.io/blog/flp-solar-project-faqs) |
| Feb 5, 2026 | [How Investors Are Protected](https://www.refihub.io/blog/how-investors-are-protected) |
| Feb 5, 2026 | [How Solar Assets Generate Revenue For Investors](https://www.refihub.io/blog/how-solar-assets-generate-revenue-for-investors) |
| Mar 10, 2026 | [Investor Faq Flp Ii Solar Installation](https://www.refihub.io/blog/investor-faq-flp-ii-solar-installation) |
| Feb 5, 2026 | [Investor Guide](https://www.refihub.io/blog/investor-guide) |
| Nov 6, 2025 | [Investor Update Month 2 Performance Of Vox Ev Charging](https://www.refihub.io/blog/investor-update-month-2-performance-of-vox-ev-charging) |
| Jun 18, 2025 | [Kyc On Refi Hub](https://www.refihub.io/blog/kyc-on-refi-hub) |
| Jul 30, 2025 | [Own A Piece Of An Ev Charging Network Without Laying A Single Cable](https://www.refihub.io/blog/own-a-piece-of-an-ev-charging-network-without-laying-a-single-cable) |
| Jan 21, 2026 | [Project Surya January 2026 Investor Update](https://www.refihub.io/blog/project-surya-january-2026-investor-update) |
| Feb 23, 2026 | [Project Surya Second Month Operating Distribution Report](https://www.refihub.io/blog/project-surya-second-month-operating-distribution-report) |
| Dec 3, 2025 | [Project Surya Update](https://www.refihub.io/blog/project-surya-update) |
| Feb 10, 2026 | [Rebusiness Due Diligence Framework](https://www.refihub.io/blog/rebusiness-due-diligence-framework) |
| Dec 1, 2025 | [Regenerate Before You Accelerate Solana Breakpoint 2025](https://www.refihub.io/blog/regenerate-before-you-accelerate-solana-breakpoint-2025) |
| Oct 20, 2025 | [Singapores Solar Projects Earn More With Recs How To Benefit With Refi Hub](https://www.refihub.io/blog/singapores-solar-projects-earn-more-with-recs-how-to-benefit-with-refi-hub) |
| Feb 5, 2026 | [Understanding Returns And Irr](https://www.refihub.io/blog/understanding-returns-and-irr) |

GitBook: 21 halaman isi dari [index dokumentasi](https://refihub.gitbook.io/refi-hub/llms.txt):

- [Infrastructure-backed cashflow](https://refihub.gitbook.io/refi-hub/refi-hub/infrastructure-backed-cashflow.md)
- [What ReFi Hub does](https://refihub.gitbook.io/refi-hub/how-refi-hub-works/what-refi-hub-does.md)
- [Where returns come from](https://refihub.gitbook.io/refi-hub/how-refi-hub-works/where-returns-come-from.md)
- [How cashflow is defined](https://refihub.gitbook.io/refi-hub/how-refi-hub-works/how-cashflow-is-defined.md)
- [Who is ReFi Hub is for](https://refihub.gitbook.io/refi-hub/how-refi-hub-works/who-is-refi-hub-is-for.md)
- [Asset Selection & Due Diligence](https://refihub.gitbook.io/refi-hub/how-refi-hub-works/asset-selection-and-due-diligence.md)
- [Geographical Focus](https://refihub.gitbook.io/refi-hub/how-refi-hub-works/geographical-focus.md)
- [Contracts & Distribution Mechanics](https://refihub.gitbook.io/refi-hub/how-refi-hub-works/contracts-and-distribution-mechanics.md)
- [Risk & Variability](https://refihub.gitbook.io/refi-hub/how-refi-hub-works/risk-and-variability.md)
- [Performance Deviations](https://refihub.gitbook.io/refi-hub/how-refi-hub-works/performance-deviations.md): What happens if asset performance falls short?
- [Transparency & Reporting](https://refihub.gitbook.io/refi-hub/how-refi-hub-works/transparency-and-reporting.md)
- [Technology & Settlement](https://refihub.gitbook.io/refi-hub/how-refi-hub-works/technology-and-settlement.md)
- [Fees on ReFi Hub](https://refihub.gitbook.io/refi-hub/how-refi-hub-works/fees-on-refi-hub.md)
- [Why ReFi Hub Exists](https://refihub.gitbook.io/refi-hub/how-refi-hub-works/why-refi-hub-exists.md)
- [ReFi Hub in one sentence](https://refihub.gitbook.io/refi-hub/how-refi-hub-works/refi-hub-in-one-sentence.md)
- [User Impact & SDG alignment](https://refihub.gitbook.io/refi-hub/environmental-impact/user-impact-and-sdg-alignment.md)
- [Terms & Conditions](https://refihub.gitbook.io/refi-hub/legal/terms-and-conditions.md)
- [Privacy Policy](https://refihub.gitbook.io/refi-hub/legal/privacy-policy.md)
- [Contracts with listed business](https://refihub.gitbook.io/refi-hub/legal/contracts-with-listed-business.md)
- [Terminology](https://refihub.gitbook.io/refi-hub/additional/terminology.md)
- [Key Resources & Links](https://refihub.gitbook.io/refi-hub/additional/key-resources-and-links.md)

Belum diverifikasi: actual program/mint addresses, audit smart contract, autentikasi oracle/perangkat, source platform, admin CMS, transaksi settlement, ketersediaan P2P live, amendment terhadap kontrak lama, REC registry/retirement/ownership dan status insurance terkini. Pernyataan publik tidak menggantikan bukti tersebut.
