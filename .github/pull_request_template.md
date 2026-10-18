## Perubahan

Jelaskan masalah, hasil perubahan, dan alasan pendekatannya. Tautkan issue jika ada.

## Verifikasi

Tuliskan perintah/skenario yang benar-benar dijalankan dan hasilnya. Untuk source/dependency/CI: `npm run verify:ci`. Untuk docs saja: `npm run docs:check` dan pemeriksaan kontrak bila relevan. Sertakan bukti browser jika UI berubah.

## Batasan dan rollout

Sebutkan yang belum diuji, perubahan environment/migrasi, dampak kompatibilitas, dan langkah pemulihan jika relevan. Jangan menganggap rollback kode membatalkan migrasi database.

- [ ] Diff hanya berisi pekerjaan terkait; file privat/hasil lokal tidak ikut commit.
- [ ] Pemeriksaan relevan selesai; kegagalan atau pemeriksaan yang tertahan dijelaskan.
- [ ] Dokumen/kontrak diperbarui jika perilaku atau alur berubah.
