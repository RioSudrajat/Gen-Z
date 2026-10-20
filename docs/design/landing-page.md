# Aturan landing page Gen-Z

Scope: landing marketing dan halaman Insights, bukan ukuran global platform. Arah visual mengikuti [DESIGN.md](../../DESIGN.md). Implementasi ini menindaklanjuti persetujuan founder pada 20 Oktober 2026 atas rencana konsistensi layout, artikel pendalaman, dan motion.

## Layout dan typography

- `.page-container` menjadi garis acuan heading, intro, CTA, panel konten dan isi footer landing. Lebar maksimum 1180 px, naik menjadi 1280 px mulai viewport 1600 px; gutter desktop 52 px, tablet 32 px, mobile 20 px. Nilai ini merupakan token implementasi landing, bukan standar baru seluruh Gen-Z.
- Section tidak mengganti lebar container. Media dapat memakai komposisi internal yang lebih lapang; judul dan aksi tetap mengacu pada container. Hindari scale pada wrapper yang sekaligus memuat heading; stack menyesuaikan ukuran visualnya saja.
- Spacing section biasa mengikuti `--landing-space`: 104 px desktop, 88 px tablet, 68 px mobile. Scene pinned, Capital Bridge, comparison, dan penutup dapat memakai ritme khusus berdasarkan konten. Jangan memaksa semua section menjadi satu viewport.
- Heading memakai GenZ Display 500; body, label, dan CTA memakai GenZ UI. Serif GenZ Editorial hanya pada peran editorial existing. Referensi tidak mengizinkan font atau palette baru pada satu section.
- Warna merujuk semantic token Gen-Z. Link kecil pada putih memakai deep teal; CTA teal memakai teks gelap. Light-only tetap berlaku. Media dan banner charcoal existing tidak membentuk tema alternatif.
- Bentuk mengikuti peran komponen: tombol existing, panel/card 24 px pada Who We Serve, media editorial 20 px, dan gambar dalam artikel 16 px. Nilai lokal ini tidak menetapkan radius platform.

## Konten dan Insights

- Section energi menyediakan video, satu takeaway, dan link langsung ke artikel, transcript deskriptif serta data. Jangan mengulang thesis panjang pada jalur utama landing.
- Preview artikel ditempatkan setelah comparison dan sebelum penutup. Satu artikel yang tersedia ditampilkan sebagai featured item; tidak membuat artikel atau metadata fiktif demi mengisi grid.
- Metadata artikel berasal dari `apps/marketing/src/content/insights.mjs`. Tanggal adalah tanggal publikasi artikel, bukan tanggal data. Data lama menyimpan tahun/snapshot dan sumbernya.
- Informasi video tetap tersedia sebagai teks yang setara. Poster statis, reduced motion, save-data, no-JS dan error media mempertahankan link bacaan.
- Artikel publik masuk allowlist metadata dan sitemap. Halaman handoff auth/workspace tetap noindex. Route yang disediakan: `/insights/` dan `/insights/energy-demand/`.

## Motion

- Pertahankan GSAP/ScrollTrigger dan Lenis existing. Lenis adalah satu pemilik perpindahan scroll; tidak menambahkan tween window yang bersaing.
- Heading dan intro mendapat reveal ringan saat memasuki viewport, bukan per karakter. Konten visible sebelum observer dan tanpa JS. Focus menyelesaikan reveal aktif agar pembaca keyboard tidak menunggu gerakan.
- Hero memiliki dua keadaan: full-bleed dan settled. Satu gestur yang disengaja menyelesaikan transisi menuju keadaan berikut; input kecil di bawah ambang tidak memicu perpindahan otomatis. Reverse dan input baru dapat menginterupsi.
- Turbin dan stack menggunakan beat yang sama-sama memiliki entrance dan jeda baca. Settling dipicu input pengguna, bukan scrollEnd dari animasi itu sendiri, sehingga satu gestur tidak merantai beberapa beat.
- `scroll-settling.js` membagi arah/ambang/interupsi hero, turbin, dan stack melalui hook `virtualScroll` Lenis. Akumulasi 6 px langsung memulai transisi, tanpa menunggu gestur berhenti. Momentum searah dikonsumsi sampai gestur selesai agar tidak me-restart atau merantai beat; jeda input 180 ms membedakan gestur berikutnya. Gerakan balik yang disengaja dapat menginterupsi, noise 1 px tidak membatalkan gerakan.
- Durasi perpindahan .65–.95 detik disesuaikan jarak dengan easing cubic-out. `scrub: true` mengikuti scroll Lenis langsung, tanpa numeric scrub kedua yang menambah keterlambatan. Durasi anak timeline scrub adalah proporsi jarak, bukan detik tayang final. Scroll biasa tetap bebas di luar scene dan pada batas akhirnya.
- Frame hero memakai transform dengan kompensasi rasio video. Susunan baris judul opening dan settled tetap selama gerakan, dengan crossfade visual; satu H1 tetap menjadi sumber teks aksesibel. Jangan mengubah width teks setiap frame karena line wrap dapat melompat di tengah transisi.
- Anchor, scroll cue dan perpindahan focus menggunakan `scrollLandingTo`. Navigasi membatalkan settling yang menunggu. Dialog dan area scroll nested tidak boleh ditarik oleh scene.
- Reduced motion membuang reveal dan pinning naratif serta menjeda video. Viewport pendek mempertahankan fallback turbin/stack. Kontrol Pause film tersedia dekat video dan terhubung ke state yang sama dengan menu Resources.
- Jangan menyamakan pacing yang terasa cepat dengan frame drop. Profilkan biaya layout/paint hero, SVG stack, video decoding, dan WebGL sebelum menyebut akar masalah performa.

## Pemeriksaan sebelum delivery

1. Jalankan `npm run verify:ci` sesuai [workflow kontribusi](../engineering/github-workflow.md). Integration test memakai PostgreSQL terisolasi melalui Docker.
2. Jalankan `npm run verify:marketing` terhadap preview production. Harness browser mencakup container/font pada enam lebar, route artikel dan sumber, satu input hero, interupsi/reverse, beat turbin/stack, keyboard media, error video, reduced motion, overflow dan axe A/AA. `verify-gesture-motion.mjs` juga menguji input kecil, burst trackpad, momentum panjang, noise arah, keyboard, pelepasan batas, nested scroll dan swipe touch native yang diemulasi. Catat onset dan completion; tes yang hanya menunggu dua detik tidak cukup untuk mendeteksi delay awal.
3. Jalankan `npm run verify:metadata --workspace=@gen-z/marketing` untuk canonical, sitemap dan pemisahan halaman publik dari handoff.
4. Inspeksi screenshot desktop/mobile hasil browser. Catat batas touchpad fisik, touchscreen/perangkat nyata, performance trace, zoom dan pembaca layar bila tidak diuji. Tes wheel sintetis tidak membuktikan seluruh hardware terasa identik.
5. Jalankan pre-flight taste dan Delivery Gate antislop. Laporkan hasil nyata; jangan menyebut produk production-ready hanya berdasarkan CI hijau.

Screenshot dan laporan browser secara default disimpan di `apps/marketing/qa/`. Set `MARKETING_QA_ROOT` ke file URL direktori berakhiran `/` bila memerlukan folder bukti terpisah, misalnya `file:///D:/Projekan/GenZ/.cache/landing-qa/`. Gunakan folder terpisah saat verifikasi perubahan agar bukti baseline yang sudah dilacak Git tidak tertimpa. Bukti lokal ini bukan hasil build yang harus ikut commit.
