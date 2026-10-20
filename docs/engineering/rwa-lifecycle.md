# Lifecycle token RWA proyek

**Status:** arah mekanisme disetujui founder 20 Oktober 2026 [F]; rincian kontrak/data di bawah rancangan [R], belum implementasi. [ADR 0004](../adr/0004-project-rights-lifecycle.md) mencatat trade-off, [finance](../product/finance.md) memiliki ekonomi offering, [data model](data-model.md) memiliki entitas, dan [riset](../research/rwa-mechanisms-2026-10-20.md) menyimpan bukti pembanding. Dokumen ini bukan ABI atau endpoint API baru.

## 1. Hak, unit dan batas produk

Satu restricted ERC-20 mewakili satu offering/series dengan kelas hak identik. Token bukan aset fisik, native token Gen-Z, saldo stablecoin, valuasi proyek atau outstanding principal. Unit partisipasi tetap selama terms memberi bobot hak yang sama; tidak rebase dari produksi, proyeksi yield atau pembaruan NAV.

Income, capital recovery, contractual principal dan residual dicatat terpisah. Principal hanya ada bila terms mendefinisikannya; capital recovery dari distribusi tidak membuktikan adanya janji pelunasan pokok. Pembayaran modal tidak otomatis mengurangi unit atau variable participation. Bila model lain mengubah bobot, formula/jadwalnya harus menjadi terms version yang disetujui sebelum subscription, bukan efek tersembunyi fungsi burn.

Closed-end dan transfer rutin tertutup tetap berlaku. Kontrak menolak transfer antarinvestor melalui `transfer` maupun `transferFrom`, termasuk kedua wallet yang eligible. Same-owner recovery dan assignment legal adalah tindakan berbeda dengan mandate tersendiri. Tidak ada fitur AMM, pinjaman, bridge, instant redemption atau sumber yield native baru.

## 2. Subscription, settlement dan mint

```text
Offering + terms/model version disetujui
→ eligibility + wallet binding
→ quote IDRX/native USDC, fees, min_net, expiry dan consent
→ subscription ID + cap reservation
→ deposit pada escrow yang terdaftar
→ canonical receipt/finality
→ conversion bila perlu + net settlement reconciliation
→ closing memenuhi terms
→ allocation ID + register
→ mint unit + reconciliation
```

Deposit IDRX/USDC yang confirmed belum membuktikan kas bank atau net IDR settlement. Settlement attestation memerlukan bukti dan reviewer berwenang. Otorisasi mengikat environment/chain/contract, subscription/allocation ID, investor, offering, amount/asset, terms/model version, nonce dan expiry. ID allocation ditegakkan pada state kontrak; tx hash/event saja tidak mencegah dua transaksi mengulang efek ekonomi.

Jika closing gagal sebelum mint, tidak ada posisi untuk dibakar dan deposit menjadi refund liability. Koreksi setelah issuance memerlukan case, approval serta pembatalan hak/refund yang direkonsiliasi. Dana yang sama tidak sekaligus dialokasikan dan full-refunded. Burn tidak otomatis membuka capacity penerbitan baru; cap lifetime issuance dibedakan dari active supply dan koreksi sah.

Late/under/overpayment, unmatched transfer, wrong token/chain dan conversion failure mengikuti [flows](flows.md). Expiry quote tidak menghapus uang yang sudah diterima. Input, denominasi hak, kas proyek dan payout/refund currency tetap field/keputusan berbeda.

## 3. Distribusi dan claim

```text
Reviewed collection + terms/model + record date
→ calculation fixed/variable dan income/modal/pajak/fees
→ review + approval entitlement versi tertentu
→ funding distributor untuk batch/pool yang tepat
→ finality + verifikasi reserve cukup
→ activate claimable
→ claim sekali per entitlement
→ finality + domain reconciliation + receipt
```

Calculation off-chain tidak mengubah jumlah unit. Forecast, meter atau invoice belum dibayar tidak menciptakan funding. Approval bukan claimable sampai dana tersedia dan diikat ke batch. Total paid ditambah unpaid reserved tidak melebihi cumulative verified funding yang tetap dialokasikan untuk batch tersebut; satu dana tidak menopang batch/pool lain.

Kontrak memeriksa entitlement, payout asset/amount, current authorized recipient dan claimed state sebelum efek transfer. Recovery boleh memperbarui binding penerima melalui approval tanpa mengubah nilai hak atau mengulang claimed history. Unknown transaction direkonsiliasi sebelum retry; gagal/revert tidak menghapus liability. Koreksi entitlement yang sudah dibayar memakai adjustment/history, bukan overwrite klaim lama.

## 4. Burn dan akhir hak

| Kejadian | Perlakuan unit | Perlakuan hak dan kas |
|---|---|---|
| Income claim | Tidak burn | Entitlement yang dibayar ditandai claimed |
| Capital recovery parsial, participation masih berlaku | Unit tetap | Catat modal kembali; outstanding principal hanya jika applicable |
| Redemption yang sah mengakhiri sebagian hak | Akhiri/burn unit terkait | Bayar atomic atau sediakan payable pengganti yang persisten dan terdanai |
| Pembatalan issuance | Controlled cancellation dengan case/reason | Refund/correction terikat bukti; tidak menghilangkan hak yang belum diselesaikan |
| Tenor/accrual selesai | Tidak auto-burn | Hentikan hak periode baru menurut cutoff; accrued unpaid, residual, default dan sengketa tetap sesuai terms |
| Penutupan posisi | Burn opsional sebagai akhir representasi | Seluruh surviving rights selesai atau dipindahkan ke klaim persisten yang sah dan terlindungi |
| Same-owner recovery | Pindah representasi; total hak tetap | Old binding disabled; posisi dan claimed history tidak direset |

D1 tidak mempunyai public burn atau burn otomatis saat maturity. Close/cancellation memerlukan authority, reason/case ID dan reconciliation. Burn sebelum payout memerlukan klaim pengganti yang didukung reserve; catatan backend tanpa pendanaan tidak cukup. Default/workout bukan pelunasan. Dana klaim yang belum diambil tidak boleh di-sweep tanpa dasar terms/legal dan penanganan liability yang dapat ditelusuri.

## 5. Data blockchain dan data privat

Nama/tipe berikut kategori logis [R], bukan schema deployment final. Raw amounts/units memakai integer dengan scale eksplisit dan API memakai strings. IDR, IDRX, USDC dan unit hak bukan satuan yang dapat dijumlah langsung.

| Data | State on-chain untuk enforcement [R] | Off-chain berversi/privat |
|---|---|---|
| Offering/terms | Opaque offering/series ref, terms/model commitment, lifecycle dan issuance cap | Issuer/legal documents, model lengkap dan consent |
| Posisi | Saldo/unit, supply dan referensi hak yang diperlukan | Stable party/position register, net cost, income/modal/residual breakdown |
| Deposit/allocation | Subscription/allocation business IDs, payment asset/amount, recipient, consumed state | Quote/FX, fees, evidence net settlement dan closing approval |
| Distribusi | Batch/entitlement refs, asset/amount, reserve, recipient binding/version dan claimed state | Collection, waterfall, pajak, entitlement calculation dan review |
| Penutupan/recovery | Case/reason commitment, affected units dan binding transition | Bukti same-owner, issuer approval, surviving claims dan resolution |
| Admin | Role/policy changes dan pause per action | Mandate/signers, approval dan incident evidence |

Event mencatat deposit, issuance, funding/activation, claim, closure/recovery dan admin changes; ERC transfer events mencerminkan mint/burn/movement yang benar-benar terjadi. Event/indexer bukan pengganti state pencegahan duplicate. Direct entitlement mapping menjadi basis D1 kecil; Merkle proofs opsional setelah kebutuhan skala terbukti, dengan domain chain/contract/batch/beneficiary/asset/amount dan claimed tracking tetap ditegakkan.

Commitment memerlukan serialisasi/schema version dan domain yang jelas; hash bukan bukti laporan benar atau bank sudah membayar. PII/KYC, rekening, original sensitif, identity mapping dan raw telemetry tidak ditaruh di chain. Public Base membuat wallet, saldo, transfer dan nominal on-chain dapat diamati/dikorelasikan; akses app setelah login tidak menyembunyikan chain. Minimalkan referensi lintas konteks, berikan disclosure sebelum live, dan jangan menjanjikan anonimitas atau kerahasiaan nominal yang tidak ditegakkan teknologi.

Indexer menyimpan chain/contract/version, tx hash/log index, block number/hash, canonical/finality state, business IDs, cursor, replay/backfill serta tx attempts/replacements pada PostgreSQL. Canonical finality dan domain reconciliation tetap diperlukan. Legal register dan efek kontrak direkonsiliasi; mismatch menahan transition terkait dan masuk case, bukan DB menimpa transfer atau token membatalkan hak hukum otomatis.

## 6. Authority dan dependency

Prinsip yang diterima: least privilege, approval dan audit untuk allocation/mint, settlement, distribution funding, pause, recovery dan role administration. Worker tidak memegang master authority. Pause issuance terpisah dari payout; perubahan governance tidak membatalkan hak offering sepihak. Proxy/upgrade authority harus dimasukkan threat model karena bisa melemahkan pembatasan role operasional.

Mandat/signers/threshold dan independensi nyata, issuer/legal route, countries, custody/FX, payout/refund, contract versions dan audit tetap [O] sebelum live. Target capital recovery bertahap harus lolos underwriting dan bukan principal guarantee. Restricted ERC-20 adalah basis D1 yang diterima; interface ERC-3643/7943, B20 dan pilihan proxy/immutable produksi masih evaluasi. Non-upgradeable per versi merupakan rekomendasi evaluasi D1, bukan keputusan kontrak produksi.

Pemetaan uji mengikuti M07/M09/M11/M12/M13/M14 pada [requirements](../product/requirements.md) dan [Testing](../TESTING.md). Tidak ada contract/indexer test yang dinyatakan lulus dari dokumen ini.
