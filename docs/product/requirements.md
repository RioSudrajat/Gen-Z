# Requirements MVP

**Status: scope dikonfirmasi founder 17 Oktober; chain diperbarui ke Base 18 Oktober; arah lifecycle RWA diterima 20 Oktober.** Versi dokumentasi 1.1-base dipertahankan. [PRD](../PRD.md) merangkum tujuan/scope; daftar berikut mempertahankan 22 user stories sumber. Kriteria tambahan tidak berarti implementasi atau tes kontrak sudah tersedia.

Sumber pemisahan: [dokumen asal](../archive/mvp-spec-2026-10-18.md). Dipisahkan 18 Oktober 2026; label [F]/[R]/[A]/[O]/[V] mengikuti [panduan](../CONTRIBUTING.md).

## User Stories

1. Pengunjung memahami peran Gen-Z, tahap produk dan dua jalur Discuss your asset serta Launch app.
2. Operator mengirim profil, kontak, kategori/lokasi/status aset dan kebutuhan pembiayaan melalui inquiry yang benar-benar tercatat server dan mempunyai referensi.
3. Operator mengetahui status penerimaan, screening dan kekurangan bukti; intake awal tidak meminta dokumen sensitif pada contact publik.
4. Reviewer menautkan bukti kewenangan, kontrak, operasi dan kas ke proyek/periodenya sebelum publikasi.
5. Pengguna membuktikan kontrol wallet untuk memperoleh sesi app; wallet login tidak menyatakan KYC, eligibility atau privilege admin.
6. Pengguna login menjelajahi kategori Energy/Infrastructure, satu demo aktif serta showcase Coming soon yang tidak dapat diinvestasikan.
7. Investor memahami perbedaan aset fisik, offering/series, issuer dan token/hak kontraktual.
8. Investor membaca identitas operator, terms, risiko, laporan dan dokumen inti yang disetujui setelah login sebelum investasi, tanpa eligibility transaksi sebagai syarat membaca.
9. Investor mengetahui alasan redaksi atau pembatasan original sensitif, serta versi/sumber/status dokumen.
10. Admin mengisi fakta bertipe dan konten blok pada tujuh tab dengan bentuk editorial fleksibel; angka finansial utama berasal dari model terstruktur.
11. Investor melihat model hak, fixed/variable basis, gross/net, biaya, tenor, jadwal serta hak principal/expiry jika berlaku.
12. Investor melihat calculator sebagai skenario dengan asumsi eksplisit, terpisah dari performance/distribusi aktual.
13. Investor melihat produksi/usage, invoice, kas diterima dan distribusi sebagai catatan berbeda dengan periode, unit dan sumber.
14. Investor mengetahui missing/overdue/stale, coverage dan status koneksi; data hilang bukan pengukuran nol.
15. Investor membaca laporan bulanan reviewed dan histori koreksi; telemetry provisional dapat tampil dengan label saat integrasi siap.
16. Peserta demo memilih input IDRX atau native USDC, meninjau quote/biaya/expiry/net IDR rights, lalu memperoleh allocation setelah net settlement.
17. Investor melihat posisi, riwayat pembayaran serta principal/income hanya jika model mendefinisikannya; seluruh distribusi tidak otomatis disebut profit.
18. Investor claim hanya hak miliknya yang didukung dana distribusi tersedia; estimasi atau sensor tidak menciptakan claimable balance.
19. Pengguna memahami kegagalan, quote expired, dana pending, refund, overdue serta claim gagal tanpa kehilangan jejak status.
20. Reviewer/admin dapat menelusuri collection → perhitungan hak → approval → pendanaan distribusi → claim/receipt dengan histori perubahan dan akses terverifikasi.
21. Pengguna membuka Rewards, Points dan Gen-Z Token sebagai halaman informasi/Coming soon dan memahami perbedaannya dari hak proyek.
22. Pengguna dapat menjalani alur pada mobile, keyboard, focus/error feedback dan reduced motion, termasuk empty/error/unavailable states.

## Out of Scope

- Dana investasi live, penerbitan instrumen legal, payout nyata atau klaim kesiapan regulator dari spec ini.
- Swap, lending/borrowing, staking, secondary trading, instant exit dan transfer rutin antarinvestor.
- Functional rewards/points/redemption/reversal, TGE, konversi otomatis points ke token, serta integrasi banyak partner/AI reward.
- Portal operator self-service penuh; MVP memakai assisted intake dan review minimum.
- IoT/hardware wajib untuk semua proyek atau klaim feed live tanpa akses yang nyata.
- Mengunci persentase, APY, fee, principal/expiry dan maturity proyek nyata dari benchmark atau contoh sintetis.

## Acceptance dan prioritas fase

**P0-D:** wajib demo pertama; **P0-T:** sebelum functional testnet dinilai selesai; **P0-L:** sebelum dana nyata; **P1/P2:** ditunda setelah core/dependency siap. Semua baris berikut adalah kriteria implementasi yang akan diuji, bukan test result.

| ID / Fase | User story | Acceptance |
|---|---|---|
| M01 P0-D | Pengunjung memahami produk dan menghubungi tim | Marketing menjelaskan peran/stage dan dua CTA; inquiry valid tersimpan server+reference lalu notifikasi; invalid/retry/duplicate/failure tidak menghilangkan record |
| M02 P0-D | Founder/admin screening inquiry | Akses terbatas; status/needed evidence tercatat; tidak meminta dokumen sensitif pada contact; no marketing otomatis; uji clock 90 hari untuk inactive deletion/active review |
| M03 P0-D/T | User memperoleh sesi wallet | Proof server sejak D0, valid/rejected/expired/replay diuji; connected saja tidak login; sesi berbeda dari KYC/role/eligibility |
| M04 P0-D/T | Login membaca bukti sebelum investasi | Tanpa sesi app/API/download/cache terlindungi; login tanpa eligibility bisa membaca tujuh tab+approved investor copies; original/akun lain/admin tetap restricted |
| M05 P0-D | Investor menjelajahi demo | Energy/Infrastructure; satu solar hybrid active_demo, lainnya Coming soon; transaksi/angka/dokumen sintetis jelas; direct checkout Coming soon diblokir |
| M06 P0-D/T | Admin mengelola tujuh tab | Structured facts+typed blocks; draft terms/report tidak tampil sebelum review; koreksi versi/reason/history; CMS tetap pilihan implementasi |
| M07 P0-D/T | Investor memahami model hak | Fixed/variable, gross/net, fees, tenor, schedule dan principal/expiry eksplisit; calculator forecast terpisah actual; model/table/chart/portfolio dapat direkonsiliasi |
| M08 P0-D/T | Peserta memilih input IDRX/USDC | Quote/expiry/min_net/fees/net IDR rights; versioned consent+eligibility sandbox; wrong chain/token contract dan stale quote ditolak; reconsent jika berubah |
| M09 P0-D/T | Investor mendapat posisi setelah settle | Input confirmed/conversion/net settled/allocated berbeda; duplicate/concurrent/cap tidak menggandakan hak; synthetic bukan issuance on-chain |
| M10 P0-D/T | Investor menelusuri reporting dan kas | Produksi/invoice/collection/distribution terpisah; period/unit/source/coverage/freshness; monthly reviewed; provisional/missing/stale bukan nol atau claimable |
| M11 P0-D/T | Investor claim hak yang funded | Collection → calculation → approval → funding → claim → receipt; no entitlement/no funds/wallet lain/duplicate tidak membayar; failed/pending dapat ditelusuri tanpa double send |
| M12 P0-D/T/L | Finance menangani exception | Expired/pending/conversion failure/closing failure/refund/shortfall/overdue/claim failure tersimpan; no mint+full refund; gagal pembayaran tetap liability |
| M13 P0-D/T/L | Reviewer/admin bekerja sesuai mandat | Server resource checks, audit/history, revoked sessions; demo actor separation berlabel; live maker-checker/signers sesuai mandat nyata |
| M14 P0-T/L | Pemulihan menjaga hak investor | Recovery Base direview: same-owner/issuer approval, old representation disabled sebelum replacement; accrued entitlements tidak hilang/ganda; bukan recovery private key |
| M15 P0-L | Live memenuhi dependency aktual | DD/operator/data permission, legal wrapper, allowed countries/person/entities, identity/custody/FX, executable routes, payout/refund terms, security/continuity dan operation mandate nyata |
| M16 P0-D | User membuka Rewards/Points/Token | Semua setelah login sebagai informasi/Coming soon, tanpa saldo/award/redemption/conversion/stake fiktif |
| M17 P0-D/T | User menjalani alur dengan aksesibel | Mobile/keyboard/focus/error feedback/reduced motion dan empty/loading/error/unavailable diuji pada flow utama |

Penajaman [lifecycle 20 Oktober](../engineering/rwa-lifecycle.md): M07 memisahkan unit, income, capital recovery dan principal jika berlaku; M09 menguji mint sesudah settlement/closing dan cap tidak otomatis pulih karena burn; M11/M12 mempertahankan funded entitlement/accrued unpaid saat tenor berakhir; M13/M14 menguji authority mint/burn/recovery, old binding serta claimed history. Income atau capital recovery tanpa pengakhiran hak tidak membakar unit. Burn sebelum payout memerlukan payable pengganti yang persisten dan terdanai. Ini acceptance target, bukan endpoint/ABI baru atau perluasan ke redemption terbuka.

**Pemetaan ke Testing Decisions spec 17 Oktober:** butir 1 → M01–M02; 2 → M03–M04; 3 → M05, M07–M11; 4 → M11; 5 → M06, M10; 6 → M07–M09, M12; 7 → M16–M17. Invariant access/financial tetap diuji hingga persistence/domain result yang relevan.

## Aturan produk terkait

Scope dan disclosure: [PRD](../PRD.md). Hak/denominasi/keuangan: [finance](finance.md). Akses dan retensi: [security](../SECURITY.md). Keputusan serta dependency asal: [register](decisions.md). Rancangan transisi: [flows](../engineering/flows.md). Cara membuktikan acceptance: [testing](../TESTING.md).
