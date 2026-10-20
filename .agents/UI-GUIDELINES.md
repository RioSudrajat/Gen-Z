# Fondasi UI Gen-Z

Keputusan founder, 18 Oktober 2026: semua UI Gen-Z mengikuti fondasi produk yang sudah ada, meskipun ada referensi visual baru. Arah canonical di `DESIGN.md`; file ini adalah panduan pemeriksaan agent, bukan design system alternatif.

## Sebelum mengubah UI

1. Baca `DESIGN.md`, panduan direktori aplikasi, dan komponen/token yang sudah dipakai. Periksa implementasi aktif; laporan history bukan sumber keputusan terbaru.
2. Catat fondasi yang berlaku: typography beserta font lokal dan weight, warna semantik, spacing, radius, komponen, logo, focus, responsivitas, serta motion.
3. Tentukan bagian referensi yang diminta pengguna: alur, interaksi, komposisi, atau detail tertentu. Screenshot tidak otomatis mengganti seluruh identitas Gen-Z.
4. Pakai komponen/token existing. Perubahan fondasi brand memerlukan instruksi pengguna; jangan menyimpulkan font baru disetujui hanya karena muncul pada screenshot.
5. Bila `DESIGN.md` tertinggal, laporkan perbedaannya dan catat fondasi yang terverifikasi dari source. Jangan mengklaim keputusan founder yang belum ada.
6. Jangan mengubah keputusan implementasi agent menjadi aturan design system global. Bedakan keputusan founder, komponen existing, dan usulan/penyesuaian lokal. Angka radius atau spacing yang baru dipilih bukan bukti bahwa angka itu sudah menjadi standar Gen-Z.

## Fondasi saat ini

- Tema light saja pada aplikasi dan platform. Tidak ada pilihan dark, deteksi tema sistem, atau pembacaan preferensi dark tersimpan. Permukaan charcoal pada logo, banner atau media boleh menjadi aksen dalam halaman terang.
- Heading memakai **GenZ Display**, UI/body memakai **GenZ UI**, mengikuti keluarga font lokal landing. **GenZ Editorial** hanya untuk konteks editorial yang memang sudah memakai serif, bukan pengganti font UI. Jangan mengganti font halaman login mengikuti referensi Nemesis.
- Mint/teal dan warna semantik mengikuti `packages/design-tokens/src/colors.css`; link kecil di atas putih memakai deep teal dan CTA teal memakai teks gelap.
- Pertahankan logo Gen-Z dan motif ekosistem energi. Bila pengguna meminta mengikuti radius, shadow, spacing atau urutan interaksi referensi, terapkan detail tersebut sambil menjaga font/palette Gen-Z. Jangan memakai design system sebagai alasan mengabaikan bagian referensi yang diminta.
- Login menampilkan satu aksi **Connect Wallet**, lalu modal **pilih network → pilih provider wallet**, dengan Back. Base Sepolia aktif; Solana dan BNB ditampilkan **Coming soon**, tanpa mengaktifkan autentikasi jaringan itu. Jangan menghilangkan langkah network hanya karena runtime baru mendukung satu jaringan.
- Pakai logo network/wallet asli dari sumber resmi atau metadata provider. Wallet yang belum terpasang boleh ditampilkan dengan aksi download yang jelas; tidak boleh memberi kesan login telah tersedia. Wallet EIP-6963 lain tetap didukung.
- Copy produk harus membantu pengguna melakukan tugas. Penjelasan internal tentang signature/session, klaim tidak melakukan transfer, ketiadaan gas, status scaffold/pre-pilot, dan keterbatasan implementasi masuk laporan/docs untuk founder. Jangan menjejalkan disclaimer/caption teknis pada login atau landing. Pertahankan helper yang diperlukan untuk memilih network, error/retry, loading, dan state yang menentukan aksi pengguna; gunakan kalimat singkat.

## Pemeriksaan hasil

Untuk landing marketing dan Insights, ikuti [aturan landing page](../docs/design/landing-page.md): satu container konten, typography Gen-Z, pemisahan media dari rail konten, artikel sebagai pendalaman, dan motion yang dapat diinterupsi. Nilai token landing tidak otomatis berlaku untuk platform.

Verifikasi font yang benar-benar ter-render, tema light pada sistem dark dan storage lama, mobile/zoom, kontras, focus keyboard, Escape dan pengembalian focus modal, serta state loading/empty/pending/error. Jalankan check/build dan tes perilaku yang relevan. Catat keterbatasan uji dengan jujur.
