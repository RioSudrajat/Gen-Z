# Migrasi landing ke apps/marketing

Tanggal: 17 Oktober 2026, Asia/Jakarta. Scope: migrasi marketing publik, bukan implementasi seluruh backend MVP atau deploy publik.

Acuan: [APP-ARCHITECTURE](../archive/app-architecture-2026-10-18.md), [MVP-SCHEMA-FLOWS](../archive/schema-flows-2026-10-18.md), [SPEC-MVP](../archive/mvp-spec-2026-10-18.md). Spec 17 Oktober mendahului baseline 12 Oktober. Mode antislop during dipilih pengguna pada sesi ini.

## Hasil dan kepemilikan

Landing aktif berada di `apps/marketing`: Astro memiliki layout, route, metadata, HTML section dan script bootstrap; React islands memiliki interaksi yang membutuhkan state. Tidak ada iframe, Vite entry tersembunyi, impor source legacy, atau mount React root kedua. Semua sebelas section dirender ke HTML pada build. Struktur dan kontrak lengkap: [README marketing](../../apps/marketing/README.md).

Urutan dan ID existing tetap: `top`, `energy-context`, `why`, `ecosystem`, `assets`, `opportunities`, `stack`, `evidence`, `platform`, `comparison`, `connect`. Browser membandingkan text content setiap section dengan source Vite, termasuk data thesis, tautan sumber, label dan CTA. Identitas font/palette, media, geometri SVG stack, motion pinned, tabel, modal, carousel dan tab ilustrasi dipertahankan.

Semua 39 aset publik existing disalin byte-identical, diuji SHA-256, termasuk font dan lisensi OFL. Enam WOFF2 tambahan diturunkan dari font existing dengan pengujian glyph advance/bearing. Font original tetap menjadi fallback untuk karakter di luar subset. Font audience dimuat mendekati viewport. Tidak ada gambar, logo, statistik, identitas orang atau testimoni baru yang dibuat.

Perbedaan yang disengaja sesuai arsitektur:

- `/contact/` mempertahankan role, name, company opsional, email, message, review, copy dan download. Presentasi menerima gateway dari composition boundary; validasi/draft dan adapter HTTP dipisahkan. Saat platform belum dikonfigurasi, form menjelaskan delivery belum terhubung. Saat terkonfigurasi, error/retry/loading/receipt mengikuti kontrak server; tidak mengklaim sukses tanpa reference.
- `/auth/`, `/dashboard/` dan `/assets/` hanya handoff ke auth platform atau status belum terhubung. Login email sessionStorage dan dashboard browser preview tidak dipindahkan sebagai autentikasi marketing.
- URL lama detail asset diarahkan melalui custom 404 ke auth dengan internal returnTo tervalidasi bila origin platform tersedia. Tidak ada payload offering atau dokumen privat dalam redirect/HTML marketing.
- Halaman menambahkan label pre-pilot yang menjelaskan bahwa kemampuan yang diilustrasikan belum menjadi live investment, feed terverifikasi atau issuance on-chain.
- Accessible name tombol soundtrack sekarang menyertakan visible label Sound on/off. Cached image completion disinkronkan sesudah hydration; mobile dialog mengembalikan focus ke tombol menu.
- Saat migrasi awal, `landing/` dipertahankan sebagai snapshot pembandingan. Pada 18 Oktober 2026, snapshot tersebut dihapus atas permintaan pengguna setelah aset/font diverifikasi dan dependency tes serta produksi motion dipindahkan. Source aktif tunggal berada di `apps/marketing`.

## Design Read dan alasan preservasi

Landing pembiayaan energi untuk operator dan investor, mempertahankan bahasa visual existing. Dials antislop ENERGY 2 / RHYTHM 3 / MOTION 3; taste DESIGN_VARIANCE 7 / MOTION_INTENSITY 7 / VISUAL_DENSITY 4. Dials mendeskripsikan baseline yang dipindahkan, bukan redesign baru.

| Keputusan | Alasan |
|---|---|
| Mint/teal dan netral existing | Menjaga identitas Gen-Z serta hierarki CTA yang sudah dipilih |
| Typeface display/UI/editorial dan font audience existing | Mempertahankan hierarki baca serta komposisi visual, bukan memilih font baru |
| Ruang antarsection dan komposisi bervariasi | Masing-masing section membahas demand, audiens, proses, bukti dan workspace dengan struktur berbeda |
| Panel, radius, badge foto dan chip existing | Menjaga pengelompokan audiens/kategori yang sebelumnya disetujui; tidak menambah pola baru |
| Hero film, capital bridge, turbin dan SVG stack | Ilustrasi infrastruktur dan lapisan produk yang sudah ada; bukan bukti proyek/pelanggan nyata |
| Hero shrink, pinned steps dan stack reveal | Mempertahankan urutan cerita dan hubungan layer saat scroll; reduced motion menjadi statis |
| Ikon Phosphor dan panah CTA existing | Menunjukkan jenis record, kategori, navigasi dan arah tindakan, tanpa mengganti keluarga ikon |
| Tema hero/body, scroll cue dan copy existing | Preservasi eksplisit dalam permintaan migrasi mengalahkan default desain baru pada skill |

Copy audience yang sebelumnya disetujui sebagai referensi dipertahankan. Preservasi bukan verifikasi independent bahwa kemampuan live/commercial/legal tersebut tersedia; label pre-pilot berlaku pada ilustrasi produk di halaman ini.

## Bukti verifikasi

Log `*.log` di `apps/marketing/qa/` adalah artefak lokal dari sesi verifikasi asal dan tidak ikut Git. Nama log di bawah mencatat lokasi bukti saat laporan dibuat; file tersebut tidak tersedia pada clone baru. Tautan JSON dan gambar mengarah ke bukti yang disimpan di repository. Hasil historis ini bukan hasil pengujian ulang CI saat ini.

| Pemeriksaan | Bukti |
|---|---|
| Type-check npm workspaces | Log lokal `workspace-check.log`, marketing 0 error/warning/hint; packages, scaffold platform dan worker ikut diperiksa |
| Build npm workspaces | Log lokal `workspace-build.log`; build marketing terakhir pada sesi asal di `build.log` |
| Unit dan boundary | Log lokal `unit-tests.log`, 12 test; meliputi domain editorial existing, URI safety, inquiry failure/receipt, asset hash dan lifecycle motion |
| Browser produksi | [browser-verification.json](../../apps/marketing/qa/browser-verification.json) dan log lokal `browser-run.log`, 63 pemeriksaan lulus, termasuk nol respons aset gagal pada pemuatan normal dan font audience terdaftar |
| HTTP smoke | Log lokal `smoke.log`, public HTML/contact/handoff serta batas platform/API/worker |
| Font derivation | Log lokal `font-subsets.log`, enam font dengan glyph metrics identik |
| Kontras tambahan | [contrast.json](../../apps/marketing/qa/contrast.json): body 17,74:1, muted 7,56:1, teal 5,47:1, dimmed stack 5,52:1 pada putih, CTA 10,95:1; computed text/ancestor opacity dan screenshot diperiksa untuk melengkapi incomplete axe |
| Visual | [hero desktop](../../apps/marketing/qa/hero-desktop.png), [hero mobile](../../apps/marketing/qa/hero-mobile.png), [operator mobile](../../apps/marketing/qa/operator-mobile.png), screenshot penuh tiap viewport di `apps/marketing/qa/` |
| Lighthouse mobile | [hasil Astro](../../apps/marketing/qa/lighthouse-mobile.json), [baseline produksi Vite](../../apps/marketing/qa/lighthouse-legacy-production-mobile.json); angka lab, bukan SLA atau hasil pengguna lapangan |

Suite browser mencakup desktop 1440, tablet 768, mobile 390/320; normal motion 390×844 dan 320×600; navbar desktop/mobile, ArrowDown/Escape/focus restore, seluruh target section menu, tiga kategori dan modal, next/previous wrap, tiga evidence records, tiga tab ilustrasi plus Home/End/arrow, empat label layer keyboard, dua disclosure thesis, form invalid/prefill/draft/copy/download, handoff, 404, synthetic inquiry failure/retry/receipt, gambar gagal/retry, scroll cue, reduced-motion switch, HTML tanpa JavaScript, serta uncaught runtime/hydration error. Turbin 3D juga diperiksa langsung: state ready dan canvas terpasang pada production build.

Respons 503 dan 404 yang sengaja diinjeksi menghasilkan console network messages yang diharapkan. Itu dipisahkan dari runtimeErrors pada report. Fixture receipt bersifat sintetis dan tidak membuktikan commit database atau notifikasi.

Lighthouse mobile pada build terakhir: performance **81**, accessibility **100**, best practices **100**, SEO **100**, CLS **0**, TBT **20 ms**, FCP **2,4 s**, LCP **4,5 s**. Baseline Vite production dengan profil yang sama: performance **80**, FCP **2,4 s**, LCP **4,5 s**, TBT **100 ms**, CLS **0**. Selisih single-run tidak dipakai sebagai klaim peningkatan performa. Hasil awal Astro performance 69 menjadi 81 setelah optimasi, tetapi target lab LCP 2,5 detik tetap belum tercapai. Ini keterbatasan yang dinyatakan, bukan hasil yang disembunyikan atau dinyatakan lulus.

## Delivery Gate antislop, scope migrasi

| Item | Status dan bukti |
|---|---|
| R-02 copy | PASS: tidak ada em dash pada copy antarmuka yang dikirim |
| R-03 mobile | PASS: browser mengukur scrollWidth tidak melebihi viewport pada ukuran yang diuji, termasuk normal motion |
| R-17 angka | PASS: tabel/snapshot dan sumber thesis existing dipertahankan; tidak menambah angka yield, customer atau operasi Gen-Z |
| R-18 testimoni | PASS: tidak membuat atau menambahkan testimoni |
| R-23 aset | PASS: aset existing dipertahankan; subset font merupakan optimasi derivatif dengan metrics diuji, tanpa identitas/gambar baru |
| R-24 navigasi | PASS: anchor ditemukan dan diklik; route publik/handoff diuji; tidak menambah menu ke fitur privat yang belum tersedia |
| R-25 kontras | PASS dalam layar yang diuji: axe WCAG A/AA tidak menemukan violation; Lighthouse accessibility 100. Area image/SVG yang tidak dapat diputuskan otomatis tetap dicatat sebagai incomplete di JSON, bukan klaim sertifikasi penuh |
| R-26 interaksi | PASS: menu, selector, modal, tabs, disclosures, form dan links dicatat per kontrol dalam browser report |
| R-27 states | PASS: draft/empty record, loading, error/retry/unavailable dan receipt ada; cached image dan network failure diuji |
| R-28 FAQ | PASS: tidak menambah FAQ generik |
| R-32 keyboard | PASS: menu, native dialog/Escape/focus return, tabs dan stack label dijalankan dengan keyboard |
| R-33 sumber | PASS: feature ditulis pada Astro/React/runtime/CSS; script font hanya menghasilkan file font, tidak menulis ulang source UI |
| R-34 tema | PASS dalam scope: tidak menambah theme toggle; perlakuan warna existing dipertahankan dan mobile diperiksa |
| R-35 runtime | PASS: build/check/test, production browser, console/runtime, HTTP dan Lighthouse dijalankan; lihat artefak bukti |
| R-36 klaim | PASS dalam scope preservasi: tidak menambah klaim live/security/legal; pre-pilot menjelaskan batas ilustrasi existing |
| R-37 arah | PASS: DESIGN.md dan desain existing menjadi arah, bukan default visual baru |
| R-38 konten | PASS: sumber konten existing dipertahankan; ilustrasi/demo dibedakan dari resource app privat |
| R-01 gradient | PASS: hanya treatment existing untuk hierarki/ilustrasi; tidak menambah aksen brand baru |
| R-04 ikon | PASS: Phosphor menandai kategori/record/aksi; alias Icon menghapus deprecated hints tanpa mengubah glyph |
| R-06 tipografi | PASS: family, weight dan metrics dipertahankan; alasan tertulis di atas |
| R-07 background | PASS: tidak menambah pola/grid dekoratif |
| R-08 panah | PASS: panah navigasi/aksi existing dipertahankan, tanpa penyebaran pola baru |
| R-09 badge | PASS: label audiens/kategori existing sesuai konten, bukan klaim keamanan/kecepatan baru |
| R-10 glass | PASS dalam scope: tidak menambah glass layer; dialog/backdrop existing dipertahankan |
| R-12 shadow | PASS: elevation navigation/panel existing, tanpa shadow baru pada semua elemen |
| R-13 glow | PASS dalam scope preservasi: glow SVG menjelaskan layer aktif existing; tidak menambah glow pada UI lain |
| R-14 cards | PASS: audience, evidence, category dan comparison memiliki susunan berbeda sesuai isi |
| R-19 motion | PASS: transisi cerita/state existing dipertahankan; preference switch unpin dan pause kedua film diuji |
| R-22 ilustrasi | PASS: semua media berasal dari baseline aset, bukan ilustrasi generik tambahan |
| Liveliness, dials | PASS: dials dinyatakan dan hero/pinned/stack benar-benar bergerak pada normal motion |
| Liveliness, focal point | PASS: headline hero, ilustrasi proses dan layer aktif menjadi fokus sesuai section |
| Liveliness, whitespace | PASS: struktur spacing baseline dipertahankan dan tidak overflow pada viewport uji |
| Liveliness, accent | PASS: keluarga mint/teal konsisten pada CTA/teks/indikator aktif |
| Liveliness, motif | PASS: infrastruktur energi, bridge dan layer stack tetap menjadi motif khusus produk |
| Liveliness, Design Read | PASS: arah dan alasan preservasi dicatat sebelum implementasi |
| C-1 intentionality / R-31 | PASS: alasan besar warna, font, layout, radius, icon, aset dan motion ditulis pada tabel keputusan |
| C-2 functional completeness | PASS: daftar klik/kontrol dan hasilnya ada dalam browser report; backend unavailable tidak disamarkan sebagai success |
| C-3 composition / R-05 | PASS: sebelas section kebutuhan konten existing, bukan penambahan template marketing |
| C-4 resilience | PASS pada kondisi uji: mobile/keyboard, reduced motion, error/retry, no-JS public HTML dan cached image ditangani |
| C-5 evidence | PASS dalam scope: tidak menghasilkan customer/return/testimoni palsu; receipt sintetis hanya pada fixture lokal |
| R-11 radius | PASS: sistem bentuk existing dipertahankan pada gambar, panel, CTA dan input |
| R-15 CTA | PASS: Contact Gen-Z, Discuss your asset, Launch app dan aksi form memiliki tujuan teruji |
| R-16 copy | PASS dalam scope: tidak menambah buzzword marketing; copy yang disetujui tetap menjadi baseline |
| R-20 identity | PASS: brand, tipografi, media dan geometri existing dipertahankan |
| R-21 theme | PASS dalam scope preservasi: tidak mendesain ulang tema atau menambahkan toggle yang tidak diminta |
| R-29 palette | PASS: mint/teal dan netral existing; tidak menambah keluarga warna baru |
| R-30 originality | PASS dalam scope preservasi: tidak mengkloning produk lain selama migrasi; provenance referensi existing tetap pada dokumen sebelumnya |

Pre-flight taste menjalankan pemeriksaan layout/shape/CTA/font, source parity, states, keyboard, mobile, motion dan runtime. Default skill yang meminta redesign tema, penghapusan scroll cue atau perubahan komposisi tidak diterapkan karena bertentangan dengan mandat mempertahankan landing existing. Target lab LCP <2,5 detik belum menjadi klaim lulus: angka Lighthouse aktual tetap dilaporkan, termasuk baseline produksi. Media autoplay dan biaya layout/motion existing tetap perlu perhatian untuk target performa yang lebih ketat. Tidak ada klaim zero-bug universal dari suite yang terbatas.

## Dependency dan batas yang belum dibuktikan

Wallet challenge/proof/sesi, membership, katalog offering tujuh tab, private documents, eligibility, settlement/position/distribution/claim, inquiry PostgreSQL + outbox + notification, admin screening dan retensi 90 hari tidak diimplementasikan oleh migrasi marketing. Semuanya tetap milik platform/worker sesuai spec. Pengujian frontend synthetic tidak menggantikan acceptance end-to-end database/provider.

Static host perlu melayani output Astro dan custom `404.html`. Origin/CORS/Idempotency-Key server harus disiapkan sebelum mengaktifkan pengiriman inquiry. Health marketing tetap konservatif, tidak mengumumkan finance/backend readiness. Build/check root npm workspaces tidak mencakup template platform independen yang dipasang pada folder lain.
