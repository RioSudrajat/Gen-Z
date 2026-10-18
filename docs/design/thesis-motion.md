# Energy thesis: opsi 2 menjadi motion graphic

> Catatan ini merekam implementasi 16 Oktober. Output website terbaru berada di `apps/marketing/public/assets`; folder `landing/` lama telah dihapus. Perintah produksi dan pengujian yang berlaku ada di [README motion](../../motion/README.md).

16 Oktober 2026, Asia/Jakarta. Pengguna memilih arah opsi 2, meminta tambahan konteks AI/data center, Hormuz, EV dan hook kesiapan, serta memilih tanpa voice-over. Bahasa film Inggris mengikuti landing; dokumentasi tetap Indonesia. Mode antislop during mengikuti pilihan sesi sebelumnya.

## Arah

Film 60 detik, 1920 × 1080, 30 fps. Putih, charcoal dan teal dengan font landing yang sama. Scatter plot listrik–PDB tetap menjadi adegan utama. Motion dipakai untuk membangun urutan argumen, bukan mempercepat pembacaan melalui animasi berlebihan. Tidak ada musik atau voice-over pada draft ini.

Dial film: Energy 2, Rhythm 2, Motion 2. Dial implementasi marketing: Design Variance 5, Motion Intensity 4, Visual Density 4. Berbeda dari mockup statis sebelumnya karena keluaran sekarang bergerak. Teks sudah terlihat dalam posisi akhirnya setelah reveal; tidak ada gerak yang terus mengganggu pembacaan.

## Batas klaim

- Listrik mendukung kegiatan produktif, bukan hubungan proporsional universal atau sebab tunggal kemakmuran.
- Konsumsi seluruh data center tidak sama dengan konsumsi AI saja. Angka global dan Asia Tenggara memiliki cakupan serta vintage berbeda dan ditulis demikian.
- Hormuz adalah risiko konsentrasi jalur pasokan. Gangguan pasokan dan gejolak harga tidak membuktikan klaim “monopoli harga minyak”. Film memakai narasi kerentanan impor dan diversifikasi.
- EV dapat mengurangi keterpaparan terhadap minyak; dampaknya bergantung pada sistem kelistrikan, biaya, kebijakan dan implementasi. EV bukan solusi yang menghapus seluruh ketergantungan energi.
- Hook kesiapan merupakan posisi editorial. Mengenali perubahan lebih awal tidak menjamin kemenangan, return investasi atau kepemimpinan suatu negara.

## Sumber dan angka

1. **Scatter:** snapshot World Bank 2023 dari riset sebelumnya, tujuh ekonomi, konsumsi kWh/orang/tahun dan PDB per kapita nominal. [Dataset lokal](references/thesis-2026-10-16/data.json), [seri listrik](https://data.worldbank.org/indicator/EG.USE.ELEC.KH.PC), [seri PDB](https://data.worldbank.org/indicator/NY.GDP.PCAP.CD). Data, sumbu dan ukuran marker tetap konsisten; tanpa regresi global.
2. **Global data centers:** 485 TWh pada 2025, diproyeksikan sekitar 950 TWh pada 2030, laporan IEA **2026**. Ini pembaruan atas angka 415/945 pada laporan 2025. [Key Questions on Energy and AI](https://www.iea.org/reports/key-questions-on-energy-and-ai/executive-summary).
3. **Asia Tenggara:** konsumsi listrik data center diproyeksikan lebih dari dua kali pada 2030 relatif 2024, **Base Case laporan 2025**. Jangan melabeli angka ini proyeksi seluruh listrik regional atau angka dari laporan 2026. [IEA Energy and AI](https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai).
4. **Ketergantungan impor:** sekitar 60% impor minyak mentah Asia Tenggara berasal dari Timur Tengah sebelum krisis, bukan klaim 60% melewati Hormuz. [IEA Southeast Asia Energy Outlook 2026](https://www.iea.org/reports/southeast-asia-energy-outlook-2026/executive-summary).
5. **Hormuz dan elektrifikasi:** analisis IEA 22 September 2026 menjelaskan bagaimana guncangan harga memperkuat alasan diversifikasi dan elektrifikasi, dengan kebutuhan investasi pembangkit, jaringan dan fleksibilitas. [IEA, Electrification and energy security](https://www.iea.org/news/electrification-takes-centre-stage-as-hormuz-shock-spurs-countries-to-seek-to-enhance-energy-security).

## Storyboard

| Waktu | Pesan utama | Gerak dan visual |
| --- | --- | --- |
| 00–06 | The next economy. Runs on electricity. | Pembuka Hyperframes; dua baris tipografi terungkap berurutan, garis teal menggarisbawahi gagasan listrik |
| 06–17 | Electricity supports productive economies. | Scatter opsi 2; grid menetap, marker muncul dari data dengan label, Indonesia disorot; caveat hubungan non-kausal |
| 17–27 | Digital growth has a physical power demand. | Dua batang global 485 dan 950 TWh; 2030 diberi label projection, bukan tren tahunan hasil interpolasi |
| 27–33 | The demand is closer than it looks. | >2× regional, baseline 2024 dan target 2030; teks membedakan AI dari cooling/manufaktur/elektrifikasi |
| 33–43 | Energy security has a supply-route risk. | 60% impor dari Timur Tengah; diagram konseptual jalur pasokan dengan Hormuz; bukan peta atau distribusi volume |
| 43–51 | Less imported fuel. More demand for reliable power. | EV dan empat kebutuhan: generation, grids, storage, EV charging; garis muncul berurutan untuk menjelaskan rantai |
| 51–55 | See the shift early. Be ready to lead. | Tipografi berhenti setelah reveal; hook kesiapan tanpa jaminan kemenangan |
| 55–60 | Electricity powers infrastructure. Capital powers electricity. | Dua bagian thesis bertemu pada peran Gen-Z menghubungkan pemilik aset dan investor |

## Peran framework

Keduanya adalah renderer video, jadi tidak perlu memuat keduanya sebagai runtime landing. Untuk memenuhi permintaan menggunakan keduanya dengan peran nyata:

- **Hyperframes** menulis dan merender opening 6 detik dari HTML/CSS dan timeline GSAP seekable: `motion/hyperframes/index.html` → `motion/public/intro.mp4`.
- **Remotion** memasukkan opening tersebut, merender scatter dan grafik dari data, mengatur adegan serta menghasilkan film final. Source: `motion/src/`.
- Landing cukup menyajikan MP4 terkompresi, poster, controls dan transkrip/sumber. Paket authoring dipisah dalam `motion/`; tidak perlu memasukkan renderer video ke bundle pengunjung.

Dokumentasi: [Hyperframes](https://github.com/heygen-com/hyperframes), [Remotion](https://www.remotion.dev/docs/). API diperiksa melalui Context7 sebelum implementasi.

## Perilaku section

Posisi setelah hero dan sebelum `#why`. Pemutaran manual dengan native controls, bukan autoplay atau loop 60 detik. Pengunjung dapat melewati film, membaca ringkasan dan membuka transkrip. Reduced motion tetap tidak memulai pemutaran otomatis. Poster menampilkan scatter, bukan frame kosong.

Pada ponsel, teks sumber dan transkrip menjadi acuan baca karena label grafik pada video landscape kecil. Fullscreen video tersedia melalui native controls. Grafik/caption penting tidak boleh hanya tersedia sebagai pixel video. `preload="none"` membatasi transfer sebelum pengguna memilih play.

Judul solusi berubah dari “industry” menjadi “infrastructure”, sesuai permintaan awal. Hero dan section lain tidak dirombak.

## Verifikasi

**Hasil:** film dan section lokal sudah dibuat. Master: `motion/out/gen-z-energy-thesis.mp4`. MP4 untuk landing: `landing/public/assets/gen-z-energy-thesis.mp4`, **60,000 detik, H.264, 1920 × 1080, 30 fps, 2.371.470 byte**, tanpa stream audio. Poster berasal dari frame scatter final. Preview lokal: `http://127.0.0.1:5175/#energy-context` selama server tugas berjalan.

### Delivery Gate dan pre-flight

- **PASS, output:** Hyperframes merender 180 frame opening. Remotion merender 1.800 frame final. FFprobe mengonfirmasi dimensi, frame rate, durasi dan format; FFmpeg mendekode film lengkap tanpa error.
- **PASS, klaim/data (R-17/36/38, C-5):** tujuh pasangan angka tabel HTML sama dengan pembulatan snapshot World Bank; tipe skenario, tahun dan cakupan IEA tertulis. Tidak ada angka return, testimoni atau klaim monopoli buatan.
- **PASS, visual dan direction (R-31/37):** frame opening, scatter, global data center, regional, Hormuz, EV dan penutup ditinjau. Label yang bertumpuk diperbaiki sebelum ekspor final; footer sumber dinaikkan agar lebih jauh dari kontrol player. Dials dan alasan motion tercatat; brand lama dipertahankan.
- **PASS, build:** `npm run typecheck` dalam `motion/`; build Vite landing sesudah asset final tersedia, exit 0. Ada warning dependency Framer Motion tentang `use client` pada bundler Vite; tidak ada error build. Hyperframes menyisakan satu warning authoring tentang anjuran sub-composition, bukan lint error.
- **PASS, player (R-26/35, C-2):** tombol play native memuat MP4 dan playback berjalan; durasi browser 60 detik, waktu pemutaran bertambah, pause menghentikan pemutaran tanpa media error. Pada load ulang, film paused dan autoplay false.
- **PASS, disclosure/keyboard (R-32/35):** “Read the thesis and sources” dibuka dengan klik lalu ditutup dengan Enter; “View the electricity and GDP data” membuka tujuh baris lalu ditutup dengan Enter. Tab menjangkau region tabel dengan nama yang jelas dan outline solid.
- **PASS, reflow (R-03, C-4):** screenshot desktop 1440 px dan mobile 390/320 px diperiksa. Pada viewport 320 px, document width 305 px, region tabel 264,67 px, tabel 260,67 px; tidak ada overflow horizontal. Ringkasan, sumber dan tabel tersedia di HTML untuk keterbacaan ponsel.
- **PASS, console:** tidak ada browser console error yang tercatat saat flow baru diperiksa.
- **PASS, token kontras (R-25):** palet yang sama dengan pemeriksaan sebelumnya: ink/putih 17,74:1, teal/putih 5,47:1, muted/putih 7,56:1, gray/putih 4,97:1. Tidak menggunakan warna saja untuk membedakan Indonesia atau proyeksi.
- **PASS, React review:** komponen scene didefinisikan pada level modul; animasi dihitung dari frame, tanpa timer/scroll listener atau React state per frame; tidak ada fetch runtime untuk data film, tidak ada renderer yang masuk bundle landing.
- **NOT VERIFIED:** simulasi preferensi reduced motion pada OS, pembaca layar langsung, zoom 200%, fullscreen native pada perangkat fisik, dan skenario network failure melalui fault injection. Manual-play tanpa autoplay serta transkrip/fallback telah diperiksa dari source; tidak mengklaim simulasi yang tidak dijalankan.

Pre-flight yang tidak berlaku pada perubahan ini: tema baru, form, navbar baru, logo wall, carousel, marquee dan animasi scroll tambahan. Tidak ada penambahan tersebut. Sources memiliki tautan ke halaman primer yang telah ditelusuri; navigation dan hero di luar scope tidak diaudit ulang.

Bukti visual lokal: `motion/out/section-desktop.png`, `motion/out/section-mobile-320.png`, dan `motion/out/final-scatter.png`. Gambar frame bukan pengganti playback check; keduanya dilakukan dengan batas yang dicatat di atas.
