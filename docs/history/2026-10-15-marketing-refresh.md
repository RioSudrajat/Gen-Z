# Revisi landing Gen-Z, 15 Oktober 2026

## Arah yang disetujui dalam percakapan

- Landing memperkenalkan Gen-Z sebagai penghubung pemilik infrastruktur energi produktif dengan global capital.
- Bahasa pembangunan internal seperti pre-pilot, in development, dan planned tidak menjadi pesan pemasaran yang berulang.
- Pola headline Electricity powers … / Capital powers electricity dipertahankan. Industry dipilih dalam implementasi untuk mengganti progress yang terlalu umum.
- Section kedua memperlihatkan hubungan Energy asset owners → Gen-Z → Global investors.
- Section utama minimal satu viewport pada posisi baca; konten boleh memanjang agar tetap terbaca di mobile. Scroll normal dipertahankan.
- Turbin menjelaskan Verify → Structure & tokenise → Connect to capital.
- Label dokumen yang disetujui: Power Purchase Agreements (PPAs); Project Agreements & Investor Rights; Energy Production & Billing Records, beserta penjelas yang disepakati.
- Kartu review menjelaskan Asset & Revenue Reviewed → Project Terms Structured → Prepared for Investor Review.
- Lifecycle lima langkah dilebur ke manfaat workspace. Approved rails, settlement, net allocation, serta detail pencatatan pokok tidak menjadi copy utama landing.
- Blok Before you participate/FAQ dihapus. Informasi inti disajikan langsung dalam section terkait.
- Form mitra dipindahkan ke /contact/. CTA akhir dan footer mengarah ke halaman tersebut.
- Launch app mengarah ke /auth/, kemudian ke /dashboard/ setelah akses preview.
- Pengguna mengonfirmasi auth/dashboard dan pengiriman inquiry belum ada, serta meminta halaman dibuat dahulu sebagai gambaran. Tidak ada akun sungguhan, OTP, atau layanan pengiriman yang diintegrasikan.

## Implementasi

Stack React/Vite, palette teal, logo, font, video, dan turbin yang sudah ada dipertahankan. Tidak ada aset visual baru yang dibuat atau layanan eksternal yang dipasang.

Mode perubahan: preserve, dengan revisi copy dan urutan informasi yang disetujui. Taste: DESIGN_VARIANCE 6 / MOTION_INTENSITY 6 / VISUAL_DENSITY 4. Antislop: ENERGY 2 / RHYTHM 2 / MOTION 3, motion utama tetap pada hero dan turbin. Mode After tetap berlaku; perubahan ini merupakan tindak lanjut rekomendasi yang disetujui pengguna dalam bahasa biasa.

Alasan keputusan visual:

- Teal dan netral mempertahankan identitas yang sudah dipilih.
- Tipografi dan logo yang sama menjaga hubungan antara landing, Contact, akses, dan dashboard.
- Tinggi minimum viewport memberi setiap pesan utama ruang baca sendiri tanpa memotong isi.
- Bridge dua audience menjelaskan positioning; diagram turbin menjelaskan proses yang menghubungkannya.
- Cards dipakai untuk kelompok dokumen dan contoh workspace yang mempunyai batas isi jelas.
- Native workspace menggantikan screenshot produk referensi agar demonstrasi menunjukkan konsep Gen-Z sendiri.
- Footer memperluas navigasi dan jalur percakapan, tanpa link legal/social fiktif.
- Ilustrasi kategori tetap diberi caption ilustrasi. Tidak ada angka hasil investasi, mitra, statistik, atau tanda audit yang dibuat-buat.

Halaman Contact [GEN](https://www.ge.network/contact) diperiksa melalui browser pada sesi ini: halaman terpisah dengan pembuka percakapan dan embedded form. Yang diikuti adalah pemisahan fungsi landing dan inquiry, bukan salinan konten atau klaimnya. Bukti: landing/qa/marketing-refresh/gen-contact.png.

Build multi-page mengikuti [dokumentasi Vite](https://vite.dev/guide/build.html#multi-page-app), dengan empat HTML entry. Halaman dapat dibuka langsung setelah build.

## Batas preview

Auth menyimpan email contoh hanya dalam sessionStorage untuk berpindah ke dashboard. Pemeriksaan sesi di browser adalah navigasi preview, bukan autentikasi atau proteksi server. Leave preview menghapus sesi tersebut. Tidak meminta atau menyimpan password.

Contact memvalidasi input dan membuat review pesan yang dapat disalin/diunduh. Tidak ada pengiriman atau penyimpanan lead ke server. UI menjelaskan batas itu pada halaman Contact. Integrasi delivery dan auth produksi adalah pekerjaan lanjutan terpisah.

Dashboard menampilkan empty states, tanpa saldo atau investasi fiktif. Menu Overview, Assets, Portfolio, dan Documents bisa dicoba.

## Verifikasi

Build, screenshot, pengukuran layout, hasil interaksi, dan batas pemeriksaan dicatat di landing/qa/marketing-refresh/DELIVERY-GATE.md. Audit lama mendokumentasikan kondisi sebelum revisi ini dan tidak menggantikan keputusan terbaru pengguna.
