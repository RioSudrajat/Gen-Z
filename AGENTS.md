# Panduan agent proyek GenZ

## Aturan kerja

- Gunakan bahasa Indonesia kecuali pengguna meminta bahasa lain.
- Baca skill yang relevan sebelum bekerja. Panduan ini adalah routing, bukan pengganti isi `SKILL.md`.
- Instruksi pengguna dan instruksi sistem/developer lebih tinggi prioritasnya daripada panduan atau skill. Pertahankan stack, brand, dan perilaku yang sudah ada kecuali perubahan diminta.
- Jangan aktifkan semua skill untuk setiap tugas. Perbaikan kecil, backend, dan instalasi tidak memerlukan wawancara desain.
- Jika tool `Skill` tidak tersedia, baca langsung `SKILL.md` lokal dan resource yang dirujuk. Jangan mengaku telah memanggil tool yang tidak tersedia.

## Git, GitHub, dan delivery agent

- Baca [alur kontribusi](docs/engineering/github-workflow.md) sebelum mengubah source, dependency, atau workflow. `AGENTS.md` adalah instruksi utama agent; workflow CI adalah verifikasi otomatis, bukan pengganti instruksi.
- Awali dengan `git status --short --branch`, `git remote -v`, dan instruksi nested yang relevan. Pertahankan perubahan pengguna. Setelah remote tersedia, fetch base sebelum membuat branch; jika offline, laporkan base lokal yang dipakai.
- Kerjakan perubahan di branch `feat/`, `fix/`, `chore/`, atau `docs/` yang menjelaskan tugas. Jangan pindah branch ketika working tree berisi perubahan yang tidak jelas kepemilikannya. Jangan push langsung ke `main`; import pertama ke repo kosong adalah pengecualian bootstrap.
- Aktifkan hook lokal per clone dengan `npm run hooks:install`. Jangan mengubah konfigurasi Git global. Jangan memakai `--no-verify`, melemahkan CI, atau mengecualikan tes gagal untuk membuat hasil tampak lulus.
- Gunakan Node 24 sesuai `.nvmrc`, npm 11, dan lockfile root. Untuk perubahan dependency, sertakan perubahan manifest dan lockfile yang sesuai. Jangan commit `.env` privat, credential, database dump, `node_modules`, atau hasil build. Jalankan `npm run repo:check` setelah staging dan tinjau `git diff --cached` sebelum commit.
- Untuk perubahan source/dependency/CI, jalankan `npm run verify:ci` sebelum siap review. Ini termasuk integration test dengan PostgreSQL terisolasi; Docker harus tersedia. Untuk docs saja, cukup `npm run docs:check`, ditambah `npm run docs:api:check` jika kontrak API terkait. Untuk UI, lakukan juga verifikasi browser sesuai panduan UI. Catat kegagalan atau pemeriksaan yang tidak bisa dijalankan; jangan mengklaim lulus.
- Commit hanya file terkait tugas dengan pesan yang menjelaskan perubahan. Ketika pengguna meminta delivery GitHub, push branch dan buat PR dengan template repo, ringkas alasan/perilaku, hasil uji, dan batasan. Jika akses remote belum tersedia, selesaikan pekerjaan lokal dan laporkan blokirnya. Jangan merge, deploy production, mengubah visibility, force-push, atau reset destruktif tanpa otorisasi pengguna yang sesuai.
- Pantau hasil CI pada PR; perbaiki kegagalan yang disebabkan perubahan ini. CI hijau tidak membuktikan seluruh produk siap production. Laporan akhir menyebut branch/commit, PR bila ada, pemeriksaan yang dijalankan, dan pekerjaan yang masih tertahan.
- Pengguna boleh mendelegasikan satu tugas sampai review dan merge. Jika mandat itu sudah jelas diberikan, lanjutkan tanpa meminta izin yang sama lagi. Review diff pada head commit terakhir, selesaikan temuan dan konflik, pastikan semua check wajib lulus pada commit tersebut, lalu merge dengan pencocokan SHA (misalnya `gh pr merge --squash --match-head-commit <sha>`). Commit baru membatalkan kesimpulan review untuk bagian yang berubah. Jangan menyamakan CI hijau dengan review selesai.
- Jika agent memakai akun yang juga membuat PR, pemeriksaan sendiri tetap perlu tetapi bukan approval formal reviewer lain. Untuk PR kontributor lain, tinjau juga perubahan workflow/dependency dan jangan menjalankan kode PR dengan credential production. Mandat merge satu PR/tugas tidak otomatis berlaku untuk semua PR yang akan datang. `AGENTS.md` tidak menjalankan agent di background; pemantauan otomatis perlu integrasi atau automation terpisah yang diotorisasi.

## Code Review Rules

- Tandai kebocoran credential/server-only code ke browser, bypass wallet/session/resource authorization, dan penggunaan database aplikasi dalam test.
- Tandai rewrite migrasi yang sudah diterapkan, perubahan API source yang tidak tercermin dalam kontrak, dan klaim fitur live yang belum tersedia.
- Pastikan perubahan perilaku memiliki bukti uji yang relevan; jangan meminta test yang hanya mengulang implementasi atau memaksakan test UI untuk perubahan docs saja.

## Pemilihan skill

| Kebutuhan | Skill yang dibaca | Cara pakai |
| --- | --- | --- |
| Landing page, portfolio, atau redesign halaman marketing | `.agents/skills/design-taste-frontend/SKILL.md` | Nyatakan pemahaman brief, pilih arah visual dan dial sesuai konteks, audit dahulu untuk redesign, lalu jalankan pre-flight check. Jangan paksakan pola marketing untuk dashboard atau tabel data. |
| Pengguna meminta menguji ide/rencana lewat wawancara | `.agents/skills/grill-me/SKILL.md` lalu `.agents/skills/grilling/SKILL.md` | Ajukan pertanyaan per putaran sesuai dependensi keputusan, sertakan rekomendasi, dan tunggu jawaban sebelum pertanyaan turunannya. |
| Wawancara desain sekaligus dokumentasi keputusan | `.agents/skills/grill-with-docs/SKILL.md`, `.agents/skills/grilling/SKILL.md`, dan `.agents/skills/domain-modeling/SKILL.md` | Jalankan wawancara dan catat istilah yang disepakati di glossary; tawarkan ADR hanya untuk keputusan penting yang memenuhi kriteria skill. |
| Memperjelas istilah domain atau menulis glossary/ADR | `.agents/skills/domain-modeling/SKILL.md` | Periksa istilah dan perilaku kode; gunakan format pendamping skill. |

`grill-me` dan `grill-with-docs` adalah pintasan dengan `disable-model-invocation: true`: gunakan ketika diminta pengguna, bukan sebagai tahap wajib sebelum coding. Jangan jalankan keduanya sekaligus. Saat grilling aktif, temukan fakta dari lingkungan sendiri dan gunakan delegasi sebagaimana diarahkan skill jika alat tersedia. Sebelum implementasi hasil wawancara, ikuti konfirmasi pemahaman bersama yang diminta skill; jangan meminta ulang persetujuan yang sudah jelas diberikan pengguna.

## Menggabungkan skill

Untuk setiap pekerjaan UI, baca `DESIGN.md` dan `.agents/UI-GUIDELINES.md` sebelum merancang atau mengubah tampilan, termasuk ketika pengguna memberikan screenshot atau referensi. Periksa typography, palette, spacing, radius, komponen, brand, dan perilaku existing pada source. Referensi hanya menentukan bagian yang diminta; jangan menyalin font atau identitas produk lain. Bila dokumentasi tertinggal dari implementasi, catat bukti dan selaraskan tanpa mengarang keputusan founder. Gen-Z hanya memakai tema light; jangan menambahkan dark mode, theme toggle, atau mengikuti tema sistem.

Pertahankan urutan interaksi referensi yang diminta pengguna; fitur/jaringan belum aktif dapat diberi Coming soon, bukan dihilangkan diam-diam. Jangan menganggap angka radius/spacing yang dipilih agent sebagai standar global. Copy internal tentang implementasi/signature/scaffold masuk laporan dan docs; UI memakai helper singkat yang membantu pengguna mengambil aksi. Panduan rinci: `.agents/UI-GUIDELINES.md`.

Untuk tugas UI, selesaikan pemilihan mode antislop dahulu. Gunakan brief atau `DESIGN.md` yang tersedia untuk arah visual, `design-taste-frontend` untuk implementasi marketing yang sesuai, dan antislop sebagai pemeriksaan kualitas. Grilling hanya mendahului alur ini jika pengguna meminta wawancara. Jangan mengarang keputusan brand atau jawaban pengguna untuk menutup pertanyaan.

Jika aturan bertentangan, utamakan instruksi pengguna dan kebutuhan aksesibilitas/fungsi, lalu batasan proyek. Jelaskan konflik material secara singkat. Jangan mengubah preferensi global atau memasang skill tambahan tanpa kebutuhan dan otorisasi yang sesuai.

## Verifikasi dan dokumentasi

- Periksa hasil yang benar-benar bisa dijalankan: interaksi, responsivitas, keyboard/focus, kontras, reduced motion, dan state relevan untuk perubahan UI.
- Jalankan pre-flight taste dan Delivery Gate antislop ketika skill tersebut aktif. Jangan menyatakan pemeriksaan lulus jika belum dijalankan; laporkan keterbatasannya.
- Buat `GLOSSARY.md` dan `docs/adr/` hanya ketika ada istilah atau keputusan nyata untuk dicatat. Gunakan `GLOSSARY-MAP.md` jika proyek sudah memisahkan konteks domain.
- Simpan instruksi khusus proyek di panduan ini, bukan dengan mengedit skill upstream.
- Panduan contoh prompt dan pemeliharaan: `.agents/GUIDE.md`.

<!-- antislop:start -->
## antislop

Untuk pekerjaan UI, copy antarmuka, aksesibilitas, mobile layout, atau komentar kode yang relevan, baca `.agents/skills/antislop/SKILL.md`. Yang dipasang adalah **core saja**; modul opsional `antislop-ui`, `antislop-copywriting`, `antislop-human`, `antislop-layoutmobile`, dan `antislop-code` belum dipasang. Jangan mencoba membaca modul yang tidak ada atau mengulang wizard instalasi.

Ikuti bagian **Two Usage Modes** di core: pilihan eksplisit `during`/`after` dalam sesi, lalu preferensi global, lalu tanyakan jika belum terselesaikan. Tidak ada mode default baru yang ditetapkan oleh panduan ini. Permintaan audit saja bukan pilihan mode. Jangan mengubah preferensi global tanpa permintaan pengguna.

Umumkan mode dan sumbernya sesuai penempatan notice dalam core. Mode `during` menerapkan aturan saat bekerja; mode `after` membuat temuan bernomor dan hanya memperbaiki nomor yang disetujui pengguna. Ikuti aturan arah desain, aset, dan Delivery Gate, dengan tetap menghormati otorisasi yang sudah diberikan serta instruksi berprioritas lebih tinggi. Instalasi skill/pembuatan panduan saja tidak mengaktifkan pekerjaan desain atau memerlukan pemilihan mode.
<!-- antislop:end -->
