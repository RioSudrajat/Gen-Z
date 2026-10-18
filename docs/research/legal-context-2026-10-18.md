# Konteks legal dari PRD lama

**Status: snapshot riset lama, tidak diverifikasi ulang saat reorganisasi.** Referensi aturan/pajak dan applicability memerlukan pemeriksaan terbaru sebelum keputusan legal atau transaksi. Gate operasional aktif diringkas di [risiko dan dependency](../product/risks-and-dependencies.md).

Sumber pemisahan: [dokumen asal](../archive/prd-2026-10-18.md). Dipisahkan 18 Oktober 2026; label [F]/[R]/[A]/[O]/[V] mengikuti [panduan](../CONTRIBUTING.md).

## Legal, Regulatory & Compliance

**Bagian ini merupakan pemetaan isu produk, bukan legal opinion. Peluncuran perlu konsultasi counsel Indonesia dengan keahlian pasar modal, AKD/kripto, pembayaran, pajak, dan ketenagalistrikan.** Tidak ada satu izin “RWA” yang boleh diasumsikan mencakup seluruh aktivitas Gen-Z.

**Pembaruan dari sesi founder:** DPR melaporkan persetujuan RUU Satu Data Indonesia pada 6 Oktober 2026. Temuan ini relevan dengan kabar regulasi baru yang disampaikan founder, tetapi nomor/naskah UU final dan applicability pasal blockchain pada model Gen-Z masih **[perlu verifikasi]**. PADK OJK 3/2026 yang berlaku 1 September 2026 mengatur pelaksanaan/pelaporan perdagangan AKD; bukan UU blockchain yang disahkan DPR. Rincian dan batas validasi dicatat pada [sesi stress-test](../archive/founder-interview-2026-10-17.md). [DPR](https://emedia.dpr.go.id/news/2026/10/07/dpr-setujui-ruu-satu-data-indonesia-sturman-data-jadi-fondasi-kebijakan), [OJK](https://ojk.go.id/id/regulasi/Pages/PADK-Nomor-3-Tahun-2026-Penyelenggaraan-Perdagangan-Aset-Keuangan-Digital-termasuk-Aset-Kripto.aspx)

### Peta kewenangan dan implikasi

| Area | Baseline yang ditemukan | Implikasi untuk Gen-Z |
|---|---|---|
| Aset kripto/AKD | Pengawasan beralih dari Bappebti ke OJK pada 10 Januari 2025; POJK 27/2024 telah diubah oleh POJK 23/2025 | Jangan memakai rezim Bappebti sebagai rujukan utama terkini; konfirmasi scope izin setiap mitra |
| Securities crowdfunding | POJK 17/2025 menggantikan POJK 57/2020 | Kemitraan SCF berizin menjadi opsi; instrumen, issuer, investor limit dan penyimpanan/pencatatan wajib mengikuti aturan terkini |
| ITSK/sandbox | POJK 3/2024 menjadi dasar sandbox | Sandbox merupakan jalur penilaian inovasi, bukan izin otomatis menghimpun dana publik |
| Pembayaran | BI menegaskan virtual currency bukan alat pembayaran sah Indonesia | Stablecoin subscription dan settlement tidak boleh diaktifkan hanya karena teknisnya memungkinkan |
| Perlindungan konsumen | POJK 22/2023 | Disclosure, pemasaran yang tidak menyesatkan, pengaduan, dan perlakuan konsumen harus masuk desain |
| Energi/EV | Permen ESDM 1/2023 mengatur penyediaan infrastruktur charging kendaraan listrik berbasis baterai | Periksa izin badan usaha/proyek, keselamatan, kerja sama penyediaan listrik, tarif dan operasi masing-masing lokasi |

Rujukan: [OJK, transisi Januari 2025](https://www.ojk.go.id/id/berita-dan-kegiatan/siaran-pers/Documents/Pages/Pertemuan-Tahunan-Industri-Jasa-Keuangan-2025/SP%2029%20-%20Pertemuan%20Tahunan%20Industri%20Jasa%20Keuangan%20PTIJK%202025.pdf), [POJK 23/2025](https://peraturan.bpk.go.id/Download/407174/POJK%2023%20Tahun%202025.pdf), [OJK, penggantian aturan SCF](https://ojk.go.id/id/berita-dan-kegiatan/siaran-pers/Pages/RDKB-Agustus-2025.aspx), [FAQ POJK 17/2025](https://ojk.go.id/id/regulasi/Documents/Pages/POJK-17-Tahun-2025-Penawaran-Efek-Melalui-Layanan-Urun-Dana-Berbasis-Teknologi-Informasi/FAQ%20POJK%2017%20Tahun%202025%20Penawaran%20Efek%20Melalui%20Layanan%20Urun%20Dana%20Berbasis%20Teknologi%20Informasi.pdf), [sandbox OJK](https://ojk.go.id/id/fungsi-utama/itsk/regulatory-sandbox/default.aspx), [BI](https://www.bi.go.id/id/publikasi/ruang-media/news-release/Pages/sp_200418.aspx), [POJK 22/2023](https://ojk.go.id/id/regulasi/Pages/Pelindungan-Konsumen-dan-Masyarakat-di-Sektor-Jasa-Keuangan.aspx), [JDIH ESDM](https://jdih.esdm.go.id/dokumen/view?id=2360).

**[R] Isu klasifikasi terpenting:** token yang memberi hak atas bunga, dividen, revenue share, atau pelunasan dapat memicu analisis efek/instrumen investasi berdasarkan substansi. Melabelinya utility atau mencatatkannya pada blockchain tidak menyelesaikan klasifikasi. Perdagangan aset kripto yang diizinkan bukan otomatis izin menerbitkan instrumen yield kepada retail.

### Pilihan struktur legal

| Struktur | Pros | Cons / syarat | Rekomendasi |
|---|---|---|---|
| Mitra SCF Indonesia berizin; instrumen dan settlement mengikuti kerangka SCF | Jalur distribusi/investor servicing yang lebih jelas | Kesesuaian revenue share, proyek/SPV, batas penggalangan dan token representation harus dikonfirmasi | **[F] Jalur scale**, belum diasumsikan cocok otomatis |
| Entitas proyek/SPV + struktur penawaran anchor yang mempunyai dasar hukum | Dapat disesuaikan dengan anchor investor dan proyek | “Invite-only” atau “private” tidak otomatis mengecualikan kewajiban izin/penawaran | **[F] Arah pilot**, struktur final mengikuti legal review |
| Wrapper luar negeri + investasi ke SPV Indonesia | Dapat memfasilitasi investor asing tertentu | Aturan distribusi negara investor, Indonesia, FX, pajak, PMA dan enforcement berlapis | Tunda; bukan shortcut regulatory arbitrage |

Contoh hubungan usulan:

```text
Investor → memiliki instrumen yang diterbitkan entitas yang berwenang
         → token mencerminkan hak dalam register/dokumen legal
SPV proyek → memiliki aset ATAU hak piutang/cash flow yang sah dan dapat dialihkan
Operator → menjalankan aset berdasarkan kontrak O&M
Off-taker/fleet → membayar ke collection account yang dikendalikan sesuai mandat
Security agent/trustee jika relevan → menjalankan hak jaminan menurut hukum
Gen-Z → origination, teknologi dan servicing sesuai izin/kemitraan
```

SPV tidak otomatis bankruptcy-remote. Periksa pemisahan aset, commingling, assignment piutang, fidusia/jaminan lain, persetujuan lender, rekening, related-party agreements, kewenangan direksi, serta siapa yang dapat mengeksekusi saat default. Token holder mungkin kreditur SPV, bukan pemilik charger. Dokumen penawaran harus menyatakannya secara eksplisit.

Legal diligence juga mencakup UU PDP dan aturan pelaksana yang berlaku, PSE bila relevan, electronic signature, AML/CFT dan beneficial ownership, pemasaran/influencer, foreign ownership, perizinan tenaga listrik/grid connection, hak lahan, izin lingkungan, keselamatan, serta tata kelola limbah baterai. Applicability per entitas dan pasal/ketentuan teknis **[perlu verifikasi]** oleh counsel; jangan menyatakan seluruhnya telah dipenuhi.

### Perpajakan

PMK 50/2025 berlaku mulai 1 Agustus 2025. DJP menjelaskan penyerahan aset kripto tidak dikenai PPN dan PPh Pasal 22 final penjual sebesar **0,21%** untuk transaksi melalui PPMSE dalam negeri serta **1%** melalui PPMSE luar negeri sesuai ketentuan pemungutannya. Jasa platform dan aktivitas lain memiliki perlakuan tersendiri. [DJP, siaran pers](https://www.pajak.go.id/en/node/117261), [PMK 50/2025](https://jdih.kemenkeu.go.id/api/download/66a7633b-9e1b-4a54-9046-5320aa96c7e1/2025pmkeuangan050.pdf)

**[R] Jangan menerapkan tarif perdagangan kripto tersebut otomatis ke bunga, dividen, revenue share, atau pelunasan RWA.** Tax memo harus memisahkan: subscription, jual/beli stablecoin, distribusi proyek, fee Gen-Z, penjualan sekunder, poin/reward, withholding investor domestik/asing, dan pajak SPV. Return dashboard harus menyatakan gross/net dan siapa pemotong pajak. Tarif serta klasifikasi final setiap arus **[perlu verifikasi]**.

### Launch gates yang tidak dapat dilewati

Sebelum dana nyata: legal classification memo; izin/kemitraan yang mencakup aktivitas; offering/investor eligibility matrix; dokumen instrumen dan penegakan hak; legal settlement rail; custody/escrow arrangement; tax memo; operator permits; complaint process; security sign-off; dan persetujuan investment committee. **Jika belum lolos, hasil yang dapat diluncurkan hanya demo tanpa dana nyata atau non-transactional discovery portal.**

### Target investor global dan country eligibility

**[F] Global merupakan target investor individu/institusi; belum ada calon anchor atau negara pilot. [R]** Pisahkan marketing publik, app/deal review setelah wallet login dan subscription setelah eligibility. Negara yang belum disetujui tidak mendapat akses subscription. Eligibility mencakup entity/residence/UBO dan instrument, bukan wallet/IP saja; copy/offers memerlukan review sebelum publikasi. Institutional/accredited bukan exemption otomatis.

[MAS guide 14 Nov 2025](https://www.mas.gov.sg/-/media/mas/sectors/guidance/guide-on-the-tokenisation-of-capital-markets-products.pdf) menekankan economic substance, syarat offering exemptions dan licensing intermediary yang terpisah. Ini contoh kebutuhan review negara investor, bukan memilih issuer Singapore. Indonesia dan negara investor tetap dianalisis bersama.

**[V] FAQ IDRX saat akses 12 Okt** mengecualikan beberapa negara support, termasuk USA; business accounts memerlukan approval. Scope entity/UBO, foreign bank/omnibus dan custody belum terkonfirmasi. Jangan menyamakan wallet bisa menerima IDRX dengan investor eligible atau direct mint/redeem tersedia. [IDRX FAQ](https://idrx.co/en/). Diligence dan rencana discovery ada pada [pre-pilot global](pre-pilot-2026-10-12.md).
