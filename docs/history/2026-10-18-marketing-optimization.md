# Optimasi marketing Astro dan penghapusan landing lama

18 Oktober 2026, Asia/Jakarta. Permintaan: terapkan rekomendasi penggunaan Astro untuk landing Gen-Z, pertahankan tampilan/interaksi, dan hapus aplikasi `landing/` lama. Source aktif tunggal: `apps/marketing`. Tidak ada deploy publik atau perubahan backend investasi.

## Implementasi

### HTML dan hydration

Comparison dipindahkan dari React ke `components/sections/Comparison.astro`. Copy, heading IDs, ikon Phosphor, kelas CSS dan struktur panel tetap dipertahankan. `runtime/comparison-motion.js` memiliki timeline GSAP yang sama, dipasang/dilepas oleh lifecycle landing bersama. Animasi tidak lagi memerlukan hydration React.

Tujuh islands tersisa memiliki prioritas eksplisit:

| Komponen | Strategi | Alasan |
| --- | --- | --- |
| Navigation | `client:load` | Menu dan kontrol media harus segera aktif |
| Productive capital, stack | `client:load` | Pin spacing harus tersedia sebelum scroll menuju section berikutnya |
| Infrastructure showcase | `client:load` | Menu dapat memilih kategori sebelum section terlihat |
| Audience | `client:visible`, margin 1000 px | Menyiapkan interaksi dan font sebelum section terlihat |
| Evidence, workspace illustration | `client:visible`, margin 600 px | State interaktif dibutuhkan ketika section didekati |

Pemilik pin tetap memakai `refreshPriority: 1`; lazy loading tidak diterapkan ke pin secara buta. Konten seluruh section tetap tersedia pada HTML build, termasuk ketika JavaScript nonaktif. Pola ini mengikuti [islands Astro](https://docs.astro.build/en/concepts/islands/) dan [prioritas client directives](https://docs.astro.build/en/reference/directives-reference/#client-directives).

### CSS dan gambar

`PublicLayout.astro` sekarang hanya memuat tokens, font dan `base.css`. CSS khusus homepage dimuat oleh `index.astro`; contact dan handoff memakai CSS entry. Aturan bersama yang dipindahkan tidak diduplikasi di stylesheet lama. Styling tetap CSS custom; tidak ditambahkan framework styling baru.

Tujuh sumber gambar dipindahkan ke `src/assets`: tiga showcase, dua audience, skyline dan closing landscape. Original source dipertahankan byte-identical. `getMarketingImages()` menjalankan transform di boundary build Astro, kemudian mengirim URL/srcset/sizes/dimensi serializable ke React. React tidak mengimpor optimizer. Closing memakai komponen `Image` Astro. Build menghasilkan 22 varian WebP responsif; retry dan fallback gambar tetap bekerja. Helper URL retry mempertahankan query parameter optimizer pada development dan mendukung URL file statis produksi. [Panduan image pipeline Astro](https://docs.astro.build/en/guides/images/).

Closing landscape sebelumnya memuat JPEG 5464×3640 sebesar 2.132.987 byte. Varian hasil build: 480 px / 29.766 byte, 800 px / 70.854 byte, 1280 px / 149.920 byte, 1920 px / 273.944 byte. Browser memilih varian berdasarkan ukuran tampilan dan DPR.

### Font

Range font penuh sekarang merupakan komplemen dari range subset Latin, baik font utama maupun audience. Sebelumnya pemanggilan `document.fonts.load` dapat ikut memuat font penuh untuk teks yang sudah tercakup subset. Setelah koreksi, font penuh tetap tersedia bagi karakter extended dan tidak diunduh untuk karakter Latin yang sama. QA browser menggunakan probe sintetis `Ā` untuk membuktikan fallback tersebut. File font dan lisensi asli tidak diubah. [Penjelasan unicode-range](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@font-face/unicode-range).

### Metadata produksi

`PUBLIC_SITE_ORIGIN` menerima origin HTTPS tanpa credential/path/query/fragment; HTTP loopback diizinkan untuk lokal. Origin final belum ditetapkan oleh pengguna, sehingga tidak ada domain produksi rekaan. Setelah diisi, build menghasilkan canonical, Open Graph/social image absolut, Organization JSON-LD, sitemap resmi Astro, dan tautan sitemap pada robots.

Sitemap hanya memuat `/` dan `/contact/`. Auth, dashboard, assets handoff dan 404 tetap `noindex`, tanpa canonical publik. Domain marketing dan platform dikonfigurasi secara terpisah. Fixture verifikasi membuat build terisolasi di `.cache/marketing-metadata` dengan `https://marketing.example.invalid`; fixture ini tidak mengganti konfigurasi atau output produksi utama. [Integrasi sitemap Astro](https://docs.astro.build/en/guides/integrations-guide/sitemap/).

### Penghapusan aplikasi lama

`D:\Projekan\GenZ\landing` dihapus menggunakan PowerShell setelah path absolut diverifikasi berada di workspace dan bukan reparse point. Penghapusan diotorisasi eksplisit oleh pengguna. Sebelumnya, 39 file publik lama direkam dengan SHA-256. Sebanyak 38 aset sumber/font/lisensi tetap diverifikasi dari lokasi marketing; robots lama digantikan endpoint build.

Script `dev:legacy`, ketergantungan tes pada folder lama, dan opsi QA `BASELINE_ORIGIN` telah dihapus. `motion/package.json` serta panduan produksinya sekarang menulis ke `apps/marketing/public/assets`. README aktif diperbarui; catatan implementasi lama ditandai sebagai arsip. Tidak ada import runtime atau perintah aktif yang masih memerlukan aplikasi lama.

## Pengukuran

Resource awal diukur melalui browser Chromium dengan cache nonaktif pada desktop 1440×900 dan mobile 390×844. Ukuran CSS adalah byte teks stylesheet inline; ukuran JavaScript adalah jumlah `encodedBodySize` resource script. Ini pengukuran lokal, bukan data field pengguna produksi.

| Metrik | Sebelum | Sesudah |
| --- | ---: | ---: |
| React islands total | 8 | 7 |
| Islands terhidrasi pada tampilan awal | 8 | 4 |
| CSS inline contact | 66.064 byte | 8.903 byte, turun 86,5% |
| JavaScript awal homepage | 183.350 byte | 177.459 byte, turun 3,2% |
| CLS pengukuran lokal awal | 0 | 0 mobile; sekitar 0,0006 desktop |

Copy seluruh sebelas section dicocokkan terhadap baseline sebelum optimasi dan identik. Screenshot hero desktop/mobile diperiksa berdampingan; screenshot fase membuka comparison dan mobile diperiksa setelah perubahan. Bukti: [before.json](../../apps/marketing/qa/astro-optimization/before.json), [after.json](../../apps/marketing/qa/astro-optimization/after.json), [desktop](../../apps/marketing/qa/astro-optimization/compare-1440.png), [mobile](../../apps/marketing/qa/astro-optimization/compare-390.png).

Lighthouse mobile dengan versi 13.5.0 dan emulasi default: performance **85 → 85**, accessibility **100 → 100**, best practices **100 → 100**, SEO **100 → 100**. FCP sekitar **2,04 → 1,91 detik**, LCP **4,14 → 4,13 detik**, CLS **0 → 0**. Ini tidak membuktikan target LCP 2,5 detik tercapai; jalur hero masih menjadi batas performa mobile. Optimasi payload gambar di bawah fold dan CSS contact tidak otomatis menaikkan skor homepage. [Baseline Lighthouse](../../apps/marketing/qa/astro-optimization/lighthouse-before.json), [hasil sesudah koreksi font](../../apps/marketing/qa/astro-optimization/lighthouse-after.json).

Satu run saat browser QA dan compiler berjalan bersamaan memperoleh performance 79; hasil tersebut dipertahankan sebagai `lighthouse-after-concurrent.json` dan tidak digunakan sebagai pembanding kondisi terisolasi. Tidak ada klaim pengukuran Core Web Vitals produksi atau peningkatan konversi.

## Verifikasi dan batas

- PASS: `npm run build --workspace=@gen-z/marketing`, enam halaman statis beserta robots dan 22 varian gambar. Warning existing untuk ukuran chunk renderer tetap ada; renderer 3D tetap dimuat melalui dynamic import.
- PASS: `npm run check` pada semua workspace, termasuk pemeriksaan Astro tanpa error/warning/hint.
- PASS: `npm test`, 16 tes termasuk fingerprint aset, boundary inquiry/platform, metadata dan parameter URL retry.
- PASS: `npm run smoke`, entry marketing/platform/worker, health/readiness dan batas akses anonim. Readiness 503 merupakan state yang memang diharapkan untuk fitur yang belum tersedia.
- PASS: 63 pemeriksaan browser umum, termasuk menu, keyboard/focus, carousel/dialog, tabs, contact invalid/review/copy/download, handoff, fallback gambar/retry, no-JS, media preferences dan overflow. Dua audit axe tidak memiliki pelanggaran; runtime/hydration tanpa uncaught error. [Bukti](../../apps/marketing/qa/browser-verification.json).
- PASS: sembilan kelompok regresi comparison pada versi final, mencakup desktop/tablet, ukuran screenshot pengguna, wheel dua arah, late-font refresh, deep link, mobile, reduced motion dan resize. [Bukti](../../apps/marketing/qa/comparison-motion/results.json).
- PASS: build fixture metadata dengan origin `.invalid`: canonical, social image, Organization JSON-LD, robots, dua URL sitemap dan pengecualian private routes. [Bukti](../../apps/marketing/qa/astro-optimization/metadata.json).
- PASS: seluruh copy sebelas section identik dengan baseline sebelum optimasi; folder `landing/` tidak lagi tersedia dan perintah produksi aktif tidak bergantung padanya.

Inquiry persistence/notifikasi dan lifecycle investasi tidak ditambahkan atau diklaim diuji melalui optimasi ini. Handoff browser menggunakan target navigasi sintetis; fixture tersebut tidak memverifikasi backend login. Safari dan perangkat touch fisik tidak diuji. Domain final marketing tetap perlu diisi pada `PUBLIC_SITE_ORIGIN` sebelum deployment produksi.

## Pre-flight dan Delivery Gate antislop

Mode `during` mengikuti pilihan eksplisit sesi. Design Read: preservasi landing energi Gen-Z untuk operator dan investor; typography, charcoal/teal/mint, komposisi lega dan motion existing dipertahankan. Dial taste DESIGN_VARIANCE 5 / MOTION_INTENSITY 6 / VISUAL_DENSITY 4; dial antislop ENERGY 2 / RHYTHM 2 / MOTION 3. Tidak ada visual asset baru atau desain ulang.

- Hard Gate PASS dalam scope: aplikasi dibuild dan diuji di browser; seluruh kontrol existing diuji; 320/390/768/1440 px tanpa overflow; keyboard/focus serta reduced motion berfungsi; axe tidak menemukan pelanggaran pada audit yang dijalankan. Tidak ada data/klaim/customer/aset palsu atau kontrol kosong baru.
- Purpose Gate PASS: perubahan mengurangi hydration dan CSS lintas halaman; gambar responsif mempertahankan ilustrasi asli; koreksi font menghindari unduhan ganda. Comparison tetap menggunakan gerak membuka koneksi dua pendekatan. Warna, typography, jarak dan panel mengikuti alasan brand/struktur existing, tanpa dekorasi tambahan.
- Liveliness PASS: focal point hero dan comparison, whitespace, simbol Gen-Z, aksen teal dan koreografi pin dipertahankan; screenshot sebelum/sesudah serta fase animasi diperiksa. Tidak ada perubahan motion dial untuk mengejar skor audit.
- Craftsmanship dan Quality Locks PASS dalam scope: batas build/runtime/application jelas, props gambar serializable, tidak ada React state per frame baru, cleanup motion tetap tersedia, fallback gambar/font berfungsi, copy identik, dan source aktif tidak lagi bergantung pada aplikasi yang dihapus. Pre-flight taste PASS untuk preservasi brand, hierarchy, responsivitas, interaksi dan motion existing.

Pemeriksaan React mengikuti checklist react-best-practices: transform gambar dilakukan paralel pada build, modul browser tidak mengimpor optimizer, state interaksi tetap lokal, props dapat diserialisasi, dan hooks/listener tidak ditambahkan tanpa lifecycle cleanup.
