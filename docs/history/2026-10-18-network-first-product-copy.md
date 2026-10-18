# Login network-first dan product writing

18 Oktober 2026, Asia/Jakarta. Revisi berdasarkan feedback pengguna setelah melihat hasil sebelumnya. Scope: urutan login, polish modal/CTA, logo, serta copy internal pada login dan marketing. Antislop `during` tetap mengikuti pilihan sesi pengguna.

## Koreksi dan hasil

Radius 8/12/20–24 px pada revisi sebelumnya adalah pilihan agent yang kemudian dicatat ke DESIGN, bukan aturan global Gen-Z yang telah disetujui founder. Alur provider langsung juga menyederhanakan referensi pengguna secara keliru. DESIGN dan `.agents/UI-GUIDELINES.md` sekarang mencatat perbedaan itu dan urutan interaksi yang diminta.

Design Read: login light Gen-Z dengan modal dua langkah dan kedalaman lembut mengikuti screenshot pengguna, ENERGY 2 / RHYTHM 2 / MOTION 2. Landing menerima penyederhanaan copy; font, palette, komposisi, media dan motion existing dipertahankan.

| Keputusan | Alasan |
|---|---|
| Connect Wallet → network → provider | Mengikuti alur referensi pengguna. |
| Solana dan BNB Coming soon, Base Sepolia aktif | Menampilkan pilihan yang diminta tanpa membuat integrasi jaringan baru. |
| Tombol Back di provider | Mengembalikan pengguna ke pemilihan network dalam dialog yang sama. |
| CTA putih, radius 16 px, border/shadow halus | Mengikuti bentuk dan kedalaman CTA referensi. |
| Modal desktop radius 48 px, mobile 32 px | Mengikuti siluet rounded referensi sambil menjaga ruang baca mobile. |
| Baris pilihan radius 20 px | Mempertahankan bahasa bentuk modal, tanpa mengubah seluruh komponen aplikasi. |
| Shadow modal dan tile ikon | Membedakan lapisan dialog dan bingkai logo; gambar logo sendiri tidak dimodifikasi. |
| Backdrop blur tunggal | Memusatkan perhatian pada proses pemilihan. |
| GenZ Display/UI dan palette existing | Menjaga identitas Gen-Z pada komposisi referensi. |
| Aset logo asli | Menggantikan ikon wallet generik yang sebelumnya digunakan untuk setiap provider. |
| Provider populer dengan Get wallet | Menampilkan pilihan familiar dan aksi download bila extension belum terdeteksi. |
| Provider EIP-6963 tambahan | Mempertahankan discovery terbuka, tanpa membatasi merek. |
| Login tanpa catatan signature/gas/session | Menjaga UI berpusat pada tugas pengguna; batas implementasi dilaporkan di sini. |
| State pending dan error singkat | Memberi feedback dan tindakan retry tanpa penjelasan internal panjang. |

Logo network: [Solana](https://solana.com/branding), [BNB Chain](https://www.bnbchain.org/en/brand-guidelines), dan [Base brand kit](https://github.com/base/brand-kit). Base memakai aset resmi Square terbaru; screenshot pengguna memakai ikon lingkaran lama. Logo provider dari [RainbowKit resmi Rainbow](https://github.com/rainbow-me/rainbowkit/tree/main/packages/rainbowkit/src/wallets/walletConnectors); MIT license disimpan bersama aset. Provenance: `apps/platform/public/wallets/SOURCES.md`. Provider lain memakai metadata icon EIP-6963; bila tidak ada icon, hanya inisial nama yang ditampilkan.

## Copy yang dibersihkan

- Login: catatan signature/transfer/gas, catatan pembuatan akun/sesi, penanda environment pada halaman awal, dan caption “not live project data”. Base Sepolia tetap disebut pada pilihan network yang bersangkutan.
- Landing: paragraf pre-pilot preview setelah hero, caption ilustrasi berulang, badge illustrative project view dan penjelasan preview berulang pada empty payment state.
- Platform handoff: penjelasan teknis sesi diganti petunjuk sign-in singkat.
- Contact: penjelasan backend/receipt dan disclaimer panjang diganti petunjuk menyiapkan pesan untuk copy/download. Review draft tidak mengklaim pesan terkirim.
- Thesis disclosure: penjelasan sumber tetap ada; meta-caveat berulang diringkas. Nilai data dan tahun sumber existing tidak ditambah atau diganti dengan klaim hasil investasi.

Alt text yang menggambarkan media, helper tindakan, Coming soon, loading, error, retry dan kontrol gerak tetap sesuai fungsi. Tidak ada data proyek, penerimaan inquiry, signature, sesi atau dukungan jaringan tambahan yang dikarang untuk mengisi tampilan.

## Verifikasi

- `npm run check`: lulus seluruh workspace. Astro 47 file, 0 error/warning/hint; typegen dan TypeScript platform lulus.
- Build final Next/Webpack: exit 0, termasuk TypeScript dan standalone output. Warning existing `ox/tempo` dari viem tetap ada.
- Build Astro: exit 0. Warning chunk >500 kB existing tetap ada.
- Root/marketing tests: 16/16 lulus.
- `node apps/platform/scripts/test-ui.mjs`: 3/3 lulus pada build final. Server production sementara memakai konfigurasi database kosong.
- Platform browser: 320, 390, 768, 1024, 1440, 2048 px; kedua preferensi warna OS dan storage dark lama tetap menghasilkan light. Overflow false, computed contrast AA lulus pada login, network dan provider; gambar network benar-benar termuat.
- Network Solana/BNB disabled dengan Coming soon, Base membuka provider, Back kembali ke network. Dialog mendukung close, backdrop, Escape, Tab/Shift+Tab, scroll lock dan focus return.
- Provider fixture menolak switch network: error tampil, retry aktif dan sesi anonim tetap 401. Pending tetap terlihat setelah close/reopen; response API fixture 503 mengaktifkan error/retry tanpa sesi. Ini pengujian state UI, bukan klaim keberhasilan backend.
- Marketing browser: 63 pemeriksaan lulus. Menu desktop/mobile, carousel/detail, evidence, workspace tabs, thesis disclosure, contact validation/draft/copy/download, handoff, image retry, normal/reduced motion, no-JS dan viewport 320/390/768/1440 diperiksa. Axe desktop dan contact mobile: 0 violations. Tidak ada uncaught runtime/hydration error. Log resource juga merekam 404 route uji, favicon pada handoff, dan 503 fixture image retry; bukan bukti seluruh console kosong.
- Native preview pengguna: login, dialog network, Base → provider, dan Back diperiksa lewat browser. Screenshot native disimpan pada `network-first-preview.png` dan `provider-preview.png` di `.cache/platform-verification/`.
- Screenshot desktop/mobile dari tes dibuka dan diperiksa: logo, radius, shadow, wrapping dan hierarchy. Contact mobile juga ditinjau setelah pembersihan copy.

Bukti marketing: `apps/marketing/qa/browser-verification.json` dan screenshot di direktori yang sama. Bukti platform: `.cache/platform-verification/wallet-networks-1440.png`, `wallet-networks-390.png`, `wallet-modal-empty.png`, `wallet-modal-selection.png`, `wallet-modal-mobile.png`, `wallet-login-1440.png`, dan `wallet-login-390.png`.

## Batas implementasi dan lingkungan

Autentikasi aktif tetap EVM/SIWE Base Sepolia 84532. Koneksi wallet belum membuat sesi; signature diverifikasi oleh service existing. Solana dan BNB hanya Coming soon. Tautan Get wallet membuka download vendor; tidak memasang extension atau menambah integrasi SDK vendor. Tidak ada transaksi transfer/investasi baru pada perubahan ini.

`npm run test:platform` dicoba lagi dan berhenti sebelum membuat database tes karena engine Docker tidak aktif. Proof/sesi/database lengkap belum diuji ulang. Ini tidak menghalangi pemeriksaan UI tanpa database dan tidak disamarkan sebagai login sukses.

Panduan opsional DesainPakeAI tidak berhasil diambil. Pemeriksaan persetujuan otomatis menolak akses API karena tujuan/payload eksternal tidak terverifikasi. Tidak ada upaya bypass; implementasi memakai referensi pengguna, source existing, brand assets publik, antislop dan verifikasi lokal.

## Delivery Gate dan pre-flight

Scope: perubahan login dan product writing; bukan redesign menyeluruh landing atau sertifikasi backend.

### Hard Gate

- R-02 PASS: copy baru tanpa em dash.
- R-03 PASS: enam lebar platform, empat lebar marketing dan modal mobile diuji tanpa horizontal overflow; target kontrol ≥44 px.
- R-17/R-18 PASS: tidak menambah statistik bisnis atau testimonial.
- R-23 PASS: alur/radius/shadow/aset asli diminta pengguna; brand Gen-Z dipertahankan.
- R-24 PASS: Base menuju state provider, Back menuju network, tautan wallet memakai download vendor; anchor/handoff marketing diperiksa browser.
- R-25 PASS: computed contrast platform dan audit Axe marketing lulus dalam scope uji.
- R-26 PASS: Connect Wallet, Base, Back, close, refresh, provider, retry dan motion bekerja. Solana/BNB jelas Coming soon, disabled, dengan TODO implementasi di source.
- R-27 PASS: loading/empty/pending/rejection/API error/retry tersedia dan diuji.
- R-28 PASS: tidak menambah FAQ.
- R-32 PASS: keyboard dan focus modal diuji; navigasi dan tabs marketing juga diperiksa.
- R-33 PASS: fitur ditulis langsung di source. Script hanya untuk build/tes dan capture, bukan rewriting UI.
- R-34 PASS: light-only tetap konsisten terhadap dark OS/storage.
- R-35 PASS: check, dua build, 16 tes, 3 tes UI dan 63 browser checks lulus; screenshot diperiksa.
- R-36/R-38 PASS: tidak menambah klaim keuangan, compliance, performa, data bisnis atau dukungan network palsu.
- R-37 PASS: arah screenshot dan DESIGN dinyatakan sebelum revisi; koreksi keputusan agent dibedakan dari standar founder.

### Purpose Gate

- R-01/R-13 PASS: tidak menambah glow/gradient dekoratif; efek energi existing tidak diubah.
- R-04 PASS: ikon kontrol Phosphor, logo resmi network/provider dan metadata EIP-6963 memiliki fungsi identifikasi.
- R-06 PASS: typography tetap Gen-Z, tanpa font referensi baru atau monospace dekoratif.
- R-07 PASS: pola existing panel energi dipertahankan sesuai arah pengguna.
- R-08 PASS: panah Base/Back menyampaikan perpindahan langkah.
- R-09 PASS: Coming soon adalah status fitur, bukan badge promosi.
- R-10 PASS: satu backdrop dialog memakai blur; komponen lain tidak diubah menjadi glass.
- R-12 PASS: elevasi baru terbatas pada dialog, CTA putih dan tile ikon, dengan alasan tertulis.
- R-14 PASS: baris seragam menyatakan pilihan network/provider setara, bukan grid fitur template.
- R-19 PASS: hover memberi feedback; gerak ekosistem existing tetap memiliki pause/reduced motion.
- R-22 PASS: tidak menambah ilustrasi generik.

### Liveliness

- PASS: dials 2/2/2 konsisten; panel energi existing tetap menjadi motif produk.
- PASS: satu fokus tugas per state, whitespace struktural, aksen teal pada perpindahan langkah dan focus.
- PASS: font, logo Gen-Z serta komposisi energi menjaga identitas pada pola modal referensi.

### Craftsmanship dan quality locks

- C-1/R-31 PASS: alasan alur, warna, typography, radius, spacing, shadow dan ikon dicatat.
- C-2 PASS: kontrol inti berfungsi, status belum tersedia dibedakan secara eksplisit.
- C-3/R-05 PASS: copy internal dan dekorasi teks berulang dihapus; tidak menambah section template.
- C-4 PASS: modal, network, provider, pending/retry, breakpoint, keyboard dan light-only diperiksa; batas DB dicatat.
- C-5 PASS: tidak menambah fakta bisnis fiktif.
- R-11 PASS: radius mengikuti koreksi referensi pada login, dengan perbedaan fungsi dan breakpoint.
- R-15/R-16 PASS: label tindakan spesifik dan copy ringkas, tanpa buzzword baru.
- R-20/R-29 PASS: palette/font/logo Gen-Z tetap; warna lain hanya logo vendor dan semantic error existing.
- R-21 PASS: light-only sesuai keputusan founder.
- R-30 PASS: alur, radius dan shadow reference diadopsi secara eksplisit atas permintaan pengguna; identitas tidak diganti.

Pre-flight taste untuk perubahan copy marketing: arah preserve existing, dials existing dipertahankan, warna/font/theme/radius tidak berubah; copy baru dibaca ulang, disclaimer internal dan micro-meta berulang dihapus, tidak ada data/quote fiktif atau layout section baru. Audit browser memeriksa navigasi, media, kontras, mobile, form dan motion. Aturan visual redesign global tidak digunakan untuk merombak section yang tidak diminta.

Hasil Delivery Gate perubahan ini: **PASS**, dengan batas pengujian DB di atas.

## Perbaikan logo kembali ke landing

Preview production lokal tidak memiliki `GENZ_MARKETING_ORIGIN`, sehingga Brand pada `/auth` memakai fallback `/auth` lagi. Konfigurasi lokal sekarang mengisi `http://localhost:4321`; `prepareEnvironment` juga mengisi variabel ini sebelum early return ketika DATABASE_URL sudah ada. Domain deployment tetap harus dikonfigurasi eksplisit.

Verifikasi perbaikan: syntax check script, check TypeScript platform dan build Next lulus. `prepareEnvironment` diperiksa dengan konfigurasi database existing tanpa mengubah data. Browser login di-reload: href logo menjadi `http://localhost:4321/`; klik logo benar-benar membuka landing dengan judul Gen-Z. Bukti screenshot: `.cache/platform-verification/login-logo-to-landing.png`.

Delivery Gate terbatas perbaikan tautan: Hard PASS (navigasi nyata diklik, check/build lulus); Purpose PASS (tanpa teknik visual baru); Liveliness PASS (arah existing dipertahankan); Craftsmanship PASS (tujuan logo dan konfigurasi setup diverifikasi, tanpa perubahan auth/data).
