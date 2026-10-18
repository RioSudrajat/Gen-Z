# Register keputusan produk

**Status: pencatatan ulang keputusan/dependency yang sudah ada.** Bukan keputusan produk baru. [F] berbeda dari rekomendasi [R] dan kebutuhan [O]; alasan pilihan arsitektur tersendiri ada di [ADR](../adr/README.md).

Sumber pemisahan: [dokumen asal](../archive/prd-2026-10-18.md). Dipisahkan 18 Oktober 2026; label [F]/[R]/[A]/[O]/[V] mengikuti [panduan](../CONTRIBUTING.md).

## Keputusan, asumsi dan dependency

### Register keputusan founder dan dependency

| ID | Topik | Status | Langkah berikutnya / batas |
|---|---|---|---|
| D01 | Gen-Z; aset Indonesia lalu ASEAN; investor individu/institusi global | [F]; countries [O] | Eligibility/offer per negara, bukan izin dunia tunggal |
| D02 | Energy/Infrastructure, aset mitra operasional berkontrak | [F] baseline | Demo solar hybrid tidak memilih proyek nyata atau membatasi semua aset ke solar |
| D03 | Satu proyek satu pool, offering/series/issuer terpisah dari aset | [F/R] | Ring-fencing hukum/accounting dan prior obligations harus eksplisit |
| D04 | Project rights, points dan native utility/governance berbeda | [F] | Native bukan saham/revenue perusahaan atau yield proyek |
| D05 | Subscription stablecoin IDRX/native USDC | [F] | Net settled IDR rights untuk kas IDR; tidak auto fallback produk IDR bank-only |
| D06 | Anchor discovery, SCF scale baseline | [F]; actual countries/ticket/route [O] | Target individu/institusi global tetap, anchor bukan exemption hukum |
| D07 | Belum ada actual partner/project/anchor pada baseline | [F] | Sourcing, izin data, prescreen dan investor discovery |
| D08 | Ekonomi eksplisit per offering; hybrid/revenue participation dibuka | [F] 17 Oktober | Solar hybrid fixed+variable demo; note bukan default wajib; actual wrapper/terms [O] |
| D09 | Fees/tenor/schedule/principal/expiry/gross-net | Kewajiban disclosure [F]; nilai nyata [O] | Fixture sintetis dalam rancangan teknis; tidak mengunci APY/principal guarantee |
| D10 | Closed-end dan transfer rutin tertutup | [F]/mandat baseline | Tidak menjanjikan instant exit; Base recovery/exception produksi direview |
| D11 | Quoted IDRX/native USDC → hak IDR | [F]; provider/capacity/payout/refund [O] | Fees/min_net/expiry/consent dan allocation sesudah net settlement |
| D12 | Rewards/Points/Gen-Z Token informational/Coming soon | [F] 17 Oktober | Functional rewards/account linking/redemption/reversal/TGE/konversi ditunda |
| D13 | Usage-first/service/payment/account attribution | Konteks ekspansi baseline | Tidak diimplementasikan sebagai simulated reward P0-D |
| D14 | Governance/upgrade/emergency/signing mandates | [O] live | Tidak membatalkan hak offering; actor independence nyata |
| D15 | Astro marketing; Next.js/TypeScript app/auth; Base/EVM | [F] chain diubah 18 Oktober | PostgreSQL/storage/worker baseline; wagmi/viem/SIWE/Solidity/OpenZeppelin/Foundry [R], production standard/vendors/versions [O] |
| D16 | Origination + servicing | [R] dalam mandat | Fee/payer/minimum deal size/continuity budget actual [O] |
| D17 | Issuer/legal wrapper, permitted countries/identity/custody/FX | [O] live | Menunggu counterparties/data; tidak dijawab dengan angka/entitas fiktif |
| D18 | Founder 2–4 jam/hari, free-first hingga testnet | [F] baseline | Engineering/review/funding live [O]; tidak ada tanggal baru |
| D19 | Green/renewable-supporting energy | [F] baseline | Impact perlu metode/source; telemetry bukan bukti kas atau zero-emission |
| D20 | KPI/risk appetite/concentration/thresholds | [O] proyek/live | Tetapkan dari underwriting/ops, bukan benchmark atau fixture |
| D21 | Satu solar hybrid demo; showcase Coming soon | [F] 17 Oktober | Investment core→portfolio→distribution→funded claim; full operator portal ditunda |
| D22 | Demo memvalidasi kejelasan hak/bukti dan calon stakeholder | [F]/acceptance [R] | Jangan menganggap pujian UI atau simulation sebagai investment commitment |
| D23 | English-first kemudian Indonesia | [F] baseline | Model/terms/angka lintas bahasa konsisten, tanpa switch kosong |
| D24 | Nemesis mint/teal dan netral baseline | Referensi [F] | [DESIGN](../../DESIGN.md); bukan klaim bisnis referensi |
| D25 | Wallet proof/sesi sejak D0; seluruh app setelah login | [F] 17 Oktober | Server resource/API/download/cache checks; login bukan role/KYC/eligibility |
| D26 | Tujuh tab + facts/block editor | [F] 17 Oktober | Calculator di Deal Terms; Impact di Performance & Data; CMS belum dipilih |
| D27 | Approved core investor copies sebelum eligibility transaksi | [F] 17 Oktober | Original sensitif permission tersendiri; redaction reason/version/source/status |
| D28 | Monthly reviewed, API/IoT feasible, provisional berlabel | [F] 17 Oktober | Freshness/coverage/missing/overdue/stale/koneksi; no missing=zero atau sensor-to-claim |
| D29 | Inquiry server+reference, notifikasi satu inbox, assisted screening | [F] 17 Oktober | Failure notifikasi bukan failure penerimaan; no public sensitive docs/no auto marketing |
| D30 | Inquiry inactive delete 90 hari; active review 90 hari | [F] 17 Oktober | Sejak last interaction untuk inactive; provider/inbox/backup config [O]; ledger/bukti investasi terpisah |
| D31 | Claim hak sendiri yang funded, receipt traceable | [F] 17 Oktober | Approval/funding/claimable/claimed dipisah; concurrent/retry/unknown tidak double pay |

### Dependencies dan pemilik kerja

| Dependency | Owner yang diusulkan | Bukti siap |
|---|---|---|
| Operator bersedia membuka data dan collection | Founder/partnership | Data access agreement, dataset dan statement |
| Legal route feasible | Counsel/compliance | Memo dengan scope aktivitas, investor dan izin |
| Proyek layak secara teknis/keuangan | Energy engineer/credit | DD report, downside model, investment committee sign-off |
| Settlement/custody tersedia | Finance/engineering | Kontrak, sandbox test, payout/refund flow dan SLA |
| Kas operasi platform tersedia | Founder/finance | Runway dan budget audit/servicing, tanpa native-token proceeds wajib |
| Security dan business continuity | Engineering/security | Audit closure, recovery drill dan backup servicing |

**Asumsi paling berbahaya:** demand energi nasional berarti setiap charger laku; proyek yang menghasilkan kWh pasti menerima uang; token berarti kepemilikan aset; stablecoin rupiah berarti alat pembayaran rupiah; liquidity pool berarti exit dijamin; dan reward berarti retention incremental. Seluruhnya harus diuji atau dibatalkan sebelum scale.
