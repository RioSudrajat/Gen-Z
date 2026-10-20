# Contact submission dan handoff wallet, 20 Oktober 2026

## Masalah dan hasil

Contact sebelumnya hanya mengekspor draft: endpoint belum tersedia, policy tidak dapat dimuat dan hanya topik operator yang memiliki adapter kirim. Launch app tanpa `PUBLIC_PLATFORM_ORIGIN` berhenti pada handoff unavailable walaupun wallet auth platform sudah tersedia.

Contact sekarang mengirim operator, investor dan partnership ke `POST /api/v1/inquiries`. Review menampilkan aksi Send inquiry; availability, consent, sending, retry dan receipt memiliki state nyata. Copy/download menjadi cadangan. Fokus berpindah ke referensi setelah berhasil. Preview HTTP loopback otomatis memakai platform `http://localhost:3001`; deployment publik tetap memerlukan origin eksplisit. Auth tetap EVM/SIWE Base Sepolia dengan urutan network → provider, tanpa auth simulasi atau grant baru.

## Persistence dan batas

Migrasi additive `20261020063024_public_inquiry_intake.sql` menambahkan schema intake tanpa mengubah migrasi/tabel identity lama. Inquiry, referensi dan satu outbox committed atomik. UUID request key disimpan sebagai hash; replay identik mempertahankan record, outbox dan tanggal retensi. Payload berbeda dengan key sama ditolak. Rate limit PostgreSQL membatasi 60 inquiry global dan tiga/email per menit. CORS mengizinkan exact marketing/app origin; variasi port loopback hanya ketika app juga HTTP loopback. Cookie auth tidak dipakai untuk inquiry.

Notice berversi dan acknowledgement wajib. Payload operator menyimpan nominal IDR sebagai integer string, tanpa pembulatan floating point. Due date 90 hari tercatat; delivery notifikasi, admin inbox dan otomasi review/penghapusan retensi belum diimplementasikan. Receipt menyatakan inquiry diterima, bukan email sudah terkirim. Tidak ada email nyata dikirim selama verifikasi.

## Bukti verifikasi

- `npm run verify:ci`: PASS; check/build seluruh workspace, 21 unit tests, smoke dan 22 integration tests dengan PostgreSQL Docker terisolasi. Database aplikasi tidak dipakai untuk test.
- Integrasi browser mengisi ketiga topik, submit, membaca receipt dan memeriksa inquiry/outbox pada database terisolasi. Proxy tes memetakan port lokal 3001 ke port acak server terisolasi, termasuk origin notice; receipt dan persistence tidak dimock. Launch app mencapai UI login sebenarnya. Tes wallet existing memverifikasi signature, sesi, logout, rejection, replay dan account/network changes.
- Kasus HTTP: Origin/CORS, consent/policy, strict input, UUID key, JSON/byte limit, precision, concurrent identical retries, conflict, rate limit serta rollback inquiry ketika insert outbox gagal.
- `verify-browser.mjs`: 65 checks PASS; landing/navigation/contact/handoff, keyboard, mobile 320/390/768/1440, reduced motion, fallback dan tanpa uncaught runtime/hydration error.
- `verify-contact.mjs`: 16 checks PASS, termasuk desktop/mobile axe tanpa violation, privacy acknowledgement, failure → same-key retry → receipt. Transport fixture ditandai synthetic dan tidak mengirim data ke database aplikasi.
- `db:check` dan schema snapshot/introspection terisolasi: PASS. SQL ditinjau: hanya CREATE schema/tabel/index/FK baru, tidak ada drop/reset/backfill identity.
- Kontrak source/OpenAPI/reference diperbarui; docs dan API validation PASS. Generator header kini menyalin header per operasi agar Set-Cookie tidak terbawa ke response endpoint lain.

Log, screenshot dan trace sesi berada di `.cache/contact-auth-verify.log`, `.cache/intake-verification/`, `.cache/guided-contact/` dan `.cache/contact-auth-browser/`, bukan artefak yang di-commit. Bukti motion sebelumnya berada di `.cache/motion-response-qa/` pada checkout utama; perubahan Contact tidak mengganti controller gesture yang telah diverifikasi.

## Pemeriksaan UI dan review

Arah mempertahankan komposisi Contact, typography Display/UI, tema light dan aksen teal Gen-Z. Aksi kirim menjadi fokus; ekspor draft bersifat sekunder. Tidak ada aset baru. Untuk form: ENERGY 2, RHYTHM 2, MOTION 1. Landing mempertahankan motion yang diminta pengguna.

Pre-flight dan antislop Delivery Gate: PASS untuk scope ini. Hierarki aksi, whitespace, identitas, kontras/focus, responsive reflow, state pending/error/success, fungsi tautan dan kejujuran klaim diperiksa lewat source, screenshot dan pengujian di atas. Pemeriksaan React mencakup hook cleanup, guard request ganda, batas server/client dan fokus receipt. Build masih melaporkan warning chunk marketing serta dynamic dependency ox/viem yang sudah ada; tidak disembunyikan.

Review dilakukan pada diff terhadap main, termasuk migrasi baru, auth boundary dan perubahan landing yang ikut delivery. Pemeriksaan sendiri bukan approval formal reviewer independen. PR/CI/merge harus tetap mengacu head SHA terakhir. Tidak ada deployment production atau konfigurasi Git global yang diubah.
