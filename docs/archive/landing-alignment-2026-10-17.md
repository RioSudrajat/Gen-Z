> **Arsip per 18 Oktober 2026.** Isi dipertahankan sebagai riwayat; dapat memuat keputusan yang tergantikan dan snapshot berbeda. Acuan aktif: [indeks dokumentasi](../README.md), [PRD](../PRD.md), [requirements MVP](../product/requirements.md).

# PRD Gen-Z — penyelarasan dengan landing page
Tanggal awal: 16 Oktober 2026; diperbarui 18 Oktober 2026 (Asia/Jakarta)
Versi: 1.8-base-aligned
Status: catatan keputusan PRD dengan scope MVP dan shared understanding dikonfirmasi founder pada 17 Oktober 2026. Acuan konsolidasi: SPEC-MVP-Gen-Z-2026-10-17.md; rincian teknis/vendor dan kebutuhan fase live mengikuti batas yang tercatat.
Basis: PRD v1.2 tanggal 12 Oktober, glossary proyek, rancangan arsitektur dan MVP, serta source landing yang diperiksa 16 Oktober 2026.

**Pembaruan aktif, 18 Oktober 2026:** [F] Base menggantikan Solana atas arahan founder. Scope produk 17 Oktober tetap, dengan detail teknis [R] pada [riset Base/EVM 18 Oktober](../research/base-evm-2026-10-18.md) dan spec versi `1.1-base`. Pilihan Base tidak mengaktifkan kembali mock wallet D0, public deal detail, note wajib atau functional rewards. Fondasi login EVM/SIWE pada Base Sepolia kini diimplementasikan, dengan akun Solana historis tetap terpisah; kontrak/lifecycle investasi masih rancangan. Lihat [laporan fondasi Base](../history/2026-10-18-base-foundation.md) untuk scope serta bukti verifikasi. Bagian riset dan snapshot lama tetap bertanggal.

## Konvensi
- [F] Keputusan founder yang sudah tercatat; dipertahankan sampai dibuka kembali secara eksplisit.
- [I] Fakta implementasi yang terlihat dari source saat pemeriksaan; bukan hasil pengujian runtime dalam sesi ini.
- [R] Rekomendasi baru; belum disetujui.
- [O] Keputusan/dependensi terbuka.
- [T] Target perilaku produk; keberadaannya di PRD tidak menyatakan fitur telah dibangun.

## Arahan founder terbaru — 17 Oktober 2026

Riset 34 screenshot, enam PDF dan situs pembanding telah dibahas. Founder menjawab Q13–Q23; jawaban ini menggantikan rekomendasi yang berbeda dan prioritas baseline lama pada bagian terkait. Q8–Q12 tidak otomatis disetujui.

- [F, Q15] Platform terbuka untuk individu dan institusi global, menggantikan private/anchor-only. Ini target akses produk; negara dan eligibility transaksi nyata mengikuti jalur yang tersedia.
- [F, Q16] Landing/marketing publik. Masuk dashboard, navigasi app, daftar/detail proyek dan dokumen memerlukan autentikasi lewat wallet. Upfront berarti informasi tersedia setelah autentikasi dan sebelum komitmen investasi, bukan sebelum wallet connect.
- [R turunan Q16] Koneksi wallet dilanjutkan challenge bertanda tangan untuk proof of control, verifikasi server dan sesi terautentikasi. Ini sign-in message, bukan persetujuan transaksi dana. Wallet authentication tidak memberikan status KYC/eligibility atau hak admin. API dan file dilindungi pada resource server, termasuk deep link dan download.
- [F, Q13] Tujuh tab tetap: Overview; Asset & Operator; Deal Terms; Performance & Data; Reports & Updates; Risks; Documents. Structured facts + editor blok; Impact di Performance & Data, calculator di Deal Terms. Payload/Lexical tetap kandidat teknis, bukan vendor yang dikunci.
- [F, Q14] Pilihan hybrid/revenue participation dibuka; model hak dan ekonomi eksplisit per offering. Note beramortisasi bukan instrumen default wajib. Jangan menyalin persentase, fixed payment, hak principal atau expiry benchmark menjadi terms Gen-Z.
- [F] Fungsi investor workspace memakai referensi ReFi Hub dengan UI/UX Gen-Z sendiri. Astro untuk marketing; Next.js untuk auth dan seluruh app; Base/EVM menggantikan Solana [F, 18 Oktober]; scope 17 Oktober lainnya tetap.
- [F, Q17] Proyek yang lolos review boleh memakai laporan bulanan saat feed belum tersedia; API/IoT ditambahkan bila feasible dengan coverage, freshness dan status sumber yang jelas. Akses perangkat/partner nyata belum dibuktikan.
- [F, Q18] MVP fokus investasi RWA/DeFi dan transparansi. Rewards, Points dan Gen-Z Native Token tetap menjadi halaman informasi/Coming soon; simulated reward flow penuh ditunda dari rilis pertama dan test seam MVP.
- [F, Q19] DeFi MVP: penilaian offering → investasi simulated/testnet → allocation/token posisi → portfolio → distribusi dan claim. Swap, lending/borrowing, staking dan secondary trading ditunda. Claim mengikuti hak investor dan dana distribusi yang telah tersedia.
- [F, Q20] Pengguna wallet-authenticated boleh membaca profil operator, terms, risiko, laporan dan dokumen inti yang disetujui sebelum investasi, tanpa KYC sebagai syarat membaca. Salinan investor dapat disunting untuk data sensitif; original dibatasi ke pihak berwenang dengan alasan terlihat. Eligibility diperiksa sebelum transaksi.
- [F, Q21] Laporan bulanan dan perubahan terms direview sebelum terbit. Koreksi mempunyai versi baru, alasan dan histori. Telemetry boleh tampil provisional dengan label; IoT tidak otomatis memicu pembayaran.
- [F, Q22] Demo pertama: satu proyek solar ilustratif dengan hybrid fixed payment + variable revenue participation; angka, biaya, tenor dan hak saat expiry bersifat sintetis dan dijelaskan. Ini bukan terms/model wajib proyek nyata.
- [F, Q23] Inquiry hanya untuk founder/admin berwenang; satu inbox operasional. Inquiry tidak berlanjut dihapus setelah 90 hari sejak interaksi terakhir; inquiry aktif ditinjau tiap 90 hari. Tidak ada pendaftaran marketing otomatis.
- [O fase live] Counterparties, negara aktif, legal wrapper/terms aktual, provider, custody, executable FX, mandat produksi dan feed nyata tetap dependensi fase live. Nilai fixture, vendor CMS serta rincian implementasi teknis merupakan rancangan yang harus diperiksa, bukan jawaban founder yang dikarang.
- [I] Hanya dokumen PRD/riset diperbarui; tidak ada migrasi kode, deployment, wallet signing atau transaksi dalam sesi analisis.

## Problem Statement
Pemilik/operator infrastruktur energi membutuhkan cara menjelaskan aset, kebutuhan pembiayaan, kontrak pendapatan, dan kinerja kepada calon investor. Investor membutuhkan informasi proyek, hak kontraktual, risiko, dan pembayaran yang bisa dihubungkan kembali ke bukti proyek.

[I] Landing terbaru menjanjikan koneksi energi dan modal global, dengan dua jalur: Discuss your asset untuk operator dan Launch app untuk investor. Namun jalur tersebut baru berakhir pada draft inquiry lokal atau workspace kosong. Pengunjung belum dapat menjalani siklus proyek yang digambarkan landing.

[I] Landing juga memuat bahasa live on-chain production data, stable monthly income, dan regulated and compliant investment structure. Belum ditemukan implementasi sumber data live, instrumen yang disahkan, atau bukti kesiapan tersebut dalam alur aktif yang diperiksa. PRD harus membedakan kebutuhan calon pengguna, arah produk, dan kemampuan yang tersedia.

## Solution
Gen-Z menghubungkan aset infrastruktur energi produktif milik mitra dengan modal global melalui informasi proyek yang terstruktur, penilaian bukti, struktur pembiayaan dan hak investor, serta workspace untuk mengikuti kinerja dan pembayaran.

[F] Fokus awal aset Indonesia; akses investor ditargetkan global melalui platform publik sesuai arahan 17 Oktober 2026. Batas private/anchor-only dicabut sebagai strategi akses pilot. Individu dan institusi global disetujui pada Q15; negara dan eligibility transaksi nyata masih perlu dirinci. Workspace memerlukan wallet authentication sesuai Q16. Gen-Z tetap perantara; kepemilikan aset dan kewajiban proyek mengikuti mitra penerbit serta dokumen yang berlaku.

[F] Tahap produk masih pre-pilot: satu proyek ilustratif interaktif, subscription/portfolio/servicing simulated, serta halaman informasi/Coming soon untuk Rewards, Points dan native token. Q18 menunda reward flow penuh dari MVP. Belum ada mitra/aset/anchor konkret yang tercatat dalam baseline. Status aktual tersebut perlu diperbarui jika founder memiliki perkembangan baru.

[R] Prinsip penyelarasan: setiap janji landing mempunyai keluaran produk yang dapat diperiksa, label tahap yang jelas, serta batas cakupan. Kategori ekosistem yang luas tidak otomatis menjadi kategori yang dapat menerima pendanaan pada rilis awal.

## Peta landing → kebutuhan produk

| Bagian landing | Pesan/fitur yang teramati [I] | Kebutuhan produk [T] | Kondisi saat pemeriksaan [I] |
|---|---|---|---|
| Hero | One electrification ecosystem; energy to global capital | Pengunjung memahami peran Gen-Z dan dua audiens | Narasi marketing tersedia |
| The next economy needs power | Konteks kebutuhan listrik dan pertumbuhan produktif | Konten edukasi dengan sumber, periode data dan batas interpretasi | Visual/narasi serta referensi tersedia; angka tidak diverifikasi ulang dalam sesi ini |
| Capital powers electricity | Hubungan pemilik aset dengan investor | Jalur eksplorasi yang relevan untuk tiap peran | Diagram/penjelasan tersedia |
| Who We Serve | Operator dan investor, beberapa kategori aset | Intake operator dan akses informasi investor | CTA tersedia; klaim data live dan income perlu keputusan produk |
| Verify; Structure & tokenise; Connect to capital | Proses membawa aset ke calon investor | Bukti proyek → review → terms → akses investor | Penjelasan proses tersedia; workflow operasional belum dibuktikan |
| Infrastructure showcase | Renewable generation, storage, electrification | Kategori aset, project detail, status ketersediaan | Showcase ilustratif; bukan listing proyek live |
| Gen-Z stack | Infrastructure → information → capital/participation → workspace | Hubungan asset, evidence, offering, investment, report dan payment yang konsisten | Visual empat layer tersedia |
| Foundation for financing | PPA, hak investor, produksi/billing/payment | Dokumen terkait proyek, provenance, periode, review state, akses | Selector informasi tersedia; bukan dokumen proyek terverifikasi |
| Investor workspace | Asset overview, performance, payments | Detail aset, laporan kinerja, portfolio, pembayaran | Preview ilustratif bertab |
| Contact | Asset, mandate, partnership | Jalur inquiry yang menyatakan status pengiriman secara akurat | Validasi dan draft lokal; copy/download; tidak dikirim |
| Launch app | Akses workspace | Wallet authentication lalu satu perjalanan produk yang lengkap | Email di browser session; tidak membuat akun atau mengirim email |
| Dashboard | Overview, Assets, Portfolio, Documents | Informasi proyek dan aktivitas investor | Shell dan empty states; belum ada transaksi atau data proyek live |

## Aktor dan outcome
1. Pengunjung: memahami Gen-Z, tahap produk, kategori aset, dan jalur tindak lanjut.
2. Pemilik/operator aset: menyampaikan konteks aset dan kebutuhan pembiayaan; memahami bukti yang diperlukan.
3. Investor: menilai proyek, hak dan risiko; mencoba partisipasi simulated dan mengikuti hasilnya.
4. Reviewer/admin Gen-Z: menjaga keterhubungan bukti, status review, informasi yang dipublikasikan, serta servicing.
5. Pengguna layanan mitra (fase berikutnya): menggunakan reward sesuai syarat; MVP hanya menjelaskan roadmap.
6. Mitra layanan (fase berikutnya): menyediakan bukti transaksi dan pendanaan/manfaat campaign.

## User Stories
1. Sebagai pengunjung, saya ingin memahami hubungan aset energi dan modal agar mengetahui fungsi Gen-Z.
2. Sebagai pengunjung, saya ingin mengetahui apakah informasi bersifat ilustratif, simulated, testnet, atau live agar memahami tahap produk.
3. Sebagai operator, saya ingin masuk melalui Discuss your asset agar mendapatkan jalur yang sesuai kebutuhan saya.
4. Sebagai operator, saya ingin menyampaikan jenis aset, perusahaan, kontak dan kebutuhan pembiayaan agar dapat memulai pembahasan.
5. Sebagai operator, saya ingin memahami apakah inquiry sudah dikirim agar tidak mengira draft lokal telah diterima Gen-Z.
6. Sebagai operator, saya ingin mengetahui bukti operasi, kontrak energi, billing dan collection yang dibutuhkan agar siap menjalani review.
7. Sebagai operator, saya ingin mengetahui status dan kekurangan pengajuan agar dapat memberikan informasi lanjutan. [F: intake-assisted Q2; profil awal dan screening sampai siap publikasi disetujui Q5; permission rinci masih O]
8. Sebagai reviewer, saya ingin menghubungkan bukti ke proyek dan periode pelaporannya agar review dapat ditelusuri.
9. Sebagai reviewer, saya ingin laporan/terms direview sebelum terbit serta koreksi berversi dengan alasan dan histori agar publikasi dapat ditelusuri. [F, Q21; nama state implementasi tetap R]
10. Sebagai investor yang sudah terautentikasi melalui wallet, saya ingin menjelajahi kategori dan detail aset tanpa menganggap seluruh kategori sudah tersedia untuk investasi.
11. Sebagai investor, saya ingin mengenali satu proyek demo aktif dan showcase Coming soon agar mengetahui interaksi yang tersedia.
12. Sebagai investor, saya ingin membaca identitas proyek, mitra penerbit, model pendapatan, terms dan risiko agar memahami penawarannya.
13. Sebagai investor, saya ingin membedakan aset fisik, penawaran proyek dan Token RWA Proyek agar memahami bentuk partisipasi.
14. Sebagai investor yang telah login wallet, saya ingin membaca dokumen inti yang disetujui sebelum investasi tanpa harus lulus eligibility transaksi; salinan sensitif dapat disunting dan original dibatasi sesuai kewenangan. [F, Q20]
15. Sebagai investor, saya ingin melihat periode, sumber, waktu pembaruan dan status review data kinerja agar dapat menilai kesegarannya.
16. Sebagai investor, saya ingin membedakan energi diproduksi, invoice diterbitkan dan kas diterima agar tidak menyamakan kinerja operasi dengan pembayaran.
17. Sebagai pengguna app, saya ingin membuktikan kontrol wallet dan memperoleh sesi terautentikasi sebelum mengakses workspace. Data investasi demo tetap berlabel sintetis; login wallet tidak mengubahnya menjadi investasi live.
18. Sebagai peserta demo, saya ingin mencoba subscription IDRX atau native USDC agar memahami denominasi hak IDR dan quoted conversion.
19. Sebagai peserta demo, saya ingin melihat quote expiry dan hasil net settlement simulated agar memahami kapan allocation terjadi.
20. Sebagai peserta demo, saya ingin melihat allocation yang sesuai dana net settled agar portofolio tidak menampilkan investasi sebelum waktunya.
21. Sebagai investor, saya ingin melihat modal masuk, distribusi, dan hak yang masih berlaku menurut model offering. Principal outstanding/returned dan income dipisahkan bila model memang mendefinisikannya; revenue participation tidak otomatis mempunyai principal redemption atau seluruh cashflow sebagai profit.
22. Sebagai investor, saya ingin melihat jadwal, status dan rincian pembayaran, lalu claim hanya atas hak saya dan dana distribusi yang tersedia, agar estimasi tidak dianggap saldo yang bisa ditarik. [F, Q19]
23. Sebagai peserta demo, saya ingin melihat skenario keterlambatan, kegagalan atau refund agar memahami alur selain sukses.
24. Sebagai reviewer/admin, saya ingin menelusuri bukti collection sampai hasil distribusi simulated agar bisa menjelaskan perubahan portofolio.
25. Sebagai pengguna app, saya ingin membuka halaman Rewards dan memahami tujuan serta status Coming soon tanpa saldo atau aktivitas reward fiktif.
26. Sebagai pengguna app, saya ingin membuka halaman Points dan memahami bahwa implementasi reward ditunda serta poin berbeda dari kas dan investment yield.
27. Sebagai pengguna app, saya ingin membuka halaman Gen-Z Token dan memahami status ditunda serta perbedaannya dari hak proyek.
28. Sebagai pengguna, saya ingin navigasi keyboard, mobile layout, focus/error feedback dan reduced motion bekerja agar alur produk dapat diakses.
29. Sebagai pengguna, saya ingin error, empty, stale dan unavailable states menjelaskan tindakan berikutnya agar tidak terjebak pada informasi kosong.
30. Sebagai reviewer/admin pada tahap autentikasi nyata, saya ingin akses dan publikasi mengikuti kewenangan yang diverifikasi agar pilihan peran di browser tidak memberikan privilege.

## Implementation Decisions

### Keputusan baseline dan perubahan eksplisit founder
- Gen-Z adalah platform perantara untuk aset mitra; origination, kurasi, monitoring/reporting dan servicing merupakan model kerja yang direkomendasikan dalam mandat founder.
- Prioritas aset operasional yang mendukung renewable energy, memiliki kontrak monetisasi dan histori collection; tidak dibatasi solar.
- [F, Q14] Economic model eksplisit per offering; hybrid dan revenue participation menjadi pilihan yang dibuka. Note/private credit beramortisasi dapat tetap menjadi opsi, tetapi bukan default wajib. Fixed/variable basis, gross/net, biaya, tenor, principal jika ada dan hak saat expiry mengikuti terms offering; legal wrapper dan parameter aktual masih terbuka.
- Closed-end, tanpa janji exit instan.
- [F terbaru, 18 Oktober] Base/EVM menggantikan Solana. Dua input IDRX dan native USDC, hak IDR serta allocation setelah dana net settled tetap. Registry chain/token address/decimals Base menggantikan mint context; provider/likuiditas/FX/payout nyata tetap dependency.
- Existing investor wallet dengan proof of control dipertahankan secara konsep; target implementasi memakai wagmi/viem + SIWE/ERC-4361 dan verifikasi EOA/1271/6492 sesuai dukungan. Wallet proof bukan identity/eligibility atau hak admin; custody pool tetap keputusan terpisah.
- Rancangan restricted ERC-20 per offering/series untuk D1 Base direkomendasikan kembali setelah riset 18 Oktober; transfer rutin ditutup dan same-owner recovery menjaga register/claim history. Production standard/authority tetap perlu review; native utility/governance tetap ditunda.
- [F, Q18] Investment core dan transparansi menjadi fokus MVP. Reward flow simulated penuh baseline lama ditunda; menu Rewards/Points/Native berupa informasi/Coming soon yang dapat dibuka setelah login.
- [F, baseline fase berikutnya] Reward tidak memerlukan investasi/staking; memerlukan service completion, final payment evidence dan account linkage. Ini bukan requirement fungsional rilis MVP Q18.
- Reward AI/compute merupakan ekspansi; tidak otomatis menjadi bagian MVP.
- [F terbaru] Astro untuk landing/marketing dan Next.js untuk auth serta seluruh app. PostgreSQL/worker persisten tetap baseline. Solidity/OpenZeppelin/Foundry menjadi arah kontrak Base [R, 18 Oktober]. Source landing yang diperiksa masih React/Vite; belum ada migrasi kode pada sesi riset ini.
- English-first menuju bilingual EN–ID untuk produk; PRD tetap bahasa Indonesia.
- Navigasi Assets tetap Energy/Infrastructure sesuai baseline; generation/storage/electrification pada landing dipetakan sebagai kategori showcase atau tags, bukan pembatalan taxonomy app.
- Founder solo, 2–4 jam/hari dan free-first hingga testnet merupakan baseline terakhir; tidak menetapkan kalender launch baru.

### Modul produk [T/R]
- Marketing publik dan role-aware inquiry; discovery/detail proyek dalam app setelah wallet authentication.
- Project register dan evidence review.
- Offering dan investor-rights information dengan tujuh tab tetap serta structured facts/editor blok sesuai Q13.
- Simulated subscription, quoted conversion, settlement dan allocation.
- Investor portfolio, operating reports dan servicing/payment history.
- Halaman informasi/Coming soon Rewards, Points dan Gen-Z Token; functional reward ditunda.
- Review/admin scenario dengan pemisahan kewenangan serta histori perubahan.

### Hubungan informasi [R]
Project menghubungkan asset, owner/operator, issuer, evidence, offering, operating report dan collection. Offering menghubungkan rights, currency, eligibility dan terms. Subscription menghubungkan quote, settlement dan allocation; investor position menghubungkan allocation dan distribution. Setiap bukti/laporan mempunyai provenance, periode, waktu pembaruan, versi dan review state.

Implementasi API, schema rinci, vendor serta sumber data akan mengikuti keputusan yang dikonfirmasi. Draft ini tidak mengklaim endpoint/backend tersebut sudah tersedia.

### Environment dan klaim [T]
- Preview marketing, demo interaktif, testnet dan live memiliki label serta data yang dibedakan.
- Auth preview saat ini tidak menjadi bukti identity verification atau otorisasi server. Target Q16 memerlukan wallet proof dan sesi server; seluruh app/API/file mengikuti kewenangan resource, bukan hanya redirect UI. Halaman auth tetap dapat dibuka untuk login.
- Demo tidak meminta seed phrase, tanda tangan transaksi bernilai atau transfer uang nyata.
- On-chain record tidak membuktikan pembacaan sensor atau penerimaan kas dengan sendirinya.
- Kebutuhan investor akan pendapatan rutin tidak dianggap jaminan distribusi bulanan.
- Approved/reviewed internal tidak dianggap lisensi atau persetujuan regulator.
- [F, Q1/Q4] Demo memakai fixture simulated; pilot mulai dari laporan operator bulanan yang direview dan bertanggal sebelum IoT/on-chain live. Produksi, tagihan dan kas diterima terpisah, dengan sumber/periode/update/review state. Data belum tersedia atau terlambat tidak diisi nol. Deadline mengikuti kesepakatan proyek; bukan janji pembayaran bulanan. Review/koreksi mengikuti Q21; penanggung jawab produksi konkret masih dependensi pilot.
- [F, Q2/Q5] Intake dibantu tim Gen-Z. Profil aset/kebutuhan pembiayaan dahulu, lalu bukti kewenangan, kontrak, produksi dan histori penerimaan kas sebelum publikasi. Alur: diterima → screening → lengkapi informasi → due diligence → siap publikasi. Alasan keputusan dicatat; dokumen sensitif tidak diminta pada contact publik awal. Portal operator penuh ditunda; review/publication mengikuti Q21 dan akses investor mengikuti Q20; mandat produksi konkret masih dependensi pilot.
- [F, Q3/Q6] Inquiry operator/investor/partner diterima nyata: tersimpan server, nomor referensi, kemudian notifikasi email tim. Kegagalan notifikasi tidak menghapus inquiry atau mengharuskan pengiriman ulang. Akses/retensi disetujui Q23; alamat inbox/provider/retensi backup masih konfigurasi deployment.

## Testing Decisions
[F, Q7 diperbarui Q18] Batas pengujian MVP: inquiry sampai tercatat dan investasi simulated sampai portfolio/laporan/pembayaran, termasuk gagal, duplikat dan akses tak sah. Q18 menunda perjalanan reward sampai reversal; pada MVP periksa navigasi serta informasi Coming soon. Rincian teknik pengujian berikut merupakan [R] untuk memenuhi batas perilaku tersebut, tanpa bergantung pada detail komponen.
- Jalur operator: entry dari landing → inquiry → hasil review/pengiriman sesuai scope yang dipilih.
- Jalur investor: Launch app → wallet authentication → satu solar hybrid ilustratif → tujuh tab/bukti/terms → eligibility sandbox sebelum transaksi → subscription simulated → allocation/token posisi → portfolio → report/distribution → claim. Dana distribusi harus tersedia; klaim duplikat tidak membayar dua kali.
- Jalur roadmap: setelah login, Rewards/Points/Gen-Z Token dapat dibuka dan menjelaskan Coming soon tanpa aksi finansial/redeem atau saldo sintetis yang disangka aktif. Uji reward eligible → reversal ditunda bersama fitur tersebut.
- Error cases: quote expired, dana belum settled, data stale/missing, dokumen tidak tersedia/tidak diizinkan, form invalid, storage/network failure, akses workspace tak sah, eligibility gagal, claim belum didanai dan duplicate claim. Pengguna login yang belum eligible tetap dapat membaca dokumen inti yang disetujui; original sensitif tetap dilindungi.
- Nilai lintas IDRX, USDC dan IDR tidak dijumlah tanpa basis konversi; distribusi/principal/income mengikuti model offering. Poin/native token tidak menjadi saldo investasi. Periksa akses tanpa sesi, sesi kedaluwarsa, wallet lain, deep link API dan file.
- Periksa mobile, keyboard, focus, error feedback dan reduced motion pada jalur yang berubah.
- Existing project evidence memuat pemeriksaan browser/QA landing; unit test thesis motion tidak membuktikan lifecycle investasi.
- Batas pengujian perilaku sudah dikonfirmasi pada Q7 sesuai to-spec; persetujuan ini bukan konfirmasi seluruh spec atau implementasi.
Belum ada pengujian runtime atau test baru dijalankan pada sesi penulisan draft ini.

## Acceptance Criteria [T, draft]
1. Kedua CTA utama menyelesaikan jalur yang sesuai aktornya dan menjelaskan tahap produk.
2. Satu proyek demo menghubungkan bukti, terms, subscription, allocation, portfolio dan distribusi melalui identitas proyek yang konsisten.
3. Nilai, dokumen, akun dan transaksi sintetis diberi label simulated; Coming soon tidak dapat diinvestasikan.
4. Hak IDR, input stablecoin, biaya/konversi simulated dan status settlement terlihat sebelum allocation.
5. Produksi, billing, collection dan payment ditampilkan sebagai kejadian berbeda dengan periode/sumber.
6. Laporan hilang/stale tidak ditampilkan seolah data live atau nilai nol yang terukur.
7. Form tidak menampilkan status terkirim sebelum delivery benar-benar berhasil; preview lokal menjelaskan bahwa tidak ada pengiriman.
8. Seluruh dashboard/navigasi app, project list/detail dan dokumen memerlukan sesi wallet yang diverifikasi server; UI browser tidak memberikan role admin atau melewati resource authorization.
9. Rewards, Points dan Gen-Z Token berupa halaman informasi/Coming soon; reward flow penuh tidak menjadi acceptance MVP.
10. Hak/angka mengikuti economic model offering; principal hanya ditampilkan jika berlaku, distribusi tidak otomatis dianggap profit, dan points/native token tidak dicampur sebagai hak atau saldo investasi.
11. Skenario error utama dapat dipahami dan dipulihkan dari UI.
12. Laporan/terms yang terbit telah direview; koreksi berversi, beralasan dan mempunyai histori. Telemetry provisional berlabel dan tidak memicu pembayaran.
13. Inquiry mengikuti akses/retensi Q23, tanpa subscription marketing otomatis; inbox/provider tetap konfigurasi deployment.
14. Dokumen inti dapat dibaca setelah login sebelum eligibility transaksi; original sensitif tetap terbatas. Distribusi/claim mengikuti hak dan dana tersedia, dengan duplicate protection.
15. Satu offering demo solar hybrid menggunakan terms/angka sintetis yang konsisten; tidak menetapkan terms proyek nyata. Shared understanding terhadap scope spec konsolidasi telah dikonfirmasi founder pada 17 Oktober 2026.

## Out of Scope
- Menerima dana investasi live, menerbitkan instrumen legal, atau menjalankan distribusi nyata dari draft ini.
- KYC/AML provider, custody, payment/FX provider, production contracts atau security audit yang belum dipilih.
- Memastikan seluruh kategori showcase eligible untuk pilot.
- Swap, lending/borrowing, staking, secondary marketplace, instant exit atau transfer rutin antarinvestor pada MVP. [F, Q19; transfer rutin ditutup merupakan rancangan PM dalam mandat baseline]
- Peluncuran native token, staking wajib atau konversi poin otomatis.
- Functional rewards/points, reward eligibility/redemption/reversal, AI/compute reward integration dan integrasi banyak partner pada rilis MVP Q18.
- Klaim sensor/IoT live, on-chain production feed, stable monthly income atau regulatory status sebagai kemampuan yang sudah terbukti.
- Redesign landing, migrasi framework landing, coding fitur atau publikasi issue eksternal dalam sesi PRD ini.

## Further Notes

### Putaran 1 — disetujui founder, 16 Oktober 2026
Jawaban founder: "ya semua". Q1, Q2 dan Q3 berikut disetujui. Rekomendasi cabang putaran berikutnya belum termasuk dalam persetujuan ini.
Q1. Sumber data kinerja: apakah rilis demo memakai fixture berlabel simulated, dan pilot berikutnya mulai dengan laporan/bukti operator yang direview serta bertanggal sebelum feed IoT/on-chain live?
Keputusan [F]: ya; frekuensi pelaporan dan SLA diputuskan pada cabang berikutnya. Tidak ada komitmen data real-time.

Q2. Jalur operator: apakah rilis berikutnya memakai intake yang dibantu tim Gen-Z serta review internal, sebelum membangun portal operator self-service penuh?
Keputusan [F]: ya; masih ada reviewer/admin scenario minimum untuk satu proyek demo. Keputusan ini menentukan kedalaman onboarding, status dan permission.

Q3. Hasil Contact: apakah rilis berikutnya harus benar-benar menerima inquiry operator/investor/partner dengan status pengiriman yang dapat diverifikasi, menggantikan batas draft-lokal saat ini?
Keputusan [F]: ya, sebagai jalur discovery pre-pilot. Pilihan destination, consent/retention, spam protection dan delivery failure menyusul setelah scope ini disetujui.

### Putaran 2 — disetujui founder, 16 Oktober 2026
Jawaban founder: "ya semua" atas Q4–Q7 yang ditampilkan di chat. Keputusan yang disetujui dirangkum pada Implementation Decisions dan Testing Decisions. Detail tambahan yang tidak ditampilkan pada pertanyaan pengguna tetap rekomendasi, termasuk teknik retry/rate limit dan backend verification.
Q4. Laporan kinerja: setuju pilot dimulai dari laporan bulanan dengan produksi, invoice dan kas diterima sebagai catatan terpisah, lengkap periode, sumber, tanggal update dan status review; periode yang belum dilaporkan ditandai missing/overdue tanpa mengisi nol?
Jawaban [F]: ya. Detail turunan [R]: demo mensimulasikan data tersedia, terlambat dan dikoreksi. Tanggal jatuh tempo mengikuti kesepakatan proyek dan harus tersedia sebelum pilot, bukan kalender bulanan universal atau janji distribusi bulanan.

Q5. Intake dan review: setuju operator mengirim profil/kategori/lokasi aset, status operasi dan kebutuhan pembiayaan dahulu; tim meminta bukti kewenangan, kontrak energi, catatan produksi dan histori penerimaan kas sebelum project dipublikasikan untuk investor review?
Jawaban [F]: ya. Detail turunan [R]: intake internal memakai received → screening → needs information → due diligence → ready for publication → published, dengan rejected/withdrawn dan histori alasan. Ini status intake/review; tidak menggantikan lifecycle offering, funding atau servicing lama. Pemeriksaan internal bukan legal/regulatory approval. Demo memakai fixture dokumen; pengunggahan dokumen sensitif bukan bagian form contact publik awal.

Q6. Inquiry nyata: setuju penerimaan inquiry dibuktikan oleh penyimpanan server dan nomor referensi, lalu notifikasi ke inbox tim; kegagalan notifikasi tidak menghapus inquiry yang sudah diterima atau membuat pengiriman ulang duplikat?
Jawaban [F]: ya. Detail turunan [R]: form membatasi data ke konteks/kontak, menjelaskan pemrosesan untuk tindak lanjut, memakai validasi/rate limit, dan membedakan gagal menerima dari notifikasi tertunda. Pada putaran Q6, inbox/akses/retensi belum dipilih; Q23 kemudian menetapkan akses dan retensi. Alamat/provider tetap konfigurasi. Tidak ada pengiriman atau provisioning dalam sesi PRD ini.

Q7. Batas pengujian: setuju spec diuji pada perilaku end-to-end melalui browser untuk (1) inquiry sampai tercatat, (2) satu proyek demo sampai allocation/portfolio/report/payment, dan (3) reward eligible sampai reversal, termasuk gagal, duplikat dan akses tak sah?
Jawaban [F]: ya. Detail turunan [R]: untuk inquiry, backend persistence dan delivery status diperiksa juga; notifikasi diuji melalui penerima uji terkendali. Investasi/rewards tetap simulated. Pemeriksaan domain tambahan dipakai pada settlement/idempotency yang tidak cukup dibuktikan dari tampilan. Ini konfirmasi test seam sesuai to-spec, bukan permintaan melakukan implementasi.

### Arsip putaran 3 — status digantikan oleh keputusan 17 Oktober
Arsip pertanyaan lama, bukan requirement aktif. Review/koreksi Q8 telah diteruskan dan disetujui melalui Q21; akses dokumen Q9 diganti Q16/Q20; inquiry Q10 disetujui melalui Q23. Urutan rilis Q11 yang memuat reward penuh/wallet belakangan dan checkpoint anchor Q12 tidak disetujui; keduanya tidak mengalahkan scope terkini.
Q8. Pelaporan dan koreksi: setuju operator bertanggung jawab menyediakan data; investor hanya melihat versi yang sudah direview, lengkap periode dan timestamp; koreksi menjadi versi baru dengan alasan, sedangkan versi lama tetap dapat ditelusuri?
Rekomendasi [R]: ya. Deadline wajib diatur per proyek; jika terlewat, tampilkan overdue dan periode data terakhir yang tersedia tanpa membuat angka produksi/kas baru. Deadline demo berupa konfigurasi fixture. Review dan update laporan tidak otomatis memicu pembayaran.

Q9. Kontrol publikasi: setuju ringkasan proyek yang disetujui boleh publik, sedangkan dokumen mentah/kontrak dan laporan privat hanya untuk pihak yang diberi akses; proyek yang ditolak/ditarik tidak menjadi listing investor?
Rekomendasi [R]: ya. Reviewer berwenang mencatat checklist dan alasan sebelum publish; perubahan material harus direview ulang. Dalam demo semua dokumen sintetis; pada tahap nyata uploader tidak menyetujui bukti sendiri, mengikuti baseline separation of duties. Pengajuan yang belum lolos dapat diperbaiki/diajukan ulang lewat proses intake dengan histori, tanpa mengubah status offering secara otomatis.

Q10. Pengelolaan inquiry: setuju tahap awal hanya founder/admin berwenang mengakses inquiry; notifikasi menuju satu inbox operasional yang ditentukan saat konfigurasi; inquiry yang tidak berlanjut dihapus setelah 90 hari sejak interaksi terakhir, sedangkan yang aktif ditinjau ulang setiap 90 hari?
Rekomendasi [R]: ya sebagai kebijakan operasional awal. Tidak ada subscription marketing otomatis. Permintaan penghapusan dapat ditangani admin; retry notifikasi tidak membuat inquiry baru. Record server adalah bukti penerimaan. Alamat inbox, provider dan pengaturan retensi backup merupakan konfigurasi/dependency sebelum deployment, bukan fakta yang diasumsikan sudah tersedia. Kebijakan ini tidak diklaim sebagai penetapan kepatuhan hukum.

Q11. Urutan rilis: setuju (1) inquiry nyata dan intake minimum, (2) demo lengkap satu proyek rooftop solar ilustratif, termasuk investasi/servicing serta satu partner/reward scenario, lalu (3) wallet/testnet setelah demo tervalidasi?
Rekomendasi [R]: ya. Ini urutan pengerjaan, bukan penghapusan simulated reward dari scope demo. Milestone berbasis acceptance; tidak menetapkan tanggal launch. Teknologi solar dipilih hanya untuk fixture, bukan membatasi kategori pilot nyata. Rincian nilai/model keuangan fixture menjadi parameter sintetis yang direkonsiliasi dan berlabel, bukan terms investasi aktual.

Q12. Syarat keberhasilan: setuju kesiapan demo dinilai dari tiga alur uji Q7 yang selesai tanpa bug kritis, sedangkan validasi minat awal membutuhkan minimal satu operator bersedia membahas/membuka data dan satu calon anchor bersedia melanjutkan pembahasan?
Rekomendasi [R]: ya. Bug kritis mencakup hasil uang/points salah, akses tak sah, inquiry hilang atau jalur utama gagal diselesaikan. Bukti minat dicatat dengan konteks dan tindak lanjut; bukan komitmen pendanaan. Traffic, token price, TVL atau nominal funding bukan syarat demo. Jumlah inquiry dan tanggal discovery tidak menjadi commitment founder; angka minimum ini merupakan checkpoint evaluasi yang masih perlu disetujui. Persetujuan metrik tidak mengotorisasi pengiriman pesan eksternal.

### Batas antara keputusan spec dan konfigurasi deployment
- Spec saat ini mencakup intake/inquiry nyata dengan data kontak terbatas, wallet-authenticated app, demo investasi sintetis dan transparansi; Rewards/Points/Token sebatas informasi/Coming soon sesuai Q18.
- Live investment, legal wrapper, final credit terms, eligible countries, custody, executable FX, security review dan IoT feeds tetap fase lanjutan bersyarat; keputusan teknis/komersial lama yang sudah [F] dipertahankan.
- Actual inbox, provider, endpoint/credentials, tanggal pilot dan data counterparties harus tersedia ketika konfigurasi/operasi relevan dimulai. Nilainya tidak dikarang untuk menyelesaikan wawancara.
- Q8–Q10 diteruskan/diganti oleh Q16/Q20/Q21/Q23; Q11/Q12 tetap arsip belum disetujui. Rancangan implementasi serta milestone teknis tidak dinyatakan sebagai jawaban founder. Konfirmasi shared understanding terhadap scope spec konsolidasi telah diberikan founder pada 17 Oktober 2026.
- Batas pengujian Q7 telah disetujui dan diperbarui oleh Q18 untuk menunda functional reward; tidak perlu dimintakan ulang.


## Jawaban pascariset — Q13–Q18, keputusan founder

- **Q13 [F]:** ya; tujuh tab tetap dan structured facts + editor blok disetujui, dengan Impact di Performance & Data serta calculator di Deal Terms.
- **Q14 [F]:** founder memilih membuka hybrid/revenue participation dan mengikuti model eksplisit per offering. Ini tidak menyetujui note beramortisasi sebagai default wajib, tidak memilih parameter FLP II, dan belum menentukan fixture ekonomi pertama pada saat jawaban Q14; Q22 kemudian memilih contoh solar hybrid sintetis.
- **Q15 [F]:** ya; target individu dan institusi global, dengan eligibility transaksi dan negara aktif mengikuti jalur yang tersedia.
- **Q16 [F, koreksi rekomendasi]:** founder tetap memerlukan auth lewat wallet sebelum dashboard/navigasi app, termasuk daftar/detail proyek dan dokumen. Rekomendasi dokumen sebelum wallet connect tidak diterima. Marketing publik; informasi proyek upfront setelah login dan sebelum investasi. Policy full/redacted/restricted kemudian disetujui pada Q20.
- **Q17 [F]:** ya; monthly reviewed reports diperbolehkan ketika feed belum tersedia; API/IoT ditambahkan bila feasible dengan status/freshness/coverage.
- **Q18 [F]:** ya; MVP fokus investasi RWA/DeFi dan transparansi. Halaman Rewards/Points/Native berupa informasi/Coming soon, menggantikan kewajiban simulated reward flow penuh baseline lama pada rilis pertama.

## Jawaban lanjutan — Q19–Q23, disetujui founder

Founder menjawab ya pada masing-masing Q19–Q23 beserta rekomendasi yang ditampilkan di chat.

- **Q19 [F]:** alur investasi simulated/testnet, allocation/token posisi, portfolio, distribusi dan claim disetujui. Claim mengikuti hak investor dan dana tersedia. Swap/lending/borrowing/staking/secondary trading ditunda.
- **Q20 [F]:** dokumen inti yang disetujui dapat dibaca pengguna login wallet sebelum investasi, tanpa eligibility transaksi sebagai syarat membaca. Salinan investor dapat disunting; original sensitif dibatasi dengan alasan. Eligibility sebelum transaksi.
- **Q21 [F]:** review sebelum laporan/terms terbit, koreksi versi baru dengan alasan/histori, telemetry provisional berlabel. IoT tidak otomatis memicu pembayaran. Rincian organisasi reviewer produksi bukan fakta yang sudah tersedia.
- **Q22 [F]:** satu solar ilustratif dengan hybrid fixed payment + variable revenue participation, angka/biaya/tenor/hak expiry sintetis. Tidak menetapkan terms/model proyek nyata atau persentase benchmark.
- **Q23 [F]:** akses inquiry founder/admin berwenang, satu inbox, hapus inquiry tidak berlanjut setelah 90 hari sejak interaksi terakhir, review inquiry aktif tiap 90 hari, tanpa marketing otomatis. Alamat/provider/backup retention tetap konfigurasi.

## Konsolidasi dan batas keputusan berikutnya

Spec MVP konsolidasi tersedia pada dokumen pendamping SPEC-MVP-Gen-Z-2026-10-17.md. Keputusan produk di atas cukup untuk merangkum scope demo yang dapat ditinjau. Tidak ada jawaban Q24 baru yang diasumsikan. Detail teknis rutin mengikuti mandat PM; keputusan live yang membutuhkan issuer/operator/provider nyata didefer secara eksplisit, bukan diisi dengan data sintetis.

Baseline tahapan tetap simulated → testnet; wallet authentication wajib sejak workspace pertama sesuai Q16. Rancangan 18 Oktober memakai Base Sepolia 84532, Circle test USDC + Mock IDRX 2 decimals dan test ETH; alamat deployment/versi SDK dan engineering review diselesaikan saat implementasi; D0 tidak mengklaim mint/claim on-chain jika adapter masih simulated. Tidak ada janji tanggal atau syarat anchor baru. Shared understanding atas scope spec konsolidasi dikonfirmasi founder pada 17 Oktober 2026 dengan jawaban "ya broo" atas rangkuman penutup. Wawancara produk MVP selesai; belum ada implementasi dari sesi ini.

### Penutupan sesi
Jawaban baru harus dicatat sebagai [F] hanya setelah diberikan founder. Rekomendasi yang belum dijawab tetap [R]/[O]. Baseline PRD v1.2 tetap berlaku untuk keputusan yang belum diganti. Konfirmasi penutup menetapkan pemahaman bersama atas scope MVP; sesi dokumentasi ini tidak menyatakan fitur sudah dibangun atau transaksi live disetujui.

Skill yang dibaca: grill-me dan grilling lokal proyek. Panduan to-spec dibaca dari upstream Matt Pocock; belum terpasang lokal dan konfigurasi issue tracker belum ditemukan. Publikasi formal ke tracker membutuhkan setup tersebut. Dokumen ini adalah working draft lokal untuk ditinjau, bukan issue ready-for-agent.
