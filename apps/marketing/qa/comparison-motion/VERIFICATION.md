# Perbaikan animasi comparison setelah migrasi

> Update 18 Oktober: comparison kini dirender sebagai HTML Astro dengan lifecycle GSAP terpisah. Sembilan kelompok regresi yang sama lulus setelah optimasi dan penghapusan aplikasi lama. Implementasi serta hasil keseluruhan terbaru ada di [laporan optimasi](../../../../docs/history/2026-10-18-marketing-optimization.md).

17 Oktober 2026. Scope: animasi section Traditional energy asset financing pada aplikasi marketing. Preview produksi lokal: http://127.0.0.1:4321/. Tidak ada deploy publik.

## Penyebab dan perbaikan

Kode animasi comparison sudah termigrasi, tetapi Astro menghidrasi React islands secara independen. Saat refresh berjalan berdasarkan urutan pembuatan trigger, comparison dapat diukur sebelum jarak pin dari capital dan stack dipulihkan. Dalam reproduksi desktop, start comparison berubah dari sekitar 15980 menjadi 10625 sementara panel tetap berada di posisi dokumen sekitar 16772. Akibatnya timeline sudah selesai sebelum panel terlihat, dan scroll balik di section tersebut tidak mengubah panel.

`src/runtime/pinned-sequence.js` sekarang memberi `refreshPriority: 1` pada pemilik pin spacing. GSAP mengurutkan dan menghitung pin lebih dahulu sebelum reveal berikutnya, sesuai [dokumentasi refreshPriority dan sort](https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.sort()/). Tidak ada perubahan pada layout, copy, breakpoint, durasi, easing, atau gerakan comparison lama. Perubahan berada di runtime pemilik pin, tanpa coupling antar komponen React atau state per frame.

## Bukti

Regresi browser sebelum perbaikan gagal pada viewport 1176×1339: panel traditional x=0 dan connected opacity=1 saat panel masih di bawah layar. Setelah perbaikan, sembilan kelompok pemeriksaan pada [results.json](results.json) lulus.

| Pemeriksaan | Hasil |
| --- | --- |
| Desktop 1440×900 | PASS: x panel 301,60 → 157,32 → 0 → 157,32 px |
| Ukuran screenshot pengguna 1176×1339 | PASS: x panel 273,52 → 142,56 → 0 → 142,56 px; [fase membuka](1176x1339-opening.png) |
| Tablet 768×1024 | PASS: x panel 177,84 → 92,95 → 0 → 92,95 px |
| Wheel turun dan naik melalui Lenis | PASS: opacity kanan bergerak dari 0 ke nilai antara 0–1, kembali ke 0 |
| Font audience terlambat dan layout refresh | PASS: posisi awal, tengah, akhir dan balik tetap benar |
| Entry langsung /#comparison | PASS: panel tetap mengikuti posisi scroll setelah entry dan scroll balik |
| Perubahan reduced motion ketika halaman aktif | PASS: transform kembali nol, semua baris terbaca, panel kanan opacity=1 |
| Mobile 390 dan 320 px | PASS: reveal vertikal, kedua panel terbaca, tanpa overflow horizontal; [390 px](mobile-390.png), [320 px](mobile-320.png) |
| Resize mobile ke desktop | PASS: animasi horizontal pulih dan dapat dibalik |
| Runtime/hydration | PASS: tidak ada uncaught error |

`npm run build --workspace=@gen-z/marketing` lulus; warning ukuran chunk existing masih ada. `npm run check --workspace=@gen-z/marketing`: 42 file, nol error/warning/hint. Sepuluh unit test marketing lulus. Suite browser umum lulus 61 pemeriksaan, tanpa runtime error dan tanpa pelanggaran axe pada dua audit yang dijalankan; lihat [laporan umum](../browser-verification.json). Baseline legacy dan backend inquiry terkonfigurasi tidak diuji ulang pada koreksi ini.

Tes comparison sekarang menjadi bagian `npm run verify:marketing` melalui script `verify:browser`; dapat dijalankan sendiri dengan `npm run verify:comparison --workspace=@gen-z/marketing` setelah build dan preview aktif.

## Pre-flight dan Delivery Gate

Design Read tetap preserve: landing energi Gen-Z untuk operator dan investor dengan panel comparison yang membuka koneksi dua pendekatan. Dial existing dipertahankan: DESIGN_VARIANCE 5 / MOTION_INTENSITY 6 / VISUAL_DENSITY 4; antislop during dari pilihan sesi, ENERGY 2 / RHYTHM 2 / MOTION 3. Tidak ada arah visual atau aset baru.

- Hard Gate PASS dalam scope: build dan browser dijalankan; mobile tanpa overflow; reduced motion terbaca; keyboard/menu/form diuji suite umum; dua audit axe tanpa pelanggaran. Tidak ada kontrol, data, klaim, atau aset baru.
- Purpose Gate PASS: koreksi urutan pengukuran mengembalikan hubungan gerak scroll dan pembukaan panel. Transform dan opacity existing tetap menjadi mekanisme animasinya.
- Liveliness PASS: gerakan bertumpuk ke berdampingan pulih dan reversibel; simbol, warna, heading dan whitespace Gen-Z dipertahankan. Screenshot fase membuka diperiksa.
- Craftsmanship dan Quality Locks PASS dalam scope: fix terpusat pada pemilik pin, lifecycle cleanup existing dipertahankan, fallback reduced motion bekerja, 61 cek browser umum dan sembilan kelompok regresi lulus. Pre-flight taste PASS untuk preservasi komposisi, typography, breakpoint dan motion existing.

Perangkat touch fisik dan Safari tidak diuji; browser QA menggunakan Chromium lokal. Tidak ada klaim performa atau backend baru.
