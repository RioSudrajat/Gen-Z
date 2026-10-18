# Implementasi landing page Gen-Z

> Arsip implementasi 14 Oktober. Source aktif kini berada di `apps/marketing` (Astro); folder `landing/` dan QA/production di dalamnya dihapus pada 18 Oktober 2026 atas permintaan pengguna. Gunakan [README marketing](../../apps/marketing/README.md) dan [laporan optimasi Astro](../history/2026-10-18-marketing-optimization.md) untuk kondisi serta perintah terbaru.

Status: prototipe HTML lokal lengkap, 14 Oktober 2026. Preview: http://127.0.0.1:4174/.

Permintaan terbaru mempertahankan hero Ondo dengan film pengguna, lalu menyelesaikan section berikutnya. Hero, font referensi, theme terang, navbar, dan scroll shrink yang diperbarui mengambil prioritas atas opsi hero lama di rencana awal.

## Arah visual dan alasan

- Antislop **during** berasal dari pilihan sesi pengguna; preferensi global tidak diubah.
- Design Read: landing electrification untuk eligible investors, operator aset, dan service partners, dengan film sinematik dan body editorial terang. Ini arah kustom berdasarkan referensi, bukan design system resmi Ondo.
- Dial antislop: **ENERGY 2 / RHYTHM 3 / MOTION 3**. Dial taste: **VARIANCE 7 / MOTION 7 / DENSITY 3**.
- Mint / teal berasal dari `DESIGN.md`; deep teal pada teks kecil memenuhi AA. Logo asli tidak diwarnai ulang. Error memakai deep red untuk keterbacaan, bukan accent brand tambahan.
- OndoSans menyambungkan judul dengan hero; Gellix menjaga UI konsisten; Arizona menekankan satu kalimat editorial.
- Container 1180 px, spacing section 116 px desktop / 76 px mobile, dan kolom yang berbeda mengikuti urutan baca serta bobot tiap materi.
- Radius 8 px pada kontrol, 12–20 px pada panel, 24 px pada stage aset, dan 30 px pada hero membedakan fungsi tanpa mengubah bahasa bentuk.
- Seluruh section tetap terang. Media dan navbar gelap adalah komponen, bukan pergantian theme.
- Garis hubungan menjadi motif fisik, evidence, dan capital; node memiliki makna hubungan. Shadow hanya pada navigasi yang melayang.
- Gradient film membantu pembacaan; gradient SVG membedakan sisi slab dan layer terpilih. Tidak ada glow dekoratif atau backdrop glass UI.
- Icon Phosphor menyatakan operator, dokumen, records, dan wallet. Tidak ada sparkle, orb, atau ilustrasi generik.

## Isi dan copy utama

| Section | Headline | Fungsi |
| --- | --- | --- |
| Hero | One electrification ecosystem. From energy to your wallet. | Film maju-mundur |
| Thesis | Electricity powers progress. Capital powers electricity. | Infrastructure, evidence, eligible capital |
| Assets | From productive asset to Capital on your Wallet. | Turbin GLB mengikuti scroll, aset / hak proyek / pembayaran |
| Stack | The Gen-Z stack. Built from the ground up. | Empat layer terhubung |
| Lifecycle | Follow the project. From funding to repayment. | Lima chapter proyek |
| Evidence | Energy. Invoices. Cash. See the difference. | Memisahkan produksi, billing, collection |
| Platform | See the asset. Understand the terms. Follow the cash. | Preview workspace interaktif |
| Ecosystem | Different roles. Connected by energy. | Investor / operator / service partner |
| Participation | Before you participate. | Tahap, risiko, tenor, points, token |
| Intake | Help shape what comes next. | Draft inquiry lokal |
| Footer | Connecting productive energy infrastructure, project evidence, and eligible capital. | Brand dan navigasi |

Copy section aset ada di `landing/index.html` dan `ProductiveCapitalSection.jsx`. Section lain tetap memakai komponen masing-masing.

## Penggantian section aset, 14 Oktober 2026

Antislop **after**, dipilih pengguna untuk revisi ini. Section lama diganti sesuai referensi [GE Network](https://www.ge.network/#asset-to-yield), dengan judul pengguna dipertahankan. Brand, theme terang, font, dan anchor `#assets` mengikuti implementasi yang sudah ada. ENERGY 2 / RHYTHM 3 / MOTION 3; taste DESIGN_VARIANCE 7 / MOTION_INTENSITY 7 / VISUAL_DENSITY 3.

Model dibuat melalui [Higgsfield 3D Jutsu](https://higgsfield.ai/3d-jutsu/aeed98c9-f7f5-4dff-9be5-97128f94e660), revision 2. Tower, housing, hub, dan tiga blade terpisah; `ROTOR_wind` menjadi pivot animasi. GLB 142.028 byte, poster WebP 16.546 byte. Source Blender dan script produksi ada di `landing/production/wind-turbine/`.

- Silver memberi bentuk turbin yang terbaca di permukaan putih; ujung teal mengikatnya ke palette Gen-Z.
- Layout desktop mengelilingi turbin untuk menunjukkan hubungan fisik, hak proyek, dan pembayaran; tablet memakai dua kolom dan mobile satu kolom.
- Font mengikuti hero agar section tetap terasa bagian dari halaman yang sama.
- Ruang kosong memberi bilah yang berputar area tersendiri, bukan menjadi background seluruh halaman.
- Garis pendek menghubungkan alur dengan visual aset; nomor hanya urutan alur, bukan statistik.
- GSAP memutar rotor 2,25 putaran sepanjang lintasan scroll section, dengan `scrub: 0.55`; arah naik membalik putaran. Motion hanya menyentuh teks pada komponen terpisah.
- Reduced motion membekukan rotor dan teks; Data Saver mempertahankan poster. WebGL / GLB gagal menampilkan poster dan retry. Renderer menggambar sesuai kebutuhan dan berhenti di luar viewport.
- Copy tetap menyatakan planned flow, project rights, principal / income terpisah, dan ketergantungan pada cash collection sesuai brief pre-pilot.

Build, pemeriksaan responsif 1440 / 768 / 390 / 320 px, keyboard, fallback, retry, dan reduced motion tercatat di `landing/qa/wind-turbine/`. Delivery Gate scope section ada di `landing/qa/wind-turbine/DELIVERY-GATE.md`; audit after ada di `anti-slop/audit-001-2026-10-14.md`. Lighthouse final seluruh halaman: performance 72, accessibility 100, best practices 100, SEO 100; LCP 5,6 detik, TBT 100 ms, CLS 0. LCP hero dicatat sebagai temuan, tanpa mengubah section lain melalui audit.

Catatan aset dan explorer berikut merupakan dokumentasi implementasi sebelumnya, bukan perilaku section aset aktif.

## Aset dan adaptasi stack

Empat kategori mencakup solar PV, wind, hydro, geothermal, sustainable biomass; BESS, substation / transformer, grid connection, smart meter; data centre, AI compute, industrial supply; EV charging, battery swap, dan fleet services. Caption menandai kategori ilustratif tanpa live listings.

Poster bersama memperlihatkan ekosistem. Selector mengubah detail kategori; saat explorer aktif, camera memakai bounds mesh kategori pada GLB yang sudah dibuat dengan [Higgsfield 3DJutsu](https://higgsfield.ai/3d-jutsu/5268ce0e-e0a3-4351-9fea-4059f1a411c0). Model dan file Blender tidak diubah. Three.js hanya diimport setelah pilihan pengguna; viewer memiliki drag, keyboard left/right, zoom, reset, close, fallback, dan retry. Wheel scroll tetap tersedia. Renderer menggambar saat berubah dan berhenti di luar viewport; close mengembalikan focus ke tombol explorer.

Sumber stack: [NemesisStackSection.tsx](https://github.com/RioSudrajat/Nemesis-Protocol/blob/main/frontend/src/components/landing/NemesisStackSection.tsx). Snapshot penelitian tetap di `docs/design/references/`.

Source aslinya memakai SVG. Adaptasi mempertahankan projection isometrik 30°, octagonal slabs, thickness, elevated levels, cube groups, connecting walls, foundation image, alternating annotations, dan perpindahan detail Framer Motion. Sesuai revisi pengguna, foundation memakai gambar `landing/public/assets/elctrification ecosystem.jpg` dengan aspect ratio utuh. Gambar dimuat ketika stack mendekati viewport. Tablet memindahkan labels ke empat kolom di bawah diagram; mobile memakai dua kolom. Layer menjadi Infrastructure assets, Gen-Z network, Finance & settlement, serta Apps & ecosystem. Layer 3 tidak menjanjikan secondary liquidity; Network tidak mengklaim Gen-Z mempunyai L1 chain sendiri.

Hover mouse dan click memilih layer. Tombol HTML memberi alternatif keyboard dan touch. Selection tetap tersedia setelah pointer keluar, label tetap memenuhi AA, dan mobile memindahkan labels menjadi empat kontrol dua kolom di bawah diagram. SVG mengikuti pendekatan source dengan payload ringan; Three.js / GLB digunakan pada explorer aset.

## Motion, UI, dan batas produk

Hero mempertahankan koreografi scroll sebelumnya. Chunk navbar / body tidak mengulang judul hero. Font display memicu pengukuran ulang judul; autoplay menunggu typography tampil, berhenti di luar hero, serta menghormati reduced motion dan Data Saver.

Stack dirakit sekali saat masuk viewport, tanpa pinned scroll kedua. Transisi 160–180 ms menyatakan pergantian detail. Lifecycle memakai detail sticky biasa dan lima chapter pilihan. Tidak ada scroll snap, horizontal hijack, custom cursor, atau animasi seluruh heading bersamaan. Reduced motion meniadakan choreography dan perpindahan panel.

Menu navbar menuju section nyata dan memindahkan focus ke heading. CTA role memilih peran intake. Drawer mobile memiliki body lock, focus trap, Escape, dan focus return. Footer memakai anchor yang valid.

PRD tetap menjadi sumber: Gen-Z pre-pilot; aset milik partner; tanpa partner atau anchor yang sudah diumumkan; hak proyek mengikuti issuer documents; funding dan repayment belum live. IDRX / native USDC untuk proyek IDR menghasilkan IDR-denominated rights berdasarkan quote dan net settlement. Outstanding principal, principal returned, dan income dipisahkan. Tidak ada guaranteed return atau early exit.

Rewards terpisah dari investasi. Simulasi memerlukan completed eligible service, final partner payment, dan verified account link, tanpa investment atau staking. Native token deferred dan tidak tersedia untuk dijual.

Form memiliki validation, error association, focus error, draft lokal, copy, dan download. Tidak ada pengiriman, penyimpanan, atau endpoint. Nama / email pada bukti QA merupakan fixture pengujian.

## Verifikasi dan batas prototipe

Build Vite berhasil. Bukti di `landing/qa/full-landing/`: interaction checks, screenshot desktop / mobile / tablet, GLB failure-and-retry, error form, contrast ratios, hashes, Lighthouse, dan Delivery Gate.

Viewport diperiksa: 1440×900, 768×1024, 390×844, dan 320×568. Tidak ditemukan overflow horizontal atau text overflow pada komponen yang diperiksa. Input boundaries 3,52:1, deep teal pada putih 5,47:1, primary button 10,95:1.

Lighthouse desktop 100 / 100 / 100 / 100. Mobile 95 / 100 / 100 / 100, LCP 2,86 detik, TBT 31 ms, CLS mendekati nol. Ini hasil lab lokal, bukan field performance. LCP mobile masih di atas target 2,5 detik. Reduced motion lulus: video paused, time 0, readyState 0, tanpa request video / GLB.

Hak distribusi font referensi untuk rilis publik belum diverifikasi. Inquiry memerlukan endpoint nyata sebelum menerima leads. Integrasi investasi, wallet, dan rewards berada di luar scope landing ini.
