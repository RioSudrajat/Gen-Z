# Plan landing page Gen-Z

> Implementasi 14 Oktober 2026: landing HTML lokal kini lengkap. Hero memakai film pengguna dan scroll Ondo sesuai revisi terbaru. Font referensi dan light editorial body menggantikan opsi typography / theme awal. Detail final, copy, behavior, dan QA ada di [LANDING-IMPLEMENTATION.md](landing-implementation.md).

Tanggal: 13 Oktober 2026, Asia/Jakarta. Status: usulan untuk review sebelum produksi aset dan implementasi HTML.

Pembaruan brief hero: pengguna meminta seluruh kelompok energi dan infrastruktur terlihat dalam satu ekosistem sampai pembayaran ke wallet. [Daftar aset dan storyboard terbaru](hero-storyboard.md) merinci manifest, koneksi energi/kas dan master film sekitar 24 detik.

## 1. Brief dan batas produk

Gen-Z menghubungkan infrastruktur energi produktif milik mitra dengan calon investor yang memenuhi eligibility. Landing ini perlu memberi rasa skala ekosistem, menjelaskan underlying dan hak, lalu menyediakan jalur percakapan untuk investor, operator dan mitra layanan.

Acuan: [PRD](../archive/prd-2026-10-18.md), [DESIGN.md](../../DESIGN.md), [logo](../../gen-z-symbol.svg), [arsitektur aplikasi](../archive/app-architecture-2026-10-18.md), serta [audit tujuh referensi](reference-audit.md).

Yang sudah diarahkan pengguna:

- Satu landing page sinematik, direncanakan dahulu, kemudian dibuat dengan entry HTML.
- Hero video menggambarkan kategori aset Gen-Z. Gagasan headline: one electrification ecosystem, from energy to your wallet.
- Kualitas pembuka Ondo sebagai referensi; motion hero Gen-Z berbeda dari efek media mengecil.
- Reverse engineering section stack Nemesis dan penyesuaian empat layer untuk Gen-Z.
- Aset video/3D melalui Higgsfield; GSAP, Three.js, GLB dan Framer Motion membantu implementasi.
- Logo tetap file yang diberikan, palette dari DESIGN.md, copy Inggris terlebih dahulu.
- Antislop during dipilih untuk sesi ini. Preferensi global tidak diubah.

Batas dari PRD yang dipakai untuk semua copy:

- Kondisi saat ini pre-pilot; belum ada aset, mitra atau anchor konkret. Showcase dan walkthrough tidak ditampilkan sebagai platform investasi live.
- Fokus awal aset energi operasional milik mitra dengan kontrak monetisasi dan histori penerimaan kas. Solar adalah contoh; bukan satu-satunya underlying.
- Pasokan untuk compute/data center dan industri adalah konteks penggunaan energi. Gambar server tidak otomatis berarti saham atau kepemilikan data center ditawarkan.
- EV dan layanan reward merupakan ekspansi. Native token Gen-Z ditunda; tidak ada token sale pada MVP.
- Kandidat instrumen pilot project note/private credit beramortisasi. Terms dan wrapper belum final. Hak bergantung pada kontrak penerbit, bukan kepemilikan langsung yang otomatis muncul dari token.
- Closed-end: pembayaran mengikuti terms dan kemampuan proyek memenuhi kewajiban. Tidak ada janji exit instan atau likuiditas sekunder.
- Base adalah arah chain pilot. Untuk proyek dengan kas/hak IDR, input IDRX atau native USDC melalui quoted conversion mengarah ke satu hak IDR, setelah dana net settled.
- Poin, hak proyek dan native utility/governance berbeda. Poin tidak mensyaratkan investasi/staking; awarding membutuhkan layanan selesai, payment final dari mitra dan account link terverifikasi.

Seluruh copy di bawah adalah draft pemasaran yang mengikuti batas ini. Arah visual, font dan komposisi adalah rekomendasi baru, belum keputusan founder yang dicatat pada DESIGN.md.

## 2. Arah visual yang diusulkan

Design read: landing untuk calon investor dan mitra energi, dengan visual sinematik berupa infrastruktur dan aliran energi, berlandaskan komposisi custom HTML/CSS.

Dial taste: DESIGN_VARIANCE 7, MOTION_INTENSITY 7, VISUAL_DENSITY 3. Dial antislop: ENERGY 3, RHYTHM 3, MOTION 3. Hero dan stack menjadi momen gerak utama; detail rights, cash dan risk memberi jeda baca.

| Keputusan | Usulan | Alasan |
|---|---|---|
| Identitas utama | Infrastruktur nyata dalam satu diorama, dengan satu jalur mint yang menghubungkan energi, record dan cash | Mengikat visual ke underlying dan peran platform |
| Tema | Preview yang diarahkan ke charcoal; implementasi menyediakan light/dark pada tingkat seluruh halaman dan mengikuti preferensi sistem | Menghasilkan kedalaman sinematik sambil menjaga pilihan baca |
| Palette | Charcoal #1A1D23, panel #22262E/#2B3038, text #F4F4F5, satu keluarga mint/teal | Mengikuti DESIGN.md dan menyisakan aksen untuk hierarki |
| Light theme | #FAFAFA, text #111827/#4B5563, link #0F766E | Memakai pasangan warna yang sudah tercatat pada panduan |
| Primary CTA | #2DD4BF dengan teks #050505; hover #14B8A6 | Teks putih pada teal bukan pasangan yang dipilih |
| Logo | gen-z-symbol.svg asli dengan fill #B9F8D7; wordmark teks Gen-Z sebagai pendamping | Menjaga aset brand yang diberikan |
| Typography | Manrope untuk display dan body, self-hosted WOFF2; normal 400/500, headline 600/700 | Bentuk geometris terasa modern tanpa mengorbankan pembacaan istilah keuangan |
| Radius | Button/input 12px, panel 20px, diagram plate chamfered; pills hanya jika status benar-benar perlu | Menjaga konsistensi sambil membedakan objek dan kontrol |
| Ruang | Container maksimum sekitar 1320px; gutter desktop 48-64px, mobile 20px; section 80-128px desktop | Menempatkan aset besar dan memberi jeda pada informasi padat |
| Cahaya | Mint pada satu jalur energi atau layer terpilih, material metal matte dan kaca terbatas | Cahaya menunjukkan relasi atau pilihan aktif |

Di light mode, footage hero tetap media dengan overlay baca yang diuji; permukaan navigasi, body, kontrol dan panel berubah secara konsisten. Tidak ada perubahan tema otomatis ketika scroll. Logo tidak diwarnai ulang; bila perlu, light mode memberinya permukaan charcoal kecil.

Tidak ada logo wall, angka TVL/APY, testimonial, badge audited, atau feed artikel tanpa materi nyata. Informasi pre-pilot memakai teks status biasa, bukan badge dekoratif.

## 3. Peta satu halaman

Header dan footer mengapit sepuluh section konten. Dua section pendek, thesis dan participation, menjadi jeda; halaman tidak terdiri dari sepuluh hero berurutan.

| Urutan | Section / anchor | Pertanyaan yang dijawab | Bentuk |
|---|---|---|---|
| 1 | Hero / #top | Gen-Z menghubungkan apa? | Video full bleed, satu headline dan CTA |
| 2 | Electrification thesis / #why | Kenapa energi dan modal perlu terhubung? | Pernyataan editorial singkat dan satu hubungan visual |
| 3 | Asset universe / #assets | Infrastruktur seperti apa yang dimaksud? | Satu stage aset besar dengan empat pilihan kategori |
| 4 | Gen-Z stack / #stack | Apa fungsi setiap lapisan? | Empat layer isometrik selectable dan detail |
| 5 | Asset to wallet / #how-it-works | Bagaimana lifecycle investasi dirancang? | Lima chapter, satu proyek yang berlanjut |
| 6 | Evidence / #evidence | Bagaimana operasi dan kas dibedakan? | Diagram hubungan energi, invoice, cash |
| 7 | Platform walkthrough / #platform | Apa yang akan pengguna lihat? | Demonstrator komponen dengan tab Assets, Portfolio, Rewards |
| 8 | Ecosystem roles / #ecosystem | Apa manfaatnya untuk peran gua? | Komposisi tiga peran dan ringkasan reward |
| 9 | Before participation / #participation | Apa batas penting yang perlu diketahui? | Empat disclosure yang spesifik |
| 10 | Pilot inquiry / #contact | Bagaimana mulai percakapan? | Intake peran yang sederhana |

Header: logo/Gen-Z, Assets, Stack, How it works, Platform, lalu CTA Discuss a pilot. Pada mobile memakai tombol Menu dan panel dengan urutan link yang sama. Tinggi desktop target 72px, seluruh label satu baris. Theme switch berada sebagai utility yang berlabel.

Footer: logo, kalimat identitas, link ke Assets, Stack dan Before participation serta kontrol tema. Link legal, social, docs atau app eksternal hanya hadir ketika tujuan nyata tersedia. Tidak ada href kosong atau link # yang berpura-pura menjadi halaman.

## 4. Section dan copy lengkap

### 4.1 Hero

Status plain text: **In development**.

H1: **One electrification ecosystem. From energy to your wallet.**

Subcopy: **Connecting productive energy infrastructure with eligible capital, project reporting, and a growing ecosystem of partner services.**

Primary CTA: **View platform walkthrough**. Aksi: anchor #platform.

Secondary CTA: **Propose an asset**. Aksi: #contact dengan peran operator terpilih.

Hero berisi empat unit teks: status, headline, subcopy, CTA row. Display desktop sekitar 56-72px; target dua baris pada desktop normal. Mobile memakai ukuran sekitar 34-42px dan boleh tiga baris agar CTA tetap terlihat. Pemisahan visual baris menempatkan kalimat pertama dan kedua secara alami.

Video: satu diorama yang memperlihatkan solar, wind dan kandidat generation lain; jaringan/substation, BESS, data center, industri, EV charging dan battery swap. Semua cluster mendapat bagian yang jelas, lalu narasi mengikuti tagihan, kas diterima dan pembayaran ke wallet investor. Visual ekspansi tetap dibedakan dari proyek live. Manifest dan storyboard rinci ada pada [brief hero terbaru](hero-storyboard.md).

### 4.2 Electrification thesis

Headline: **Electricity powers progress. Capital powers electricity.**

Body: **Productive energy infrastructure needs capital, operating evidence, and clear investor rights. Gen-Z brings those pieces into one planned platform.**

Tiga hubungan pada visual, bukan tiga feature cards: **Operating infrastructure**, **Project evidence**, **Eligible capital**.

Penutup pendek: **Starting with partner-owned assets in Indonesia.**

Fungsi: memberi konteks setelah adegan sinematik, tanpa grafik makro atau angka demand yang memperpanjang narasi. Jalur mint dari akhir hero muncul kembali di sini sebagai hubungan antarobjek.

### 4.3 Asset universe

Headline: **Real infrastructure. Productive energy.**

Body: **Our initial focus is operating partner assets with monetisation contracts and a track record of cash collection.**

Pilihan kategori dan deskripsi:

| Label | Copy detail | Status konteks |
|---|---|---|
| Renewable generation | **Solar and other renewable generation assets with documented operating and commercial records.** | Initial focus; gambar solar sebagai contoh |
| Storage & grid support | **Storage and supporting infrastructure that help renewable power reach productive demand.** | Candidate infrastructure; eligible per proyek |
| Power for compute & industry | **Energy infrastructure serving data centres, industrial sites, and other contracted customers.** | Demand/use case; bukan janji investasi server |
| EV energy infrastructure | **Charging and battery-swap infrastructure as a potential expansion of the energy ecosystem.** | Expansion |

Catatan bawah: **Illustrative asset categories. No live investment listings are available.**

Desktop: empat tombol kategori di sisi stage, satu model/render yang berubah. Tombol terpilih mempunyai state yang jelas. Mobile: daftar selector dua kolom atau tab scroll native yang tidak menimbulkan overflow halaman, render di atas detail. Tidak ada autoplay carousel.

### 4.4 Gen-Z stack

Headline: **The Gen-Z stack. Built from the ground up.**

Body: **Four connected layers link partner infrastructure, project evidence, financial servicing, and the people using the platform.**

Urutan visual paling bawah ke paling atas:

| Layer | Nama | Copy detail | Label pendamping |
|---|---|---|---|
| 1 | Gen-Z Infrastructure | **Partner-owned energy assets form the foundation. Eligibility depends on operating records, commercial contracts, and project due diligence.** | Renewable generation; Storage & grid support; Contracted energy supply |
| 2 | Gen-Z Network | **The coordination and verification layer connects operating records, billing evidence, and cash reconciliation for each project.** | Operating records; Billing evidence; Cash reconciliation |
| 3 | Gen-Z Finance & Settlement | **Planned funding and servicing connect eligible subscriptions, project rights, and repayment records. For IDR projects, supported inputs settle into IDR-denominated rights.** | IDRX & USDC inputs; Project rights; Repayment servicing |
| 4 | Gen-Z Apps & Ecosystem | **Investor workspaces, operator reporting, and partner-service rewards make the infrastructure understandable and usable.** | Investor workspace; Operator reporting; Partner rewards |

Caption: **Concept architecture. Base is the selected pilot chain; live integrations and offerings remain subject to readiness.**

Nama Layer 3 diubah dari usulan DeFi & Liquidity menjadi Finance & Settlement. Istilah itu sesuai subscription, records dan servicing pada PRD; marketplace sekunder dan AMM bukan scope MVP. Layer 2 tidak diklaim sebagai chain Gen-Z baru atau DePIN terdesentralisasi yang sudah beroperasi.

Interaction hint fungsional pada controls: **Select a layer to see its role.** Tidak menggunakan label scroll dekoratif.

### 4.5 Asset to wallet

Headline: **Follow the project from funding to repayment.**

Body: **Each project has its own terms, records, and repayment path. The walkthrough shows the intended lifecycle, not an investment offer.**

Lima chapter:

| Chapter | Copy |
|---|---|
| Review the asset | **Understand the operator, contracts, operating history, risks, and use of funds.** |
| Understand your rights | **Review the instrument, eligibility, fees, tenor, and transfer restrictions before any subscription.** |
| Subscribe through approved rails | **Planned IDRX or native USDC inputs use disclosed quotes where conversion is needed. Allocation follows reconciled, net settled funds.** |
| Follow operations and collections | **Read energy records, invoices, and cash receipts as separate evidence of project performance.** |
| Track principal and income | **Payments follow the instrument and available project cash. Principal returned and income received are reported separately.** |

Seluruh chapter dapat dipilih langsung. Lima label bermakna menggantikan Step 1/Step 2 dekoratif. Tidak ada animasi yang menghubungkan kWh langsung menjadi pembayaran otomatis. Risiko shortfall/default tetap disebut pada disclosure.

### 4.6 Evidence

Headline: **Energy. Invoices. Cash. See the difference.**

Body: **Production shows what an asset delivered. Invoices show what was billed. Cash records show what was actually collected.**

Tiga node berhubungan:

- **Energy records:** **Meter readings and operating reports describe physical performance.**
- **Billing records:** **Contract terms and invoices explain amounts charged to customers.**
- **Cash records:** **Collection evidence supports reconciliation and repayment decisions.**

Insight yang tetap terlihat: **A meter reading is not proof of payment.**

Diagram memperlihatkan satu project record menghubungkan ketiganya. Klik node membuka explanatory detail; tidak membuat angka atau dokumen palsu yang tampak terverifikasi. Jika contoh record dipakai, label **Illustrative record** melekat pada contoh itu, bukan hanya di footer.

### 4.7 Platform walkthrough

Headline: **See the asset. Understand the terms. Follow the cash.**

Body: **Preview the planned workspace for reviewing projects, following investment records, and understanding partner rewards.**

Status dekat demonstrator: **Interactive concept. No real funds or rewards.**

| Tab | Copy dan materi demonstrator |
|---|---|
| Assets | **Review the operator, rights, operating evidence, and risks before deciding whether a project fits your mandate.** Satu contoh asset overview; dokumen ilustratif jelas berlabel, kategori lain Coming soon. |
| Portfolio | **Keep outstanding principal, principal returned, and income received separate. Follow payment status and project updates.** Demonstrator state empty/reporting/overdue; nominal hanya bila fixture disepakati dan berlabel Simulation. |
| Rewards | **Eligible partner services can support loyalty points after service completion, final payment confirmation, and verified account linkage.** Demonstrator service/payment/account-link checks, dengan pending/available/reversed sebagai state simulasi. |

Copy native token dalam detail Rewards: **The native Gen-Z token is deferred. It is separate from project rights and is not available for sale.**

Demonstrator adalah komponen mini yang berfungsi, bukan gambar dashboard palsu dari kotak CSS. Bila screenshot aplikasi asli nanti tersedia, bisa menggantikannya. Scope landing tidak membangun auth, wallet checkout atau dashboard penuh.

### 4.8 Ecosystem roles

Headline: **Different roles. Connected by energy.**

Body: **The ecosystem is designed for people allocating capital, operating infrastructure, and using eligible partner services.**

| Peran | Copy | Aksi |
|---|---|---|
| Investors | **Assess individual projects with clear terms, evidence, and reporting. Access will depend on eligibility and permitted jurisdictions.** | Discuss an investment mandate, mengisi peran investor di #contact |
| Asset operators | **Bring operating records and commercial contracts. Help shape an asset onboarding and reporting process around your infrastructure.** | Propose an operating asset, mengisi peran operator di #contact |
| Service partners | **Explore funded loyalty programmes that recognise completed, paid, and linked service transactions.** | Discuss a service partnership, mengisi peran service partner di #contact |

Keterangan rewards: **Partner programmes are not live. Future eligibility and benefits will follow programme terms. Investing or staking is not a requirement for points.**

Layout: satu komposisi radial atau tiga jalur teks menuju infrastructure stage, dengan investor/operator mendapat ruang utama. Pada mobile urutan baca linear. Role buttons adalah pintasan ke satu intake, bukan tiga formulir berbeda.

### 4.9 Before participation

Headline: **Before you participate.**

Intro: **Know the stage, rights, and limits of the product.**

Empat disclosure berbentuk detail yang dapat dibuka, dengan ringkasan tetap terlihat:

1. **Current stage:** **Gen-Z is in pre-pilot development. The current experience demonstrates a product concept and does not accept real investment funds.**
2. **Project rights and risk:** **Project rights depend on final issuer documents. Returns and principal repayment are not guaranteed, and project losses or delays are possible.**
3. **Tenor and liquidity:** **Projects are intended to be closed-end. Early exit or secondary liquidity is not promised. Payment schedules depend on the selected instrument.**
4. **Points and native token:** **Points are a separate loyalty programme. The native token is deferred and does not represent company shares or automatic project revenue rights.**

Ini disclosure produk berdasarkan PRD, bukan FAQ yang mengaku berasal dari pertanyaan pengguna nyata. Tidak menambah pertanyaan template.

### 4.10 Pilot inquiry

Headline: **Help shape the first Gen-Z pilot.**

Body: **Share an investment mandate, an operating energy asset, or a service partnership you want to discuss.**

Role selector: **Investor**, **Asset operator**, **Service partner**.

Field labels: **Name**, **Work email**, **Organisation (optional)**, **What would you like to discuss?**

Untuk prototype lokal, tombol: **Prepare inquiry**. Action nyata: validasi input lalu menyiapkan draft inquiry yang dapat diunduh/disalin. Success: **Your inquiry draft is ready. Download or copy it to share.** Status plain text: **Prototype form. No inquiry is sent from this page.** Tidak menampilkan klaim lead sudah diterima.

Untuk situs publik, tombol dapat menjadi **Send inquiry** setelah penerima/endpoint dan privacy notice nyata tersedia. Destination ini masih terbuka; tidak mengarang email, CRM atau subscription newsletter.

Copy error: **Enter your name.**, **Enter a valid work email.**, **Tell us what you would like to discuss.** Error ditautkan ke field; input tetap tersimpan ketika submit gagal.

Footer copy: **Connecting productive energy infrastructure, project evidence, and eligible capital.** Diikuti ringkasan pre-pilot dan link Before participation.

## 5. Motion dan scroll choreography

### Hero: transisi aliran energi

Usulan utama adalah framing video full bleed yang ukurannya tetap. Motion terjadi pada adegan dan hubungan ke section berikutnya.

1. Saat load, poster tampil terlebih dahulu; H1/subcopy/CTA terbaca tanpa menunggu video. Intro copy ringan sekitar 600-800ms, satu kali.
2. Master video loop sekitar 24 detik memperlihatkan seluruh cluster dan penutup wallet dengan gerak kamera yang konsisten. Opening wide menampilkan seluruh ekosistem sejak awal. Durasi ini target kreatif dan memerlukan beberapa segmen/render, sesuai [storyboard terbaru](hero-storyboard.md). Headline tidak dibakar ke video.
3. Saat scroll keluar hero, copy bergeser sekitar 24-40px dan memudar. Jalur mint muncul menuju hubungan pada section thesis. Media tetap full bleed, scale 1 dan radius tetap.
4. Video berhenti saat tidak terlihat. Tidak mengikat currentTime video ke scrollbar, agar decoding dan seeking tidak menyebabkan stutter mobile.
5. Reduced motion dan Data Saver menggunakan poster; tombol play opsional dapat menjalankan video atas pilihan pengguna. Pause/play memiliki nama yang jelas.

GSAP/ScrollTrigger mengatur opacity/transform dan hubungan antarsection. Jalur yang dibuat dengan Three.js adalah diagram fungsional aliran pada scene, bukan gambar infrastruktur yang dipalsukan dengan div/SVG.

### Ritme seluruh halaman

| Bagian | Gerak | Tujuan | Mobile / reduced motion |
|---|---|---|---|
| Nav | Surface/border menjadi jelas setelah hero, tetap 72px | Menjaga link terbaca di footage dan body | Menu native semantik, tanpa transform besar |
| Hero | Video dan transisi aliran | Menghubungkan kategori aset dengan ekosistem | Poster, natural scroll |
| Thesis | Hubungan tiga objek muncul berurutan sekali | Menjelaskan hubungan aset, bukti dan modal | Diagram statis |
| Asset universe | Crossfade render/model saat kategori berubah, 250-400ms | Feedback pilihan kategori | Render ringan dan tombol tap |
| Stack | Entrance separation singkat; layer terpilih diberi depth/fokus | Mengungkap ketergantungan empat lapisan | Accordion, static poster dan tombol |
| Lifecycle | Chapter aktif mengganti penjelasan dan objek terkait | Mengikuti satu proyek | Vertical steps; semua dapat dipilih |
| Evidence | Sorotan satu jalur/node berdasarkan pilihan | Membedakan produksi, tagihan dan penerimaan | Diagram/list statis |
| Walkthrough | Tab/panel transition 180-250ms | Menjelaskan perubahan state | Instant pada reduced motion |
| Roles | Reveal sekali dengan offset kecil | Memperkenalkan tiga jalur partisipasi | Urutan teks linear |
| Disclosures | Buka/tutup mengikuti kontrol | Membantu membaca detail tanpa membanjiri halaman | Native details jika JS tidak tersedia |
| Inquiry | Validasi, feedback dan status | Memberi kepastian atas aksi pengguna | Fokus berpindah ke error/status |

Natural scroll adalah dasar. Maksimum satu pinned narrative, pada stack, hanya desktop dengan tinggi viewport yang cukup. Jika dipakai: start top top, total tambahan scroll sekitar 1-1,5 tinggi viewport, scrub singkat; tidak ada snap paksa. Tombol Next section selalu tersedia saat pin aktif. Di viewport pendek, mobile dan reduced motion, pin ditiadakan.

Lifecycle memakai panel sticky dalam layout biasa, bukan pin kedua. Tidak ada custom cursor, auto-carousel, horizontal scroll hijack, atau animasi tanpa fungsi. GSAP dan Framer Motion tidak mengubah properti yang sama pada elemen yang sama.

## 6. Reverse engineering stack Nemesis

File yang ditelusuri: [NemesisStackSection.tsx](https://github.com/RioSudrajat/Nemesis-Protocol/blob/main/frontend/src/components/landing/NemesisStackSection.tsx), branch main pada tanggal riset. [Referensi lokal](references/NemesisStackSection.reference.tsx) disimpan untuk analisis.

| Aspek asli | Hasil inspeksi |
|---|---|
| Data | LAYERS dengan id, level, title, description, chips dan sisi anotasi |
| Order | apps, defi, depin, physical dari atas; SVG digambar dari bawah ke atas |
| Perspektif | Proyeksi x = (x-y) cos(30°), y = (x+y) 0,5-z |
| Geometry | Footprint 280 x 280, chamfer 32, tebal slab 34, gap 76, empat layer |
| ViewBox | 880 x 720; tinggi render 650, posisi dipusatkan |
| Foundation | Gambar /images/ecosystem-ev.png di dalam SVG |
| Layer atas | SVG slabs, cubes dan dinding glass; bukan model Three.js/GLB |
| Default | State active dimulai pada depin |
| Select | onMouseEnter dan onClick pada grup/slab mengubah active |
| Dim | Visual nonaktif opacity 0,12; anotasi dim sekitar 0,22 |
| Reset | onMouseLeave wrapper mengubah active menjadi null |
| Detail | AnimatePresence mode wait; transisi sekitar 0,3s, y masuk 10px dan keluar -10px |
| Scroll | Heading masuk saat in view; tidak ada GSAP pin/scrub pada file stack |

Adaptasi Gen-Z mempertahankan empat lapisan, perspektif isometrik, foundation fisik, anotasi kiri/kanan dan panel detail berdasarkan selection. Konten diperbarui sesuai bagian 4.4.

Perubahan yang disengaja:

- Foundation memakai solar, storage/substation dan pasokan industri/compute, sesuai fokus energy-first.
- Three.js memakai orthographic camera untuk rasa isometrik dan GLB modular untuk aset. Plate adalah geometri diagram fungsional, bukan upaya menggambar aset fisik dengan CSS.
- Default layer Infrastructure. Klik/tap mengunci pilihan; meninggalkan scene tidak menghapus panel detail. Desktop hover hanya preview sementara jika belum ada pilihan yang dikunci.
- Semua layer mempunyai tombol HTML di luar canvas. Canvas raycast memanggil selection state yang sama. Keyboard tidak bergantung pada canvas.
- Fokus visual tidak meredupkan teks penting. Text labels tetap contrast AA; hanya geometry yang boleh redup sekitar 0,4-0,6. Angka ini target visual, bukan hasil QA.
- Panel detail berada di kanan pada desktop lebar dan langsung di bawah stage pada ukuran menengah. Mobile menggunakan empat disclosure berurutan dengan poster yang dapat diganti.
- Stage ditata responsif mengikuti container; tidak memaksakan SVG width/height asli pada layar kecil.
- Scroll entrance dan optional pin merupakan enhancement Gen-Z, bukan perilaku yang ditemukan pada source Nemesis.

## 7. Rencana aset Higgsfield

Higgsfield sudah dipakai untuk membaca katalog/constraints pada sesi planning. Belum ada video, model atau generation berbayar yang dibuat. Harga/credit final belum tersedia dari hasil katalog yang diperiksa, sehingga tidak diisi angka perkiraan.

Kandidat terverifikasi melalui tools:

- **Seedance 1.5 Pro**, id seedance1_5: durasi 4/8/12 detik, resolusi sampai 1080p, aspect ratio termasuk 16:9 dan 21:9, mendukung start/end image dan generate_audio=false.
- **Seedance 2.0**, id seedance_2_0: opsi 4-15 detik dengan references; alternatif jika kontrol continuity dari keyframe dibutuhkan. Final pilihan setelah melihat test shot.
- **Meshy 6 Text to 3D**, id meshy_v6_text_to_3d: GLB, full mode untuk texture, target polycount dan PBR. Kandidat awal 10-20 ribu polygon per aset, lalu optimasi dan pemeriksaan silhouette.
- **Meshy 7 Image to 3D** tersedia sebagai alternatif jika render/keyframe yang dipilih menjadi referensi bentuk.
- **Higgsfield 3D Jutsu** menyediakan assembly scene dan export GLB melalui capability scene builder; dapat dipakai untuk konsistensi diorama dan render.

| Aset | Pemakaian | Output rencana | Prioritas |
|---|---|---|---|
| Diorama energi utama | Hero dan foundation stack | GLB scene modular, render master, loop desktop | Wajib |
| Solar, wind, hydro, geothermal, biomass/biogas modules | Seluruh cluster generation pada diorama dan pilihan Assets | GLB + render WebP/AVIF | Wajib dalam manifest visual usulan |
| Storage/substation module | Diorama dan pilihan Assets | GLB + render | Wajib |
| Power-for-compute module | Visual demand dari pasokan energi | GLB/render yang memisahkan load dari underlying | Wajib |
| EV charging dan battery-swap modules | Cluster mobilitas dengan kendaraan dan battery packs | GLB/render; masing-masing tampil jelas | Wajib dalam brief hero |
| Project records, Gen-Z hub dan wallet | Penutup collection, servicing dan pembayaran investor | Scene elements + overlay presisi | Wajib |
| Hero desktop | Full bleed | MP4 H.264 dan WebM bila hasil transcode memenuhi target | Wajib |
| Hero mobile | Framing portrait yang dirancang terpisah | Poster; video 9:16 singkat opsional | Wajib poster |
| Stack fallback | WebGL off/reduced motion/error | Poster dan empat render selection | Wajib |

Urutan produksi: pilih satu master art direction, buat model/render yang koheren, susun scene, render keyframe, lalu animasikan hero melalui Higgsfield. Video dan GLB memakai objek/material yang sama sejauh workflow memungkinkan. Logo dirender sebagai overlay HTML/SVG asli; tidak diminta digambar ulang oleh model generatif.

### Brief hero siap produksi

Prompt draft:

> A cinematic product film showing one coherent electrification ecosystem. Use the locked master scene and asset manifest: ground and rooftop solar, wind turbines, hydro, geothermal and biomass/biogas generation; connected substation, distribution, battery energy storage and metering; clearly recognisable data-centre, industrial, EV charging and battery-swap districts. Show physical energy flow first, then distinct project operating records, billing, confirmed cash collection and a project payment reaching an investor wallet. Maintain consistent engineered proportions, physically based matte materials, charcoal environment and restrained mint/teal light. Preserve every object and its position between shots. Calm camera motion, no fast cuts. Leave negative space for HTML headline and buttons. No generated text, numbers, logos, coins, people or performance indicators. Return to the opening composition for an inspected loop. Silent.

Storyboard sekitar 24 detik, durasi adalah target kreatif. Shot dan manifest lengkap mengikuti [brief hero terbaru](hero-storyboard.md):

| Waktu | Isi adegan | Makna |
|---|---|---|
| 0-3s | Opening wide seluruh ekosistem | Semua kategori terbaca sejak awal |
| 3-7s | Kelompok generation terlihat lebih dekat | Solar, wind dan kandidat sumber energi lain |
| 7-10s | Grid/substation, BESS dan meter | Koordinasi energi dan storage |
| 10-16s | Data center, industry, charging dan battery swap | Productive demand dan layanan |
| 16-19s | Record operasi, invoice dan cash receipt | Operasi dibedakan dari kas diterima |
| 19-22s | Project servicing dan wallet investor | Pembayaran berdasarkan hak proyek |
| 22-24s | Pullback menuju framing opening | Seluruh ekosistem dan loop |

Tidak ada janji seamless loop hanya dari prompt. Hasil diperiksa frame awal/akhir, flicker, geometri, continuity dan framing; lakukan loop edit/transcode jika perlu. Target output mobile bukan crop acak dari pusat desktop yang memotong aset atau CTA.

## 8. Rencana implementasi HTML dan pembagian library

Prototype berentry **index.html**, HTML semantik untuk seluruh section, CSS variables dan ES modules. Tidak menginisialisasi Next.js atau backend investasi untuk landing ini. Folder belum berisi package.json/app runnable; dependencies perlu dipasang dan dikunci saat implementasi.

Framer Motion adalah library React. Agar memenuhi permintaan literal Framer Motion sambil tetap HTML-first, usulan ini memakai **React island kecil dan lazy-loaded** untuk controls/detail stack serta demonstrator. Mayoritas halaman tetap source HTML. Vite menjadi build/dev tool, bukan framework aplikasi; output tetap static index.html dan aset.

| Bagian | Pemilik |
|---|---|
| Layout, navigation anchors, disclosures, progressive fallback | HTML/CSS dan JavaScript biasa |
| Hero transition, section orchestration, optional stack pin | GSAP + ScrollTrigger, menggunakan gsap.matchMedia |
| Model GLB, camera, raycast, lighting, per-layer scene | Three.js + GLTFLoader |
| Tab/detail changes pada React island | Framer Motion, melalui AnimatePresence dan motion components |
| State selection | Satu controller yang dibagi dengan scene; tidak menghitung scroll lewat React state |
| Asset loading/status | LoadingManager + HTML status dan fallback render |

Jika HTML tahap pertama dimaksudkan sebagai tanpa React sama sekali, alternatif adalah Motion versi JavaScript resmi untuk animate/inView, lalu motion/react saat migrasi aplikasi. Alternatif itu bukan package framer-motion; tidak boleh diklaim memakai Framer Motion literal. Default usulan di sini tetap island supaya empat teknologi yang diminta terakomodasi.

Dokumentasi yang diperiksa: [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/), [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [Three.js](https://threejs.org/docs/), [Motion JavaScript](https://motion.dev/docs/quick-start), [Motion React](https://motion.dev/docs/react).

Struktur file yang diusulkan:

```text
landing/
  index.html
  package.json
  src/
    styles.css
    main.js
    motion/scroll.js
    scene/stack.js
    scene/loaders.js
    islands/StackControls.jsx
    islands/PlatformPreview.jsx
    content/en.js
    content/id.js
  public/assets/
    gen-z-symbol.svg
    fonts/
    video/
    models/
    posters/
```

English-first sesuai DESIGN.md. Content disiapkan agar terjemahan Indonesia tidak mengubah markup; tombol bahasa Indonesia hanya dikirim jika terjemahan benar-benar lengkap. Dokumentasi tetap Indonesia.

## 9. Responsive, accessibility dan state

Target inspeksi implementasi: 360, 390, 768, 1024 dan 1440px, ditambah desktop viewport pendek dan zoom 200%. Angka ini target QA, bukan hasil pengujian yang sudah dilakukan.

- Hero memakai min-height 100svh/100dvh sesuai kestabilan browser dan area aman; CTA tidak tertutup nav, video controls atau keyboard.
- Mobile memakai poster dahulu, ukuran H1 adaptif, satu kolom dan tap target minimum 44px. Scroll horizontal hanya pada strip yang jelas dapat digeser, bukan body halaman.
- Skip link, urutan heading, anchor offset untuk nav sticky, tombol Menu dengan aria-expanded, Escape/return focus untuk dialog.
- Tabs mengikuti tablist/tab/tabpanel, roving focus dan arrow keys. Layer selection memakai controls HTML dan tetap dapat dibaca tanpa WebGL.
- Tidak membuat teks menjadi opacity 0 hanya karena JS/motion gagal. HTML fallback sudah terlihat; enhancement aktif setelah library siap.
- Loading GLB menampilkan status yang terlabel; failure menampilkan poster dan Try loading 3D again. WebGL context lost tidak menghapus informasi layer.
- Data preview memiliki empty, loading, error, ready serta delayed/overdue bila relevan. State finansial berbeda secara kata dan simbol, bukan warna saja.
- prefers-reduced-motion menonaktifkan parallax, auto-loop dan pin. Semua detail tetap tersedia. Pengguna dapat pause video; tidak ada audio autoplay.
- Kontras hero diuji terhadap frame terburuk melalui overlay yang konsisten. Rasio warna solid pada [panduan palette](colors.md) bukan pengganti pengujian footage.

## 10. Performance budget dan pengujian

Budget di bawah adalah target implementasi, bukan spesifikasi output Higgsfield atau capaian runtime:

- Poster hero mobile sekitar 150-250KB, desktop sekitar 250-400KB bila kualitas memungkinkan.
- Master video desktop sekitar 24 detik target 4-8MB setelah kompresi bila kualitas memungkinkan; ukuran adalah target, bukan hasil terukur. Mobile poster sebagai default, video opsional yang tetap mempertahankan kategori aset target maksimal sekitar 2-3MB.
- GLB stage pertama target sekitar 1,5-3MB; models berikutnya lazy-loaded. KTX2 dan Draco/Meshopt digunakan jika format hasil optimasi memerlukannya.
- Maksimum satu WebGL renderer aktif, DPR mobile dibatasi sekitar 1,5. Stage lain memakai render fallback bila tidak sedang diinteraksikan.
- Three.js/React island dimuat mendekati section, bukan menghambat poster/HTML hero. Pause render ketika offscreen; dispose geometry/material/texture ketika tidak dipakai.
- Reserve ukuran media/fonts, local version-pinned dependencies dan font-display swap. Tidak memakai latest pada URL production.
- Target Core Web Vitals: LCP <2,5s, INP <200ms, CLS <0,1. Hasil aktual diukur setelah implementasi, termasuk perangkat mobile dan throttling.

Click-through yang wajib direkam saat HTML tersedia:

| Kontrol | Bukti yang diperlukan |
|---|---|
| Nav dan CTA | Mencapai section yang tepat, focus/offset tidak tertutup nav |
| Mobile menu | Buka, pilih tujuan, tutup, Escape dan focus kembali |
| Theme | Seluruh halaman berubah konsisten; kontras diuji di kedua mode |
| Video | Play/pause nyata; poster tetap terbaca ketika autoplay ditolak |
| Asset categories | Semua pilihan mengubah model/render dan detail yang sesuai |
| Stack | Empat layer bisa dipilih via pointer, touch dan keyboard; scene/detail sinkron |
| Lifecycle | Semua chapter bisa dipilih; tidak kehilangan informasi saat scroll/pin dimatikan |
| Evidence | Pilihan node mengubah detail; tidak menyatakan data ilustratif sebagai proof nyata |
| Platform tabs | Assets/Portfolio/Rewards dan state kosong/gagal/tertunda tampil benar |
| Disclosures | Buka/tutup dan dibaca keyboard; ringkasan batas tetap terlihat |
| Inquiry | Invalid input menampilkan error; valid input menghasilkan draft lokal; tidak mengklaim email terkirim |
| Failure paths | JS off, video fail, GLB fail/context lost, slow network, reduced motion dan short viewport |

## 11. Urutan kerja setelah plan dipilih

1. Kunci copy/section dan art direction dari usulan ini; status produk dari PRD tetap menjadi acuan.
2. Produksi satu master diorama dan test video melalui Higgsfield. Review continuity, logo asli, footprint, crop dan ukuran file sebelum membuat seluruh variasi.
3. Susun HTML/CSS dengan konten nyata dan fallback poster; semua anchor, menu, disclosures dan inquiry draft bekerja.
4. Tambahkan stack GLB dan satu state selection yang dapat diakses; pertahankan fallback static.
5. Tambahkan GSAP choreography dan Framer Motion island dengan pembagian pemilik yang jelas; reduced motion selesai dalam tahap yang sama.
6. Jalankan browser QA, cek console, semua kontrol, kedua tema, mobile, zoom dan performance; perbaiki temuan material.
7. Serahkan HTML preview lokal dan catatan pengujian. Publishing/deployment di luar tahap planning/HTML lokal ini.

Scope cut jika aset atau performa tidak layak: pertahankan hero video dan stack interaktif, gunakan render 2D untuk kategori aset, serta hentikan pin bila tidak membantu pembacaan. Konten, accessibility, state, disclosures dan interaksi inti tidak dipotong.

Dependency yang masih terbuka: tujuan kontak produksi, URL aplikasi yang benar-benar tersedia, materi screenshot aplikasi asli, final hasil generation serta quote credits. Tidak diperlukan untuk menyelesaikan plan; prototype dapat memakai anchor dan draft intake lokal.

## 12. Pre-flight planning dan Delivery Gate

Status berlaku untuk **artefak plan dan riset**, bukan halaman yang sudah dibuat. Tidak ada klaim runtime UI lulus.

### Hard Gate antislop

- R-02 PASS: draft copy dan dokumen baru tidak menggunakan karakter em dash.
- R-03 TERTUNDA runtime: breakpoint, overflow, tap target dan mobile fallback ditetapkan pada bagian 9; belum ada HTML untuk diuji.
- R-17 PASS: tidak ada traction, APY, TVL atau statistik pemasaran Gen-Z yang diciptakan. Durasi, geometry dan budgets diberi konteks teknis/target.
- R-18 PASS: testimonial dan profil rekaan tidak diusulkan.
- R-23 PASS: logo/video/3D dan perencanaan layout diminta eksplisit; plan tidak menghasilkan aset final atau mengganti logo.
- R-24 PASS pada plan: setiap item nav/CTA dipetakan ke anchor/action yang tercantum. Tujuan eksternal yang belum ada dikeluarkan.
- R-25 TERTUNDA runtime: pasangan solid memakai panduan palette; kontras image/frame/overlay/focus menunggu implementasi.
- R-26 PASS pada spesifikasi: action setiap kontrol ditentukan; inquiry prototype menghasilkan draft, bukan submit palsu. Click-through masih tertunda.
- R-27 PASS pada spesifikasi: empty/loading/error dan failure media/WebGL dicatat; rendering belum diuji.
- R-28 PASS: tidak membuat FAQ yang diklaim berasal dari pengguna; disclosure berasal dari batas PRD.
- R-32 TERTUNDA runtime: keyboard, focus, Escape, tab semantics dan canvas fallback tercantum, belum diuji.
- R-33 PASS: dokumen ditulis langsung; source UI/CSS tidak diubah lewat script.
- R-34 TERTUNDA runtime: dua tema direncanakan dan QA keduanya diwajibkan.
- R-35 PASS scope planning: tujuh referensi dibuka/dicapture, selection Nemesis dan Shipment diuji. Build/run Gen-Z tidak berlaku pada artefak plan, dan gate UI belum diklaim selesai.
- R-36 PASS: tidak mengklaim audit, izin, custody, partnership, performa finansial atau produk live Gen-Z.
- R-37 PASS: DESIGN.md, logo, brief sinematik dan referensi mengarahkan keputusan; usulan tambahan ditandai sebagai rekomendasi.
- R-38 PASS: planned integrations, illustrative assets, simulation dan current stage diberi label yang eksplisit.

### Purpose Gate antislop

- R-01 PASS: mint/teal berasal dari DESIGN.md; charcoal memberi kedalaman untuk aset, bukan gradient generik.
- R-04 PASS: ikon hanya untuk fungsi/peran yang nyata; keluarga Phosphor dipilih bila ikon dibutuhkan, tidak menggambar SVG ikon baru.
- R-06 PASS: Manrope dipilih untuk keterbacaan istilah dan karakter geometris; tidak ada headline mono/uppercase yang dekoratif.
- R-07 PASS: background berupa scene aset yang relevan; tidak mengusulkan grid/dots sebagai filler.
- R-08 PASS: panah hanya bila memberi informasi arah/tujuan, bukan dipasang pada seluruh CTA.
- R-09 PASS: status pre-pilot/Coming soon/Simulation bermakna; tidak ada badge klaim dekoratif.
- R-10 PASS: kaca berada pada objek/diagram; backdrop blur UI dibatasi nav bila diperlukan, panel baca solid.
- R-12 PASS: shadow hanya untuk depth objek dan elevation dialog; bukan setiap section.
- R-13 PASS: cahaya menyoroti hubungan energi atau layer pilihan; CTA dan semua border tidak glow bersamaan.
- R-14 PASS: komposisi mengikuti hierarchy; empat kategori memakai satu stage, bukan kartu identik.
- R-19 PASS pada plan: setiap motion punya tujuan pada tabel bagian 5; demonstrasi runtime masih tertunda.
- R-22 PASS: aset yang direncanakan berhubungan dengan energi Gen-Z, tidak memakai blob generik.

### Liveliness dan quality locks

- PASS planning: Design Read dan dua set dial dinyatakan; focal point hero adalah diorama/headline, stack adalah empat layer, proof adalah hubungan tiga record.
- PASS planning: rhythm berganti antara film, editorial, category stage, stack, lifecycle, diagram, demonstrator, roles, disclosure dan intake.
- PASS planning: whitespace, satu keluarga aksen dan motif aliran energi mempunyai alasan tertulis pada bagian 2.
- C-1/R-31 PASS: alasan keputusan utama tercatat dalam tabel visual dan motion.
- C-2 PASS pada spesifikasi: kontrol mempunyai action; seluruh action menunggu click-through UI.
- C-3 PASS: setiap section menjawab kebutuhan produk yang tercantum pada peta halaman.
- C-4 TERTUNDA runtime: resilience direncanakan; tidak disimpulkan lulus dari dokumen.
- C-5 PASS: tidak ada social proof atau metrik Gen-Z yang dibuat-buat.
- R-05/R-11/R-15/R-16 PASS planning: section beragam, radius terdefinisi, CTA spesifik, copy tanpa buzzword yang menggantikan manfaat.
- R-20/R-21/R-29/R-30 PASS planning: identitas memakai aset/logo Gen-Z dan palette terpilih, tema menyeluruh, referensi diadaptasi menurut fungsi. Stack mengikuti mandat reverse engineering; seluruh halaman tidak disalin dari satu situs.

### Taste pre-flight

Telah diperiksa pada level plan: brief/dials, custom aesthetic, jumlah unit hero, draft copy, theme/color/radius system, variasi section, motion purpose, status/batas produk, pembagian library dan mobile fallback.

Pengecualian yang disadari: headline hero mempertahankan pesan sembilan kata pengguna meskipun pedoman section umum menyarankan delapan kata; target layout dua baris desktop, mobile adaptif. Teks status development diperlukan untuk tahap produk, bukan dekorasi. Angka layer menunjukkan urutan arsitektur yang diminta, bukan numbering section dekoratif.

Belum dapat dinyatakan lulus: actual fit/wrap/contrast, loading/error rendering, motion yang tampil, keyboard/focus, cleanup, reduced motion, kedua tema, Lighthouse, Core Web Vitals dan klik semua kontrol. Pre-flight final serta Delivery Gate UI dijalankan kembali setelah HTML dapat dijalankan.
