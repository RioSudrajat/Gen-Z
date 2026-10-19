# Gen-Z marketing

Landing publik Astro dengan React islands, dimigrasikan dari `landing/` pada 17 Oktober 2026. Acuan: [PRD](../../docs/PRD.md), [arsitektur](../../docs/ARCHITECTURE.md), [ERD](../../docs/ERD.md), dan [requirements MVP](../../docs/product/requirements.md). [Indeks docs](../../docs/README.md) memisahkan acuan aktif dari riset/arsip.

## Menjalankan

Dari root repo, Node 24.11+ major 24 dan npm 11:

```sh
npm ci
npm run dev:marketing
```

Halaman publik: `http://127.0.0.1:4321/`, contact: `/contact/`. Build: `npm run build --workspace=@gen-z/marketing`; preview: `npm run start --workspace=@gen-z/marketing`. Shared package domain perlu dibuild lewat `npm run build:packages` sebelum build langsung pada checkout baru.

## Arah dependensi

```text
src/pages/                  Route dan komposisi Astro, tanpa business logic
src/layouts/                Dokumen HTML, metadata, font dan style bersama
src/components/layout/      Header/footer serta handoff platform
src/components/sections/    Hero, energy thesis/sources, capital bridge, comparison, closing
src/components/islands/     Navigation, audience, carousel, stack, evidence, workspace preview
src/features/contact/       Presentasi form dan composition boundary ContactExperience
src/application/            Validasi inquiry, draft dan kebijakan URL murni
src/infrastructure/         HTTP adapter inquiry, tanpa persistence di browser
src/config/                 Composition root konfigurasi publik dari environment
src/runtime/                Lifecycle motion/media/scroll, controller publication dan renderer 3D
src/styles/                 Style existing, dipisahkan dari perilaku
src/assets/                 Sumber gambar asli dan adapter optimasi build Astro
public/                     Media/font/lisensi ber-URL tetap, ditambah enam subset WOFF2
tests/                      Boundary, failure paths, fingerprint aset, metadata dan media lifecycle
scripts/verify-browser.mjs  Pengujian interaksi produksi dan aksesibilitas
qa/                         Bukti hasil verifikasi dan screenshot
```

Application tidak mengimpor React/Astro, HTTP, app lain atau credential. ContactForm hanya menerima gateway `onSend` dan tidak mengimpor adapter HTTP. ContactExperience menghubungkan gateway tersebut dengan adapter di composition boundary. Adapter dapat diuji dengan transport pengganti. Runtime tidak memiliki otoritas autentikasi atau finansial. Halaman Astro mengomposisikan komponen dan meneruskan konfigurasi serializable. React dihidrasi melalui integrasi resmi Astro; tidak ada mount root kedua atau impor dari `landing/`. Seluruh section memiliki HTML pada build, sehingga copy publik tetap terbaca ketika JavaScript gagal. React tetap dipakai untuk menjaga perilaku existing, bukan mengganti semua halaman menjadi SPA.

Bootstrap media/motion diproses sebagai script Astro terpisah dari hydration navigation; controller dibagikan hanya di memori browser lewat `landing-session.js`. Tidak ada session login pada modul tersebut. Font audience dimuat saat mendekati viewport, lalu posisi ScrollTrigger diperbarui. Enam subset WOFF2 mempertahankan advance/bearing glyph yang diuji pada `qa/font-subsets.log`; font original menjadi fallback untuk karakter di luar subset dan seluruh file/lisensinya tetap tersedia. Regenerasi opsional menggunakan `scripts/subset-fonts.py` dengan fonttools dan Brotli, tidak diperlukan untuk npm build. CSS kecil di-inline dan modul motion/icon dikelompokkan sesuai [opsi code splitting Rolldown](https://rolldown.rs/reference/OutputOptions.codeSplitting), tanpa menggabungkan renderer Three.js ke bootstrap awal.

Homepage memiliki tujuh React islands: navigation, capital pin, showcase dan stack pin memakai `client:load`; audience, evidence dan workspace memakai `client:visible` dengan margin untuk persiapan interaksi. Showcase tetap eager karena pilihan kategori dapat dikirim dari menu sebelum section terlihat. Kedua pin disiapkan lebih awal dan memiliki `refreshPriority` agar layout scroll stabil. Comparison adalah HTML Astro dengan GSAP pada runtime bersama, tanpa hydration React.

Font asli dan subset memakai `unicode-range` yang saling melengkapi: teks Latin memakai WOFF2 subset, sedangkan karakter di luar cakupannya masih dapat memuat font penuh. Pemanggilan `document.fonts.load` tidak lagi memicu unduhan kedua font untuk karakter Latin yang sama. QA browser memeriksa permintaan jaringan sebelum dan sesudah probe karakter extended yang sintetis.

`PublicLayout` hanya membawa palette, font dan CSS dasar. CSS homepage dimuat oleh `index.astro`; CSS contact/handoff dimuat oleh halaman entry. Sumber gambar showcase, audience, skyline dan closing berada di `src/assets`; transform `getImage`/`Image` menghasilkan WebP responsif saat build. React menerima URL/srcset/dimensi serializable, tanpa mengimpor optimizer ke browser. Retry gambar tetap tersedia. Fingerprint source dan lisensi disimpan di `tests/fixtures/migrated-assets.json`, sehingga verifikasi tidak memerlukan aplikasi lama.

## Metadata deployment

Isi `PUBLIC_SITE_ORIGIN` dengan origin HTTPS marketing sesudah domain final ditetapkan. HTTP loopback diperbolehkan untuk pengujian lokal. Nilainya mengaktifkan canonical URL, social image absolut, Organization JSON-LD, sitemap resmi Astro dan tautan sitemap pada robots. Tanpa nilai tersebut, title/description/social text tetap tersedia dan tidak ada domain produksi rekaan. Sitemap hanya mencantumkan `/` dan `/contact/`; auth, handoff, dashboard dan 404 tetap `noindex` serta tanpa canonical publik. `PUBLIC_SITE_ORIGIN` berbeda dari `PUBLIC_PLATFORM_ORIGIN`.

Tujuh tab offering, dataset finansial, auth/session, inquiry persistence, approval dan settlement tetap milik platform/domain. Tiga tab di ilustrasi workspace marketing adalah ilustrasi konsep, bukan detail offering atau taxonomy app.

## Batas route dan konfigurasi

`PUBLIC_PLATFORM_ORIGIN` pada `.env` milik marketing hanya menerima HTTPS origin tanpa path/query/credential. HTTP loopback diperbolehkan untuk development. Tidak ada origin produksi atau vendor yang ditebak. Contoh ada di [.env.example](.env.example). Environment dibaca saat build, jadi perubahan memerlukan rebuild/redeploy untuk output statis.

Wallet login platform lokal sekarang tersedia pada `http://localhost:3001/auth`; origin ini dapat dipakai untuk Launch app. Endpoint inquiry belum dibuat. `PUBLIC_PLATFORM_INQUIRIES_ENABLED` default `false`, sehingga pengaturan origin untuk auth tidak otomatis mengubah contact draft menjadi pengiriman server. Set `true` hanya sesudah inquiry persistence, validasi/CORS, idempotency dan receipt endpoint benar-benar tersedia.

Tombol Launch app dan tautan App sekarang memakai `site.platformAuthUrl`, langsung menuju `/auth?returnTo=%2Fapp` pada origin platform yang dikonfigurasi. Tanpa origin, tujuan tetap halaman handoff `/auth/`. File referensi `NemesisStackSection.tsx` di root telah dihapus karena tidak diimpor Astro; runtime stack tetap `src/components/islands/GenZStack.tsx` dan snapshot riset di `docs/design/references` dipertahankan.

- `/auth/` dan `/dashboard/` melanjutkan ke `<platform>/auth?returnTo=/app`.
- `/assets/` melanjutkan ke auth dengan `returnTo=/app/assets`.
- URL lama `/assets/<slug>` dan `/app/assets/<slug>` yang masuk ke custom 404 dapat diteruskan ke auth untuk path internal tervalidasi. Slug tidak memberi otorisasi. Host statis harus mengirim `404.html` untuk URL tidak dikenal; dengan JavaScript nonaktif tautan Workspace access tetap tersedia.
- Tanpa konfigurasi, halaman handoff menjelaskan workspace belum terhubung dan menawarkan contact. Tidak ada login email, role picker, sessionStorage atau dashboard anonim.
- Origin platform harus berbeda dari origin marketing untuk deployment dua aplikasi ini. Server platform tetap wajib memeriksa resource, sesi dan `returnTo` sendiri.
- `/health.json` tetap konservatif: readiness backend/finance tidak diklaim dari keberhasilan render marketing.

## Contact dan kontrak platform

Desain Guided Inquiry dipilih founder 20 Oktober 2026. Tiga tahap: kontak → konteks → review. Nama/email bersama, perusahaan/telepon opsional; operator mengisi kategori, region Indonesia, status, deskripsi aset dan pembiayaan opsional. Investor/partnership memakai pesan sesuai topik, tanpa pertanyaan aset wajib. Back/edit dan pergantian topik mempertahankan jawaban selama halaman tetap terbuka; tidak ada penyimpanan data pribadi di browser storage atau server marketing. Tidak ada upload sensitif atau pendaftaran marketing otomatis.

Tanpa layanan penerimaan yang tersedia, contact menyediakan review/copy/download draft. Origin dan `PUBLIC_PLATFORM_INQUIRIES_ENABLED=true` belum cukup untuk menampilkan Send inquiry: gateway harus menerima privacy policy valid dari `GET /api/v1/public/inquiry-policy` terlebih dahulu. Pengiriman hanya untuk operator, mengikuti kontrak proposed; investor/partnership tetap draft sampai kontrak dan layanan untuk kategorinya tersedia. Privacy acknowledgement wajib sebelum send, bukan sebelum menyimpan draft lokal. Kebijakan berasal dari server, bukan ID/URL yang dibuat frontend.

```text
POST <PUBLIC_PLATFORM_ORIGIN>/api/v1/inquiries
Content-Type: application/json
Idempotency-Key: UUID stabil selama pesan tidak berubah
Body: { contact: { name, email, organization, phone }, assetCategory,
        location: { countryCode: "ID", region }, operationsState,
        assetDescription, financingNeed, privacyNoticeVersionId, privacyAcknowledged: true }
Receipt sukses: { reference: "referensi-server" }
```

Tidak ada credential/cookie app pada request publik. Adapter membatasi timeout dan menangani network error, server error, rate limit dan receipt rusak. Retry payload yang sama menggunakan key yang sama. Edit draft membuat key baru; tombol dibatasi saat request berlangsung dan setelah receipt diterima. Receipt hanya dipercaya bila respons HTTP sukses mengandung referensi valid. Payload inquiry tidak disimpan di localStorage/sessionStorage.

Nominal rupiah dikirim sebagai string integer `minorUnits` dengan scale 0; field kosong atau Not sure yet memetakan ke `null`, bukan nol. Notice URL tidak menerima executable scheme atau credential-bearing URL. API canonical tidak berubah; implementasi frontend kini mengikuti bentuk [kontrak intake](../../docs/engineering/api/intake.md).

**Dependency inquiry platform belum diimplementasikan oleh migrasi ini:** validasi/rate limit/origin allowlist server, CORS preflight untuk Content-Type dan Idempotency-Key, commit PostgreSQL inquiry + reference + outbox atomik, idempotency/body hash, worker notifikasi satu inbox, akses admin dan retensi 90 hari sesuai spec. Adapter frontend dan fixture test tidak membuktikan persistence tersebut. Jangan mengaktifkan pengiriman inquiry sebelum layanan itu siap; konfigurasi auth origin boleh digunakan secara terpisah.

## Verifikasi

```sh
npm run check
npm test
npm run build
npm run smoke
npm run start --workspace=@gen-z/marketing
npm run verify:marketing
npm run verify:metadata --workspace=@gen-z/marketing
```

Verifikasi browser juga menjalankan regresi animasi comparison: panel bertumpuk, membuka dan berbalik mengikuti scroll/wheel, font yang dimuat belakangan, deep link, resize, mobile dan reduced motion. Jalankan tersendiri dengan `npm run verify:comparison --workspace=@gen-z/marketing`; bukti tersimpan di `qa/comparison-motion/`. Pinned sequences memakai `refreshPriority` agar jarak pin dihitung sebelum reveal di bawahnya, terlepas dari urutan hydration Astro islands.

QA browser memakai Chrome lokal. Override `CHROME_PATH` bila perlu. `MARKETING_ORIGIN` default `http://127.0.0.1:4321`. `CONFIGURED_MARKETING_ORIGIN` opsional menunjuk instance development lokal dengan origin platform fixture; respons inquiry diintersep secara sintetis, tidak mengirim pesan nyata. Handoff ke platform dikonfirmasi melalui target navigasi sintetis sehingga tidak bergantung pada server app yang aktif. Browser report mencatat kegagalan transport yang sengaja diinjeksi terpisah dari runtime errors. QA ini tidak menyatakan backend MVP atau platform template lain sudah lulus.

Regresi Guided Inquiry: `node apps/marketing/scripts/verify-contact.mjs` dari root. `MARKETING_ORIGIN` default untuk script ini `http://127.0.0.1:4322`; `CONFIGURED_MARKETING_ORIGIN` mengaktifkan pengujian policy/send sintetis dengan flag inquiry pada instance tersebut. Hasil lokal di `.cache/guided-contact/`: validasi/focus, Back/edit, draft per topik, angka exact, viewport, axe, fallback dan stable-key retry. Jangan menganggap receipt fixture sebagai inquiry live.

`verify:metadata` membuat build terisolasi di `.cache/marketing-metadata` dengan domain `.invalid` sintetis, lalu memeriksa output canonical/social/sitemap/robots dan pengecualian route privat. Perbandingan resource serta copy tersedia melalui `npm run measure --workspace=@gen-z/marketing -- before` dan `-- after` pada build/preview masing-masing; hasil lokal ini bukan pengukuran field pengguna nyata.

Aplikasi lama `landing/` dihapus pada 18 Oktober 2026 atas permintaan pengguna. Script produksi `motion/` mengarah langsung ke marketing. Source aktif tunggal berada di aplikasi ini; tidak ada perubahan upstream skill atau deploy publik.
