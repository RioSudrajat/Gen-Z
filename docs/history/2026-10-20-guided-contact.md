# Implementasi Guided Inquiry

20 Oktober 2026, Asia/Jakarta. Founder memilih konsep kedua, Guided Inquiry, setelah tiga alternatif dan rekomendasi dibandingkan. Implementasi dilakukan pada aplikasi marketing Astro existing; tidak ada deploy publik, provider baru, perubahan dependency atau pembuatan backend inquiry.

## Perubahan

- Contact menjadi tiga tahap: detail kontak → konteks → review. Font lokal, logo, foto ilustratif existing, palette mint/teal dan tema light dipertahankan.
- Operator mengisi kategori/region/status/deskripsi aset dan pembiayaan opsional. Negara tetap Indonesia. Investor dan partnership memperoleh pertanyaan sesuai topik, tanpa field aset wajib.
- Kontak dipakai bersama; konteks setiap topik disimpan terpisah di memory halaman. Back/edit tidak menghapus jawaban. Mengedit data membatalkan kelayakan menuju tahap review sampai divalidasi lagi. Tidak ada localStorage/sessionStorage atau persistence marketing.
- Label, focus, heading/title tahap, native controls, error, mobile layout, review/edit dan export draft diperiksa. Nilai rupiah besar tetap string integer; unknown/blank menjadi null.
- Pengiriman operator membutuhkan policy server valid dan acknowledgement sebelum mengirim payload sesuai kontrak proposed. Retry memakai key sama untuk payload sama; field terkunci saat sending/sent. Investor/partnership tetap draft karena kontrak pengiriman kategori itu belum tersedia.
- API inquiry/policy, inbox, worker email dan database inquiry tetap belum dibuat. UI tidak mengklaim pesan terkirim ketika layanan tidak tersedia. Draft/copy/download tetap bekerja.

## Verifikasi aktual

Lingkungan Windows, Node 24.11.0, npm 11.6.1, Chrome lokal, Docker 28.5.1. Preview pengembangan tugas memakai port 4322. Preview produksi yang sudah berjalan pada port 4321 dipakai kembali sesudah build; proses preview pengguna tidak dihentikan.

| Pemeriksaan | Hasil |
|---|---|
| `npm run verify:ci` | PASS: repo policy, docs, API contract, workspace check, 19 unit/boundary tests, build, HTTP smoke dan 17 integration tests |
| `node apps/marketing/scripts/verify-browser.mjs` dengan `MARKETING_ORIGIN=http://127.0.0.1:4322` | PASS: 63 pemeriksaan regresi marketing; [laporan](../../apps/marketing/qa/browser-verification.json) memisahkan resource failure yang diharapkan dari runtime error |
| `node apps/marketing/scripts/verify-contact.mjs` dengan kedua origin test menunjuk instance development yang mengaktifkan flag inquiry | PASS: 16 pemeriksaan; policy unavailable/retry, acknowledgement, failure dan receipt seluruhnya diintersep secara sintetis |
| Script Contact pada build produksi, `MARKETING_ORIGIN=http://127.0.0.1:4321` | PASS: 14 pemeriksaan; [hasil tersimpan](../design/references/contact-2026-10-20/browser-results.json) |
| Design QA/Delivery Gate | PASS pada scope frontend; [perbandingan dan batas](../../design-qa.md) |

Integration test menyatakan database aplikasi tidak digunakan; PostgreSQL dibuat terisolasi. Tidak ada inquiry nyata, email atau transaksi keuangan yang dikirim oleh pengujian.

Sebelum run final, fixture policy sempat gagal karena notice HTTP menunjuk origin marketing yang berbeda dari origin API. Pembatasan aplikasi dipertahankan; fixture diperbaiki agar notice berada pada origin API. Run 16 pemeriksaan setelah perbaikan lulus. Pemeriksaan visual awal menemukan P2 density; spacing/textarea/header diperbaiki dan hasilnya dibandingkan ulang.

Build selesai dengan warning chunk marketing >500kB dan dynamic dependency pada import `ox` melalui `viem` di platform. Warning tidak diubah atau disembunyikan untuk meluluskan pemeriksaan. Browser in-app dengan extension AITOPIA pernah memicu warning hydration akibat atribut `data-has-listeners` yang disisipkan extension; headless tanpa extension tidak mengalami hydration/runtime error.

## Batas dan pekerjaan berikutnya

Native browser zoom 200%, pembaca layar manusia dan email/persistence live belum diuji. Uji layout setara 200% dilakukan pada width 720px; tidak diklaim sama dengan pengujian zoom native. Kesiapan legal, kelayakan proyek dan persetujuan pendanaan tidak dibuktikan oleh form ini. Keputusan visual tidak memperluas scope portal operator MVP.

Penyambungan layanan inquiry memerlukan implementasi kontrak policy/intake, CORS/rate limit/idempotency, commit reference + outbox, notifikasi dan admin screening sesuai [alur mitra](../product/partner-onboarding.md) serta [kontrak intake](../engineering/api/intake.md).
