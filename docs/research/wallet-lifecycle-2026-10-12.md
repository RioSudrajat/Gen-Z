# Gen-Z: wallet, token proyek dan lifecycle hak investor

> **Status arsip, diperjelas 18 Oktober 2026:** isi berikut menyimpan riset/jawaban pada tanggal asal. Acuan implementasi aktif ialah [spec v1.1-base](../archive/mvp-spec-2026-10-18.md), [PRD v2.1](../archive/prd-2026-10-18.md) dan [riset Base/EVM 18 Oktober](base-evm-2026-10-18.md). Founder memilih Base kembali pada 18 Oktober; pilihan itu tidak memulihkan mock wallet D0, katalog privat tanpa login, note wajib atau simulated rewards. Scope aktif: proof wallet sejak demo pertama, model per offering/solar hybrid, tujuh tab, funded claim dan rewards informational. Angka/vendor/standar/terms historis di bawah bukan keputusan produksi baru.

**Koreksi founder sesudah snapshot ini:** existing wallet dan Base tetap; wallet candidates MetaMask/Rabby/Base app/Phantom/Safe; persona reward pengguna layanan mitra. Input subscription sekarang wajib arah dua opsi lokal + USD, Indonesia IDRX + native USDC [R]. Batas IDRX-only/satu-input lama tidak lagi berlaku; hak IDR untuk kas IDR tetap. Evidence, conversion options dan compatibility caveats pada [memo pembaruan](market-features-2026-10-12.md).

**Akses sumber:** 12 Oktober 2026. **Status:** riset untuk putaran founder, bukan implementasi, provider onboarding atau persetujuan investasi. Mendampingi [PRD](../archive/prd-2026-10-18.md), [memo chain/stack/bisnis](chain-business-2026-10-12.md) dan [catatan grilling](../archive/founder-interview-2026-10-17.md).

**[F] Sudah dipilih:** Base arah pilot; Next.js/TypeScript + PostgreSQL + worker, satu repo/domain logic bersama; contract direction Solidity/OpenZeppelin/Foundry. Untuk proyek dengan kas kontraktual IDR, hak IDR + IDRX Base. Pilot anchor, operational partner assets, kandidat amortizing project note, closed-end tanpa exit instan. Native Gen-Z ditunda.

**Pembaruan jawaban GUI:** **[F] Wallet existing investor dipilih. [F] Founder memandatkan pilihan terbaik untuk prototype dan policy; [R] pilihan PM:** restricted ERC-20 per proyek untuk prototype/testnet; transfer rutin antarinvestor ditutup pada pilot, dengan recovery same-owner dan pengecualian assignment yang legal. Ketiganya menjadi basis kerja sesuai cakupan tersebut. Custody dana pool, register authority, legal wrapper dan production standard tetap memerlukan partner/evidence.

## 1. Pisahkan kontrol wallet, dana dan hak

| Pertanyaan | Boundary yang perlu jelas |
|---|---|
| Siapa menguasai signing key investor? | Investor/institutional process, embedded vendor atau pihak custody; jangan disimpulkan dari tombol login |
| Siapa menerima/mengendalikan principal? | Entitas/partner sesuai fund-flow dan mandat proyek; bukan otomatis Gen-Z karena portalnya dipakai |
| Siapa memberi dan mencatat hak investor? | Mitra penerbit dan legal register sesuai dokumen; wallet address adalah representasi/payout destination |
| Siapa dapat freeze/recover project token? | Pihak yang diberi mandat issuer dengan batas dan audit trail; bukan hak mengubah economics sepihak |
| Siapa dapat memulihkan IDRX yang kehilangan key? | Bergantung kontrol wallet/issuer dan keadaan; recovery project claim tidak otomatis menyelesaikannya |

Wallet investor existing dapat dipakai bersama custody/escrow pihak lain untuk pool. Model itu bukan janji Gen-Z tidak memiliki tanggung jawab compliance/servicing. Pilihan teknologi dan kewenangan hukum adalah keputusan berbeda.

## 2. Pilihan wallet untuk anchor pilot

| Opsi | Fit | Trade-off |
|---|---|---|
| **A. Wallet existing investor [R]** | Investor memakai wallet yang sudah dikuasai, termasuk institutional wallet atau smart account yang kompatibel; Gen-Z menyediakan portal dan verifikasi | Scope kecil; investor mengelola key/signing. Auth, support contract-wallet signatures dan wallet changes harus diuji |
| B. Embedded wallet, kandidat Privy | Login/onboarding/recovery UX lebih mudah untuk pengguna baru | Vendor, delegated authority dan recovery policy bertambah; belum perlu untuk sedikit anchor berpengalaman |
| C. Custody investor pihak ketiga | Signing/approval/segregation dapat dikelola provider | Izin/scope, Base, IDRX dan restricted note harus diterima provider; belum ada vendor terkonfirmasi memenuhi semua |

**[V] Teknis:** Safe mendukung Base dan pengelolaan ERC-20 serta owner/signature thresholds. Itu tidak membuktikan semua indexing/UX untuk custom restricted token, ataupun status custodian Indonesia. [Base support](https://help.safe.global/articles/9993850744-safewallet-gas-fees-faq), [assets](https://help.safe.global/articles/6230138832-managing-assets), [multisig glossary](https://docs.safe.global/home/glossary)

Privy menyediakan contoh arbitrary ERC-20 transfer di Base. **[R/inferensi]** IDRX dapat menggunakan pola transaksi ERC-20 jika contract behavior/authorization sesuai, tetapi belum ada end-to-end test atau sertifikasi IDRX Gen-Z. Server signers dapat bertransaksi atas nama user; permission itu mengubah kontrol aktual. [ERC20 recipe](https://docs.privy.io/recipes/dashboard/recovering-assets), [signers](https://docs.privy.io/wallets/using-wallets/signers/use-signers)

Dokumentasi Privy/Safe telah ditinjau lewat Context7. Vendor SDK, accounts dan versi belum dipilih. **Rekomendasi A** berdasar cohort anchor kecil [A], bukan bukti semua calon anchor punya wallet atau nyaman self-custody. Jika mereka mensyaratkan custody, gunakan evidence itu untuk rancangan provider; jangan memaksa investor menyerahkan seed ke Gen-Z.

### Kontrol minimum yang direkomendasikan

- Account link memerlukan legal identity/KYC + proof of control + approval wallet, bukan wallet connect saja.
- Jika memakai Safe/contract wallet, authentication/signatures mendukung EIP-1271 dan diuji terhadap versi wallet sebenarnya. [Safe signatures](https://docs.safe.global/sdk/protocol-kit/guides/signatures/messages)
- Principal, reserve, distribution cash dan fee platform memiliki segregation serta reconciliation sesuai struktur legal; bukan wallet operasional founder.
- Maker menyiapkan payout; pihak berbeda memberi approval; signing oleh pihak berwenang. Threshold dan signer organizations belum ditetapkan.
- Safe modules/allowances bisa memberi execution authority di luar jalur multisig biasa; audit konfigurasi aktual, bukan hanya menghitung owners. [Safe concepts](https://docs.safe.global/advanced/smart-account-concepts)

**Provider diligence [O]:** entity/izin dan scope aktivitas; Base dan IDRX; custom token restrictions; institutional signatures; settlement beneficiary; recovery; SLA/limits; quote fee; audit/security; sanctions/freeze; segregation dan business continuity. Logo vendor tidak menggantikan bukti ini.

## 3. Token proyek: prototype tidak otomatis production

| Opsi | Kegunaan | Trade-off |
|---|---|---|
| **A. Restricted ERC-20 per proyek + OpenZeppelin [R], prototype** | Demo subscription, allocation, distribution dan maturity dengan scope kecil | Restriction/recovery dan accounting custom harus dirancang serta diuji; bukan otomatis compliant/audited |
| B. ERC-3643/T-REX sejak prototype | Identity/eligibility dan lifecycle interfaces lebih terstruktur | Suite registry/trusted issuers/claims/compliance menambah konfigurasi dan integration work; provider/cost belum ada |
| C. Offchain legal register + onchain hash dahulu | Pencatatan/evidence demo sebelum issuance token feasible | Hash tidak menjadi claim token transferable; stablecoin subscription tetap membutuhkan rail yang feasible |

**[V] ERC-20** menentukan interface fungible token, bukan KYC, legal ownership, PPA, debt terms atau jaminan redeem. [ERC-20](https://eips.ethereum.org/EIPS/eip-20)

**[V] ERC-3643 berstatus Final**, ERC-20-compatible dengan identity/eligibility registries dan interfaces mint/burn, freeze, recovery serta forced transfer. Ini mekanisme menegakkan aturan yang ditentukan, bukan izin investasi universal. Jalur administratif dapat memiliki pemeriksaan berbeda dari transfer biasa; audit mint/forced-transfer/burn dan role configuration wajib. Audit implementasi pihak lain bukan audit Gen-Z. [ERC-3643 specification](https://eips.ethereum.org/EIPS/eip-3643), [suite docs](https://docs.erc3643.org/erc-3643)

OpenZeppelin menyediakan token dan access-control building blocks; Context7 docs 5.x ditinjau. Restriction tidak boleh hanya memeriksa `transfer` dan melupakan mint/burn/admin paths. Token pause juga tidak otomatis berarti semua kewajiban pembayaran proyek dihentikan. [OZ ERC20](https://docs.openzeppelin.com/contracts/5.x/erc20), [access control](https://docs.openzeppelin.com/contracts/5.x/access-control)

**[R] Scope A hanya arah prototype/testnet.** Standard production ditentukan setelah issuer/legal/custodian requirements, admin mandates dan audit feasibility. Migration dari custom ke standard lain bukan sekadar mengganti kode: reconciliation dan legal register serta investor notice harus dipetakan. Jangan mengklaim prototype A sebagai ERC-3643.

Satu token class hanya untuk hak yang seragam dalam issuance/tranche yang disepakati. Pool proyek tidak mencampur proyek lain. Data KYC mentah privat; on-chain memuat identifiers/status yang diperlukan setelah privacy review. Mock identity/legal attestations dan test stablecoin diberi label; bukan IDRX nyata.

## 4. Transfer: closed-end tidak menentukan policy

Closed-end yang sudah dipilih berarti tidak ada redeem-on-demand promise; belum menjawab apakah legal assignment antarinvestor diizinkan.

| Opsi policy | Kekuatan | Beban |
|---|---|---|
| **A. Transfer rutin ditutup; recovery same-owner; assignment pengecualian [R]** | Scope anchor pilot kecil; tidak menimbulkan ekspektasi marketplace exit | Investor harus menerima batas sejak awal; exceptions tetap memerlukan issuer/legal review |
| B. Assignment antarinvestor eligible, issuer-reviewed per transaksi | Mengakomodasi kebutuhan anchor tanpa menjanjikan pembeli | Assignment documents, pricing, identity/eligibility, consent dan accrued entitlement cut-off menambah pekerjaan |
| C. Self-service antarwallet eligible | Lebih otomatis | Allowlist belum cukup menyelesaikan beneficial owner, legal agreement dan holder limits; tidak direkomendasikan pilot |

**[V] Benchmark:** Centrifuge memisahkan permissions subscription/redemption/transfer serta menyediakan address freeze dan authorized recovery. Tokeny menghubungkan recovery ke investor identity dan wallet baru. Dua pola ini membantu membedakan claim ownership dari kontrol wallet; bukan persetujuan memakai protocol/standard tersebut. [Centrifuge permissions](https://docs.centrifuge.io/user/concepts/access-permissions/), [Tokeny wallet management](https://docs.tokeny.com/docs/wallets-management)

Opsi B/C tidak menyediakan likuiditas otomatis. Jika transfer dibuka, record date, accrued income, outstanding principal, eligibility penerima dan hak distribusi berikutnya harus berpindah sesuai kontrak. Whitelist saja tidak cukup. Transaksi disputed bukan simple wallet reset.

## 5. Recovery, amortisasi dan admin authority

**Bedakan:** recovery login portal; recovery signing keys; migrasi project claim; redeem stablecoin; dan exit investasi. Hanya migrasi klaim yang dirancang pada policy proyek; tidak otomatis mengembalikan ETH/IDRX atau asset lain di wallet hilang. Safe owner rotation memerlukan otorisasi/quorum yang tersedia; tidak boleh dijanjikan support bisa mengatasi semua kehilangan akses.

```text
Investor melaporkan kehilangan wallet
→ verifikasi ulang identity + evidence case
→ buktikan kontrol wallet baru milik investor yang sama
→ freeze posisi lama bila sah dan sesuai evidence
→ issuer/compliance approval + checker independen
→ migrate/burn-reissue sesuai standard dan mandat
→ rekonsiliasi register, principal, income dan payout destination
→ audit trail dan notice; tidak ada double claim
```

**[R] Batas issuer/admin:** recovery tidak mengubah coupon, tenor, principal schedule atau waterfall secara unilateral. Legal succession/dispute mengikuti proses berbeda bila beneficiary berubah. Emergency freeze scoped dengan reasons/authority, review dan unfreeze procedure. Gen-Z dapat menyiapkan case; pihak yang berwenang memberi keputusan dan execution. Maker-checker minimal dua approval independen direkomendasikan; threshold serta signer organizations mengikuti issuer structure.

**Accounting [R]:** claim units, original subscription, outstanding principal, accrued income dan distributed amounts berbeda. Original claim units dapat dipertahankan sampai hak berakhir, sementara principal repaid dicatat per unit; desain final menyusul. Income bukan repayment principal dan tidak otomatis burn token. Tidak ada ERC4626 instant-redeem model.

[IDRX Base](https://docs.idrx.co/introduction/supported-chain-and-contract-address) memakai 2 decimals; precision claim units bisa berbeda. Jangan mengasumsikan 1 claim = 1 IDRX. Subscription price, allocation dan residual rounding/carry-forward harus explicit dan reconciled. Claim payment tidak boleh melebihi funded cash. Freeze token tidak otomatis menghapus hak investor terhadap issuer.

## 6. Hasil GUI dan pekerjaan berikutnya

Tiga keputusan policy/design telah dijawab atau dimandatkan founder:

1. **Investor wallet architecture [F]:** existing wallets. Pool custody/legal fund flow dinilai terpisah.
2. **Prototype token direction [R] dalam mandat [F]:** restricted ERC-20. Production standard tidak otomatis disetujui.
3. **Transfer/recovery policy pilot [R] dalam mandat [F]:** transfer rutin ditutup, same-owner recovery dan issuer-reviewed exceptions.

Berikutnya: akses proyek/anchor serta tim/budget actual, lalu concrete token units/schedule, signer organizations/admin authority, registry/record-date process, wallet/provider tests dan issuer fund flow. Project/anchor data serta legal route tetap dependencies; tidak mengarang counterparties atau quotation. Demo bisa memakai mocks yang jelas; live membutuhkan data nyata, security review dan struktur yang feasible. Pilihan yang telah dimandatkan tidak diminta ulang.

**Pertanyaan stress-test yang masih terbuka:** anchor wallet competence dan custody preference; apakah provider menerima IDRX + restricted note; siapa legal register authority; apakah issuer punya signer/recovery operation; bukti treasury capacity untuk biaya sepanjang tenor; dan settlement obligations saat IDRX depeg/freeze. Bukan alasan memilih provider atau membuka deposit otomatis.
