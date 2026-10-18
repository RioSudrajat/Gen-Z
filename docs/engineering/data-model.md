# Kamus data dan invariant target

**Status: rancangan [R].** Ini model target investasi dan reporting, bukan daftar tabel yang sudah dimigrasikan. ERD fisik auth dan batas implementasi ada di [ERD](../ERD.md).

Sumber pemisahan: [dokumen asal](../archive/schema-flows-2026-10-18.md). Dipisahkan 18 Oktober 2026; label [F]/[R]/[A]/[O]/[V] mengikuti [panduan](../CONTRIBUTING.md).

## Entitas dan invariant target [R]

Rancangan relasional untuk PostgreSQL/modular monolith dengan object storage privat dan worker. Nama entity belum mengunci CMS, token standard atau provider; bukan SQL yang telah dijalankan. Entitas dapat dibangun bertahap, tetapi invariant tidak dihapus saat tabel digabung.

### Access, intake, project dan editorial

| Entity | Data minimum | Relasi / invariant |
|---|---|---|
| Party / Account | person/organization, country, status, private identity refs | Target individu/institusi global tidak otomatis eligible; account bukan issuer/operator otomatis |
| OrganizationMembership / CapabilityGrant | account, organization/project/offering scope, role, mandate, validity, revocation/version | Login wallet tidak membuat grant; role dari browser diabaikan |
| WalletLink | account/party, namespace, chain_id, normalized address, account kind, proof ref, verified_at, status | SIWE mengikat namespace eip155/chain/address; unique tuple terkontrol, checksum untuk display; account link bukan migrasi posisi/eligibility atau automatic Solana merge |
| AuthChallenge / Session | nonce hash, exact SIWE message/context, domain/URI, chain_id/address, browser binding, env, intent, issued/expiry/consumed; session subject/revocation | Single-use atomik; current grant/resource checks; no signing keys |
| EligibilityCase | party, offering/country scope, KYC/KYB/UBO refs, decision, expiry, reviewer, sandbox flag | Gate sebelum quote/subscription; bukan gate umum membaca approved investor copies |
| Inquiry | reference, profile/contact, asset category/location/status, financing need, privacy acknowledgement, state, last_interaction_at | Publik boleh submit, founder/admin saja baca; tidak meminta dokumen sensitif atau auto marketing |
| InquiryInteraction / RetentionReview | inquiry, actor/time, screening/needed evidence, last meaningful interaction, review/delete due, disposition | Tidak berlanjut: hapus 90 hari sejak interaksi terakhir; aktif: review tiap 90 hari; notification retry tidak mereset jam |
| NotificationOutbox / DeliveryAttempt | inquiry_ref, destination config ref, delivery state, retry/attempt/error | Inquiry + outbox committed bersama; satu inbox; delivery failure tidak membatalkan penerimaan |
| Partner / ProjectPartyRole | party, owner/operator/issuer role, project/asset scope, authority evidence, effective dates | Owner, operator, issuer dan Gen-Z terpisah; kewenangan dibuktikan |
| Project / Asset / ProjectAsset | project identity; asset technology/location/units/stage; membership relation | Project ekonomi berbeda dari peralatan fisik; capacity tidak dihitung ganda |
| AssetClassification / ShowcaseVisibility | asset, primary Energy/Infrastructure, tags, slug, active_demo/coming_soon/hidden | Availability berbeda dari operations_state dan offering_state; Coming soon non-investable |
| ProjectPool / Offering | project/pool, issuer, series/class, instrument/model type, rights currency, cap/min/max, lifecycle | Satu pool satu proyek; tiap offering mengikat terms/model version; satu offering aktif pada demo |
| OfferingTermsVersion / EconomicModelVersion | fixed/variable components, basis gross/net, fees, tenor/schedule, principal policy, expiry/residual, rounding, effective/review state | Hybrid/revenue participation dibuka; note bukan default wajib; published versions immutable |
| ContentRevision / TabContent / Block | entity/locale/tab key, typed facts refs, validated block type/payload, schema version, draft/review/published | Tujuh tab tetap; konten fleksibel, tanpa angka finansial utama/formula bebas yang melewati model |
| Evidence / DocumentVersion / DocumentAccessPolicy | project/asset/party/offering/period refs, source, type, object key/hash/version, investor copy/original, redaction reason, permission | Core approved copy terbaca setelah login; original sensitif privileged; object storage privat |
| ReviewDecision / Publication / Correction | entity+version, submitter/reviewer, decision/reason/time, published/superseded ref | Draft tidak tampil; koreksi versi baru; history tidak ditimpa, reviewer live sesuai mandat |

Inquiry yang berlanjut ke project ditautkan secara eksplisit; data inquiry tidak otomatis menjadi bukti investasi. Penghapusan inquiry mencakup data inquiry terkait menurut konfigurasi retensi, tanpa menghapus record proyek/keuangan yang mempunyai dasar retensi tersendiri. Backup/inbox copies perlu lifecycle yang ditetapkan sebelum penerapan kebijakan.

### Subscription, settlement, posisi dan claim

| Entity | Data minimum | Relasi / invariant |
|---|---|---|
| Quote | offering+terms/model version, input asset/chain_id/token_address/decimals, gross amount, FX pair/rate/basis/time, fees, net settlement/net rights, min_net, expiry, provider ref | Display quote bukan executable capacity; consent mengikat versi; tidak repriced diam-diam |
| Subscription / Consent | investor/org, offering, quote, requested/accepted amount, terms/model/document versions, consent_at, cap reservation, state, idempotency/body hash | Eligibility+cap atomik; no allocation sebelum net settle; financial demo berlabel |
| InputPayment / Conversion / Settlement | subscription, input chain_id/token_address/decimals, received amount, tx_hash/log_index/block_hash, conversion/provider refs, net settled amount, fees, states | Chain input confirmed berbeda dari conversion/net settlement; unique evidence tidak menambah dana dua kali |
| Allocation / Position / TokenRepresentation | subscription, investor, offering+terms/model version, register ref, units, acquisition/net cost, principal fields jika berlaku, chain_id/token_contract/contract_version/allocation_id refs jika ada | Simulated allocation bukan legal/on-chain issuance; jumlah units cocok rights/register; principal nullable/not applicable sesuai model |
| Schedule / Obligation | offering/position, period/due_date, fixed/variable basis, principal/income due jika berlaku, calculation ref, state | Due/forecast berbeda dari received; expiry tanpa principal terpisah harus eksplisit |
| Journal / LedgerEntry | pool, currency/asset, debit/credit account, amount/precision, source, reversal_of | Balance per currency/asset; conversion legs/clearing/valuation terpisah; tanpa cross-pool netting |
| DistributionBatch / Calculation | pool/offering/model version, period/record_date, eligible collection refs, gross/deductions/reserve/net, review/approval refs | Hak dan kas/periode cocok; approved tidak otomatis funded/claimable |
| DistributionFunding | batch, settlement chain/token/decimals, expected/verified available amount, reserved/claimed, evidence/tx/log refs, finality/reconciliation state | Funding terverifikasi; reserved+claimed tidak melebihi dana tersedia untuk distribusi |
| DistributionEntitlement | batch, position/owner, units snapshot, fixed/variable amounts, principal/income jika applicable, fees/tax/net, payout asset, state | Hak milik sendiri; gross/net disclosure; payable dibatasi hak dan funding, bukan estimated yield |
| Claim / PayoutAttempt / Receipt | entitlement, owner/verified recipient, amount/asset, reservation/idempotency, attempt/sender+nonce refs, tx_hash, receipt/event refs, finality_policy_version/reconciliation, failure reason | Atomic reservation; duplicate/concurrent tidak membayar ganda; pending unknown direkonsiliasi sebelum retry |
| Refund / ExceptionCase | subscription/position/claim, reason, before/after conversion, asset/amount, approvals, liability, payment outcome | No allocation + full refund atas dana sama; gagal refund/payout tetap kewajiban tercatat |
| AuditEvent / ReconciliationRun / Break | actor/action/entity/version/time, bank/custody/chain/register/ledger refs, discrepancy, resolution | Reversal/correction traceable; tidak overwrite bukti; live critical actions sesuai mandat independen |
| DemoScenario / SyntheticDataset | environment, version/seed, synthetic facts/events/time, reset ownership | Tidak memasukkan synthetic posisi/transaksi ke register live; reset bukan bypass login/grant |

**Precision:** uang integer minor units atau decimal dengan precision terkontrol; settlement bukan floating point. Chain ID/token address/decimals authoritative berasal dari registry per environment: IDRX Base 2, USDC 6; Base Sepolia 84532 memakai test USDC + Mock IDRX, live Base 8453 terpisah. Raw amount integer/bigint dan API strings; validasi excess precision, rounding FX/units dan dust. FX pair/basis/time, unit produksi, rounding dan residual tercatat. API mengirim decimal/integer strings beserta currency/unit. Jangan menjumlah IDRX, USDC, IDR dan hak unit mentah.

**Model rights:** posisi menyimpan unit/hak dan net cost; initial/outstanding principal hanya jika terms mendefinisikan principal. Distribusi income tidak mengurangi principal; pembayaran modal tidak otomatis seluruhnya profit. Expiry/residual/penyelesaian mengikuti offering, bukan label token. Restricted ERC-20 per offering/series menjadi basis D1 [R]; transfer rutin/allowance bypass ditolak. Stable position/party IDs menjaga hak dan claimed history saat same-owner recovery; freeze/disable old wallet dan issuer approval wajib. Production standard/authority [O], B20/ERC-3643 evaluasi terpisah.

### Data chain dan business idempotency Base [R]

| Entity | Data minimum / invariant |
|---|---|
| ChainAssetRegistry | env, chain_id, asset_id, token_address, decimals, enablement, source, verified_at; wrong symbol/chain ditolak; Mock IDRX bukan issuer token |
| ContractDeployment | chain_id, contract_address, offering/pool, kind/version, ABI/source/build hash, deployment block, roles; registry bukan claim audited |
| ChainEventObservation | chain_id, tx_hash, log_index, contract, block_number/hash, payload, canonical/finality state; canonical dedupe chain/tx/log, histori reorg tetap ada |
| IndexerCursor | chain/contract, last scanned/finalized block/hash, overlap/backfill, retry/lag; restart tidak kehilangan log atau menambah uang dua kali |
| TransactionAttempt | command/business ID, sender+nonce, signed attempt ref, tx hash/replacements, receipt/status/finality; unknown direkonsiliasi sebelum mengirim lagi |
| AllocationExecution | allocation_id/subscription_id, mint contract, units, approved net settlement/closing ref; unique on-chain business ID dan register reconciliation |
| RecoveryCase | stable party/position ID, old/new wallet, same-owner proof/issuer approval, freeze/disable + tx ref, binding history; claimed history tidak direset |

Identity auth yang sudah diterapkan memakai namespace + chain ID + normalized address; migrasi Base mempertahankan akun legacy dan mencabut proof/sesi lama. WalletLink/Party pada model target belum diimplementasikan. Tidak mengedit migrasi 0001 yang sudah diterapkan atau menggabungkan akun Solana/EVM tanpa proof/mandat. Smart account ERC-1271/6492 verification memakai chain challenge; connector/signer bukan legal party secara otomatis.

Default konservatif: receipt included/safe hanya intermediate; final accounting/allocation/funding activation/claimed setelah canonical finalized head + domain reconciliation. Reorg membatalkan pending projection dan memicu reconciliation break bila dalam; tidak overwrite journal final. Business IDs juga ditegakkan pada escrow/allocation/distributor karena hash/log saja tidak mencegah duplicate economics.

Distribusi terikat snapshot hak record-date dan stable position/party ID, bukan saldo token saat claim. Immutable entitlement mencatat payout recipient binding/version, batch/asset/amount, funding reservation dan claimed state; old wallet diblokir setelah recovery. Reserve per batch/pool melarang satu saldo funding dipakai dua kali. Merkle proofs/sponsorship opsional setelah mapping distributor D1 terbukti. Detail/sumber primer: [riset Base/EVM 18 Oktober](../research/base-evm-2026-10-18.md).

### Reporting dan time series

| Entity | Data minimum | Relasi / invariant |
|---|---|---|
| SourceConnection / MetricDefinition | project/asset, source/device/provider, permission, metric/unit/basis, expected cadence, connection state | API/IoT opsional; koneksi bukan jaminan akurasi |
| RawObservation / MetricAggregate | source, observed_at/ingested_at, period, value/unit, quality, coverage, missing/stale flag, provisional/review status | Nilai missing bukan nol; raw/aggregate terpisah dari monthly report dan ledger |
| OperationRecord | project/asset/period, production/usage, unit, source/evidence, review | Produksi bukan invoice atau kas; Impact memakai methodology/baseline tersendiri |
| Invoice / Collection | project, period, payer/currency, billed amount/due, cleared amount/time, bank/custody refs, evidence/review | Satu invoice dapat dibayar parsial; perlu relasi matching, bukan meter=paid |
| CollectionMatch | invoice, collection, matched amount, currency/basis, reconciliation | Partial/multi-invoice cash dapat ditelusuri; tidak dihitung dua kali |
| MonthlyReport / ReportVersion | project/offering/period, facts/operation/invoice/collection refs, submitted/reviewed/published, correction reason/prior version | Fallback bulanan reviewed; draft/provisional tidak menjadi laporan final atau dana claimable |
| ImpactMeasurement | project/period, metric/unit, methodology/baseline/source, forecast/actual, review | Hindari klaim zero-emission/additionality tanpa bukti; bukan basis pembayaran otomatis |

Functional reward entities dari baseline lama ditunda; tidak masuk schema implementasi MVP. Halaman Coming soon tidak memerlukan saldo loyalty atau campaign palsu.

### Relasi utama

Diagram dipelihara di [ERD](../ERD.md) agar model fisik auth dan logical target tidak tercampur. Tabel pada dokumen ini tetap menjadi kamus field/invariant target. Evidence bisa terkait beberapa objek/periode melalui link tervalidasi; multiplicity tidak mewajibkan banyak seri atau portal operator penuh pada demo.
