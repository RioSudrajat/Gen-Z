> **Arsip per 18 Oktober 2026.** Isi dipertahankan sebagai riwayat; dapat memuat keputusan yang tergantikan dan snapshot berbeda. Acuan aktif: [indeks dokumentasi](../README.md), [PRD](../PRD.md), [requirements MVP](../product/requirements.md).

# Brief demo pre-pilot Gen-Z

> **Status arsip, diperjelas 18 Oktober 2026:** isi berikut menyimpan riset/jawaban pada tanggal asal. Acuan implementasi aktif ialah [spec v1.1-base](mvp-spec-2026-10-18.md), [PRD v2.1](prd-2026-10-18.md) dan [riset Base/EVM 18 Oktober](../research/base-evm-2026-10-18.md). Founder memilih Base kembali pada 18 Oktober; pilihan itu tidak memulihkan mock wallet D0, katalog privat tanpa login, note wajib atau simulated rewards. Scope aktif: proof wallet sejak demo pertama, model per offering/solar hybrid, tujuh tab, funded claim dan rewards informational. Angka/vendor/standar/terms historis di bawah bukan keputusan produksi baru.

**Versi:** 1.2, 12 Oktober 2026. **Status:** founder memilih interactive investment core + simulated partner/rewards; quoted IDRX/USDC input ke hak IDR. Ini functional brief; implementation belum dilakukan. Sumber keputusan: [PRD](prd-2026-10-18.md), [catatan founder](founder-interview-2026-10-17.md), [app architecture](app-architecture-2026-10-18.md).

## 1. Outcome dan pengguna

**[F] Bahasa produk:** bilingual Inggris–Indonesia, English-first. **[R]** Versi demo pertama memakai English; Bahasa Indonesia menyusul sebagai locale kedua. Struktur teks disiapkan sejak awal untuk dua bahasa. Sebelum locale Indonesia tersedia, jangan menyediakan language switch yang tampak aktif tetapi tidak bekerja. PRD/panduan operator tetap Bahasa Indonesia.

**[F] Scope terpilih:** persona reward pengguna layanan mitra; investment core interaktif simulated→testnet + simulated partner. Dashboard overview poin, Assets Energy/Infrastructure dengan satu interactive demo asset dan showcase lain Coming soon, Portfolio, Rewards dan Gen-Z Token pre-launch. Dua input IDRX/native USDC dengan quoted conversion ke hak IDR untuk kas IDR telah dipilih. [Schema/acceptance](schema-flows-2026-10-18.md), [research evidence](../research/market-features-2026-10-12.md).

**[F] Founder fokus product/partnership**, dibantu coding tools untuk demo. Institutional/family-office investors yang eligible menjadi prioritas discovery global; qualified individual kandidat sekunder. Belum ada mitra/aset, calon anchor atau tim pasti.

**[F] Tujuan pertama:** validasi calon operator dan anchor investor, dengan kejelasan proyek, hak, cash flow dan bukti minat sebagai prioritas. **[R] Outcome:** mereka dapat menjelaskan hak note, sumber pembayaran, risiko, keterbatasan exit, serta perbedaan income/pokok setelah melihat satu proyek simulated. Demo membantu discovery; pujian atas tampilan tidak dianggap investment demand.

**[F] Batas sumber daya:** founder menyediakan 2–4 jam per hari, tanpa alokasi cash budget; free-first untuk demo hingga testnet. Jika tujuh hari, kapasitas nominal 14–28 jam per minggu termasuk discovery/review. **[R]** Bangun D0 lokal dahulu, tanpa dependency berbayar; cek kelayakan layanan gratis saat dipilih. Waktu engineering aktual dan quota coding tools tidak diasumsikan tanpa batas.

Pertanyaan validasi: informasi apa yang kurang untuk menilai proyek; apakah IDR exposure, input IDRX/USDC, conversion dan custody dapat diterima; data apa yang mampu dibuka operator; apakah pekerjaan origination/servicing bernilai bagi mitra. Proposal terms final menunggu actual data.

## 2. Scope D0: investment core interaktif + simulated partner

| Area | Konten/behavior [R] |
|---|---|
| Assets & project detail | Energy/Infrastructure showcase; satu interactive demo asset/offering, lainnya Coming soon; capacity/technology berlabel; belum ada operator/PPA nyata |
| Rights & risks | Kandidat amortizing project note, issuer role, IDR denomination, dua input IDRX/USDC Base dan conditional conversion, closed-end, default/FX/rail risks |
| Data room checklist | Daftar dokumen diperlukan dan status simulated/missing; tidak membuat kontrak atau insurance seolah tersedia |
| Financial scenario | Initial principal, scheduled/received principal, income, outstanding dan late/default scenarios terpisah |
| Investor position | Satu posisi simulated; distribusi actual pada demo selalu berlabel simulated, bukan saldo investasi live |
| Operator report example | Meter/invoice/collection evidence sebagai tiga konsep; contoh data tidak membuktikan kas nyata |
| Discovery feedback | Pertanyaan untuk interview operator/investor; tidak memesan instrumen atau menerima komitmen dana |
| Account / wallet / role flow | Auth simulation ke user/operator/admin, dengan seeded scopes; D1 proof wallet sesungguhnya dan server grants |
| Subscription | IDRX/USDC quote/fees/net IDR rights → payment/conversion/settled/allocation/refund state simulation |
| Dashboard & rewards | Points overview, satu mock partner/account link, completed+paid+attributed transactions, points pending/available/redeemed/reversed |
| Native navigation | Gen-Z pre-launch utility/governance explanation; tidak buy/stake/native conversion |
| Operator/admin | Evidence upload, collection review, payout/refund approval dan exception walkthrough; live maker-checker tidak dibuktikan oleh role switch founder |

D0 memakai wallet/identity/checkout/partner/quotes simulated, bukan live KYC/mainnet/funds. Reward points simulation wajib scope demo terpilih; native conversion tidak ada. Stack baseline testnet tetap Next.js/TypeScript + PostgreSQL + worker; Solidity/OpenZeppelin/Foundry di Base. D0 fixture/adapters dapat ringan tanpa database/RPC; API/database jika diperlukan diisolasi ke demo environment. [Route/API manifest](app-architecture-2026-10-18.md).

Flow:

```text
Landing → auth simulated → authorized user/operator/admin workspace
→ user dashboard → Assets → active demo asset → rights/risks/docs
→ IDRX/USDC quote/checkout → settled/allocation simulation → Portfolio
→ operator collection report → admin servicing review → payment/late/default/refund
→ simulated partner link → completed/paid/attributed service → points/reversal
→ overview points + native informational page + discovery feedback
```

## 3. Model keuangan contoh

**Seluruh angka [A], bukan quote, target yield atau proyek nyata.** Contoh dua semester: principal awal Rp100 juta; tingkat nominal contoh 10%/tahun sederhana, 5% per semester atas outstanding awal periode. Income di bawah sebelum fee/tax; quotation belum ada. Nilai ini hanya fixture untuk memeriksa accounting demo, bukan target ticket institutional investor.

| Periode | Outstanding awal | Principal repaid contoh | Income contoh | Total kas contoh | Outstanding akhir |
|---|---:|---:|---:|---:|---:|
| Semester 1 | Rp100 juta | Rp50 juta | Rp5 juta | Rp55 juta | Rp50 juta |
| Semester 2 | Rp50 juta | Rp50 juta | Rp2,5 juta | Rp52,5 juta | Rp0 |
| Total | — | Rp100 juta | Rp7,5 juta | Rp107,5 juta | Rp0 |

`Outstanding = initial principal − principal repayments yang diterima/dicatat.` Income tidak menurunkan principal. Scheduled amount berbeda dari received amount. Total Rp107,5 juta bukan seluruhnya profit; Rp100 juta adalah pengembalian pokok. Nominal interest rate bukan otomatis effective annual yield/APY atau net return.

Saat pembayaran terlambat, displayed received cash tidak bertambah hanya karena jadwal jatuh tempo. Partial payment allocation, fee/tax, default recovery dan accrual mengikuti scenario assumptions yang terlihat; live waterfall menunggu terms. Perubahan scenario tidak mengklaim data operator berubah.

IDR adalah denominasi model. USD display jika ditambahkan hanya indikatif, dengan FX assumption/timestamp; tidak ada jaminan hasil USD. Label IDRX merupakan arah settlement bila kas IDR dan provider feasible, bukan bukti tersedia untuk semua global investors.

## 4. Acceptance criteria D0

1. Setiap proyek, posisi, dokumen dan angka simulated jelas ditandai; tidak ada partner, audit atau izin palsu.
2. Overview menjelaskan issuer memberi hak; Gen-Z origination/servicing, tanpa blanket guarantee semua proyek.
3. Principal/income/totals konsisten dengan fixture, termasuk outstanding setelah partial principal repayment.
4. Pengguna dapat membedakan due/received, collection evidence/meter dan income/pokok.
5. Skenario late/default memperlihatkan gap/loss, tanpa membayar dari kas yang tidak ada.
6. Closed-end/transfer restrictions dan risiko kehilangan modal terlihat di konteks hak proyek.
7. Data room berstatus checklist/simulated, bukan klaim independent DD selesai.
8. Discovery feedback tidak berupa subscription/deposit atau promosi terms live.
9. Review operator/investor dapat menghasilkan temuan spesifik tentang kebutuhan, currency, custody dan evidence.
10. Coming soon tidak menerima checkout/allocation, termasuk direct URL/API; label demo terlihat pada showcase dan saldo.
11. Dashboard points sama dengan ledger history; duplicate/refund/redeem-failure tidak membuat reward ganda atau hilang tanpa record.
12. Scope user/operator/admin terpisah; native page tidak menyiratkan TGE/buy/stake; prototype API tidak memberi privilege dari input browser.

Visual direction, assets brand dan layout belum dipilih dalam brief ini. Sebelum UI implementation, ikuti routing skill proyek serta accessibility/responsive verification yang berlaku. Tidak mengarang logo atau testimonial sebagai bukti traction.

## 5. D1: testnet prototype setelah scope/capacity siap

**[R]** Satu pool proyek, wallet existing investor, restricted ERC-20 per proyek. Trial entitlement memerlukan mock KYC/eligibility yang diberi label. Gunakan **Mock IDRX + test USDC — testnet/no financial value** dan simulated conversion quote, bukan bukti route live. Ledger, allocation dan record dates jelas; normal/late/refund/default/recovery diverifikasi dengan test funds.

Prototype policy dalam mandat PM: transfer rutin ditutup; same-owner recovery dan assignment exception melalui issuer approval workflow. Recovery mempertahankan principal/entitlements; tidak memulihkan private key atau stablecoin yang hilang. Contract admin roles/signers belum dipilih untuk issuer actual.

D1 memerlukan engineering capacity dan review; timeline/hosting/provider versions/quote belum dikunci. Upgrade/security decisions tidak diisi otomatis dari demo D0. Dokumen ini tidak mengotorisasi deployment atau publikasi.

## 6. Dependencies yang tetap terbuka

- Operator/project, actual collection data, permits, PPA/offtake currency/terms, engineering/credit DD.
- Actual anchor/country/qualification/ticket, IDRX/ramp/custody acceptance dan legal offering route.
- Issuer/SPV, security/contract classification, enforceability, tax, note terms/collateral/reserves.
- Founder 2–4 jam/hari dan demo free-first telah diketahui; kapasitas engineering/review, biaya counsel/credit/security dan continuity servicing live belum tersedia/di-quote.
- Palette Nemesis dipilih [F], dicatat di [DESIGN](../../DESIGN.md); theme default, typography dan layout masih perlu arah sebelum implementation. Tidak menahan dokumentasi functional brief.

**Completion D0:** simulated model dan rights dipahami, accounting konsisten, feedback terdokumentasi. **Completion finance pilot:** actual counterparties, lawful/feasible fund flow, DD, docs, security dan operations siap. Kedua completion criteria tidak disamakan.
