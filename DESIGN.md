# Arah design Gen-Z

## Arah yang dikonfirmasi founder

**[F] Referensi warna:** founder meminta palette Nemesis Protocol untuk Gen-Z. Ekstraksi dilakukan pada 12 Oktober 2026 melalui CSS dan inspeksi visual landing publik. Keputusan awal ini menentukan warna, bukan adopsi seluruh identitas referensi.

**[F] Tema, 18 Oktober 2026:** aplikasi/platform Gen-Z hanya memakai **light theme**. Tidak ada dark mode atau theme toggle, termasuk ketika sistem pengguna bertema gelap atau browser menyimpan preferensi dark lama. Banner/media/logo charcoal merupakan aksen komponen, bukan tema alternatif.

**[F] Konsistensi referensi, 18 Oktober 2026:** setiap UI wajib memeriksa fondasi Gen-Z terlebih dahulu. Referensi memberi arahan untuk bagian yang diminta, bukan izin mengganti typography, palette, komponen dan brand secara menyeluruh.

**Bahasa produk [F]:** Inggris dan Indonesia, Inggris dahulu. Dokumentasi proyek tetap Bahasa Indonesia.

## Palette

| Peran rekomendasi [R] | HEX terverifikasi dari referensi | Penggunaan |
|---|---|---|
| Brand mint | `#5EEAD4` | Aksen brand, termasuk pada komponen charcoal |
| Primary teal | `#2DD4BF` | Tombol utama dengan teks `#050505`, selection dan highlight |
| Strong teal | `#14B8A6` | Hover dan variasi aksen |
| Deep teal | `#0F766E` | Link/teks kecil pada putih |
| Mint soft | `#CCFBF1` | Background lembut dengan teks gelap |
| Charcoal base | `#1A1D23` | Logo, banner dan media kontras dalam tema light |
| Charcoal raised | `#22262E` | Variasi permukaan komponen charcoal, bukan tema |
| Charcoal elevated | `#2B3038` | Variasi detail komponen charcoal, bukan tema |
| White | `#FFFFFF` | Konten dan card terang |
| Off-white | `#FAFAFA` | Background terang sekunder |
| Light text | `#F4F4F5` | Teks pada permukaan gelap |
| Dark text | `#111827` | Teks pada permukaan terang |
| Muted light | `#A1A1AA` | Teks sekunder hanya pada gelap |
| Muted dark | `#4B5563` | Teks sekunder pada terang |

## Penggunaan rekomendasi dan batas scope

- Satu keluarga aksen mint/teal dengan warna netral; warna mengarahkan perhatian ke aksi relevan tanpa membuat semua data finansial terlihat positif.
- Teks tombol teal memakai warna gelap. Putih pada `#2DD4BF` atau `#14B8A6` tidak memenuhi contrast AA untuk teks normal.
- Pada background terang, link kecil memakai `#0F766E`; mint terang bukan warna teks di atas putih.
- Gradient referensi `#2DD4BF` → `#14B8A6` opsional untuk satu aksi atau elemen brand, bukan background wajib semua card.
- Tema Gen-Z ditetapkan light-only oleh founder pada 18 Oktober 2026. Token bernama dark menyimpan warna komponen charcoal; keberadaannya tidak mengaktifkan dark theme.
- Font, logo, gambar, layout dan data bisnis Nemesis tidak diadopsi melalui keputusan ini.

## Typography dan fondasi existing

**[V] Implementasi landing yang sudah dipakai**, diperiksa 18 Oktober 2026 pada `apps/marketing/src/styles/base.css`:

| Peran | Keluarga | Weight/font lokal |
|---|---|---|
| Heading | GenZ Display | 500, `display-latin.woff2` dan `ondo-sans-medium.woff2` |
| Body dan UI | GenZ UI | 500, `ui-latin.woff2` dan `gellix-medium.woff2` |
| Serif editorial tertentu | GenZ Editorial | 400, `editorial-latin.woff2` dan `arizona-regular.woff2` |

Platform memakai Display/UI yang sama. Fallback Arial/sans-serif; font lokal memakai `font-display: swap` dan `font-synthesis: none`. GenZ Editorial tetap khusus komposisi editorial existing, tidak wajib pada login. Font dari screenshot baru tidak mengganti fondasi ini.

Spacing dan radius mengikuti komponen serta permintaan pengguna. Angka CTA radius 8 px, opsi 12 px, dan modal 20–24 px pada revisi sebelumnya adalah pilihan implementasi agent, **bukan standar global yang disetujui founder**.

**[F] Koreksi login, 18 Oktober 2026:** ikuti urutan network lalu provider pada screenshot, gunakan ikon asli, serta bentuk yang lebih membulat dan shadow sebagaimana referensi. Base Sepolia aktif; Solana dan BNB tampil Coming soon. Font/palette tetap Gen-Z. CTA login putih dengan border dan shadow halus. Nilai implementasi lokal login: CTA radius 16 px, baris pilihan 20 px, modal desktop 48 px/mobile 32 px; nilai ini bukan aturan baru seluruh produk. Tap target minimal 44 px.

Aksen teal mengarahkan pilihan aktif, whitespace memisahkan tugas, dan focus deep teal terlihat pada permukaan light. Motif ekosistem energi menggunakan ilustrasi existing yang diberikan founder.

Layout dan dials disesuaikan dengan tugas. Login: ENERGY 2 / RHYTHM 2 / MOTION 2, dua panel existing dan satu CTA wallet; modal berurutan memilih network lalu provider. Animasi ilustrasi bisa dijeda dan mengikuti reduced motion.

**[F] Product writing, 18 Oktober 2026:** tampilkan copy yang diperlukan pengguna untuk tugasnya. Catatan signature/session, ketiadaan gas, preview/scaffold, disclaimer implementasi, dan penjelasan batas teknis masuk laporan founder/docs. Hapus penjelasan berulang itu dari login/landing; pertahankan error, status loading, petunjuk pemilihan, dan aksi retry yang ringkas. Jangan mengganti disclosure yang dihapus dengan data atau klaim palsu.

Panduan pemeriksaan sebelum setiap perubahan UI: [.agents/UI-GUIDELINES.md](.agents/UI-GUIDELINES.md).

Detail dan contrast: [catatan warna](docs/design/colors.md). Tokens: [CSS](docs/design/colors.css).
