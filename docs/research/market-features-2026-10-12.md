# Gen-Z: riset market sizing, wallet, dua stablecoin dan fitur benchmark

> **Status arsip, diperjelas 18 Oktober 2026:** isi berikut menyimpan riset/jawaban pada tanggal asal. Acuan implementasi aktif ialah [spec v1.1-base](../archive/mvp-spec-2026-10-18.md), [PRD v2.1](../archive/prd-2026-10-18.md) dan [riset Base/EVM 18 Oktober](base-evm-2026-10-18.md). Founder memilih Base kembali pada 18 Oktober; pilihan itu tidak memulihkan mock wallet D0, katalog privat tanpa login, note wajib atau simulated rewards. Scope aktif: proof wallet sejak demo pertama, model per offering/solar hybrid, tujuh tab, funded claim dan rewards informational. Angka/vendor/standar/terms historis di bawah bukan keputusan produksi baru.

**As-of:** 12 Oktober 2026. **Status:** bahan keputusan PRD pre-pilot. [F] keputusan founder; [V] fakta primer dengan scope/tahun; [R] rekomendasi PM; [A] asumsi/model, bukan traction; [O] terbuka. Pendamping [PRD](../archive/prd-2026-10-18.md) dan [schema/MVP/flows](../archive/schema-flows-2026-10-18.md).

## 1. Koreksi founder yang sudah pasti

- Persona reward adalah **pengguna layanan mitra**, lintas charging/swap/layanan lain eligible; AI subscription tetap ekspansi. Akun dan wallet terverifikasi, layanan selesai, final payment dari mitra dan attribution akun wajib. Tidak harus berinvestasi/staking.
- Existing wallet tetap, chain **Base tetap**; daftar wallet perlu spesifik dan diverifikasi.
- Dua pilihan input investasi: stablecoin lokal asal proyek dan stablecoin USD. Untuk Indonesia: **IDRX + native USDC [F]**, setelah jawaban GUI menerima rekomendasi quoted conversion. USDC/USDT disebut founder sebagai alternatif USD; bukan mandat menerima setiap token bersimbol USD di Base.
- Requirement ini menggantikan batas lama IDRX-only. Hak IDR untuk kas IDR tetap; quoted conversion ke hak IDR dan interactive core + simulated partner telah dipilih; payout/provider/FX refund terms tetap terbuka. Gunakan **Invest / Subscription Investasi**, karena membeli project note berbeda dari staking keamanan jaringan.

## 2. TAM / SAM / SOM: definisi dahulu

| Ukuran [R] | Definisi / horizon |
|---|---|
| TAM capital | Net kebutuhan financing/refinancing **12 bulan** aset energi operasional pihak ketiga di Indonesia, renewable-supporting dan monetisasi berkontrak dalam ruang produk. Bukan seluruh asset value atau capex nasional |
| SAM capital | Bagian TAM yang bisa dilayani setelah filter ukuran/teknologi, collection/underwriting, issuer/legal, currency/rail, tenor/seniority dan eligible investor |
| SOM capital | Dana benar-benar closed/disalurkan dalam **12 bulan yang ditentukan**, dibatasi asset pipeline, committed eligible anchor capital dan kapasitas closing/servicing |
| Revenue opportunity | Fee origination atas closed funds + servicing sesuai kontrak/basis waktu. Bukan TVL, pokok investor, revenue proyek atau profit Gen-Z |

`TAM₁₂m = Σ net financing need proyek dalam ruang produk, setelah committed financing.`

`SAM₁₂m = Σ bagian kebutuhan yang lolos seluruh service/credit/legal/rail filters.`

`SOM₁₂m ≤ min(verified serviceable demand, committed eligible investor capital, execution capacity).`

Global investor target memperluas sumber modal, bukan otomatis menambah TAM aset Indonesia. AUM RWA Base dan stablecoin supply bukan modal yang sudah mau membeli project note Gen-Z. Dedupe project/SPV dan tujuan pendanaan: dana refinancing yang sama tidak dihitung lagi sebagai acquisition atau fresh capex.

### 2.1 Angka konteks primer, bukan TAM produk

| Sumber/periode [V] | Angka dan definisi | Batas pemakaian |
|---|---|---|
| ESDM realisasi Desember 2025 | EBT **15.630 MW**; PLTS **1.494,1 MW**; tambahan PLTS 2025 **584,7 MW** | Stock/penambahan kapasitas. EBT tabel termasuk **468 MW gasifikasi batubara + WHB**; tidak semua renewable/eligible Gen-Z. PLTS bukan satu-satunya aset yang boleh di-onboard |
| RUPTL 2025–2034 | Tambahan **69,5 GW**: EBT 42,6 GW, storage 10,3 GW, fosil 16,6 GW | Planned 10-year pipeline, termasuk greenfield; bukan operating loan inventory |
| RUPTL 2025–2034 investasi | Total **Rp2.967,4 triliun**, pembangkit **Rp2.133,7 triliun**, EBT melalui IPP **Rp1.341,8 triliun** | Multi-year capex; bukan annual originations, available partner assets, fee revenue atau market share Gen-Z |
| IFC Indonesia CPSD 2026 | Reform dapat membuka hingga **US$780 juta** business-solar investment | Conditional reform opportunity; bukan realized financing atau annual refinancing |

Sumber: [ESDM LKj EBTKE 2025, tabel 3.9 dan pembahasan PLTS](https://www.esdm.go.id/assets/media/content/content-laporan-kinerja-ditjen-ebtke-tahun-2025.pdf), [ESDM komposisi RUPTL dan EBT IPP](https://www.esdm.go.id/id/media-center/arsip-berita/dongkrak-energi-bersih-menteri-esdm-tekankan-pentingnya-komitmen-laksanakan-ruptl), [EBTKE total investasi](https://ebtke.esdm.go.id/artikel/berita/peluang-investasi-dan-green-jobs-di-sektor-ebt-terbuka-lebar-lewat-ruptl-pln-2025-2034), [IFC CPSD](https://www.ifc.org/en/insights-reports/2026/indonesia-country-private-sector-diagnostic).

**TAM nasional sesuai definisi produk masih [perlu verifikasi].** Data primer di atas membuktikan subpasar dan kebutuhan investasi, tetapi tidak memuat refinancing need/remaining debt/consent setiap operational asset. Jangan mengisi kekosongan itu dengan market size palsu. Membagi Rp1.341,8T dengan 10 hanya memberi rata-rata aritmetika Rp134,18T/tahun, bukan timetable investasi atau TAM Gen-Z.

SUN Energy melaporkan **200 MW operating capacity** pertengahan 2025; Xurya melaporkan lebih dari 300 proyek dan hampir 200 MW pada periode yang disebut perusahaan. Klaim operator sendiri bukan available inventory, partner Gen-Z atau independent DD. Existing lender consent, negative pledge, funding need, PPA assignability dan seasoning belum diketahui. [SUN Energy](https://sunenergy.id/sun-energy-celebrates-200-mw-operating-capacity-milestone-at-pt-lamipak-indonesia-), [Xurya strategi 2026](https://xurya.com/news/sukses-transformasi-bisnis-xurya-paparkan-strategi-bisnis-untuk-tahun-2026).

IRENA melaporkan global utility-scale solar installed cost 2024 **US$691/kW**, dengan 5th–95th percentile US$489–1.610/kW. Ini sanity check capital intensity, bukan valuasi brownfield/rooftop Indonesia atau debt capacity. Jangan dikalikan seluruh MW Indonesia untuk mengklaim financeable TAM. [IRENA](https://www.irena.org/Digital-Report/Renewable-Power-Generation-Costs-in-2024).

### 2.2 SAM sourcing dan SOM sementara, model sensitivity [A]

**Semua input dan hasil tabel hypothetical.** Bukan national TAM, inventory nyata, forecast, fee pricing atau target yang disetujui founder. Universe 100 proyek hanyalah input simulasi; saat ini belum ada mitra/aset/anchor konkret.

| Horizon 12 bulan [A] | Rendah | Basis | Tinggi |
|---|---:|---:|---:|
| Universe dipetakan | 100 proyek | 100 proyek | 100 proyek |
| Punya net funding need dalam horizon | 20% | 30% | 40% |
| Lolos seluruh service/credit/legal/rail filters | 30% | 40% | 50% |
| Eligible hasil model | 6 | 12 | 20 |
| Serviceable funding per proyek | Rp2 miliar | Rp5 miliar | Rp10 miliar |
| **SAM sourcing model** | **Rp12 miliar** | **Rp60 miliar** | **Rp200 miliar** |
| Closing capacity jika counterparties/gates tersedia | 1 proyek | 2 proyek | 3 proyek |
| **SOM capital model** | **Rp2 miliar** | **Rp10 miliar** | **Rp30 miliar** |

Contoh basis: `100 × 30% × 40% × Rp5miliar = Rp60miliar`; `2 closing × Rp5miliar = Rp10miliar`. **Downside: 0 closing / Rp0 disalurkan.** Verified serviceable pipeline dan committed capital belum ada; bukan berarti pasar Indonesia bernilai nol. Rekomendasi founder solo: validasi **satu proyek**, nominal mengikuti kas/debt capacity/discovery, bukan memaksakan basis skenario.

Revenue sensitivity **[A], bukan pricing final**: funding Rp10miliar × closing fee contoh2% = Rp200juta; average outstanding Rp5miliar × servicing contoh1% × satu tahun = Rp50juta. Total **gross fee Rp250juta**, sebelum DD/legal/custody/engineering/support/tax/run-off; bukan profit. Servicing prorata jika hanya sebagian tahun dan basis mengikuti amortisasi aktual. Fee economics harus menangani 0 closing dan fixed diligence/run-off cost.

### 2.3 Data untuk mengganti asumsi

Sourcing register: project/asset IDs, owner/operator, COD, technology, MW/MWh, PPA/service tenor/currency, pelanggan, collection12bulan, CFADS, existing debt/security/negative pledge, lender consent, net funding need/date/use, permitted share, data permission dan sponsor interest. Map20–30proyek nyata untuk serviceable pipeline awal [R]; jangan extrapolate national TAM tanpa coverage representatif. Investor register: eligible country/entity/mandate, currency/tenor preference, ticket, custody/rail acceptance, actual commitments. Catat funnel sourced→data access→DD-pass→terms→anchor commitment→closed; LOI bukan funded capital.

## 3. Wallet shortlist Base

| Wallet | Evidence primer | Fit dan batas |
|---|---|---|
| MetaMask | [Supported/custom networks](https://support.metamask.io/configure/networks/how-to-add-a-custom-network-rpc/) | Existing EVM wallet kandidat; connector/signing/transaksi Gen-Z belum diuji |
| Rabby | [Rabby official](https://rabby.io/) | Base/EVM kandidat; tidak memakai domain mirip sebagai sumber |
| Base app / Coinbase Wallet | [Networks/assets](https://help.coinbase.com/wallet/browser-extension/supported-networks-and-assets) | Bedakan Base mode/legacy extension dan akun exchange; test account type aktual |
| Phantom | [Supported networks](https://help.phantom.com/articles/41372840389651), [browser SDK](https://docs.phantom.com/sdks/browser-sdk/connect) | **Mendukung Base**, bukan Solana-only. Pakai provider/alamat EVM Base, bukan alamat Solana |
| Safe | [Base support](https://help.safe.global/articles/9993850744-safewallet-gas-fees-faq), [receiving assets](https://help.safe.global/articles/4119085855-how-can-i-receive-assets) | Smart-account kandidat institusi; quorum/configuration/contract-signature authentication perlu diuji; bukan otomatis custodian berizin |
| Solflare | [Solflare getting started](https://help.solflare.com/en/articles/5797200-how-to-get-started-with-solflare) | Wallet Solana; **tidak ditampilkan sebagai connector Base** |

**[R] Testnet shortlist:** MetaMask + Rabby terlebih dahulu untuk EOA, lalu Safe bila kebutuhan institusi nyata; Base app/Phantom kandidat sesudah compatibility test atau permintaan anchor. UI hanya menandai supported jika benar-benar diuji pada device/mode terkait. Daftar chain support bukan certification Gen-Z; hardware-wallet access melalui wallet terkait juga perlu test. Gen-Z tidak meminta seed/private key.

Verified wallet = proof of control + account linkage untuk address/chain yang tepat; legal identity/KYC, investment eligibility, partner account link dan payment final adalah bukti berbeda. Reward tidak memakai investor whitelist sebagai syarat investasi terselubung.

## 4. Dua input stablecoin, satu economics proyek

[V] Native USDC Base ada pada [daftar contract Circle](https://developers.circle.com/stablecoins/usdc-contract-addresses). IDRX Base ada pada [daftar resmi IDRX](https://docs.idrx.co/introduction/supported-chain-and-contract-address), dengan 2 decimals. Contract/token allowlist harus direvalidasi saat live; simbol/logo tidak cukup. [Supported protocols Tether](https://tether.to/en/supported-protocols/) dan [USDT0 deployments](https://docs.usdt0.to/technical-documentation/deployments) yang ditinjau tidak mencantumkan Base; tidak menjanjikan native/canonical USDT Base sekarang. USDT0 bridging/messaging memiliki dependency tersendiri.

| Riwayat opsi rancangan | Keuntungan | Beban/risiko | Penilaian |
|---|---|---|---|
| A. IDRX langsung; USDC quoted conversion sebelum allocation; hak IDR | Dua input founder; satu ledger hak/waterfall | Executable provider/quote, expiry/min_net, spread/gas/refund dan conversion execution perlu diuji | **[F] Dipilih** untuk kas IDR |
| B. Terima keduanya, convert USDC batch saat closing | Conversion terkonsolidasi | FX exposure selama menunggu, uncertainty allocation, custody dan refund lebih berat | Bukan default pilot |
| C. Tranche hak IDR/IDRX dan USD/USDC | Setiap currency right eksplisit | Dua pricing/hedge/waterfall/register; kas IDR menghadapi kewajiban USD | Terlalu berat tanpa anchor/hedge |

Opsi A dapat diwujudkan partner conversion di checkout; alur eksternal conversion sebelum deposit kurang sesuai dua pilihan checkout langsung dan harus dijelaskan sebagai tahap sementara, tidak diam-diam diklaim live USDC input. Pada quote, tampilkan input, net IDRX/IDR entitlement, FX rate/basis, fees, minimum received, expiry dan penanggung shortfall. No automatic claim mint sebelum net settled cash direkonsiliasi. Quote expired memerlukan reconsent; depeg/provider outage membuat route disabled, tidak mengganti denominasi.

Refund sebelum conversion mengikuti asset input/terms. Setelah conversion, jangan menjamin original USDC amount tanpa penanggung FX/fee; disclosed settlement-asset refund atau quote baru sesuai terms/consent. **[R] Distribution IDRX default untuk hak IDR; USD payout conversion opsi terpisah**, belum otomatis menjadi kewajiban/jaminan USD. Payout choice tidak ditanyakan dalam putaran ini karena route/provider/currency architecture belum final.

### Evidence conversion/ramp belum cukup untuk production

- [IDRX rate API](https://docs.idrx.co/api/transaction-api/get-api-transaction-rates) memberi buyAmount IDRX untuk usdtAmount USDT/USDC; chainId harus explicit, default137/Polygon. Rate API bukan bukti executable quote/SLA standalone.
- [Other stablecoins mint workflow](https://docs.idrx.co/integration/processing-mint-idrx-requests/getting-other-stablecoins) dan [redeem workflow](https://docs.idrx.co/integration/processing-redeem-idrx-requests/redeeming-from-other-stablecoins) membahas Base USDC via Li.fi; contoh redeem USDC→IDRX→burn→IDR bank **bukan otomatis subscription IDRX yang ditahan pool**.
- Public limitsUSD2–5.555 pada workflows tertentu bukan universal liquidity/anchor limit; [fees](https://docs.idrx.co/services/fees) dan actual institutional capacity perlu quote/confirmation. Jangan memecah transfer untuk melewati limit.
- [IDRX FAQ](https://idrx.co/en/) mensyaratkan business account review dan mengecualikan sejumlah negara termasuk USA; scope entity/UBO/holding/route perlu issuer confirmation. USDC input tidak melewati investasi/issuer country eligibility.
- Stablecoin lokal bukan otomatis stablecoin pemerintah/CBDC. Rupiah service-payment/QRIS rail terpisah dari RWA subscription. Legal classification/custody/collection bank/on-off-ramp tetap diperiksa sesuai aktivitas.

## 5. Benchmark features: hasil riset yang dapat dipakai

Audit browser publik ReFi berhenti sebelum Accept & Verify Wallet; tidak login, membuat akun, menghubungkan wallet atau melakukan investment. Platform lain ditinjau dari sumber primer publik. Advertised feature, public observed UI dan signed-in/production success dibedakan.

| Benchmark | Bukti yang ditinjau | Adaptasi Gen-Z [R] | Jangan disalin |
|---|---|---|---|
| ReFi Hub | Public asset list + detail FLP II: Deal Terms, Performance, Risks, Asset & Operator, Documents; status maintenance/distribution, history/explorer links, calculator dan docs | Project detail pusat keputusan; offering/series berbeda dari physical asset; historical/hypothetical/realized cash dibedakan; versions/evidence status | Portfolio/KYC/checkout belum diuji; headline reported yield/withdrawal bukan jaminan; P2P planned bukan liquidity |
| Habitat | Litepaper HABITAT→Green Credits→Energy Vouchers→compute/storage; marketplace/oracle roadmap | Service fulfillment/evidence untuk ekspansi loyalty/compute | Compute voucher bukan amortizing debt; staking/emission atau authenticated live app belum terbukti |
| GEN | Landing Core/Network/Invest, IoT dan ilustrasi deal/portfolio | Monitoring/provenance + investor reports | **/invest dan /network WIP**; landing bukan app live; telemetry bukan pengganti audit/DD/collection |
| Ondo | Product-specific eligibility, KYC, approved wallets, agreements, payments, quotes/redemption docs | Identity/wallet/eligibility terpisah, consent/quote lifecycle, rights vs payment asset, private access | OUSG legal thresholds AS bukan Indonesia/global rule; instant redemption liquid underlying tidak cocok illiquid energy |
| Glow | App2.0 publication, public farm audits dan weekly reports | Project report/source/date, dashboard activity dan impact evidence | Token mining/delegation/holding points berbeda dari cashflow note atau usage-first loyalty; jangan klaim chain deployment detail yang tidak diuji |
| SunContract | NFT marketplace guide: Collect, Trade, Dashboard, panel-linked production/receipts | Historical vs forecast, asset granularity dan usage evidence | NFT/P2P energy trading, SNC economics dan secondary liquidity bukan P0 project note |

Sumber: [ReFi assets](https://app.refihub.io/energy-assets), [FLP II detail](https://app.refihub.io/investments/9), [ReFi guide](https://www.refihub.io/blog/investor-guide), [DD framework](https://www.refihub.io/blog/rebusiness-due-diligence-framework), [Habitat litepaper](https://www.habitatprotocol.com/litepaper), [GEN](https://www.ge.network/), [Invest WIP](https://www.ge.network/invest), [Network WIP](https://www.ge.network/network), [Ondo OUSG onboarding](https://docs.ondo.finance/qualified-access-products/onboarding-and-kyc), [OUSG eligibility](https://docs.ondo.finance/qualified-access-products/eligibility), [Ondo investing/redeeming](https://docs.ondo.finance/ondo-stocks/investing-and-redeeming), [quote pricing](https://docs.ondo.finance/ondo-stocks/token-and-quote-pricing), [Glow App2.0](https://glow.org/blog/the-simple-way-to-fund-solar), [audits](https://glow.org/audits), [weekly reports](https://glow.org/weekly-reports), [SunContract guide](https://suncontract.org/si/kako-uporabljati-naso-nft-trznico/).

ReFi menunjukkan series berbeda atas aset yang sama; Gen-Z harus menampilkan existing obligations/seniority, tidak menggandakan kWh/cashflow pledge. Disclosure insurance ReFi yang diamati tidak selalu konsisten (in transition vs fully insured); Gen-Z perlu canonical document scope/expiry, bukan satu badge menyeluruh. Backend/admin ReFi belum diamati, jadi admin Gen-Z merupakan rancangan kontrol sendiri, bukan klaim copy proven internal implementation.

**Kesimpulan kurasi:** ambil detail/evidence ReFi, onboarding/rights/quote Ondo, provenance/reporting GEN+Glow; service entitlement Habitat dan asset granularity SunContract untuk later exploration. Tidak ada bukti semua benchmark profitable/mature secara bisnis. Broad multiasset portal, instant exit, native emission, compute marketplace dan full IoT tidak diperlukan untuk one-project investment MVP.

## 6. Keputusan dan riset berikutnya

**Jawaban GUI diterima:** quoted IDRX/native USDC input ke hak IDR + interactive investment core ditambah simulated partner/rewards. Architecture, role workspaces, routes/API dan scope terbaru pada [app architecture](../archive/app-architecture-2026-10-18.md). Wallet shortlist, manual-assisted operator intake, principal-vs-income portfolio dan logical schema adalah rekomendasi PM, tidak meminta founder menebak API/tabel vendor. Scope dan user stories telah diperbarui; setelah counterparties tersedia, pilih executable rail/payout/refund quotes serta actual TAM/SAM register. Tidak membuat partner claims atau forecast dari sensitivity model.
