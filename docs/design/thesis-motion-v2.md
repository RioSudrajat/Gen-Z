# Energy thesis motion loop v2

Revisi dari film 60 detik menjadi motion loop 40 detik. Permintaan pengguna: hook pengetahuan di awal, tempo lebih cepat, objek vektor bergerak, instrumental latar, autoplay saat masuk section, dan loop tanpa transport controls.

## Arah visual

Landing energi untuk operator aset dan audiens global capital. Putih, charcoal dan teal mengikuti landing; Ondo/Gellix dan logo memakai aset proyek. Dial ENERGY 3 / RHYTHM 3 / MOTION 3 untuk loop ini. Arah diturunkan dari pilihan opsi 2 dan permintaan motion yang lebih kreatif. Referensi tidak disalin sebagai layout.

Motif penghubung berupa aliran listrik: circuit di opening, bus rak server, rute kapal, kabel charging, lalu koneksi infrastruktur dan capital. Objek bergerak menjelaskan hubungan di narasi. Wipe, rise dan iris mengubah komposisi tanpa mengulang fade seluruh slide. Grid hanya dipakai sebagai sumbu data scatter. Ruang putih memisahkan headline, angka, dan objek utama.

## Timeline

| Detik | Isi | Gerak |
|---|---|---|
| 0–2.6 | Who knows more, wins the next move. | Teks masuk dari mask, jalur listrik tergambar dan pulsa berjalan |
| 2.6–6 | The next economy. Runs on electricity. | Hook berganti dengan dorongan vertikal, circuit tetap menyambung |
| 6–12 | Productive economies. Dependable power. | Sumbu tumbuh, marker masuk di koordinat data sebenarnya |
| 12–18 | AI runs on compute. Compute runs on power. | Rak server masuk bertahap, indikator dan paket data bergerak |
| 18–21 | Southeast Asian data centres >2× | Koneksi regional berputar sebagai ilustrasi jaringan |
| 21–27 | Supply shocks travel fast | Tanker melewati jalur dengan celah yang menyempit |
| 27–33 | Less oil exposure. More to electrify. | EV datang, roda berhenti, kabel tersambung, indikator charging terisi |
| 33–37 | Infrastructure and capital | Jalur solar menuju jaringan global terbentuk |
| 37–40 | See it early. Be ready to lead. | Brand lockup dan pulsa menutup menuju pengulangan |

Angka World Bank dan IEA tetap mengikuti riset serta sumber dalam memo v1 dan transkrip HTML. 485/950 TWh adalah seluruh beban data centre global; >2× adalah proyeksi regional dengan baseline berbeda. 60% adalah asal impor crude, bukan persentase transit Hormuz. Scatter berisi tujuh ekonomi terpilih dan tidak membuktikan kausalitas.

## Audio dan runtime

Instrumental orisinal 120 BPM, 40 detik, disintesis dengan NumPy tanpa sampel pihak ketiga. Pad, arpeggio, bass dan drum. Fade batas 15 ms. Pengukuran versi web: -21.5 LUFS integrated, true peak -8.3 dBFS. Tidak ada voice-over.

Hyperframes merender opening enam detik dari `motion/hyperframes/index.html`. Remotion menyusun seluruh timeline lewat `motion/src/KineticThesis.tsx`. FFmpeg menggabungkan AAC dan mengompresi versi web. Renderer tidak masuk bundle landing.

Landing memakai `<video>` sebagai media background dalam section, tanpa native controls dan pointer interaction. Mulai ketika minimal 18% video terlihat, berhenti ketika seluruhnya keluar viewport atau tab tersembunyi. Loop berlangsung otomatis. Sound off secara default; klik Sound on memberikan aktivasi untuk musik. Ini mengikuti [aturan autoplay browser](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay), bukan jaminan autoplay bersuara.

Reduced motion dan Save Data memilih poster statis. Resources menyediakan pilihan statis bagi pengunjung lain sesuai kebutuhan [pause/stop/hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html). Transkrip dan tabel tetap HTML. Sumber gagal menampilkan poster serta pesan status. Tanpa JavaScript, poster dan teks tetap tersedia.

## Verifikasi

- Remotion TypeScript: `npm run typecheck`, exit 0.
- Hyperframes lint: exit 0, nol error, satu warning saran sub-composition untuk opening tunggal. Duplikasi root authoring dan initial-hidden-state telah diperbaiki.
- Render Hyperframes dan Remotion selesai; scene diperiksa pada still dan contact sheet, termasuk perbaikan kabel EV dan clipping panel solar.
- Video web: H.264, 1920×1080, 30 fps, 40.000 detik, AAC stereo 48 kHz, 2,973,444 byte. Decode seluruh file dengan FFmpeg, exit 0. Frame 0/45/120 opening diperiksa setelah perbaikan initial state.
- Landing `npm run build`, exit 0. Peringatan directive `use client` dari dependensi Framer Motion masih ada.
- `node --test tests/thesis-motion.test.mjs`: PASS. Memeriksa viewport masuk/keluar, sound, tab visibility, pilihan statis, reduced motion, Save Data, kegagalan sumber, dan cleanup.
- Browser aktual: autoplay muted terlihat, waktu video bertambah, duration 40, controls false, loop true. Waktu kembali dari bagian akhir ke 6.42 detik saat tetap playing, mengonfirmasi pengulangan. Sound on mengubah muted false dan aria-pressed true; Sound off kembali muted.
- Browser aktual: video pause ketika keluar layar dan resume ketika terlihat. Resources memilih statis/pemutaran kembali di desktop dan drawer mobile; pilihan mobile juga diuji dengan Enter. Transkrip dan tabel bisa dibuka/tutup dengan Enter. Console error kosong pada pengecekan final.
- Desktop 1147 px, mobile 390 px dan 320 px: tidak ada horizontal overflow. Detail sumbu kecil pada film mobile mempunyai alternatif tabel HTML.
- Reduced motion, Save Data, hidden-tab dan network-failure diuji pada controller dengan lingkungan simulasi; pengaturan OS/browser pengguna tidak diubah. Pemeriksaan ini tidak sama dengan pengujian perangkat fisik.

## Delivery Gate antislop

Lingkup laporan: motion loop dan integrasinya pada section energy-context, beserta kontrol Resources yang ditambah. Bagian landing lain tidak diaudit ulang. Setiap baris di bawah PASS untuk lingkup perubahan ini; bukti runtime dan batas pengujian tercatat di atas.

| Item | Hasil dan bukti |
|---|---|
| R-02 | PASS: copy baru tidak memakai em dash. |
| R-03 | PASS: DOM scrollWidth tidak melebihi viewport pada 1147/390/320 px. |
| R-17 | PASS: semua angka film terhubung ke snapshot World Bank atau sumber IEA pada transkrip. |
| R-18 | PASS: tidak ada testimonial. |
| R-23 | PASS: pengguna meminta vektor/animasi dan soundtrack; logo/font memakai aset yang sudah ada. |
| R-24 | PASS: kontrol Resources mengubah section yang benar-benar ada; tidak menambah tautan tujuan baru. |
| R-25 | PASS: ink, teal dan muted pada putih minimal 4.97:1 untuk teks; jalur ilustratif bukan teks. |
| R-26 | PASS: Sound dan Resources static/animate diklik dan mengubah state browser. |
| R-27 | PASS: poster untuk loading/no JS; error controller menampilkan poster dan status. |
| R-28 | PASS: tidak menambah FAQ. |
| R-32 | PASS: transkrip/tabel bekerja dengan Enter; tombol native dan focus-visible tersedia. |
| R-33 | PASS: perubahan source melalui patch; script Python hanya menghasilkan audio. |
| R-34 | PASS: tidak menambah theme toggle. |
| R-35 | PASS: build, render, decode dan click-through kontrol yang berubah selesai. |
| R-36 | PASS: tidak menambah klaim keamanan, compliance atau return. |
| R-37 | PASS: arah mengikuti brief opsi 2, brand proyek dan permintaan kinetic motion. |
| R-38 | PASS: data bersumber; ilustrasi kapal/EV/rak bukan aktivitas produk atau proyek nyata. |
| R-01 | PASS: tidak memakai glow/gradient dekoratif. |
| R-04 | PASS: rak, tanker, EV dan koneksi menggambarkan isi adegan; kontrol memakai ikon proyek yang ada. |
| R-06 | PASS: font mengikuti aset Ondo/Gellix, tanpa label monospace dekoratif. |
| R-07 | PASS: grid hanya pada scatter untuk pembacaan sumbu. |
| R-08 | PASS: panah pada angka compute menjelaskan perpindahan tahun. |
| R-09 | PASS: tidak menambah capsule badge. |
| R-10 | PASS: tidak menambah glassmorphism. |
| R-12 | PASS: film tanpa floating shadow. |
| R-13 | PASS: tidak ada glow. |
| R-14 | PASS: tidak ada feature-card grid baru. |
| R-19 | PASS: gerak punya fungsi per adegan pada tabel timeline. |
| R-22 | PASS: vektor khusus mengikuti konteks energi yang diminta. |
| Dial eksplisit | PASS: ENERGY 3 / RHYTHM 3 / MOTION 3 dicatat pada arah revisi. |
| Konsistensi dial | PASS: typography, scatter, rak, jalur kapal dan EV berganti dengan tempo 3–6 detik. |
| Focal point | PASS: hook, scatter, angka atau objek menjadi pusat sesuai adegan. |
| Whitespace | PASS: ruang memisahkan headline, angka dan ilustrasi, tidak mengisi kartu template. |
| Accent | PASS: teal menandai power, Indonesia, angka dan koneksi. |
| Motif identitas | PASS: jalur listrik/paket yang menyambung narasi infrastruktur ke capital. |
| Design Read | PASS: mengikuti arah opsi 2 dan permintaan motion eksplisit; arah dicatat di memo revisi. |
| C-1 | PASS: alasan tipografi, warna, grid dan gerak tercatat pada arah visual. |
| C-2 | PASS: kontrol yang ditambah punya perilaku teruji. |
| C-3 | PASS: semua adegan memperkuat konteks demand sebelum solusi. |
| C-4 | PASS: responsif, keyboard dan fallback diverifikasi dengan batas pengujian dicatat. |
| C-5 | PASS: tidak ada angka atau testimony fiktif. |
| R-05 | PASS: komposisi mengikuti data, server, route dan EV, bukan template card. |
| R-11 | PASS: tidak mengubah semua elemen menjadi pill. |
| R-15 | PASS: kontrol bernama Sound dan Use static energy section sesuai aksi. |
| R-16 | PASS: AI merujuk workload demand, bukan label pemasaran produk. |
| R-20 | PASS: alur Indonesia–compute–oil exposure–electrification–capital spesifik pada thesis proyek. |
| R-21 | PASS: mempertahankan background putih dan brand existing. |
| R-29 | PASS: charcoal/white/teal serta tint pendukung konsisten. |
| R-30 | PASS: tidak menyalin layout referensi; vektor dan film dibuat untuk narasi ini. |
| R-31 | PASS: alasan keputusan visual ditulis pada arah visual dan timeline. |

Pre-flight taste untuk lingkup revisi: copy dibaca ulang; konten bergerak terlihat; tanpa layout card/marquee/dekorasi metadata baru; IntersectionObserver menggantikan listener scroll; reduced motion dan cleanup tersedia; tidak menambah UI library atau renderer ke runtime landing. Validasi Core Web Vitals menyeluruh dan tes audio pada perangkat fisik tidak dilakukan dalam revisi ini.
