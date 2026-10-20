# PRD Gen-Z

**Produk:** platform investasi aset infrastruktur energi produktif milik mitra Indonesia, untuk individu dan institusi global yang memenuhi eligibility.

| Metadata | Nilai |
|---|---|
| Pemilik scope | Founder Gen-Z |
| Tahap | Pre-pilot; satu demo investasi sintetis → testnet |
| Baseline keputusan | Scope dikonfirmasi 17 Oktober 2026; Base/EVM dipilih 18 Oktober |
| Pembaruan dokumen | 20 Oktober 2026, Asia/Jakarta; arah lifecycle token RWA diterima, implementasi tetap terpisah |
| Detail requirement | [M01–M17 dan 22 user stories](product/requirements.md) |

## 1. Masalah dan peluang produk

Mitra aset membutuhkan jalur pembiayaan dengan bukti kewenangan, kontrak, operasi dan kas yang bisa diperiksa. Investor membutuhkan kejelasan mengenai aset, operator, penerbit, hak, risiko dan sumber pembayaran sebelum berinvestasi, lalu posisi dan distribusi yang konsisten sesudahnya.

Gen-Z menghubungkan origination, kurasi, pelaporan dan servicing. Aset fisik, proyek, offering/series, issuer serta token hak investor memiliki arti berbeda. Gen-Z tidak otomatis menjadi pemilik aset atau penanggung kewajiban proyek. Konteks pasar dan sizing dipisahkan ke [riset](research/market-context-2026-10-18.md); belum menjadi bukti demand atau traction.

## 2. Pengguna dan outcome

| Pengguna | Kebutuhan utama | Outcome MVP |
|---|---|---|
| Mitra aset/operator | Menjelaskan aset dan kebutuhan pembiayaan | Inquiry tercatat dengan referensi, lalu assisted screening |
| Investor individu/institusi | Memahami hak, bukti, risiko dan pembayaran | Menjalani demo dari review offering sampai funded claim |
| Founder/admin/reviewer | Memeriksa bukti dan menjaga konsistensi publikasi/keuangan | Akses sesuai mandat, review dan histori dapat ditelusuri |

Target investor global tidak membuka subscription untuk semua negara. Persona dan prioritas sourcing merupakan [hipotesis strategi](product/strategy.md). Baseline belum memiliki mitra/aset/anchor nyata; jangan mengubah status itu tanpa bukti baru.

## 3. Tujuan dan ukuran berhasil

**Tujuan pre-pilot:** membuktikan alur dapat dipahami, hak/data/angka konsisten, dan pekerjaan operator serta investor layak divalidasi lebih lanjut.

| Tujuan | Bukti yang dikumpulkan | Syarat minimum MVP [R] |
|---|---|---|
| Inquiry dapat ditindaklanjuti | Reference, record server, delivery/screening status | Sukses hanya sesudah commit; retry/notifikasi gagal tidak kehilangan inquiry |
| Investor memahami hak | UAT: peserta menjelaskan rights, biaya, risiko dan principal/expiry | Catat kebingungan; target peserta/persentase belum disepakati |
| Siklus investasi konsisten | Jejak quote → settlement → allocation → funded claim → receipt | Kasus M08–M12 direkonsiliasi; hak/dana tidak tercipta ganda |
| Bukti dapat dipercaya sesuai status | Versi/sumber, review, freshness/coverage dan redaksi | Draft/unknown tidak disajikan sebagai approved/aktual/nol |
| Ada dasar discovery bisnis | Akses data, percakapan operator/investor, quote biaya aktual | Hasil dicatat; jumlah/tanggal target belum ditetapkan |

Definisi metrik lintas fase ada di [metrics](product/metrics.md). Data demo tidak dihitung sebagai funded AUM, pendapatan, mitra aktif atau realized yield.

## 4. Scope MVP yang disepakati [F]

| Area | Perilaku wajib | Acceptance |
|---|---|---|
| Entry dan intake | Marketing publik; Discuss your asset; inquiry server + reference, satu inbox, screening dan retensi | M01–M02 |
| Login dan akses | Proof wallet sejak demo pertama; seluruh workspace, katalog/detail dan dokumen memerlukan sesi | M03–M04, M13 |
| Katalog dan detail | Energy/Infrastructure; satu solar hybrid sintetis; showcase lain Coming soon dan tidak investable | M05 |
| Editorial dan bukti | Tujuh tab tetap; structured facts + blok tervalidasi; terms/laporan direview dan versioned | M06, M10 |
| Hak dan model | Model per offering; calculator skenario, fixed/variable, gross/net, fee, tenor dan principal/expiry eksplisit | M07 |
| Investasi demo | Quote IDRX/native USDC → consent/eligibility sandbox → net settled IDR rights → allocation/portfolio | M08–M09, M12 |
| Distribusi dan claim | Collection → perhitungan hak → approval → funding → owner claim → receipt | M10–M12 |
| Informasi ekspansi | Rewards, Points, Gen-Z Token sebagai informasi/Coming soon | M16 |
| Kualitas alur | Mobile, keyboard/focus, errors, reduced motion dan state kosong/loading/unavailable | M17 |

Tujuh tab: **Overview; Asset & Operator; Deal Terms; Performance & Data; Reports & Updates; Risks; Documents.** Calculator ada di Deal Terms; Impact di Performance & Data. Approved investor copies tersedia setelah login sebelum eligibility transaksi; original sensitif memakai izin tersendiri.

Demo pertama solar hybrid pembayaran tetap + partisipasi pendapatan variabel. Semua angka, dokumen dan transaksi demo ditandai sintetis. Hybrid merupakan fixture demo; proyek nyata memilih model dan terms tersendiri. [Finance](product/finance.md) menjelaskan aturan hak dan settlement.

Keputusan 20 Oktober: restricted token per offering/series, unit partisipasi tetap, income/modal terpisah, mint setelah net settlement/closing dan burn mengikuti penyelesaian hak. Expiry tidak menghapus accrued unpaid claims; data enforcement on-chain direkonsiliasi dengan evidence/calculation privat. [Lifecycle](engineering/rwa-lifecycle.md), [D32–D36](product/decisions.md) dan [ADR 0004](adr/0004-project-rights-lifecycle.md) menjelaskan arah accepted yang belum diimplementasikan. Ini tidak menetapkan principal guarantee, terms nyata atau fitur exit baru.

## 5. Alur utama dan guardrail

Investor: marketing → proof wallet/sesi → Assets/tujuh tab → terms, bukti dan risiko → eligibility → quote/consent → input/conversion → net settlement → allocation/portfolio → laporan/distribusi → funded owner claim/receipt.

Operator: contact → inquiry server + referensi → notifikasi → assisted screening → bukti sensitif melalui kanal privat → review proyek/publikasi.

- Login membuktikan kontrol wallet; grant admin, kewenangan institusi dan eligibility ditetapkan terpisah di server.
- Input confirmed belum berarti net settlement; allocation menunggu net settlement dan closing sesuai terms.
- Produksi, invoice, kas diterima dan distribusi merupakan catatan berbeda. Forecast/telemetry tidak membuat claimable balance.
- Closed-end, tanpa janji exit instan atau redemption pokok otomatis. Hak principal/expiry ditentukan per offering.
- Monthly reviewed report menjadi fallback; API/IoT ditambahkan bila feasible, dengan missing/stale/coverage terlihat.
- Inquiry tidak berlanjut dihapus 90 hari sejak interaksi terakhir; inquiry aktif direview tiap 90 hari; tidak otomatis masuk marketing. Retensi ledger/bukti investasi terpisah.

## 6. Di luar MVP

Dana/payout live, penerbitan legal, functional rewards/points, TGE/konversi poin, swap, lending/borrowing, staking, secondary trading, transfer rutin, instant exit, multichain, portal operator self-service penuh, serta IoT wajib. Scope tidak menetapkan APY, fee, bentuk hukum atau pengembalian pokok proyek nyata.

## 7. Constraint, asumsi dan dependency

Astro marketing; Next.js/TypeScript app/auth; Base/EVM. Demo memakai proof wallet nyata dan transaksi investasi simulated; testnet setelah engineering review. English-first, kemudian Indonesia. Baseline founder 2–4 jam/hari, free-first hingga testnet; tidak ada tanggal delivery baru.

CMS, conversion/payout/refund provider, kontrak produksi dan mandat custody belum dipilih. Live membutuhkan counterparties dan izin data, issuer/legal/country eligibility, identity/KYC/KYB, FX/custody, terms payout/refund, security dan operasi nyata. Detail pemilik/tindak lanjut: [risiko dan dependency](product/risks-and-dependencies.md).

## 8. Status dan rujukan

Inspeksi source 18 Oktober: marketing Astro, satu platform Next.js, SIWE Base Sepolia, sesi PostgreSQL dan Drizzle tersedia. Resource authorization, inquiry persisten/outbox, offering/editorial publication, investment lifecycle dan worker handlers belum dibuat. [Roadmap](ROADMAP.md) membedakan fondasi tersedia dari milestone target; [Testing](TESTING.md) menetapkan bukti kelulusan.

Alasan teknis ada di [ADR](adr/README.md); keputusan produk di [register](product/decisions.md); riwayat lengkap di [PRD arsip](archive/prd-2026-10-18.md). PRD ini tidak menggantikan hasil uji atau legal review.
