# Palette Gen-Z a partir de Nemesis

**Data:** 12 Oktober 2026. **[F]** Founder meminta mengambil color palette [Nemesis](https://nemesis-protocol.vercel.app/). **[R]** Pemetaan semantic untuk Gen-Z ada di [DESIGN.md](../../DESIGN.md); kode siap digunakan ada di [gen-z-colors.css](colors.css). Ini artefak palette, bukan hasil implementasi UI.

## Bukti sumber

**Keputusan terbaru, 18 Oktober 2026:** Gen-Z memakai tema light saja. Nama token dark di bawah adalah provenance palette dan warna komponen charcoal, bukan dukungan dark mode. Typography dan aturan penerapan referensi mengikuti [DESIGN.md](../../DESIGN.md).

Warna dibaca dari computed CSS variables, class HEX dan computed styles pada landing publik; bukan tebakan dari gambar. Variabel ekstensi browser `--ait-*` dikeluarkan dari palette.

| Sumber di halaman | Nilai |
|---|---|
| `--accent`, `--solana-green` | `#5EEAD4` |
| `--accent-dim`, `--solana-cyan` | `#2DD4BF` |
| `--accent-strong`, `--solana-green-dark` | `#14B8A6` |
| `--solana-dark` / `-dark-2` / `-dark-3` | `#1A1D23` / `#22262E` / `#2B3038` |
| `--text-primary`, `--solana-text` | `#F4F4F5` |
| `--text-muted`, `--solana-text-muted` | `#A1A1AA` |
| Hero highlighted text class | `#CCFBF1` dan `#5EEAD4` |
| Footer background decoration class | `#0F766E` |
| Footer headings/body classes | `#111827` / `#4B5563` |
| Main computed background, image-card class | `#FFFFFF` / `#FAFAFA` |
| CTA text/background class | `#050505` / `#2DD4BF` |
| Primary CTA gradient | `#2DD4BF` → `#14B8A6` |

Variabel sumber berawalan `solana` adalah naming milik referensi. Token Gen-Z tidak memakai naming tersebut; chain Gen-Z tetap Base. Sumber tidak membuktikan traction, partnership, APY atau klaim keamanan apa pun untuk Gen-Z.

## Pemeriksaan contrast

Rasio dihitung dari sRGB luminance pada warna solid, tanpa opacity, image atau overlay. Batas AA untuk teks normal 4,5:1. Pasangan berikut menjadi rekomendasi, bukan hasil pengujian halaman Gen-Z yang sudah dibangun.

| Foreground | Background | Contrast | Penggunaan |
|---|---|---|---|
| `#050505` | `#2DD4BF` | 10,95:1 | Tombol primary |
| `#050505` | `#14B8A6` | 8,19:1 | Tombol hover |
| `#F4F4F5` | `#1A1D23` | 15,36:1 | Body text dark |
| `#A1A1AA` | `#22262E` | 5,92:1 | Secondary text dark |
| `#111827` | `#FFFFFF` | 17,74:1 | Body text light |
| `#4B5563` | `#FAFAFA` | 7,24:1 | Secondary text light |
| `#0F766E` | `#FFFFFF` | 5,47:1 | Link text light |

Pasangan ditolak untuk teks normal: putih pada `#2DD4BF` (1,86:1) dan putih pada `#14B8A6` (2,49:1). Ini bukan alasan mengganti warna brand: gunakan teks gelap pada tombol tersebut. `#A1A1AA` juga bukan text-secondary universal untuk permukaan terang.

## Status dan batas scope

**[F]** Palette referensi dipilih. **[R]** Penggunaan primary/hover/link/neutral disusun PM sebagai guideline. Theme default, typography, spacing, motif, motion dan layout belum ditetapkan oleh keputusan warna. Warna status success/warning/error dan chart belum dikunci; jangan memakai teal untuk menutupi default/loss atau menggantikan label keadaan.

### Delivery Gate untuk artefak palette

- **PASS, source evidence:** HEX di atas memiliki bukti CSS variable/class/computed style; bukan warna karangan atau warna ekstensi.
- **PASS, purpose:** setiap warna dalam DESIGN punya peran; satu keluarga aksen dan warna netral, gradient hanya opsional dengan tujuan yang tertulis.
- **PASS, contrast scope:** tujuh pasangan teks rekomendasi dihitung dan melebihi 4,5:1; pasangan putih-teal yang gagal dikeluarkan dari rekomendasi teks.
- **Scope:** tidak ada UI, controls, images atau theme switch yang dibuat. Build/click-through, focus, responsiveness, gradient/image contrast, dials dan full visual Delivery Gate belum dapat dinyatakan lulus; dilakukan saat implementasi UI, bukan disimpulkan dari palette ini.
