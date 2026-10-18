# Modal wallet, light-only dan fondasi UI

**Revisi berikutnya:** alur provider langsung, radius dan copy pada laporan ini telah dikoreksi pengguna. Lihat [network-first dan product writing](2026-10-18-network-first-product-copy.md) untuk hasil terbaru. Laporan ini tetap menyimpan bukti sesi asal.

18 Oktober 2026, Asia/Jakarta. Scope: login dan tema platform, typography Display/UI, serta panduan konsistensi referensi. Menggantikan keputusan typography/tema pada laporan login sebelumnya. Mode antislop `during` dipilih pengguna pada sesi ini.

## Hasil dan alasan

Design Read: halaman login investor Gen-Z, bahasa visual light dengan aksen mint/teal dan ekosistem energi existing, ENERGY 2 / RHYTHM 2 / MOTION 2.

| Keputusan | Alasan |
|---|---|
| Satu tombol Connect Wallet | Memisahkan aksi memulai login dari pemilihan provider. |
| Provider ada dalam modal | Mengikuti alur referensi pengguna tanpa menaruh pilihan wallet di halaman utama. |
| Hanya Base Sepolia | Runtime SIWE hanya mendukung jaringan ini; referensi multichain tidak mengubah scope auth. |
| Daftar provider hasil discovery existing | Tetap mendukung EIP-6963/injected tanpa membuat merek atau integrasi yang belum tersedia. |
| Ikon wallet semantik | Menjelaskan aksi dan jenis opsi tanpa menambahkan logo provider yang dikarang. |
| Light-only | Keputusan eksplisit founder; CSS dark, preferensi sistem, pembacaan storage dan theme toggle dihapus. |
| GenZ Display dan GenZ UI lokal | Memakai font landing existing, menggantikan Plus Jakarta Sans di login dan Arial pada UI platform. |
| Display 500, UI 500, font-synthesis none | Menjaga bentuk huruf existing tanpa bold sintetis yang menyerupai referensi lain. |
| Mint/teal dan teks gelap pada CTA | Mempertahankan palette brand dan kontras. |
| Dua panel dan ilustrasi existing | Mempertahankan komposisi serta aset energi yang sudah diminta pengguna. |
| Whitespace dan satu CTA | Memusatkan perhatian pada tugas login. |
| Radius CTA 8, opsi 12, modal 20–24 px | Membedakan aksi, pilihan dan lapisan dialog sesuai fungsi komponen. |
| Backdrop blur tunggal dan shadow modal | Memisahkan tugas pemilihan wallet dari halaman belakang, mengikuti interaksi referensi. |
| Dialog native dan putaran focus eksplisit | Membuat background inert, menjaga Tab/Shift+Tab di modal, dan mengembalikan focus setelah ditutup. |
| State pending bertahan saat reopen | Penutupan modal tidak menduplikasi permintaan wallet atau menyembunyikan proses ketika dibuka kembali. |
| Panduan `.agents/UI-GUIDELINES.md` | Mewajibkan pemeriksaan DESIGN dan source fondasi pada setiap UI, termasuk ketika ada screenshot baru. |

`DESIGN.md` sebelumnya hanya mencatat palette dan belum memuat typography landing aktif. Dokumen sekarang membedakan keputusan founder dari fondasi yang diverifikasi pada source marketing. AGENTS root merutekan UI ke DESIGN dan panduan baru; skill upstream tidak diubah. Token bernama dark tetap menjadi palette komponen charcoal, bukan tema alternatif.

## Verifikasi

- Check seluruh workspace: `npm run check`, exit 0. Astro: 47 file, 0 error/warning/hint. Next typegen dan TypeScript platform lulus.
- Build platform terakhir: `node ../../node_modules/next/dist/bin/next build --webpack` dari aplikasi, exit 0, termasuk TypeScript dan standalone output. Memerlukan akses filesystem Windows di luar sandbox. Warning dependency dinamis `ox/tempo` dari viem existing tetap ada.
- `node apps/platform/scripts/test-ui.mjs`, exit 0: tiga tes browser lulus. Runner menyalakan server production sementara dengan DATABASE_URL kosong dan membersihkan prosesnya.
- Enam lebar: 320, 390, 768, 1024, 1440, 2048 px; preferensi sistem light dan dark. Tidak ada horizontal overflow; teks UI lolos pemeriksaan computed contrast AA, modal berada dalam viewport.
- Preferensi lama `gen-z-theme=dark` diinjeksi sebelum navigasi dan halaman di-reload: computed `color-scheme` tetap light, tanpa theme toggle.
- Browser memuat font lokal; computed heading GenZ Display, CTA GenZ UI, dan `document.fonts.check` untuk keduanya lulus.
- Screenshot desktop, mobile 390 px, modal empty/provider, dan modal error 320 × 568 diperiksa secara visual. Typography, padding, wrapping dan hierarchy sesuai Gen-Z.
- Tiga tes UI meliputi: modal/keyboard/light/mobile, pending/reopen/API error, serta penolakan network/retry. Fixture provider hanya ada di tes.
- Pending/API-error memakai response fixture 503 di browser; ini memverifikasi state klien, bukan ketersediaan API/database. Penolakan network terjadi sebelum endpoint challenge. Sesi anonim nyata tetap 401.
- `npm run test:platform` dicoba; runner berhenti sebelum membuat database tes karena Docker engine tidak aktif. Proof/sesi/database tidak diklaim diuji ulang. Verifier, schema, challenge dan session service tidak diubah.

## Catatan click-through

| Kontrol | Hasil yang diamati |
|---|---|
| Connect Wallet | Modal Select wallet terbuka; provider tidak terlihat pada halaman awal. |
| Refresh wallet list | Discovery dijalankan kembali; empty state tetap terbaca tanpa provider. |
| Close wallet selection | Modal tertutup. |
| Escape | Modal tertutup, focus kembali ke Connect Wallet dan scroll body dipulihkan. |
| Klik backdrop | Modal tertutup; klik isi dialog tidak menutupnya. |
| Tab / Shift+Tab | Focus berputar antara kontrol modal tanpa keluar. |
| Provider EIP-6963 fixture | Mencoba koneksi jaringan Base Sepolia. |
| Network ditolak | Error pembatalan muncul, provider kembali aktif dan retry berjalan. |
| Pending request | Pilihan provider disabled; close/reopen mempertahankan status pending. |
| Response 503 fixture | Error API terlihat dan provider bisa dicoba kembali; tidak menciptakan sesi. |
| Skip to content | Tab lalu Enter memindahkan navigasi ke main content. |
| Pause / Play | SVG berhenti dan berjalan kembali; reduced motion mematikannya. |
| Protected routes anonim | `/app/assets` dan `/admin` kembali ke auth. |

Bukti: `.cache/platform-verification/wallet-login-1440.png`, `wallet-login-390.png`, `wallet-modal-selection.png`, `wallet-modal-empty.png`, `wallet-modal-provider.png`, `wallet-modal-mobile.png`.

## Delivery Gate antislop

Scope gate adalah perubahan UI dan dokumentasi fondasi pada sesi ini; bukan sertifikasi ulang backend atau seluruh landing.

### Hard Gate

- R-02 PASS: copy UI baru tidak mengandung em dash.
- R-03 PASS: enam lebar dan modal mobile diperiksa, overflow false dan posisi dialog dalam viewport; target kontrol minimal 44 px.
- R-17 PASS: tidak menambah statistik bisnis; persentase existing berlabel ilustratif.
- R-18 PASS: tidak menambah testimonial.
- R-23 PASS: layout/interaction berasal dari permintaan pengguna; font, logo dan ilustrasi dipakai ulang dari produk existing.
- R-24 PASS: tidak menambah route/navigation baru; banner fallback tetap mengarah ke anchor wallet-sign-in yang ada.
- R-25 PASS: computed contrast teks UI pada enam lebar dan modal memenuhi AA; warna CTA dark-on-teal dipertahankan.
- R-26 PASS: tombol Connect Wallet, close, provider dan refresh memiliki perilaku yang diklik; catatan click-through di atas.
- R-27 PASS: discovery loading/empty ditangani, pending/reopen, penolakan wallet dan error API fixture diuji.
- R-28 PASS: tidak menambah FAQ.
- R-32 PASS: skip link, Tab/Shift+Tab, Enter, Escape, focus loop dan pengembalian focus diuji; outline global dipertahankan.
- R-33 PASS: fitur ditulis langsung di source; runner hanya menjalankan server/tes dan menyimpan screenshot.
- R-34 PASS: hanya light yang dikirim; sistem dark dan storage dark lama tidak mengubahnya.
- R-35 PASS: check/build lulus, tiga tes browser lulus, screenshot ditinjau dan kontrol yang berubah diklik.
- R-36 PASS: tidak menambah klaim keamanan, compliance, performa atau investasi.
- R-37 PASS: DESIGN dan implementasi font existing dibaca; Design Read 2/2/2 dinyatakan sebelum edit.
- R-38 PASS: tidak menambah proyek/provider/traction fiktif; wallet fixture terbatas pada pengujian.

### Purpose Gate

- R-01/R-13 PASS: tidak menambah gradient/glow; halo energi existing tetap menjadi bagian ilustrasi yang diminta.
- R-04 PASS: ikon wallet/close menjelaskan aksi; alasan tercatat pada tabel.
- R-06 PASS: Display/UI berasal dari typography produk existing, tanpa monospace dekoratif/tracking ekstrem.
- R-07 PASS: pola titik existing tetap berada di panel ekosistem yang diminta pengguna.
- R-08 PASS: tidak menambah panah dekoratif pada tombol wallet.
- R-09 PASS: penanda demo/Base Sepolia menyampaikan environment aktual.
- R-10 PASS: hanya backdrop modal yang memakai blur; tidak menyebarkan glass ke komponen lain.
- R-12 PASS: shadow baru hanya untuk elevasi modal, alasan tercatat.
- R-14 PASS: opsi seragam adalah daftar pilihan provider setara, bukan grid fitur pemasaran.
- R-19 PASS: tidak menambah animasi dekoratif baru; kontrol gerak/reduced motion existing diuji.
- R-22 PASS: memakai ilustrasi energi existing, tidak membuat ilustrasi generik baru.

### Liveliness

- PASS: ENERGY 2 / RHYTHM 2 / MOTION 2 konsisten dengan dua panel, fokus wallet dan ilustrasi existing yang dapat dijeda.
- PASS: satu CTA utama pada panel login; saat modal terbuka, pilihan wallet menjadi tugas utama.
- PASS: whitespace memisahkan identitas, tugas login dan footer.
- PASS: aksen teal mengarahkan aksi, sementara warna netral menjaga keterbacaan.
- PASS: logo dan motif solar/charging/EV mempertahankan identitas Gen-Z.
- PASS: Design Read dicatat sebelum implementasi dan alasan keputusan tercatat di atas.

### Craftsmanship dan Quality Locks

- C-1/R-31 PASS: warna, layout, font, spacing, radius, ikon dan elevasi mempunyai alasan tertulis.
- C-2 PASS: kontrol yang berubah bekerja dalam click-through, tanpa tombol palsu.
- C-3/R-05 PASS: halaman tetap berpusat pada autentikasi, tanpa section template tambahan.
- C-4 PASS: UI relevan diperiksa pada breakpoint, light-only, keyboard serta pending/empty/error; keterbatasan tes database dicatat terpisah.
- C-5 PASS: tidak menambah klaim bisnis tanpa bukti.
- R-11 PASS: radius dibedakan menurut fungsi dan tercatat pada DESIGN.
- R-15/R-16 PASS: label Connect Wallet/Select wallet/Refresh spesifik; tanpa buzzword baru.
- R-20 PASS: typography Gen-Z, palette, logo dan motif energi dipertahankan.
- R-21 PASS: tema light-only mengikuti keputusan founder, tanpa toggle tertunda.
- R-29 PASS: palette tetap mint/teal dan netral; error menggunakan semantic destructive existing.
- R-30 PASS: referensi dipakai untuk alur modal; typography dan identitas tetap Gen-Z.

Hasil Delivery Gate perubahan UI: **PASS**. Pengujian signature/sesi/database lengkap tetap dibatasi Docker yang belum aktif.
