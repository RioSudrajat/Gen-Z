# Pengajuan dan onboarding mitra aset

Dicatat 20 Oktober 2026, Asia/Jakarta, atas permintaan founder. Dokumen ini menjelaskan arah onboarding mitra dari pembahasan produk; bukan bukti layanan live atau persetujuan pembangunan portal baru.

**Status:** alur dasar mengikuti keputusan [F] D29 dan batas MVP D21. Rincian prioritas operasional dan pemicu portal di bawah adalah rekomendasi [R]. Provider, penanggung jawab nyata, target waktu respons dan scope portal lanjutan masih [O]. Acuan: [PRD](../PRD.md), [requirements M01–M02](requirements.md), dan [register keputusan](decisions.md).

## Tujuan layanan

Mitra aset/operator perlu dapat menjelaskan aset serta kebutuhan pembiayaannya, mengetahui pengajuannya diterima, dan memahami siapa yang menangani serta tindakan berikutnya. Keberhasilan diukur dari pengajuan yang dapat ditindaklanjuti dan kelengkapan bukti, bukan keberadaan dashboard.

Contact menjadi pintu pengajuan. Proses screening dan due diligence dibantu tim. Pencatatan internal diprioritaskan; portal mitra terbatas dapat ditambahkan ketika ada kebutuhan berulang yang terbukti. Portal operator self-service penuh tetap di luar MVP.

## Perjalanan mitra [R]

| Tahap | Pengalaman mitra | Tanggung jawab Gen-Z |
|---|---|---|
| Pengajuan awal | Menjelaskan kontak, perusahaan, aset dan kebutuhan pembiayaan | Mencatat inquiry dengan referensi |
| Konfirmasi | Menerima bukti penerimaan dan langkah berikutnya | Mengantrekan notifikasi serta menetapkan PIC dan tindak lanjut |
| Screening awal | Menjawab pertanyaan atau mengikuti percakapan awal | Memeriksa kesesuaian aset, kebutuhan pembiayaan dan kewenangan pengaju |
| Due diligence | Memberikan bukti melalui kanal privat yang disepakati | Memeriksa bukti perusahaan, teknis, keuangan, kontrak dan operasi sesuai kebutuhan proyek |
| Keputusan dan penyusunan transaksi | Mendapat hasil review; membahas terms bila dilanjutkan | Mencatat keputusan, alasan, pekerjaan tersisa dan pihak yang berwenang |
| Pelaporan proyek | Menyampaikan data serta menindaklanjuti permintaan review | Mereview bukti, merekonsiliasi catatan dan mengelola publikasi sesuai mandat |

Tahap lanjutan merupakan arah layanan. Publikasi, pendanaan dan servicing proyek nyata tetap memerlukan kesiapan legal, counterparties, data dan operasi; form atau status internal tidak membuktikan kesiapan tersebut.

## Contact dan notifikasi

- [F] Inquiry dan referensi tersimpan sebelum keberhasilan ditampilkan. Notifikasi yang gagal tidak menghapus atau menggandakan inquiry yang telah diterima.
- [R] Email memberi tahu tim bahwa ada pengajuan baru. Catatan inquiry menjadi acuan penerimaan dan tindak lanjut; email bukan satu-satunya tempat penyimpanan.
- [R] Konfirmasi kepada mitra mencantumkan referensi dan tindakan berikutnya. Penerimaan inquiry tidak berarti kelayakan, persetujuan listing atau komitmen pendanaan.
- [R] Tetapkan target respons berdasarkan kapasitas PIC sebelum menjanjikannya pada pengguna. Batas waktunya belum dipilih.
- [F] Form publik tidak menerima dokumen sensitif atau otomatis mendaftarkan pengaju ke pemasaran. Retensi mengikuti [PRD](../PRD.md) dan [kontrak intake](../engineering/api/intake.md).
- [R] Pengajuan awal tidak memerlukan wallet. Akses workspace privat kelak tetap mengikuti autentikasi dan otorisasi resource proyek; alamat email saja tidak memberi akses.

## Kebutuhan data dan batas form

Kebutuhan intake operator canonical tetap pada [kontrak intake yang berstatus proposed](../engineering/api/intake.md): kontak, kategori aset, lokasi, status operasi, deskripsi aset, kebutuhan pembiayaan yang boleh belum diketahui, dan pengakuan privacy notice. Dokumen ini tidak mengubah schema, field wajib, atau kontrak API.

Pada inspeksi source 20 Oktober 2026, form marketing masih mengumpulkan topik operator/investor/partnership, nama, perusahaan opsional, email dan pesan. Payload ringkas tersebut belum sama dengan kontrak intake operator target. Eksplorasi desain perlu mempertahankan kebutuhan data dan membedakan kategori pengaju; penyelarasan payload dilakukan saat implementasi dengan pembaruan kontrak bila diperlukan.

Form pertama bertujuan menentukan percakapan yang relevan. Identitas pribadi, kontrak penuh, laporan keuangan dan rekening diminta pada tahap yang memerlukannya melalui kanal privat dengan pembatasan akses. Pengumpulan dokumen lengkap sejak kontak pertama bukan prasyarat yang ditetapkan dokumen ini.

## Workspace internal dan portal mitra

| Permukaan | Fungsi | Prioritas [R] |
|---|---|---|
| Pencatatan internal Gen-Z | Inquiry, PIC, status, histori interaksi, kelengkapan bukti, tindak lanjut dan kegagalan notifikasi | Fondasi intake; antarmuka sederhana cukup bila memenuhi akses dan traceability |
| Portal mitra terbatas | Status pengajuan/proyek milik organisasi, checklist, permintaan perbaikan dan pengiriman laporan | Setelah kebutuhan dan batas akses tervalidasi; akses undangan mengikuti mandat |
| Portal operator penuh | Pengelolaan aset atau proyek secara self-service luas | Ditunda sesuai non-goals MVP |

Pencatatan internal memerlukan sumber acuan, PIC dan tindakan berikutnya yang jelas; ini tidak otomatis memerlukan CRM eksternal atau dashboard custom besar. Tool/provider belum dipilih.

Pertimbangkan portal terbatas ketika bukti operasional menunjukkan:

1. Permintaan dokumen dan revisinya berulang kali tercecer dalam komunikasi.
2. Satu operator mengelola beberapa proyek atau beberapa staf dengan kewenangan berbeda.
3. Pelaporan rutin dan tindak lanjut reviewer menjadi beban berulang.
4. Pertanyaan status mendominasi komunikasi dan memperlambat penyelesaian tugas.

Pemicu tersebut dinilai dari kasus nyata; tidak ada ambang jumlah mitra atau tanggal pembangunan yang disepakati. Scope awal yang disarankan adalah status, checklist, permintaan perbaikan, pengiriman laporan dan kontak PIC. Grafik produksi/API/IoT mengikuti kebutuhan serta akses data yang feasible; bukan syarat estetika portal.

## Bukti referensi dan batas pengetahuan

Sumber publik ditelaah dalam percakapan 19–20 Oktober 2026:

- [ReFi Hub — Business Due Diligence Framework](https://www.refihub.io/blog/rebusiness-due-diligence-framework): pemeriksaan operator, kontrak, finansial, operasi dan kesiapan pembayaran; kontak tim onboarding/legal. Ini mendukung kebutuhan proses berbantuan tim, bukan membuktikan ada atau tidaknya portal privat.
- [ReFi Hub — Investor FAQ FLP II](https://www.refihub.io/blog/investor-faq-flp-ii-solar-installation): operator tetap bertanggung jawab atas operasi dan memberikan catatan produksi serta pendapatan melalui API atau pelaporan terdokumentasi.
- [Energea — Project Developers](https://www.energea.com/developers/): pengajuan publik direview dahulu; pengaju terpilih dapat diundang ke Partner Portal untuk due diligence. Bukti berasal dari halaman terindeks; pembukaan HTML langsung memerlukan JavaScript. Akses dan fitur portal privat tidak diuji.
- [GEN — Contact](https://www.ge.network/contact): pintu percakapan bagi operator, investor dan calon kolaborator; tidak membuktikan workflow internal atau layanan portal.

Praktik referensi memberi pembanding. Prioritas Gen-Z di atas adalah rekomendasi untuk kondisi pre-pilot, bukan klaim satu pola universal atau adopsi seluruh model bisnis referensi.

## Status implementasi dan langkah berikutnya

Inspeksi source 20 Oktober 2026: form memiliki jalur menyiapkan/copy/download pesan dan gateway pengiriman yang dikonfigurasi. Endpoint inquiry platform, penyimpanan inquiry, notifikasi dan inbox internal belum diimplementasikan; kontrak masih proposed. Pemeriksaan ini bukan uji deployment atau pengiriman email.

Urutan yang direkomendasikan: selaraskan kebutuhan form dan payload → penyimpanan inquiry serta referensi → notifikasi yang dapat dicoba ulang → pencatatan screening internal → validasi workflow dengan calon mitra → evaluasi kebutuhan portal terbatas. Urutan ini tidak mengubah scope investasi atau mengotorisasi deploy/live funding.

Permintaan founder untuk tiga alternatif desain Contact dicatat sebagai pekerjaan eksplorasi tersendiri. Pilihan visual dan implementasi halaman menunggu eksplorasi serta pemilihan; dokumen ini tidak menetapkan desain pemenang.
