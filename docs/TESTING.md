# Testing dan acceptance

**Baseline:** 18 Oktober 2026. Ini strategi dan gate verifikasi. Hasil sesi sebelumnya ada di [history](history/README.md); reorganisasi dokumentasi tidak menjalankan ulang build, database, browser atau kontrak investasi.

## 1. Traceability

PRD menyatakan scope, [requirements](product/requirements.md) menyimpan acceptance M01–M17, dan test report menyatakan lingkungan serta hasil. Jangan menandai requirement selesai hanya karena schema, halaman atau endpoint stub tersedia.

| Acceptance | Pembuktian utama | Batas saat ini |
|---|---|---|
| M01–M02 inquiry | Browser → server commit/reference/outbox → worker failure/retry → scoped screening; uji jam retensi | Belum diimplementasikan |
| M03 proof/sesi | Valid/invalid/expired/wrong-origin/chain, replay dan parallel nonce, logout, legacy migration | Fondasi tersedia; hasil lama di laporan Base/platform |
| M04/M13 akses | Anonim, owner lain, revoked grants, admin, original/investor copy, API/blob/cache | Shell/session saja tersedia; resource grants belum |
| M05–M07/M10 konten/model | Tujuh tab, Coming soon direct command, draft/review/version, calculator/model/metric consistency | Domain belum diimplementasikan |
| M08–M09/M12 investasi | Dua input/precision, quote expiry/reconsent, cap/race, net settlement, allocation, refund/liability | Belum |
| M11 claim | Owner/entitlement/funding; duplicate/concurrent, unknown/failure/retry; ledger/register/receipt | Belum |
| M14 recovery/testnet | Wrong token/chain, transfer bypass, reorg/replacement/finality, recovery history, batch shortfall | Kontrak/indexer belum |
| M15 live | Evidence counterparties/legal/country/provider/security/mandate/continuity | Didefer; bukan tes unit |
| M16–M17 navigasi/aksesibilitas | Coming soon tanpa saldo/aksi fiktif; mobile/keyboard/focus/error/reduced motion dan state | Seluruh app target belum dapat diuji |

## 2. Lapisan pengujian

- **Schema/domain:** tipe blok, exact terms/model, precision/rounding, per-currency balanced ledger, unique economics dan transisi state.
- **Integration/database:** real PostgreSQL terisolasi, transaction rollback/race, migrasi baru/legacy/drift, current authorization serta idempotency.
- **Contract/indexer D1:** restricted transfer termasuk allowance, escrow binding, allocation IDs, funding reservation, claimed history, canonical finality/reorg/replacement/restart.
- **Browser end-to-end:** entry → auth → review → quote/consent → net settlement → portfolio → report/funded claim; periksa persistence/domain outcome, bukan tampilan sukses saja.
- **Manual/UAT:** pemahaman hak/gross-net/principal/expiry, mobile, keyboard/focus, kontras, reduced motion, empty/loading/error/unavailable; extension/vendor wallet nyata sesuai klaim support.

## 3. Kasus keuangan wajib

Quote expired setelah dana datang tidak langsung dialokasikan. Input token confirmed tetapi conversion gagal tetap liability aset yang benar. Closing failure/refund tidak menghasilkan allocation dan full refund atas dana sama. Meter/invoice belum dibayar tidak menambah claimable. Hak tanpa funding, user lain atau claim paralel tidak membayar dua kali. Transfer unknown direkonsiliasi sebelum retry. Semua koreksi/reversal mempertahankan jejak.

Tambahan acceptance untuk [lifecycle yang diterima 20 Oktober](engineering/rwa-lifecycle.md), belum hasil uji:

- M07/M11: income payout tidak mengubah unit; capital recovery tidak menurunkan variable participation bila terms masih memberi bobot sama; principal not applicable tidak direpresentasikan sebagai janji pelunasan.
- M09/M12: allocation ID ditegakkan kontrak, refund tidak memakai dana yang telah dialokasikan dan burn tidak membuka kembali issuance cap tanpa koreksi yang sah.
- M11/M12/M14: akhir tenor menghentikan accrual baru tetapi accrued unpaid/default/dispute tetap; public/auto maturity burn ditolak; burn sebelum payout hanya dengan klaim pengganti persisten dan reserve cukup.
- M13/M14: unauthorized mint/burn/recovery dan allowance bypass gagal; recovery old/new binding mempertahankan total hak serta claimed history. Pause dan role/proxy authority ditinjau bersama, bukan UI-only checks.

Demo memodelkan kasus tersebut secara sintetis. Pembuktian kontrak/indexer aktual tetap memerlukan D1 dan tidak digantikan kelulusan pemeriksaan dokumentasi.

## 4. Perintah yang tersedia

Dari root, setelah setup yang relevan:

```sh
npm run check
npm test
npm run build
npm run smoke
npm run test:platform
node scripts/check-docs.mjs
npm run docs:api:build
npm run docs:api:check
```

`test:platform` memerlukan build dan Docker/database sementara; gunakan script proyek, jangan database aplikasi. Marketing browser QA memakai `npm run verify:marketing` sesudah production preview siap. Batas alat dan proses milik tes dirinci di [runbook](operations/runbook.md) dan [README platform](../apps/platform/README.md).

## 5. Pelaporan hasil

Laporan implementasi mencatat tanggal, perubahan, commit/snapshot bila tersedia, environment/fixtures, perintah/skenario, hasil, bukti dan yang belum diuji. Pisahkan hasil uji otomatis, inspeksi source dan manual. Jumlah tes yang pernah lulus bukan jaminan semua requirement investasi teruji. Tes ulang sesuai perubahan yang relevan.

Untuk perubahan dokumentasi: periksa tautan lokal/anchor yang didukung checker, semua file asal terpetakan dan preserved, status actual/target, sumber extraction, konsistensi keputusan, serta sintaks diagram. Render diagram bila alat tersedia; jangan menyebut visual QA lulus tanpa render.

API contract checker memeriksa struktur OpenAPI, local references, JSON Schema/contoh positif-negatif, auth request parity dengan Zod existing, path/parameter/capability, polling links, coverage M01–M17 dan seluruh handler API source yang tersedia. Itu belum menguji endpoint proposed, concurrency database, HTTP, kontrak chain atau domain economics. Lihat [kontrak](engineering/api.md) dan [laporan](history/2026-10-18-api-contract.md).
