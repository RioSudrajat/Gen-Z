# Design QA: Guided Inquiry

Tanggal: 20 Oktober 2026, Asia/Jakarta. Pilihan founder: hasil kedua pada eksplorasi Contact, **Guided Inquiry**. Scope: halaman Contact marketing existing, bukan backend onboarding atau portal operator. Antislop `during` (session override) tetap berlaku.

## Bukti dan normalisasi

- Source visual: [guided-inquiry.png](docs/design/references/contact-2026-10-20/guided-inquiry.png), 1435 × 1096 pixel.
- Implementasi: [desktop](docs/design/references/contact-2026-10-20/implemented-desktop.png), 1435 × 1221 pixel, capture full-page pada viewport CSS 1435 × 1096, device scale factor 1.
- State yang dibandingkan: operator, tahap kedua, kontak sudah terisi dengan fixture sintetis, field aset masih kosong. Tema light. Screenshot capture tanpa focus heading; focus keyboard tetap diperiksa terpisah.
- [Perbandingan utuh](docs/design/references/contact-2026-10-20/comparison.png): source di kiri, implementasi di kanan, skala 1:1, tanpa stretch. Canvas mengikuti tinggi terbesar; area abu-abu di bawah source adalah padding pembanding.
- [Perbandingan detail form](docs/design/references/contact-2026-10-20/comparison-focus.png): crop masing-masing x510/y330, 760 × 690, bersebelahan dengan skala 1:1 untuk label, field, typography dan spacing.
- [Mobile](docs/design/references/contact-2026-10-20/implemented-mobile.png): viewport CSS 390 × 900, capture full-page, tahap kedua dengan data QA sintetis. Ini adaptasi responsif karena source tidak menyediakan viewport mobile.
- Bukti runtime produksi: [browser-results.json](docs/design/references/contact-2026-10-20/browser-results.json), 14 pemeriksaan, tiga audit axe tanpa violations. Run development terpisah dengan transport/policy sintetis lulus 16 pemeriksaan dan empat audit axe; log hasil run tersebut tercatat pada sesi implementasi. `.cache/guided-contact/results.json` selalu ditimpa run terbaru. Script reproduksi: [verify-contact.mjs](apps/marketing/scripts/verify-contact.mjs).

## Findings dan riwayat perbandingan

1. **Iterasi awal, P2: density desktop terlalu tinggi.** Capture awal 1435 × 1301 memperpanjang perjalanan dibanding source: header 104px, jarak antar-group dan textarea empat baris menambah tinggi. Perbaikan: header Contact 80px, jarak form dipadatkan, textarea tiga baris dengan minimum 96px, header/footer disejajarkan ke content width. Capture sesudah perbaikan 1435 × 1221; perbandingan utuh/detail di atas diperiksa kembali. Tidak ada field/action terpotong. Selisih tinggi tersisa beralasan pada helper nominal, catatan dokumen sensitif dan navigasi kembali existing.
2. **Negara read-only, expected deviation.** Source generatif menggambar chevron pada Indonesia; kontrak hanya menerima ID. Implementasi menghilangkan dropdown negara, sesuai koreksi eksplorasi yang sudah dicatat.
3. **Copy dan kontrol pengiriman, expected deviation.** Review/send disesuaikan ketersediaan policy/backend. Tidak ada fake success. Draft/copy/download tetap tersedia; private uploads, email/password dan wallet gate tidak ditambahkan.
4. **P3 non-blocking: crop media tidak identik dengan bitmap generatif.** Implementasi memakai file foto operator existing asli, tanpa regenerasi orang atau logo. Subjek dan konteks sama; framing lebih lebar. Ini diterima untuk menjaga aset sumber proyek.

Tidak ada P0/P1/P2 yang belum ditangani pada scope visual/interaksi Contact.

## Lima permukaan fidelity

| Permukaan | Hasil |
|---|---|
| Fonts/typography | GenZ Display dan GenZ UI lokal dari source; heading bertingkat, label persisten, input 16px. Perkiraan font dalam mockup tidak mengganti font brand. Wrapping mobile dan detail pada crop dibaca |
| Spacing/layout | Rail progress dan form terbuka mengikuti komposisi sumber; iterasi P2 density sudah dilakukan. Mobile memakai satu kolom dan progress ringkas di atas form; tidak ada horizontal overflow pada 320/390/768/1440 |
| Colors/tokens | Palette project light-only; deep teal untuk teks/active, mint dengan teks gelap untuk CTA. Axe desktop/mobile/review/receipt menemukan 0 violations, termasuk pemeriksaan kontras yang terjangkau engine; bukan audit WCAG penuh |
| Image/assets | Logo source existing, foto operator existing, icon Phosphor untuk arah/check; tidak ada gambar berisi UI, div art atau logo baru. Source dan implementasi dibuka dalam pembanding yang sama |
| Copy/content | Semua kebutuhan data operator terpetakan; investor/partnership tidak dipaksa mengisi aset. Optionality dan amount unknown eksplisit, helper nominal menjelaskan whole rupiah; disclaimer implementasi tidak dimasukkan ke headline |

## Interaksi dan batas verifikasi

- Kontak kosong: validasi dua field, focus pertama ke nama. Tahap aset kosong: empat error dan focus kategori sesuai urutan visual. Heading menerima focus saat tahap berpindah; title menyebut tahap.
- Back/edit menjaga jawaban; perubahan membuat tahap review perlu divalidasi ulang. Pergantian role mempertahankan kontak bersama dan konteks terpisah.
- Pembiayaan tidak diketahui menjadi null; nominal integer besar tidak melewati JavaScript Number. Review/edit, copy, download dan disclosure privacy diperiksa.
- Fixture sintetis: policy unavailable → retry → acknowledgement wajib → 503 → retry key sama → receipt. Field terkunci saat mengirim dan sesudah receipt. Semua response pada alur ini diintersep; tidak ada pesan atau komitmen pendanaan nyata.
- Viewport 320, 390, 768 dan 1440 tanpa overflow; layout setara 200% diperiksa pada 720px. Keyboard Tab dan focus terlihat; native radio/controls; light-only tetap berlaku saat preferensi sistem dark, reduced motion diperiksa.
- Tidak ada uncaught runtime error pada browser tanpa extension. Browser in-app dengan extension AITOPIA menyisipkan `data-has-listeners` sebelum hydration dan memicu warning atribut; tidak disembunyikan dalam kode. Suite headless tanpa extension tidak mengalami warning hydration.
- Zoom browser native 200%, pembaca layar manusia, pengiriman email dan persistence server nyata **belum diuji**. Backend inquiry/policy/admin inbox memang belum diimplementasikan; pengiriman default tetap tidak aktif.

## Delivery Gate antislop dan pre-flight

- **Hard Gate PASS:** alur Contact dijalankan dan kontrol intinya diuji; tidak ada claim/angka/testimonial buatan, route baru palsu, tema gelap, upload sensitif atau pengiriman tanpa policy. Validasi, loading, fallback, error/retry dan receipt diuji pada scope frontend.
- **Purpose-Gate PASS:** font/palette menjaga brand, grouping mengikuti pekerjaan, progress menjelaskan tahap, satu foto memperjelas domain; tidak ada animasi dekoratif, glow/glass atau stock avatar.
- **Liveliness PASS:** ENERGY 2 / RHYTHM 2 / MOTION 1; focus form jelas, whitespace memisahkan konteks/input, aksen hanya state/CTA dan motif typography/media Gen-Z dipertahankan.
- **Craftsmanship/pre-flight PASS:** perbandingan utuh/detail dibaca; CTA satu baris, mobile collapse eksplisit, layout tahan panjangnya data review, fokus/error tersedia, kontras otomatis dan browser regresi diperiksa. Scope runtime tidak disamakan dengan kesiapan backend atau production.

## Checklist implementasi

- [x] Pilihan visual founder digunakan pada halaman existing.
- [x] Dua sisi visual dan crop detail dibandingkan setelah perbaikan density.
- [x] Primary flow dan failure paths frontend diuji dengan fixture sintetis.
- [x] Gap backend/zoom native/screen reader manusia dinyatakan.

final result: passed
