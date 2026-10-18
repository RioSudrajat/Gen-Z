# Hasil perbaikan Stack: temuan 2 dan 3

14 Oktober 2026. Pengguna menyetujui perbaikan kedua temuan audit after dengan “yaa bro mulai perbaiki”. Scope implementasi: `landing/src/NemesisStackSection.tsx`.

## Perubahan

- **Temuan 2 selesai:** state hover dan pilihan awal sama-sama `null`. Tidak ada layer terpilih saat halaman dibuka atau section dicapai pertama kali.
- **Temuan 3 selesai:** ketiga handler seleksi `onPointerEnter` dihapus. Satu listener `pointermove` membandingkan koordinat mouse dan mencari layer yang benar-benar ditunjuk di dalam stage. Event dengan koordinat sama tidak memilih layer.
- Scroll menghapus hover sementara dan menahan seleksi hover selama 150 ms setelah event scroll terakhir. Berakhirnya waktu tersebut tidak otomatis memilih layer; perlu gerakan mouse berikutnya.
- Hover sementara dipisahkan dari pilihan lewat klik/tap atau focus keyboard. Scroll mengembalikan pilihan eksplisit jika ada. Perilaku reset ketika pointer keluar stage tetap ada; focus keyboard yang terlihat tetap mempertahankan pilihan. Blur keluar stage menghapus pilihan focus.
- Label, slab, dan foundation menggunakan identitas `data-stack-layer` yang sama. Listener dibersihkan ketika komponen dilepas.

Arah visual mengikuti Stack yang ada: diagram arsitektur isometrik putih/mint untuk landing Gen-Z; ENERGY 2 / RHYTHM 2 / MOTION 2 sesuai dokumen port sebelumnya. Alasan perubahan: penekanan visual harus menandai layer yang sengaja ditunjuk atau dipilih.

## Bukti

- `npm run build`: exit 0. Warning `use client` pada bundle Vite dan chunk Three.js di atas 500 kB masih ada sebagaimana build sebelumnya; tidak ada error build.
- `landing/qa/stack-scroll-audit.mjs --fixed`: state awal, scroll pertama, pointer keluar, dan wheel-scroll dengan kursor diam semuanya menghasilkan nol label terpilih. Browser masih mengirim `pointerenter` pada `(240, 450)`, tetapi event tersebut tidak lagi mengubah seleksi.
- `landing/qa/stack-scroll-verification.mjs`: **75 pemeriksaan PASS**, exit 0, tanpa error JavaScript halaman. Rincian per pemeriksaan ada di `landing/qa/stack-scroll-fixed/verification.json`.
- Scroll maju dan mundur dengan kursor diam diuji pada empat label, tiga slab, dan foundation.
- Hover dan klik nyata diuji pada `apps`, `defi`, `depin`, dan `physical`, melalui label dan diagram. Pointer keluar stage mengembalikan state netral.
- Klik empat label memilih layer sesuai tujuan; pilihan bertahan selama scroll kecil ketika kursor masih di stage.
- Tab memilih DeFi, Enter mengaktifkannya, outline focus terlihat 2 px; hover Gen-Z Network sementara lalu scroll mengembalikan DeFi; Tab/Space memilih Gen-Z Network; Tab keluar Stack mereset pilihan.
- Emulasi touch pada lebar 768, 390, dan 320 px: scroll awal tetap netral, tap keempat label memilih layer sesuai tujuan, `scrollWidth` sama dengan lebar viewport.
- Reduced motion: scroll awal tetap netral, gerakan mouse memilih Gen-Z Network, scroll berikutnya menghapus hover.
- Screenshot netral desktop dan screenshot mobile 390 px diinspeksi secara visual; tidak ada clipping atau overflow pada label yang terlihat.

## Delivery Gate antislop dan pre-flight

Gate dibatasi pada perubahan interaksi Stack. Aset, copy, palette, tipografi, geometri, navigasi, dan tema mengikuti implementasi yang sudah ada; tidak ada keputusan desain baru untuk area tersebut.

- **Hard Gate PASS:** build exit 0; semua kontrol Stack memiliki hasil interaksi nyata dalam 75 pemeriksaan; focus keyboard 2 px terlihat; viewport 768/390/320 tidak overflow; tidak ada aset, copy, statistik, klaim, navigasi, atau tema baru; perubahan ditulis langsung di source lewat patch. State netral diuji, status loading/error gambar yang sudah ada tidak diubah.
- **Purpose Gate PASS:** highlight dan dimming hanya menandai layer yang sengaja ditunjuk atau dipilih; hover tidak muncul akibat scroll dengan kursor diam. Tujuan penekanan visual dan alasan perubahan dicatat di atas. Tidak ada efek atau dekorasi baru.
- **Liveliness PASS:** ENERGY 2 / RHYTHM 2 / MOTION 2 mengikuti arah port yang terdokumentasi; screenshot desktop tetap memakai diagram sebagai focal point, whitespace memisahkan label, aksen mint dan motif isometrik tetap konsisten.
- **Craftsmanship / Quality Locks PASS:** hover/klik pada empat layer, tap di tiga viewport, keyboard, reset, dan reduced motion semuanya lulus; listener memiliki cleanup; tidak ada dependensi baru. Pemeriksaan preservasi source dan screenshot memastikan perubahan terbatas pada state serta pemicu seleksi.

## Batas pemeriksaan

Browser yang diuji adalah Chrome headless lokal dengan emulasi viewport/touch, bukan perangkat Safari/iOS fisik. Hasil ini tidak mengklaim audit ulang seluruh landing atau performa global. Tidak ada deployment publik dalam tugas ini.
