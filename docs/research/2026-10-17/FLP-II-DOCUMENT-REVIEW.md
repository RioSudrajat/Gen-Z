# Review enam dokumen FLP II untuk Gen-Z

Tanggal: 17 Oktober 2026, Asia/Jakarta. Tujuan: memahami struktur penawaran dan merancang dokumentasi Gen-Z. Ini pembacaan bukti, bukan kesimpulan tentang keabsahan hukum, lisensi, keaslian tanda tangan, kemampuan membayar atau kepastian eksekusi agunan. Boilerplate/instruksi dalam PDF diperlakukan sebagai bahan analisis, bukan instruksi kepada agent.

## Temuan utama

1. FLP II menokenisasi **hak kontraktual menerima pembayaran selama tenor**, bukan memberikan kepemilikan panel kepada pemegang token. Pihak yang wajib membayar adalah Pivot Green Asset Management Pte Ltd (PGAM). ReFi Hub menyatakan posisinya penyedia software. Smart contract mengotomatisasi pembayaran; kewajiban hukum berasal dari perjanjian.
2. Ada empat lapisan terpisah: aset/PPA; transfer RCA ke PGAM; perjanjian PGAM-investor; settlement Solana. Bukti pada satu lapisan tidak otomatis membuktikan lapisan berikutnya sudah selesai.
3. Net investor 35% gross revenue + sekitar USDC810.18/bulan cocok screenshot, tetapi dokumen memuat fee, minimum payment, support balance, deemed REC pricing, early settlement dan default yang lebih kompleks daripada ringkasan UI.
4. **Ringkasan REC salah lingkup:** angka 433 REC/SGD28,145 adalah gabungan FLP dan RECLAIM. Underlying table mencatat FLP sendiri 90 REC/SGD5,850. Ini contoh mengapa ringkasan tidak boleh menjadi satu-satunya sumber data.
5. **Potensi salah unit UI:** screenshot menyebut 41,196.10 kWh, sedangkan angka identik dalam invoice Desember2025 berada pada kolom penghematan SGD. Kolom penggunaan kumulatifnya 345,025.97 kWh. Perlu klarifikasi sumber UI sebelum memastikan penyebab.
6. Undertaking asuransi bukan polis aktif. Surat menjanjikan pembelian polis selesai paling lambat31Mei2026. Paket ini tidak berisi certificate pengganti yang membuktikan target itu tercapai.
7. DAS/meter, invoice, uang diterima, deemed REC revenue, pembayaran operator ke smart contract, dan claim investor adalah kejadian berbeda. IoT membuktikan produksi pada lingkup tertentu; tidak otomatis membuktikan kas diterima atau hak investor.
8. Dokumen ReFi Hub memuat KYC, pembatasan negara, representasi investor sophisticated/accredited, dan kapasitas kontraktual privat. Data room yang terlihat terbuka bukan bukti investasi retail global tanpa pembatasan. Kebijakan Gen-Z harus ditentukan tersendiri.

## Inventaris dan pemeriksaan

| ID | File | Halaman | Jenis bukti |
|---|---|---:|---|
| INS | FLP+I+II+Insurance+Side+Letter.pdf |2| Undertaking PGAM,11Maret2026; tanda tangan gambar hlm2; bukan insurance certificate. |
| INV | FLP+II+-+Invoicing+History+&+Billing+Structure.pdf |38| Ringkasan2hlm;14pasang invoice/detail hlm3-30; term sheet transfer8hlm pada31-38. |
| TSA | FLP_II_Token_Sale_Agreement.pdf |29| Main agreement hak yield, recipient signature bergaya DocuSign hlm29; bukan acceptance investor tertentu. |
| PPA | FLP+II+-+Power+Purchase+Agreement+(PPA).pdf |26| Scan kontrak RCA-Freight Links Properties; cover8Feb2023; signature/witness hlm25; hlm24/26 blank. |
| SCH | FLP_II_Commercial_Terms_(Schedule_1).pdf |9| Schedule komersial terpisah; recipient signature bergaya DocuSign hlm9. |
| REC | FLP+II+-+Renewable+Energy+Certificates+(REC)+Issuance.pdf |10| Intro1hlm; confirmation issuance AECO1hlm; term sheet transfer8hlm, substansi berulang dari INV31-38. |

Total114halaman. Semua halaman dirender Poppler hingga1800px dan seluruh text layer diekstrak dengan pypdf. PPA tidak memiliki text layer: seluruh26halaman diproses OCR Windows lokal, tanpa upload. Semua halaman PPA dilihat pada contact sheet; cover, metering/atribut, AnnexB dan signature diperiksa lebih dekat. Tabel REC, invoice penting, dan halaman signature pada file lain juga diperiksa visual. OCR bukan pengganti scan; tanda kapasitas +/-10% misalnya dikonfirmasi dari visual.

Nomor halaman dalam laporan adalah nomor PDF, bukan footer kontrak. PPA21 = footer20of23. Folder `pdf-evidence` menyimpan extraction/render; `manifest.json` menyimpan sumber, jumlah halaman dan SHA-256. Pemeriksaan pypdf tidak menemukan canonical AcroForm `/Sig` fields pada enam file. Ini membatasi verifikasi otomatis yang dilakukan, bukan membuktikan dokumen tidak sah. Tidak dilakukan validasi identity, authority atau DocuSign completion certificate. TSA/SCH menampilkan envelope sama: F3C83A00-2099-483E-8065-A746BC85829D; tanggal literal3/4/2026, format tanggal belum dipastikan.

## INS: transisi asuransi

Hlm1 ditujukan kepada investor FLPI/II c/o ReFi Hub VenturesS.A. PGAM menjelaskan perpindahan polis individual ke Master Operational Insurance Program dan evaluasi proposal Chubb, Allianz, AIG. Nama insurer masih calon dalam surat, bukan bukti mereka sudah memberi coverage aktif. Rencana cakupan termasuk machinery breakdown dan revenue loss akibat downtime.

Undertaking interim Maret-Mei2026 menyatakan PGAM menanggung shortfall pendapatan, menjaga distribusi bulanan penuh/tepat waktu terlepas status operasi, dan memikul liability yang biasanya ditanggung polis sampai polis baru aktif. Ini janji perusahaan yang bergantung kemampuan perusahaan memenuhi kewajiban, bukan jaminan insurer yang telah terbit.

Hlm2 menetapkan target purchase selesai paling lambat31Mei2026, lalu certificate diserahkan ke ReFi Hub. Signature terlihat dari Caius Lai YunJun,Co-Founder,PGAM,UEN202516002E. Tidak ditemukan nomor polis, current coverage dates, deductible/limit, insured asset schedule, insurer terpilih, loss-payee endorsement atau certificate pengganti.

**Gen-Z:** gunakan status `active`, `renewal pending`, `expired`, `undertaking only`, `unverified`, dengan tanggal verifikasi dan bukti masing-masing. Target tanggal yang sudah lewat memicu permintaan update; tidak otomatis menjadi insured.

## INV: invoice, produksi dan rantai hak penerimaan

### Ringkasan hlm1-2

267.85kWp di Singapura. RCA original developer dan PPA counterparty; PGAM designated asset holder. Invoice tetap oleh RCA sampai novation. Onsite S$0.125/kWh, export rates berubah, GST9%. Ringkasan mengklaim full invoice history Sep2024-Dec2025 dan executed term sheet.

### Isi hlm3-30 dan batas buktinya

Terdapat14invoice: Sep2024,Nov2024,Jan-Dec2025. Invoice Oct2024 dan Dec2024 sendiri tidak terlampir, meskipun nilai bulan itu muncul pada grafik historis. Karena itu perlu coverage checklist ketika menyebut full invoice history.

Issuer invoice adalah RCA, bill-to **Freight Links Properties Pte Ltd**, untuk fasilitas47ChangiSouthAve2. Tagihan memisahkan onsite, export, vesting credit/debit, subtotal sebelumGST, GST, current charges, dan saldo sebelumnya. **Total amount payable dapat mencakup tunggakan**, bukan revenue bulan berjalan.

| Periode | Hlm invoice/detail | Current charges inclGST (SGD) | Catatan |
|---|---|---:|---|
| Sep2024 |3/4|3,682.15| Meliputi28Aug-30Sep; di luar ringkasan kisaran2,000-2,800. |
| Nov2024 |5/6|2,395.37| InvoiceOct sendiri tidak ada. |
| Jan2025 |7/8|2,037.48| Subtotal1,869.24; onsite1,011.89+export874.11-vesting16.75. |
| Feb2025 |9/10|2,531.75| Totalpayable4,569.23 termasuk saldoJan2,037.48. |
| Mar2025 |11/12|2,386.28| Sumber periode bulanan. |
| Apr2025 |13/14|2,616.92| Sumber periode bulanan. |
| May2025 |15/16|2,607.25| Totalpayable5,224.17 termasuk saldo sebelumnya. |
| Jun2025 |17/18|2,591.00| Sumber periode bulanan. |
| Jul2025 |19/20|2,800.98| Sumber periode bulanan. |
| Aug2025 |21/22|2,575.29| Sebelum revenue commencement PGAM. |
| Sep2025 |23/24|2,435.89| Export charge invoice/detail berbeda; perlu rekonsiliasi. |
| Oct2025 |25/26|2,620.21| Totalpayable5,056.10 termasuk saldo sebelumnya. |
| Nov2025 |27/28|2,161.93| Export charge invoice/detail berbeda. |
| Dec2025 |29/30|2,005.57| Cumulativeusage345,025.97kWh; savingsS$41,196.10. |

`Payment Received` pada bentuk invoice ini kosong/strip. Paket ini bukan bank reconciliation yang membuktikan semua tagihan lunas. InvoiceFeb,May,Oct memuat arrears. Receipt/invoice status tidak dapat disimpulkan hanya dari current monthly charge.

Contoh perbedaan internal: INV23 exportSep menggunakan12,208.17kWh*S$0.0933=S$1,139.02; INV24 detailSep memakaiS$0.0800/S$976.65. INV27 tagihanNov memakaiS$0.0903/S$1,043.75; INV28 detailNov memakaiS$0.0831/S$960.53. Catatan export menyebut subject to final verification; perlu bukti adjustment untuk menentukan nilai final.

**Cross-check screenshot:** screenshot4 mencatat EnergyGeneratedasofDec2025 sebesar41,196.10kWh. INV30 secara visual menempatkan41,196.10 di kolom `SAVINGS(S$)`, sedangkan `USAGE` kumulatif345,025.97kWh. Kemiripan angka kuat mengindikasikan potensi salah pemetaan kolom/unit; jangan memastikan penyebab tanpa klarifikasi sumber alternatif. Setiap KPI Gen-Z harus memiliki unit, scope, period, source page/cell dan calculation lineage.

### Term sheet transfer hlm31-38

Portfolio882.66kWp bernilaiSGD994,578. KomponenFLP267.85kWp,SGD304,000; lainnya Reclaims271.32,Centurion150.88,Grandlink102.91,EngCheong89.79kWp. GAE adalah contractor RCA; outstanding GAE payable dikecualikan dari komitmen bebas-liabilitas. Jumlah payable outstanding tidak dicantumkan di tabel.

RevenueCommencementDate1Sep2025. Semua revenue sampai31Aug2025 tetap RCA, termasuk invoice atau pembayaran yang baru diterima kemudian; REC vintage pra1Sep2025 juga hak RCA. Tanggal produksi, entitlement, invoice dan cash receipt harus terpisah.

Sebelum novation, RCA tetap pihak hukum PPA, menginvoice/menerima atas namanya sendiri, memegang revenue atas bare trust untukPGAM, lalu remit dalam3businessdays. Bila novation belum selesai31Oct2025, pihak harus menandatangani AssignmentofReceivables. OwnershipPGAM efektif melalui NovationDeed executed RCA/PGAM dan acknowledged offtaker. Paket ini berisi **mekanisme dan kewajiban**, bukan deed/assignment yang membuktikan completion.

WaterfallINV36-37: GAEpayables -> statutory/regulatorycharges -> approved senior debt jikaada -> insurance -> priorityClassAinvestor jikaada -> O&M/compliance (essential safety O&M harus didanai sebelum investor distributions) -> netdistributable70%PGAM/30%RCA. Nomor(5)duplikat di source. InvestorFLPII dalamTSA berhak atas gross+fixed/support; belum dibuktikan apakah merupakanClassA dengan persetujuan/priority tertentu. Dibutuhkan financing consent/intercreditor dan cashflow reconciliation; jangan menganggap kedua waterfall pasti identik atau otomatis bertentangan secara hukum.

RCA memperoleh reporting minimal tahunan. Separate bank account hanya salah satu opsi; on-book segregation juga diperbolehkan. Tidak membuktikan mandatory escrow. RepurchaseRCA adalah opsi mengajukan pembelian kembali, bukan kewajiban buyback/liquidity facility investor. INV38 menampilkan dua signature dariSuenBohn(RCA) danLaiYunJun(PGAM), dated28Sep2025.

Label `Strictly Private & Confidential` ada pada term sheet; PPA juga memuat confidentiality. Untuk Gen-Z, catat izin disclosure dan redaksi sebelum mempublikasikan dokumen serupa. Ini kebutuhan desain publikasi, bukan instruksi agar agent menghentikan analisis file pengguna.

## TSA: hak token dan kewajiban penerbit

### Hak dan eligibility (hlm1-10,18-21)

Pihak berkontrak adalah PGAM dan TokenHolder. ReFiHubVenturesS.A menyediakan platform. Hlm10cl1.4 dan11cl3.5 menegaskan tidak ada equity/voting/ownership padaPGAM atauEquipment. Hlm13cl3.14: fractionalrightyield, bukan legal assignment receivables kecuali perfected menurut hukum lokal. Hlm14cl3.26: smart contract hanyalah mekanisme pembayaran teknis.

KYC berkelanjutan dan transfer hanya melalui platform kepada userKYC-approved. DilarangUSPersons dan banyak yurisdiksi termasukSingapore/Panama. Hlm19cl14.1j meminta representasi kategori qualified/sophisticated/professional/accredited atau analog menurut negara residensi. Hlm21cl14.1ll menyebut private contractual capacity, bukan public offering. Pernyataan recipient pada22 bahwa issuance bukan securities/CIS/regulatedproduct adalah representasi pihak, bukan bukti regulator menyetujui klasifikasi. Jangan menyalin negara dan kategorinya menjadi kebijakan Gen-Z tanpa keputusan terpisah.

### Pendanaan, transfer dan operasi (hlm11-18)

Solana dan compatible wallet; recipient retains administrative rights dan dapat meminta platform deploy/update. Transfer yang disetujui memindahkan hak/kewajiban kepada holder baru. Upgrade bug/security tanpa mengubah economics diizinkan; token substitution setara ekonomi dengan notice diizinkan.

Hlm12cl3.13: softcapfailure menyediakan refund melalui burn token, dikurangi blockchain fees. Bahkan source mengatakan belum timbul legalrightrefund sampai burned. Hlm16cl6.6: purchased received token final/nonrefundable kecuali softcapfailure. Ini bukan rekomendasi desain refund Gen-Z.

Hlm26risks18.1p/q: bulletin peer-to-peer mungkin difasilitasi, tanpa guarantee execution/liquidity atau regulated trading venue. MenggunakanSolana tidak otomatis berarti DEX-tradable.

### Agunan, data dan pelayanan (hlm3-5,13-17)

First-rankingfixedcharge atas equipment yang dibiayai dan replacement/proceeds, **subject to local perfection dan prior claims**. Recipient wajib merawat, mengasuransikan replacementcost, namingCollateralAgent loss-payee/additionalinsured, dan memberi evidence. Hlm16cl7.2 junior terhadap statutoryclaims yang tak bisa disubordinasi dan securityinterest yang sudah lebih dulu perfected. Badgeagunan memerlukan filing, assetIDs, currentchargesearch, consent dan legalconfirmation; teksperjanjian saja belum membuktikan priority.

Negative pledge dan sale/novation/changecontrol memerlukan agentconsent. Permittedtransferee assume obligations atau earlysettlement; originalrecipient tetap jointly/severallyliable kecuali direlease. Hlm17 platform/agent nonfiduciary dapat delegasi, **may but not obliged to enforce**. Hak enforcement memerlukan aktor, mandat, biaya dan proses nyata.

Hlm13cl3.17: repair/breakdowncost recipient, tidak mengurangi gross/yield. Cl3.18 menyediakan revenue summaries melalui dashboard/email onrequest maxquarterly. Cl3.23 menerima endpointAPI **atau verifiableCSV**, meterverifiedkWh/invoices/revenuestatements/proof, quarterly/on demand; supply30businessdays setelahrequest, failure60businessdays after writtennotice menjadiEventofDefault. Ini bukan bukti semua sensor/liveAPI sudah berfungsi.

### Default, suspensi dan maturity (hlm4-5,11-14,22-29)

Firstpaymentdefault:30BDoverdue lalu60BD setelah notice; repeateddefault kedua dalam12bulan otomatis setelah30BD. Covenantdefault60BDnotice; insurancecure30BD kecuali curedwithplatform; illegality/licenseloss,misrepresentation,insolvency,negativepledge juga termasuk. Hlm13cl3.22 menyebut failure60BD, sehingga timing harus direkonsiliasi sebelum diterjemahkan menjadi state machine.

Legal/regulatorysuspension memerlukan independentcounselopinion,notice,max30hari; forkdisruptionmax10BD dengannotice2BD; extension perluapproval; annualsuspensioncap1dalam12bulan. KYC/sanctions issue holder tertentu diisolasi ke holder itu.

Hlm4/14/22-23/26-27: token dan futureyield berakhir padaEndofTerm; accruedunpaid/priorbreach claims survive. Hlm27cl19.3: investor tidak punya hak atas kelanjutanprofit atau penjualanEquipment sesudahterm. **Tidak ditemukan janji principal balloon100,000USDC pada maturity.** Fixedpayment disebut yield/fixedcomponent, bukan allocationprincipal terpisah. Jangan menyebut amortizingloan atau menambahkan initialprincipal pada nilaiakhir tanpa klausul eksplisit.

Hlm27-29 membahas liability, indemnity, EnglishLaw, LCIAarbitrationLondon dan biaya dibagi. Ada stale crossreference: arbitrase dirujuksection22, padahal detail ada24. Hlm29cl25.10clickwrap sebelum blockchaininvestmenttransaction menerima agreement. PDF ini menampilkan recipient signatureCaiusLai/Director/literal3/4/2026, bukan bukti investor tertentu accepted versihashini. Perlu acceptanceaudittrail dan linkage identity/version/tx.

## SCH: commercial terms dan formula

### Raise dan fee (hlm1,3)

FLPSeriesII/FLPII,Solana,divisibility2desimal,USDC settlement atau commerciallyequivalentstablecoin yang disubstitusi platform/recipient. Price1USDC/token,max100,000,softcap99,995,closing26Mar202609:00UTC. CAPEXUSD240,000 dan fundedshare41.7%fullsubscription.

UI fundedcapacity111.69kWp cocok267.85*(100,000/240,000). Itu ekuivalen alokasi pembiayaan, bukan bukti investor memiliki segmen fisik111.69kWp. Infrastructurefee3,000USDC dipotong raise sukses; servicing12.5% tiapcomponentaggregatepayment. Denganraise100,000,netrecipient97,000 sebelum biaya lain; fundedshare menggunakaninvestmentamount, sehingga gross/netbasis harus jelas.

### Formula net investor dan support (hlm2-4,9)

Padafullsubscription, sebelum menyelesaikan ambiguitas support-recursion:

```text
Variable gross       = 40% * Project Gross Revenue
Fixed gross          = 925.92 USDC/month
Base aggregate       = Variable gross + Fixed gross
Target aggregate     = 2,040 USDC/month
Revenue support      = max(0, Target - Base), kewajiban recipient
Platform servicing   = 12.5% aggregate
Net investor pool    = 87.5% aggregate
Variable net         = 35% Project Gross Revenue
Fixed net            = 810.18/month = 9,722.16/year
Net floor            = 1,785/month = 21,420/year (21.42% dari100,000)
Gross target annual  = 24.48% sebelum servicing (source: approx24.5%)
```

Angka screenshot9,722/year merupakan rounding dari9,722.16. Investorindividual menerima pro-rata tokenentitlement dari netpool; snapshot, rounding dan dust butuh aturan eksplisit.

SupportBalance dicatat. Excessrevenue berikutnya boleh memulihkan support hanya setelah TargetAggregate periode terpenuhi penuh; tidak boleh mengurangi pembayaran holder di bawahfloor. Seluruh fixed/variable/target proportionalsubscription bila di bawahmaximum namun softcaptercapai.

SCH9cl9.8 menyatakan support ikutGrossRevenue untukvariablecomponent. Ini membutuhkan keputusan urutan/aljabar: support dihitung sebelum/sesudahvariable, dan bagaimana menghindari recursive doublecount? Jangan implementasikan support berulang tanpa resolvedformula.

### Jadwal, early settlement dan default (hlm3-7)

AccountingPeriod memuat akhiralternatif dengan slash: akhirbulansebelumnya /5thcalendardaybulanpembayaran. Firstpayment20Apr2026,end20Apr2035,monthly20th,inclusivebothdates. Inclusivecount menghasilkan109dates, sedangkan9tahun*12=108period. Perlu explicitdatearray,stubperiod danfinalperiod. Aritmetika810.18*108=87,499.44 **bukan bukti principalamortization**.

Earlysettlementtrigger:prepayment,refinancing,assetsale,changecontrol. Referenceanniversarytable150k/157k/169k/181k/191k/203k/211k/220k untukyear1-8, dikurangi aggregateactuallypaid, interpolateddaily, scaledpartialraise, minimum20,000. Bayar15BD,split12.5%fee,selepaspaymenttokendischarged. Nilai sebelumfirstanniversary/endboundary serta orderminimumvspro-ratascaling perlu klarifikasi. Ini formula khusus, bukan defaulttemplateGen-Z.

Defaultcompensation equals earlysettlement,15BD. Penaltylesser10%per30BD atau maxlegal, grace5BD, infrastructurerelatedwaiverconditional. Laporan ini tidak menyimpulkan enforceability rate tersebut.

### REC recognition (hlm7-9)

Deemedquantity = actualMWhgenerated; deemedpriceUSD25/attribute masukGrossRevenue **walau belumcertified,issued,registered,sold,retired atau monetized**. Hargaactualdi bawah25 tidakdownwardadjust/clawback,shortfallrecipient. Di atas25,excessprice dikaliunit dan PercentageProjectFunded ditambahkanperiodberikut sekali perbatch. Disclosure30BD dengan supportingproof; failure60BDonrequest/default.

Perlu ledger terpisah:physicalMWh,environmentalrights,issuedregistryunits,deemedcontractualrevenue,actualsoldcash,retirementbeneficiary,FX,trueupbatch. 1MWh produksi tidak otomatis certificate terverifikasi atau carboncredit. USD25 adalah contractualdeemedvalue, bukan receivedcash. Reconcile95%developer/5%client padaPPA dengan deeming seluruhplant padaSCH.

### Screenshot dan kalkulator

Screenshot8 menyebut hasil2025 adalah yang akan diterima investor **jika deal saat itu live**: backtest, bukan actualFLPIIdistribution2025. FirstpaymentkontrakApril2026. ContohJan:35%*(1,487.36+1,000.23)+810.18=1,680.8365 sebelumrounding. Ini di bawahfloor1,785; backtest terlihat tidak memasukkan supportfloor, sehingga perlu simulationformula/versionlabel.

Sidebar actualpaymentsApr/May2026 sekitar1,785,Jun/Jul1,771.01. Kontrakfloorfullsubscription1,785. Butuh actualperiod,termsversion/amendments,proration,fees dantxbreakdown sebelum menyimpulkan missedobligation. Screenshot saja tidak membuktikan breach.

Calculator50,000@21.5%*9tahun=96,750totalcashflow; tidak otomatis96,750profit ditambah50,000principalreturned. Gen-Z harus pisahkan initialoutlay,totalcashflow,returnofcapitaljikaada,netprofit,APR/IRR danAPYhanyabila reinvestmentdiasumsikan.

## PPA: aset, offtake dan metering

| HalamanPDF | Isi dan implikasi |
|---|---|
|1-2| Cover8Feb2023; RCAdeveloperUEN202144830E danFreightLinksPropertiesUEN199608074H. Bodyeffectivedateblank;CODbukan signaturedate. |
|3-5| CODmemerlukan mechanicalcomplete,commissioningtest,signedcommissioningreportwitnessutility. ActualCODreport tidak terlampir diPDFini. Guaranteedfirstyear299,205kWh; unitkWhAC/kWp. |
|6-10| Structural/siteloadingsurvey,permits,installation/O&Mdeveloper;titledeveloper/permittedtransferee;clienttanpaownershipselamaterm. Downtimeadjustment/extension/makewholeconditional. PaymentsSGD,GSTexclusive,invoice7thBDnextmonth,due30calendardays,lateinterest10%p.a. Clientpurchaseoptionafter5years. |
|11| Environmentalattributes/reportingrights95%developer/5%client per12bulan;clientexercise5%writtenrequestminimal1bulan. Continuous revenuequalitymeter+DAS;manualmonthlyreadfallback;annualverificationagainststandardmeter;rawretention2years. |
|12| Clientaudit/meteraaccess/calibration;connectionpointstodatabuildingmanagementatclientcost. Hakclient bukan otomatis publicAPIinvestor. |
|12-19| Cost/regulatorychange,representations,covenants,customaryinsurance,defaults/cure,termination,productionshortfalldamagesconditional,forcemajeure,confidentiality,assignment/novation/financingsecurity,thirdpartyenforcementexcluded,Singaporelaw/courts/mediation. |
|20| IndicativePVlayout subjecttofinalsurvey/approval. |
|21AnnexB| Site47ChangiSouthAve2;capacity **+/-10%of265.96kWp**;fixedonsiteS$0.125/kWh;excessexportnationalgrid,clientexportshareN/A;25yearsfromCOD. 267.85beradadalamrentang, bukan kontradiksi pasti; butuh asbuiltbasis. |
|22| 25yearguaranteedoutputtable299,205year1->235,078.83year25,annualdegradation1%. |
|23| EarlyterminationfairvalueSGD360,000year1->6,000year25; bukan investorredemptiontable. |
|24/26| Blankscan. |
|25| Signatureskedua pihak danwitnesses. Authenticity/authority/currentamendments belum diverifikasi. |

## REC: lingkup aset dan kualitas bukti

REC1 ringkasanReFiHub mengasosiasikan433REC/SGD28,145 denganFLP. REC2 confirmationAECOProjectServicesPteLtd kepadaRCA jelas memisahkan:

| Aset | Vintage/periode | Units | SGD/unit | TotalexGST |
|---|---|---:|---:|---:|
|FLP,47ChangiSouthAve2|Aug-Dec2024|90|65|5,850|
|RECLAIM,10TuasSouthSt7|Jan-Dec2024|343|65|22,295|
|Gabungan|2024|433|65|28,145|

FLP90=3+25+23+18+21. Ini mismatch lingkup yang terbukti, bukan perbedaan estimasi. Paymentterms30hari dariinvoicepenjual; tidak melampirkan bankreceipt. Tidak ada registryname/facilityID,serialcertificateIDs,transfer/retirementstatement,currentowner ataubeneficiary. Confirmationissuer-service denganagreedprice berbeda dari fullregistryevidence atau settledsale.

REC3-10 mengulangterm sheet. Vintage2024 mendahului entitlementPGAM1Sep2025, jadi tidak boleh dianggap actualPGAMreceipt atau FLPII2026cashflow. PPA95/5 danSCHdeeming perlu rightsreconciliation.

**ImpactGen-Z:**pisahkan observedproduction,estimatedavoidedemissions,financialparticipation dan ownership/retirementREC. Pembiayaan revenueparticipation tidak otomatis memberi investor hak mengklaim renewableelectricity/offset. Dokumentasikan baseline,faktorgrid,methodologyyear,uncertainty,registryretirement danbeneficiary untukclaimyangrelevan. Reviewini tidak memvalidasi metodologi emisinya.

## Rekonsiliasi yang belum ditutup

| Pertanyaan | Ada | Masih perlu |
|---|---|---|
|Currentlegalowner/PPAcounterparty?|OriginalPPA dantransferframework|Executednovation/assignment,offtakeracknowledgement. |
|Rankingagunan?|TSAmengklaimqualifiedfirst-ranking|Perfectionfiling,currentchargesearch,assetIDs,existingseries/creditorconsents. |
|Polisaktif?|UndertakingtargetMay31|Currentcertificate,endorsement,assetcoverage,premi,loss-payee. |
|Unitdanproduksibenar?|Invoice345,025.97kWhvsUI41,196.10|Sourcelineage/periodscope/correction. |
|Cashreceived?|Invoicesdenganarrears|Bankreconciliation,receivableaging,RCA->PGAMremittance,FX. |
|RECowned/issued/sold?|Confirmation90FLPvs433gabungan|RegistryIDs,ownership/retirement,receipts,correctionsummary. |
|Supportformula?|Floor/supportbalance/deeming|Resolvecl9.8recursion,trueup,FX/taxbase,formulaimplementation. |
|Paymentcount?|Inclusivefirst/enddates,9yearslabel|Explicit109vs108schedule,stub/finalperiod. |
|Principalreturn?|Expiry,noresidualrights|JikaGen-Zinginprincipalreturn,kontrakeksplisitberbeda. |
|Eligibleretailglobal?|Privateterms/KYC/qualifiedreps|KebijakanGen-Zperoffering/yurisdiksi tersendiri. |

Temuan ini bukan tuduhan fraud atau putusan hukum. Ini menunjukkan kebutuhan relationship antar bukti, validasi lingkup, dan status gap.

## Framework dokumentasi Gen-Z

### Pisahkan asset dan offering/series

`AssetID` stabil untuk fasilitas,operator,PPA,sensor,meter,insurance,history. `OfferingID/SeriesID` memilikitermsversion,recipient,raise,tokenmint,distributionformula,tenor,fee,eligibility,collateralscope. Jangan menghitung kapasitas aset yang sama dua kali karena dua series. Dokumen shared direferensikan many-to-many dengan scope eksplisit.

### Paket inti sebelum offering aktif

| Paket | Minimum isi |
|---|---|
|Asset&operatorprofile|Entity/registration,rolesowner/operator/issuer/offtaker,site,capacity,COD/asbuilt,meterIDs,trackrecord,beneficialcontrolreview. |
|Commercialterms|Raise,price,supply,min,upfront/ongoingfees,gross/netformula,revenue/cashbasis,tenor,paymentdates,capitalrecovery,maturity/exit,scenarios. |
|Participationagreement|Issuerobligation,righttype,governinglaw,transfer,default/cure/enforcement,refund,claim,maturity,acceptance/version. |
|Assetauthority&revenuecontracts|Title/siteuse,PPA/offtake/chargingagreements,novation/assignment bila originalparty berbeda. |
|Duediligence&riskregister|Reviewer/scope/date,stepsverified,exceptions,materialrisks,mitigations,actionowner. |
|Data/reportingpolicy|Definitions,sources,cadence,freshness,review,correction,retention,IoTreadiness,SLA. |
|Financialevidence&fundsflow|Production,invoices,cashcollection,tax/FX/fees,bank-to-chainreconciliation,cashwaterfall. |
|Useoffunds&milestones|Budget,netrecipientproceeds,conditionsrelease,deliverables,progressreports. |

### Paket conditional jika klaimnya dipakai

- Insurance: currentcertificate/policy,coverageperiod,exclusions/limit/deductible,asset/seriescoverage,loss-payee,renewalproof; undertaking berlabel sendiri.
- Collateral: securityagreement,assetregister,valuation,perfectionfiling,chargesearch,existingliens,agentmandate,enforcementcosts/process. Futurestep bukan perfectedstatus.
- Transferredasset: novation/assignment,interimcollection,baretrust,offtakeracknowledgement,remittanceproof.
- REC/environmentalrevenue: rightsallocation,registryfacility/serial/vintage,issuance/transfer/retirement,salescontract,invoice,receipt,beneficiary,doublecountcontrol,deemed-vs-actualpolicy.
- Construction: siteauthority,permits,EPC/O&M,inspection,commissioning,handover,asbuilt,delays/contingency.
- IoT: dataaccessagreement,device/meterregistry/calibration,source/protocol,cadence/timezone,retention,gaps/quality,incidents,reviewedreconciliation. Jangan publish credentials.
- Token/chain: network,mint/programaddress,deployedversion,upgradeauthority,pausepermissions,auditreport/scope/date,distributionaccount,transactionlinks.
- Updates/incidents: reportingperiod,eventtime,publishedtime,operations/cashstatus,attachments,remediation,owner,nextupdate,revisionhistory.

### Metadata, akses dan publikasi

DocumentRecordminimal: ID,asset/seriesrelation,category,title,summary,issuer/counterparties/roles,language,documentdate,effectiveperiod,reportingperiod,version/supersedes,filetype/bytes/pages,originalhash,redactedhash,signaturetype/parties,signatureverificationstatus,receiveddate,reviewer/reviewscope/reviewdate,disclosureconsent,accesslevel,redactionreason,sourceanchors,relatedmetrics,knownexceptions,nextreview/expiry.

Pisahkan state `available`, `signature visible`, `signature verified`, `current`, `rights perfected`, `payment settled`. Hash membuktikan integritas versi, bukan kebenaran konten atau enforceability.

Usulanakses: publicapproved; signedinapproved; eligibleinvestor; holderonly; internalrestricted. Keinginan pengguna assetdocumentation/operatorupfront dapat dipenuhi dengan approvedpublicsummary dan redactedsource yang cukup sebelum investasi. DokumenPII,bankrouting,identity,signature/securitydetails ditinjau untukredaksi. Catat consent untuk source berlabelconfidential; jangan menyembunyikan seluruh substansi ketika ringkasan publik/redactedversion dapat diizinkan.

Flow: uploadoriginal -> identifyscope/series -> extractstructuredfields+anchors -> redaction -> draftpublicview -> secondreview -> publishimmutableversion -> materialchangelog/holdernotice -> expiry/reviewqueue. Original tidak ditimpa. Authorize setiapdownload/signedURL; jangan policy hanya berlaku pada tombol UI.

### Konten fleksibel yang konsisten

Rekomendasi **form terstruktur untuk fakta/angka/terms**, ditambah **contentblocks yang disetujui untuk narasi,diagram,gambar,tabel,file,FAQ,timeline**. Hindari seluruhproject sebagai satuMarkdown tanpa schema. Markdown boleh untuk bodytextsanitized; bukan kode arbitrer yang menentukan terms. Chart,useoffunds,table,calculator mengacu data angka sama agar tidak salingstale. Blocks minimaltype,content,sourceRefs,displayorder,assettype,required/optional,reviewstatus. Isi antarproyek fleksibel; namatab dan minimumdisclosure konsisten.

### Transparansi hingga IoT

```text
Device/meter/operatorAPI
-> ingest(deviceID,eventtime,receivedtime,unit,quality)
-> append rawstore -> normalizedtimeseries
-> reconcile meter/invoice -> reviewedperiodreport
-> versioned contractualcalculation
-> operatorcashreceipt -> conversion/settlement
-> onchaindistribution -> investorclaim
```

UI membedakan liveprovisional dan reviewedfinancialclose. Tampilkanlastreading,lastreceived,expectedcadence,devicecoverage,gaps,source/reviewstatus. Offlineberartiunknown/stale, bukan0seolahproductionnol. Backfill/correction menyimpanversion danreason. Jangan menaruh seluruhtimeseries kechain; hashreport/attestation tertentu dapat berguna, sumberdata tetap harus diverifikasi.

Productionchart tidak otomatis menambah claimbalance. Smartcontract membagikan dana yang sudah difunded ke entitlement sah; sensor tidak menciptakanUSDC. Statusproduksi->invoice->collectedcash->distributable->funded->confirmed->claimed dipisahkan. Inilah pembeda transparansi yang lebih bermakna daripada badgeIoT.

## Pertanyaan founder berikutnya

1. Hak apa yang diterbitkan: time-limited revenueparticipation, securedloan dengan capitalrepayment, atau beneficialequity? Rekomendasi satu model dulu dengan maturity/returnofcapital eksplisit; belum diputuskan pengguna.
2. Perlu fixed/supportfloor sepertiFLPII? Jangan menciptakan guaranteedfloor demi kemiripan UI; basisnya kemampuan bayar operator dan struktur proyek.
3. Apa yang public sebelumlogin dan apa bolehredacted/gated? Usulan approvedoperatoridentity,rights,cashflow,risk,fee dansource upfront, denganizinpublikasi.
4. Pilotpublic berarti openbrowse/openregistration atau actualretailglobalinvestment? Usulan publicdiscovery+registration,eligibility pembelian peroffering; bukan menyalin restrictionReFiHub.
5. IoT berasal dari operatorAPI/inverter/meterexisting atauhardwarebaru? Mulai accessassessment,devicecoverage,cadence,manualfallback sebelum janji real-time.
6. Reward/points/nativetoken tetap routevisible,comingsoon terpisah; belum menyiratkanmint/TGE/hakekonomi sudahaktif.

Tidak ada PRD,sourceapp,contract atau publikasisource yang diubah dalam subtask ini. Dokumen ini bahan rekomendasi dan wawancara lanjutan.
