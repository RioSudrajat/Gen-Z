# GitHub dan alur kontribusi

## Instruksi yang dibaca agent

Instruksi utama berada di [AGENTS.md root](../../AGENTS.md). Codex membacanya saat memulai sesi proyek; panduan nested, seperti [panduan platform](../../apps/platform/AGENTS.md), memberi konteks khusus folder. Nama `.agents.md` tidak otomatis dipakai tanpa konfigurasi fallback. Folder `.agents/skills` berisi panduan sesuai kebutuhan, bukan pengganti instruksi root. Setelah instruksi berubah, mulai sesi baru agar chain instruksi dimuat ulang.

Aturan agent membantu konsistensi kerja. Hook lokal dapat dilewati atau tidak dipasang; CI membuktikan pemeriksaan pada commit remote. Proteksi branch GitHub menahan merge yang melanggar pemeriksaan wajib. Tidak satu pun membuktikan seluruh produk bebas bug atau siap production.

## Issue, PR, review, dan merge

**Issue** mencatat bug, kebutuhan fitur, pertanyaan, atau pekerjaan beserta kriteria selesainya. **Pull Request (PR)** mengusulkan perubahan dari satu branch ke branch lain; di sana tersedia diff kode, diskusi, review, dan status CI. Issue tidak harus langsung memiliki implementasi, dan perubahan kecil tidak harus didahului issue. Satu issue dapat membutuhkan beberapa PR. Jika satu PR benar-benar menyelesaikan issue, gunakan `Closes #<nomor>` pada deskripsinya agar issue ditutup saat PR digabung ke default branch.

**Review** memeriksa ketepatan dan risiko perubahan; **merge** memasukkan perubahan ke branch tujuan. Keduanya berbeda dari CI, yang hanya menjalankan pemeriksaan yang dikonfigurasi. PR yang hijau belum tentu telah direview, dan approval belum tentu berarti seluruh tes lulus.

Agent dapat melakukan implementasi, push, membuat PR, mereview diff, memperbaiki temuan, menunggu CI, dan merge jika pengguna memberi mandat yang mencakup merge. Contoh mandat satu tugas: "Kerjakan tugas ini sampai PR, review hasilnya, lalu squash-merge setelah CI lulus dan tidak ada temuan yang belum selesai." Agent tidak perlu meminta ulang persetujuan yang sudah diberikan. Mandat satu tugas bukan izin otomatis untuk menggabungkan PR lain di masa depan.

Sebelum merge, periksa head SHA terbaru, hasil check pada SHA itu, konflik, status draft, review yang meminta perubahan, dan scope tugas. Gunakan pencocokan SHA saat mengirim permintaan merge agar commit yang masuk sama dengan commit yang diperiksa. Jika ada commit baru, tinjau ulang bagian yang berubah dan hasil CI terbarunya. Jangan melewati aturan branch atau memakai opsi admin untuk menutupi check/review gagal.

GitHub melarang penulis PR memberi approval formal pada PR sendiri. Agent yang memakai akun penulis dapat melakukan pemeriksaan sendiri, tetapi tidak boleh mengklaimnya sebagai approval reviewer independen. Jika aturan repository membutuhkan approval akun lain, gunakan reviewer dengan identitas terpisah yang memang memiliki izin; jangan membuat identitas palsu untuk melewatinya.

Untuk PR kontributor lain, agent dapat diberi mandat review saja atau review sampai merge. Tinjau kode dan perubahan dependency/workflow sebelum menjalankan instruksi dari PR; jangan memberi kode tersebut credential production. Untuk review berkelanjutan saat chat tidak aktif, hubungkan repository ke layanan code review atau automation yang sesuai. `AGENTS.md` menyimpan aturan ketika agent bekerja; file itu sendiri tidak memicu pekerjaan.

Codex mendukung review GitHub atas permintaan dan automatic review setelah repository dihubungkan dan pengaturannya diaktifkan. Setup CLI GitHub lokal tidak otomatis menghubungkan integrasi Codex. Auto-merge bawaan GitHub merupakan fitur terpisah yang menunggu syarat review/check; ketersediaannya pada repo private mengikuti paket GitHub. Agent yang sedang diberi tugas juga dapat melakukan merge melalui CLI tanpa fitur auto-merge bawaan, selama izin akun dan aturan repository mengizinkan.

## Setup clone

Gunakan Node.js sesuai `.nvmrc` (24.11.0) dan npm 11. Clone repository, lalu dari root:

```sh
npm ci
npm run hooks:install
npx --no-install playwright install chromium
```

Hook dipasang hanya pada konfigurasi Git lokal clone ini. Tidak ada perubahan preferensi Git global. Chromium dipakai tes browser wallet; pada Linux gunakan opsi `--with-deps` bila library sistem belum tersedia. `npm run setup:platform` menyiapkan database development ketika dibutuhkan; CI tidak memanggil setup ini karena integration test membuat database sementaranya sendiri.

## Alur setiap tugas

1. Baca instruksi, periksa `git status --short --branch` serta remote. Jangan menimpa perubahan milik orang lain.
2. Jika working tree bersih, `git fetch origin`, lalu buat branch tugas dari `origin/main`, misalnya `git switch -c fix/wallet-session origin/main`. Jika melanjutkan branch/PR, gunakan branch tersebut.
3. Implementasikan perubahan beserta dokumen dan pengujian yang relevan. Gunakan lockfile root untuk enam npm workspace. Folder `motion` memiliki manifest/lockfile sendiri.
4. Jalankan pemeriksaan di bawah. Stage hanya path terkait tugas dengan `git add <path>`, periksa `git diff --cached`, lalu `npm run repo:check`. Pemeriksaan file membaca **index/staging**, sehingga file baru yang belum di-stage belum diperiksa.
5. Commit dengan pesan yang menjelaskan hasil, misalnya `fix: reject expired wallet challenges`. Push branch: `git push -u origin fix/wallet-session`.
6. Buat PR ke `main` memakai template repo. Catat masalah/perilaku, alasan, verifikasi nyata, dan batasan. Pantau hasil CI, perbaiki kegagalan terkait tugas, lalu review sebelum merge. Merge dan deploy memerlukan otorisasi pengguna yang sesuai.

Pre-commit memeriksa index untuk path privat/hasil lokal, symlink/submodule yang belum memiliki kebijakan, file >=95 MiB, dan beberapa pola credential yang jelas. Nilai credential tidak dicetak. Ini pemeriksaan dasar, bukan pemindai semua jenis secret; tinjau diff sendiri. `.env.example` boleh dilacak jika berisi placeholder aman.

Pre-push menolak perubahan langsung ke `refs/heads/main` pada remote yang sudah memiliki branch tersebut, termasuk force-push/deletion lewat ref itu. Import pertama diizinkan bila remote `main` belum ada. Hook tidak menjalankan seluruh suite agar tidak mengulang build setiap push; CI tetap menjalankannya pada PR dan push `main`.

## Pemeriksaan

| Perubahan | Pemeriksaan lokal |
|---|---|
| Source aplikasi, shared packages, dependency root, workflow CI | `npm run verify:ci` |
| Dokumentasi saja | `npm run docs:check`; tambahkan `npm run docs:api:check` bila kontrak terkait |
| UI | Pemeriksaan di atas ditambah browser/interaksi, responsive, keyboard/focus, dan state relevan sesuai panduan UI |
| Auth, sesi, database | `verify:ci` mencakup build dan `npm run test:platform` dengan PostgreSQL terisolasi |
| Produksi motion atau dependency `motion` | `npm ci --prefix motion` lalu `npm run typecheck --prefix motion`; render/inspeksi media bila komposisi berubah |

`verify:ci` menjalankan repository policy, tautan docs, API contract, workspace check, unit test, production build, HTTP smoke, dan integration test platform. Integration test memerlukan Docker; database development/production tidak digunakan. Root workflow memakai runner Ubuntu dengan Docker, Node dari `.nvmrc`, cache npm, `npm ci`, token read-only, dan Actions yang dipatok ke commit SHA. CI tidak memakai secret production dan tidak menjalankan transaksi finansial live. Root CI tidak menggantikan pengujian browser manual atau render video.

Nama check untuk proteksi branch: **Quality gate** dan **Motion typecheck**. Workflow berjalan pada PR menuju `main`, push `main`, atau pemicu manual. Hindari filter path yang membuat check wajib tidak pernah dilaporkan.

## Pengaturan repository GitHub

- Target remote: `https://github.com/RioSudrajat/Gen-Z.git`. Visibility mengikuti pengaturan repository; jangan mengubahnya tanpa permintaan pemilik.
- Aktifkan Actions, dependency graph, Dependabot alerts/security updates jika didukung. Konfigurasi version updates mingguan ada di `.github/dependabot.yml`, mencakup root npm, `motion`, dan Actions. Update dependency tetap melalui PR, tidak auto-merge.
- Pada `main`, wajibkan PR, kedua status check di atas, penyelesaian diskusi review, serta larang force-push dan penghapusan branch. Untuk pemilik solo, tidak perlu mewajibkan approval orang kedua yang tidak tersedia; PR masih diperlukan untuk meninjau diff dan hasil CI.
- Gunakan squash merge dan hapus branch setelah merge. CI gagal harus diperbaiki, bukan ditandai lulus manual atau dilewati lewat push langsung.
- Pada repo private, ketersediaan proteksi branch mengikuti paket GitHub. Jangan mengklaim proteksi aktif sebelum pengaturannya berhasil diterapkan dan dibaca kembali.

## Deployment tahap berikutnya

Workflow saat ini memverifikasi kode. Deployment belum dikonfigurasi karena provider hosting, project tujuan, domain, serta environment belum ditentukan. Marketing Astro statis, platform Next.js, PostgreSQL, dan worker perlu target deployment yang sesuai; jangan menganggap semuanya satu static site.

Setelah target ditetapkan: buat preview/staging, jalankan smoke terhadap deployment, dan gunakan commit/artifact yang sudah lolos CI untuk promosi production. Simpan credential di environment/secret server atau provider, bukan repository atau variabel `PUBLIC_*`/`NEXT_PUBLIC_*`. Migrasi production perlu review SQL dan strategi kompatibilitas serta pemulihan data; rollback kode tidak otomatis membatalkan migrasi. Jangan menambah workflow deploy palsu dengan endpoint atau credential placeholder yang diklaim aktif.

## Referensi

- [Instruksi AGENTS.md Codex](https://developers.openai.com/codex/guides/agents-md)
- [GitHub Actions](https://docs.github.com/en/actions/get-started/understanding-github-actions)
- [Proteksi branch](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Dependabot version updates](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependabot-version-updates)
- [GitHub Issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/learning-about-issues/about-issues)
- [Approval dan review PR](https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/approving-a-pull-request-with-required-reviews)
- [Auto-merge GitHub](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/automatically-merging-a-pull-request)
- [Code review Codex di GitHub](https://developers.openai.com/codex/integrations/github)
