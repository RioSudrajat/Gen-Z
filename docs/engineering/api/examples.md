# Contoh integrasi dan failure paths

**Semua angka, UUID, address dan policy pada contoh synthetic.** File [examples.json](examples.json) berisi payload lengkap yang divalidasi terhadap [OpenAPI](openapi.json). Ini fixture kontrak, bukan transaksi atau test E2E server. Nilai kurs/fee tidak menjadi pricing, quote pasar atau terms proyek nyata. Kedua input di bawah merupakan alternatif atas economics yang sama, bukan dua deposit untuk dijumlah.

## Prasyarat alur D0

Login nyata melalui `createChallenge` → wallet sign exact message → `verifyWallet`, lalu `getSession`. Untuk domain proposed, panggil `getAccessContext`; pilih acting party yang mempunyai mandate/grant server. Fixtures server menyediakan satu published solar hybrid `demo_open`, tujuh tab/documents approved, sandbox eligibility approved, versi model/terms/payout/refund serta isolated scenario namespace. Login tanpa grant tidak otomatis menjadi admin atau `demo:control`.

Ambil ID konkret dari bagian `ids` di examples.json; key seperti `offering`, `terms`, `model`, `documentVersion`, `recipientBinding`, `testUsdc` dan `mockIdrx` adalah referensi silang fixture. ID tersebut tidak tersedia pada server existing. Address token di fixture bukan deployment yang boleh dikirim dana.

## 1. Inquiry operator

Panggil `getInquiryPolicy` untuk versi privacy notice yang published. Kirim `createInquiry` memakai Origin marketing dan `Idempotency-Key` baru; body profil/kontak/kategori/lokasi/status/kebutuhan dana serta privacy acknowledgement, tanpa upload dokumen sensitif. Tunggu 201 dengan reference setelah commit server. Notification failed tidak membatalkan inquiry atau meminta submit baru; staff membaca inquiry dan dapat mengantrekan retry outbox yang sama.

## 2. Review offering dan model

`listAssets` → `getOffering` → `getOfferingTabs` → `listOfferingDocuments`. Semua setelah sesi, approved investor copies tidak memerlukan transaksi eligible. `getDocumentAccess` memberi session-bound accessGrantId dan path proxy; GET bytes tetap memakai sesi/current permission. Original tidak bisa diakses hanya dengan mengganti query variant.

Pakai `calculateScenario` untuk forecast; jangan memasukkan hasilnya sebagai realized performance, outstanding principal atau claimable. Untuk quote, `termsVersionId` dan `modelVersionId` harus cocok published versions, serta Coming soon tetap diblokir.

## 3. Dua input menuju satu net IDR rights

| Fixture | Input raw | Decimals | Human input | FX sintetis | Gross IDR | Fee IDR | Net rights IDR |
|---|---:|---:|---:|---:|---:|---:|---:|
| `quote-test_usdc` | `100000000` | 6 | 100 test USDC | 16.000 IDR/USDC | 1.600.000 | 16.000 | 1.584.000 |
| `quote-mock_idrx` | `160000000` | 2 | 1.600.000 Mock IDRX | 1 IDR/IDRX | 1.600.000 | 16.000 | 1.584.000 |

Kirim salah satu request `createQuote` pada examples.json. Server memeriksa registry/chain, positive amount/precision, eligibility, cap, terms/model dan route yang tersedia. Contoh quote berlaku pukul 03:00–03:05 UTC; ini timestamp fixture, bukan quote yang berlaku saat dibaca. `executable: true` hanya menyatakan synthetic adapter pada fixture dapat menjalankan skenario tersebut.

## 4. Consent, input, net settlement dan allocation

Kirim `subscription-consent` dengan quote ID, exact terms/model dan required document versions, `riskAcknowledged: true`. Header session, Origin app, acting party bila diperlukan, serta `Idempotency-Key` baru untuk intent subscription. Respons 201 `payment_pending`, `receivedInputAmountMinor: "0"`, `netSettledRights: null`, allocation/position kosong. Sukses create tidak membuktikan dana sudah diterima.

Pada D0, scenario adapter mensimulasikan input; pada D1, `notifyPayment` hanya hint tx yang diingest durable. Poll `getObservation`/`getSubscription`. Worker memverifikasi asset, receipt/escrow binding, finality dan conversion. Staff mengusulkan settlement evidence, reviewer merekonsiliasi; successful closing direview; baru `allocateSubscription`. Client tidak memanggil PATCH paid/net_settled atau menetapkan units. Dalam fixture rights 1 IDR per unit, net 1.584.000 IDR menghasilkan units `"1584000"`; ini model fixture, bukan unit seluruh offering.

## 5. Report, collection, funded entitlement

Catat operation record, invoice dan collection sebagai objek berbeda. Collection pending memerlukan review/verifikasi; matching tidak boleh mengonsumsi cash dua kali. Monthly report exact version direview dan published. `calculateDistribution` mengikat model/period/report/record-date dan cleared collections. Review batch tidak langsung membuat claimable. `notifyDistributionFunding` diproses worker sampai dana dan reserve terverifikasi/reconciled.

Fixture `funded-entitlement` menunjukkan net income **IDR10.000**, capitalRecovery `null`, payout **1.000.000 minor Mock IDRX = 10.000 Mock IDRX**. Policy fixture 1:1 sudah terikat; net entitlement menjadi claimable hanya karena hak, approved calculation dan funding tersedia. Perbandingan ini tidak menetapkan payout/refund currency proyek nyata.

## 6. Claim, unknown outcome dan receipt

Kirim `claim-reserved`: recipientBinding/version, expected payout asset/amount, policy version dan payoutQuoteId sesuai entitlement. Amount expected adalah concurrency guard; server tetap menghitung/reserve jumlah yang sah. Satu intent memakai satu Idempotency-Key. Respons 202 `reserved` belum pembayaran final; poll `getClaim` sesuai Location/Retry-After.

Fixture `claim-outcome-unknown` tetap 200 dengan state `unknown`, attempt ID dan error code. Jangan membuat key/pembayaran baru. Staff menjalankan reconciliation terhadap attempt/sender/nonce/replacement dan canonical outcome; reserved funds/hak tidak direset secara buta. Sesudah outcome verified, claim bisa menjadi claimed dan `getClaimReceipt` mengembalikan receipt. `claim-synthetic-receipt` mempunyai `synthetic: true`, `txHash: null`; bukan proof transfer on-chain. Receipt sebelum reconciliation menghasilkan 409.

## Failure matrix untuk implementasi dan client

| Trigger | Respons/state | Tindakan aman dan invariant |
|---|---|---|
| Quote lewat expiry sebelum consent | 409 `QUOTE_EXPIRED` | Quote/review/consent baru; tanpa allocation |
| Terms/model/docs berubah | 409 `TERMS_CHANGED` atau 412 | Baca exact versions dan minta consent baru |
| Key sama, body sama | Replay resource/status yang sama setelah permission check | Tidak membuat resource/efek ekonomi baru |
| Key sama, body berbeda | 409 `IDEMPOTENCY_CONFLICT` | Jangan menimpa command lama; tinjau intent |
| Dana datang setelah expiry | Observation/exception `unmatched` atau refund flow | Tidak auto-reprice/allocation dari dana terlambat |
| Input confirmed, conversion gagal | Subscription `conversion_failed` | Catat liability aset yang diterima; belum net IDR rights |
| Cap/eligibility berubah saat subscribe | 409 `CAP_EXCEEDED`/`ELIGIBILITY_REQUIRED` | Reservasi/decision atomik; bacaan approved tetap tersedia |
| Closing gagal setelah conversion | `closing_failed` → refund case | Refund asset/fee sesuai bound policy, tidak otomatis nominal USD awal |
| Hak ada, dana kurang | 409 `INSUFFICIENT_FUNDING` | Tidak payout atau partial diam-diam; hak tetap tercatat |
| Claim paralel beda key | Satu reserve; lain 409 state/already claimed | Tidak menggandakan pembayaran |
| Old recipient setelah recovery | 409 `RECIPIENT_CHANGED` atau denial | Refresh current binding/terms; accrued/claimed history tetap |
| Transfer timeout/replaced/unknown | Claim/refund `unknown` | Reconcile, jangan blind resend |
| ETag review stale | 412 `VERSION_MISMATCH` | Baca draft/current version, review ulang |
| Role/grant dicabut setelah download grant diterbitkan | Proxy bytes 401/403/resource-safe 404 | Current session/resource policy diperiksa saat download |
| Meter meningkat, invoice belum dibayar | Performance bisa berubah; claimable tetap | Jangan menjadikan sensor sebagai saldo payout |
| Inquiry commit berhasil, inbox gagal | 201 reference tetap valid; notification failed | Staff retry outbox; bukan submit ulang |
| Scenario reset | Generation baru; history lama tetap | Tidak menghapus auth, grants, register/audit atau double claim |

Schema/negative examples checker hanya membuktikan payload/kontrak konsisten. Race, retention clock, provider signatures, economics, contract finality dan browser-to-persistence flow masih perlu implementasi serta pengujian di [Testing](../../TESTING.md).
