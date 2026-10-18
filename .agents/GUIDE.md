# Panduan penggunaan skill

Skill dipasang lokal untuk proyek `D:\Projekan\GenZ`, di `.agents/skills/`. `AGENTS.md` di root mengarahkan agent ke skill yang sesuai. Skill tersedia untuk ditemukan mulai giliran berikutnya; jika belum muncul dalam daftar skill, buka chat baru pada proyek ini atau minta agent membaca file lokalnya.

## Yang terpasang

| Skill | Sumber | Fungsi |
| --- | --- | --- |
| `design-taste-frontend` | https://github.com/Leonxlnx/taste-skill | Skill utama taste saat instalasi; landing page, portfolio, dan redesign marketing. |
| `grill-me` | https://github.com/mattpocock/skills | Pintasan wawancara untuk menguji rencana. |
| `grill-with-docs` | https://github.com/mattpocock/skills | Pintasan wawancara dengan glossary dan ADR sesuai kebutuhan. |
| `antislop` | https://github.com/miqdadbadjuber/anti-slop | Core filter kualitas UI; modul tambahannya opsional dan belum dipasang. |
| `grilling` | https://github.com/mattpocock/skills | Dependensi kedua skill grill. |
| `domain-modeling` | https://github.com/mattpocock/skills | Dependensi grill-with-docs; memiliki template glossary dan ADR. |

Repo taste berisi beberapa skill. Instalasi ini memilih default saat pemasangan, `design-taste-frontend`, bukan seluruh koleksi atau varian v1. File sumber skill dipertahankan sebagaimana dipasang CLI.

## Contoh prompt

Untuk setiap pekerjaan UI, baca [fondasi UI Gen-Z](UI-GUIDELINES.md) dan `DESIGN.md` terlebih dahulu. Referensi baru dipakai untuk bagian yang diminta pengguna, sambil mempertahankan typography, palette, komponen dan brand Gen-Z. Produk memakai tema light saja.

### Desain baru

> Gunakan design-taste-frontend dan antislop mode during. Buat landing page GenZ untuk [audiens], dengan tujuan [tujuan]. Ikuti arah brand dan referensi berikut: [referensi].

Tambahkan stack dan kebutuhan fitur jika sudah diketahui. Taste menentukan penerapan visual dari brief; antislop menyaring keputusan generik dan memeriksa kualitas hasil. Jika arah brand belum jelas, selesaikan brief sesuai skill sebelum membangun.

### Uji ide sebelum implementasi

> Gunakan grill-me untuk menguji rencana berikut: [rencana]. Bahas keputusan, alternatif, risiko, dan edge case sebelum implementasi.

Agent akan bertanya dalam putaran dengan rekomendasi. Jawab pertanyaannya, lalu konfirmasikan pemahaman bersama ketika selesai.

### Rancang sambil mendokumentasikan

> Gunakan grill-with-docs untuk mematangkan [fitur]. Perjelas istilah domain, catat istilah yang disepakati, dan tawarkan ADR untuk keputusan arsitektur yang penting.

Glossary menyimpan istilah domain, bukan spesifikasi implementasi. ADR hanya relevan untuk keputusan yang sulit dibalik, perlu konteks untuk dipahami, dan memiliki trade-off nyata.

### Audit UI yang sudah ada

> Gunakan antislop mode after untuk audit [halaman]. Buat daftar temuan bernomor beserta prioritasnya. Tunggu pilihan nomor yang akan diperbaiki.

Lanjutkan dengan, misalnya: `Perbaiki temuan 1 dan 3.` Mode after menyimpan audit pada folder `anti-slop/` sesuai aturan core.

## Pemeliharaan

Jalankan dari root proyek untuk memeriksa pemasangan:

```powershell
npx --yes skills list --agent codex
```

Untuk memasang ulang di proyek baru, gunakan nama eksplisit berikut:

```powershell
npx --yes skills add Leonxlnx/taste-skill --skill design-taste-frontend --agent codex --yes
npx --yes skills add https://github.com/mattpocock/skills --skill grill-me grill-with-docs grilling domain-modeling --agent codex --yes
npx --yes skills add https://github.com/miqdadbadjuber/anti-slop --skill antislop --agent codex --yes
```

Untuk memperbarui skill proyek ketika memang diperlukan:

```powershell
npx --yes skills update -p
```

Periksa perubahan setelah update, terutama dependensi dan aturan interaksi, lalu sesuaikan `AGENTS.md` bila perlu. `skills-lock.json` mencatat sumber dan hash hasil instalasi; simpan bersama folder skill dan panduan dalam version control jika proyek memakai Git. Perintah pemasangan dari repo mengambil versi saat dijalankan, bukan jaminan mengembalikan isi versi lama.
