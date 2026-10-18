# Gen-Z energy thesis film

Motion loop 40 detik, 1920 × 1080, 30 fps, dengan instrumental orisinal 120 BPM. Arah opsi 2, dilanjutkan AI/data center, Hormuz, EV, dan kesiapan infrastruktur. Revisi dan QA: [memo v2](../docs/design/thesis-motion-v2.md). Riset awal: [memo v1](../docs/design/thesis-motion.md).

Authoring terpisah dari landing. Hyperframes merender opening 6 detik; Remotion menyusun opening dan tujuh adegan berikutnya. Tidak ada renderer yang dimasukkan ke JavaScript landing.

## Menjalankan

```powershell
cd D:/Projekan/GenZ/motion
npm ci
npm run studio
```

## Merender

```powershell
# Setelah Remotion mengunduh browser resminya melalui render/still pertama:
$env:HYPERFRAMES_BROWSER_PATH = 'D:/Projekan/GenZ/motion/node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe'
node node_modules/hyperframes/dist/cli.js render hyperframes --output public/intro-v2.mp4 --fps 30 --quality delivery --workers 2 --no-browser-gpu
npm run typecheck
npm run score
npm run render
npm run mux
npm run web
npm run still
ffmpeg -y -i out/poster.png ../apps/marketing/public/assets/energy-thesis-poster.webp
```

Path browser bergantung OS dan versi; arahkan variabel proses ke executable Chrome Headless Shell yang tersedia. Tidak mengubah preferensi global browser.

Output master: `out/gen-z-energy-thesis-v2.mp4`. Versi website: `../apps/marketing/public/assets/gen-z-energy-thesis-v2.mp4`. Jangan memperbarui angka tanpa memperbarui sumber, tahun, serta transkrip landing. Score memerlukan Python dan NumPy; mux/web memerlukan FFmpeg.

Hyperframes memberi satu peringatan authoring tentang anjuran sub-composition untuk scene bersarang; tidak ada lint error. Opening sengaja merupakan satu scene enam detik. Ini tidak membuktikan lint atau render versi berikutnya tetap lolos; jalankan ulang saat source berubah.

## Asset dan font

Logo serta font disalin dari aset landing yang sudah ada. GSAP disimpan lokal di `hyperframes/assets/gsap.min.js` agar opening tidak bergantung CDN saat render. Dependensi dan browser diambil dari distribusi resmi npm/Remotion.

## Penyajian website

Autoplay muted ketika minimal 18% video masuk viewport, loop, tanpa native controls atau klik untuk pause. Berhenti ketika seluruh video keluar layar atau tab disembunyikan, lalu melanjutkan saat terlihat. Tombol Sound mengaktifkan musik melalui interaksi pengunjung. Browser umumnya membatasi autoplay bersuara.

Resources menyediakan pilihan tampilan statis. Reduced motion dan Save Data memilih poster tanpa pemutaran. Transkrip HTML, sumber dan tabel data menyediakan alternatif pada mobile, pembaca layar dan kondisi video gagal. Uji controller: `node --test ../apps/marketing/tests/thesis-motion.test.mjs`.

`compose_score.py` mensintesis seluruh suara, tanpa sampel atau lagu pihak ketiga. Fade 15 ms di batas loop menghindari klik tajam. Tidak memakai voice-over.
