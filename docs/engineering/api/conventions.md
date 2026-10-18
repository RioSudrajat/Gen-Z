# Konvensi kontrak API MVP

**Status:** rancangan teknis [R] versi `0.1.0-draft`, 18 Oktober 2026. Scope produk tetap [requirements MVP](../../product/requirements.md). Hanya enam operasi berlabel `source` tersedia di source; kontrak proposed adalah acuan implementasi berikutnya. Tidak ada perubahan handler, schema database, transaksi, custody atau vendor melalui dokumen ini.

## Sumber kontrak dan versi

[OpenAPI 3.1.1](openapi.json) adalah hasil machine-readable; [contract.mjs](contract.mjs) adalah sumber yang diedit. Jalankan `npm run docs:api:build` untuk menghasilkan JSON dan reference per area, lalu `npm run docs:api:check` serta `node scripts/check-docs.mjs`. Jangan mengedit file generated sendirian. Acuan format: [spesifikasi resmi OpenAPI](https://spec.openapis.org/oas/v3.1.1.html).

Nama path/payload proposed di bawah menjadi baseline integrasi. Ini detail engineering dalam mandat, bukan keputusan vendor/legal baru. Perubahan path, required field, enum, precision atau perilaku yang mengubah makna perlu memperbarui versi kontrak, contoh, coverage dan client yang terdampak. Current `/api/v1/auth/*` dan `/api/v1/session` mempertahankan payload raw existing; jangan menyisipkan envelope baru diam-diam. Domain baru memakai `/api/v1/*`; `/api/v1/demo/*` hanya scenario controls D0. Environment berasal dari konfigurasi server, tidak dari query/body/header bebas client.

## Akses dan acting party

Semua resource privat memerlukan `genz_session` dan current authorization pada resource. Login membuktikan kontrol wallet, bukan KYC, eligibility, admin atau kewenangan institusi. Capability pada setiap operation adalah vocabulary target, belum grant yang tersedia di database. Capability membatasi aksi; resource/project/offering/party scope, expiry/revocation dan mandat tetap diperiksa.

`X-Acting-Party` opsional memilih person/organization yang memang muncul di `getAccessContext`; server memverifikasi membership/mandat pada setiap request. Bila satu party default sah tersedia, server dapat menggunakannya; bila ambigu, 422 `INVALID_INPUT`. Client tidak menentukan `actorAccountId`, reviewer, owner final, published timestamps, paid/funded/eligible flags atau privileges. ID yang dikenal tidak memberikan permission. Detail resource tidak berizin dapat dikembalikan sebagai 404 `RESOURCE_NOT_FOUND` untuk menghindari enumeration; 403 dipakai untuk aksi/capability yang tidak sah tanpa membocorkan resource lain.

Investor baca hanya approved/published investor projections. Admin memakai `/admin/*` untuk draft/original dan current capability. Eligibility diperiksa sebelum quote/subscription, bukan syarat umum membaca approved investor copies. Self-grant dilarang; proposed grant tetap pending sampai authority berbeda menyetujui, sesuai scope delegasi yang sah. Bootstrap admin pertama melalui provisioning server yang diaudit, bukan endpoint publik, role selector atau grant otomatis saat login.

Catalogue/tujuh tab/approved copies tetap bisa dibaca sesudah login meskipun user belum memiliki party finansial atau eligibility. Party/wallet link owner untuk command finansial diprovision melalui trusted server onboarding berdasarkan proof account yang sah; wallet control tidak membuat legal identity/KYC approved. Organization acting party memerlukan mandate. Tidak ada automatic legacy Solana/EVM merge. Bila belum ada owner-party yang sah, finance commands tidak dijalankan; jangan menjadikan kosongnya grant admin sebagai alasan menutup approved investor reading.

## Origin, cookies dan transport

Auth mutations existing dan seluruh private proposed POST/PATCH mewajibkan exact configured `GENZ_APP_ORIGIN`. Public inquiry menerima exact configured marketing Origin; respons sukses tidak memerlukan sesi app. Origin allowlist bukan autentikasi: public intake tetap rate-limited. Konfigurasi CORS harus explicit; jangan memakai wildcard bersama credentials. Provider adapter memakai signature, tidak session/Origin browser.

Browser menggunakan credentials/cookie sesuai origin yang dikonfigurasi; rahasia token tidak dikirim dalam JSON atau disimpan di sessionStorage sebagai auth. Cookie auth existing HttpOnly dan Secure pada HTTPS. Host, HTTPS, headers transport dan konfigurasi cookie production tetap perlu deployment review.

Request JSON memakai `Content-Type: application/json`, UTF-8, schema strict dan menolak field tak dikenal. Proposed limit umum 64 KiB; draft editorial/report maksimum 512 KiB, upload bytes lewat private upload intent maksimum 25 MiB. Auth existing tetap 8 KiB. Batas byte berlaku walaupun batas jumlah/karakter field masih mengizinkan payload lebih besar. Endpoint tanpa body tidak menerima business flags melalui query sebagai pengganti body. Proxy/network dapat menghasilkan non-JSON errors atau timeout; client tidak menganggap setiap transport failure berarti command gagal commit.

## Envelope dan error

Domain proposed sukses:

```json
{
  "data": {},
  "requestId": "11111111-1111-4111-8111-111111111111",
  "environment": "demo",
  "asOf": "2026-10-18T03:00:00Z",
  "provenance": {
    "kind": "synthetic",
    "sourceIds": [],
    "datasetVersionId": "22222222-2222-4222-8222-222222222222",
    "reviewedAt": null
  }
}
```

`data` pada contoh di atas hanya penjelasan envelope; payload endpoint harus memenuhi schema spesifik di OpenAPI. `asOf` menyatakan snapshot response, bukan janji data live. `provenance.kind`: synthetic, reviewed, provisional atau system. Response list menambahkan `page: { nextCursor, hasMore }` dan `data` berupa array. Actual auth/error tetap mengikuti schema raw existing yang terpisah.

Error proposed mempunyai `error: { code, message, retryable, fieldErrors }`, `requestId`, `environment`; `fieldErrors` berisi `{ path, code, message }` dengan path JSON Pointer, atau array kosong. Jangan memasukkan stack trace, credential, original document URL atau identitas pihak lain ke error. Client menggunakan code dan status; message dapat berubah/diterjemahkan. `retryable` bukan izin mengirim pembayaran baru.

| Status | Makna dan tindakan client |
|---|---|
| 400 | JSON/query/cursor invalid; perbaiki request, jangan terus retry |
| 401 | Sesi/proof/signature tidak valid; ulang auth yang relevan, bukan bypass |
| 403/404 | Aksi/resource tidak tersedia bagi actor; jangan menebak grant atau ID |
| 409 | Conflict state/business/idempotency; refresh resource dan gunakan code spesifik |
| 412 | `If-Match` stale; baca current resource, tinjau perubahan sebelum command baru |
| 413/415/422 | Body terlalu besar, media type atau field/domain input salah |
| 428 | `If-Match` wajib tetapi belum diberikan |
| 429 | Tunggu `Retry-After` pada proposed endpoints; actual auth belum menjanjikan header itu |
| 503 | Service/provider unavailable; pertahankan key intent dan rekonsiliasi bila outcome command tidak diketahui |

`QUOTE_EXPIRED`/`TERMS_CHANGED` memerlukan quote/consent baru. `ELIGIBILITY_REQUIRED` membuka review eligibility tanpa menutup bacaan approved. `INSUFFICIENT_FUNDING` tidak membuat claim payout; `ALREADY_CLAIMED` tidak membuka claim baru. `RECIPIENT_CHANGED` memerlukan review binding/payout terkini. `RECONCILIATION_REQUIRED` berarti tunggu/selesaikan rekonsiliasi, bukan blind resend.

## Pagination, query dan concurrency

List memakai `limit` 1–100, default 20, dan cursor opaque. Sort baseline: `(created_at DESC, id DESC)` pada resource immutable/created event; activity/audit memakai `(occurred_at DESC, id DESC)`/`(recorded_at DESC, id DESC)`. First page menetapkan snapshot cutoff. Cursor ditandatangani server, terikat actor/acting party, environment, resource scope, filter, sort dan cutoff; TTL target 24 jam. Cursor rusak/expired/filter berubah: 400 `INVALID_CURSOR`; mulai first page. Current permission tetap dicek tiap page. `hasMore: false` harus `nextCursor: null`; empty list 200 `data: []`, bukan 404. Offering tujuh tab adalah array tepat tujuh, bukan paginated list.

Filter yang tidak tercantum ditolak 400 `INVALID_QUERY`. `locale` default `en`; `variant` default `investor_copy`; `versionId` dokumen/laporan yang tidak diberikan memilih published version terbaru yang sah. Performance `from/to` default bulan kalender UTC berjalan, `from <= to`, rentang maksimum 366 hari. Tanggal API ISO/RFC 3339; presentation locale tidak mengubah data atau currency. ID semua resource target berupa UUID opaque; slug hanya navigation, bukan authorization boundary.

Mutable resource mengembalikan versi `revision.version`; strong ETag berbentuk `"v3"`. `If-Match` pada operasi bertanda concurrency harus cocok exact version, diperiksa di transaksi yang sama dengan mutation. List item version dapat dipakai membentuk tag tersebut. Review/publish mengikat version yang direview; publication tidak mengambil draft terbaru yang berbeda. Tidak ada wildcard `If-Match: *` atau force override.

## Idempotency dan pekerjaan asynchronous

Mutation bertanda wajib menerima `Idempotency-Key` UUID random baru untuk satu intent. Scope: environment + authenticated account + acting party + operation + resource + key; public inquiry memakai operation/origin + key random dengan rate limit. Jangan mengirim alamat/kontak sebagai key. Hash body canonical dan semantic query ikut dicatat. Key sama/body berbeda: 409 `IDEMPOTENCY_CONFLICT`; command masih dieksekusi: 409 `COMMAND_IN_PROGRESS` atau replay 202 yang sudah committed. Replay berhasil mengembalikan business resource yang sama dan status awal, sesudah current authorization diperiksa lagi.

Target replay cache minimum 24 jam. Business uniqueness/reservations tidak kedaluwarsa bersama cache: subscription/quote/allocation/entitlement/claim/refund IDs tetap mencegah efek ekonomi ganda. Sesudah timeout, baca resource/poll atau retry key yang sama; jangan membuat key baru untuk memaksa pembayaran. Retensi inquiry menghapus data terkait/cache sesuai policy, tidak menghidupkan kembali inquiry dari cached response. Auth challenge/verify memakai single-use nonce, bukan aturan replay idempotent domain; replay proof ditolak.

202 berarti durable acceptance, bukan final settlement, funding, claim atau publication. Operation async browser mengembalikan `Location` menuju operation polling yang dirujuk `x-poll-operation`, dan `Retry-After` target default dua detik; client menggunakan backoff. Provider callback cukup durable ack, tanpa poll oleh provider. Worker retry memakai command/business IDs, bukan mengandalkan webhook sekali atau urut. Tidak ada klaim exactly-once delivery; efek sekali ditegakkan dengan transaction/unique IDs/reservation/reconciliation.

## Uang, FX, hak dan registry

`Money = { currency, minorUnits, scale }`; IDR scale 0, IDRX 2, USDC 6, ETH 18. `minorUnits` integer base 10 string, nonnegatif, tanpa eksponen; raw chain amount harus <= uint256 dan lolos batas/cap domain. Input quote harus positif. `RightsMoney` khusus IDR scale 0. Units dan rasio memakai decimal string; rasio `0.15` berarti 15%. JSON number hanya untuk metadata seperti decimals, count, version atau chain ID.

Registry mengikat environment, chain, token address dan decimals; symbol bukan identitas. Target hanya Base Sepolia 84532: test USDC, Mock IDRX yang benar-benar dideploy dan test ETH. Address mock/provider tidak ditentukan dari contoh. Unconfigured asset tidak menerima input; salah symbol/address/chain ditolak atau ditandai rejected oleh worker bila baru diketahui sesudah ingestion. D0 adapter tetap synthetic, tanpa approval/transfer aset nyata. Mainnet 8453/live belum diaktifkan.

Quote menyatakan exact terms/model version, input raw amount, FX rate/basis/time, gross/net rights, fees/min_net/expiry serta payout/refund policy versions. Gross rights berasal dari input human amount × IDR rate; rounding floor ke minor unit dan residual dicatat terpisah. Fee dalam currency berbeda memerlukan conversion legs/basis yang eksplisit; jangan menjumlah nominal mentah. Client tidak menghitung hak final sendiri. Quote rate bukan bukti provider executable capacity; unavailable route menghasilkan 503, tanpa menerima dana.

Subscription mengikat quote yang belum expired, dokumen wajib, risk acknowledgement, current eligibility dan cap reservation secara atomik. Server memberi consent timestamp. Receipt input/finality tidak membuktikan conversion atau net bank settlement. Admin settlement request hanya proposal dengan evidence; approved/reconciled net funds + approved closing diperlukan sebelum allocation. Units diturunkan server dari model, bukan angka yang dipilih client. Principal nullable bila model tidak menjanjikan principal; distribusi income tidak otomatis capital recovery.

## Distribusi, payout dan recovery

Produksi/telemetry, invoice, cleared collection dan distribusi tetap terpisah. Batch mengikat period/model/report/record-date serta collection refs yang tidak dihitung ganda. Server menghitung snapshot entitlement; approve tidak sama dengan funding. Verified funding terikat batch/pool dan payout asset, dengan reserved + claimed tidak melebihi available funds.

Entitlement mempunyai nilai rights IDR dan exact `payoutAssetId/payoutAmountMinor/payoutPolicyVersionId`, serta payout quote/expiry bila perlu FX. Claim request menyertakan nilai payout yang diharapkan sebagai guard, bukan perintah menghitung atau menentukan jumlah. Jika policy/quote/value berubah, 409; refresh/reconsent sesuai bound terms. Provider/payout currency nyata belum dipilih; fixture D0 dapat memakai Mock IDRX 1:1 sintetis. Jangan menyimpulkan live payout selalu IDRX/USD dari fixture.

MVP target claim penuh atas net entitlement yang tersedia; tidak menerima arbitrary amount/recipient address atau melakukan partial payout diam-diam saat funding kurang. Verifikasi owner, current recipient binding/version, exact approved payout quote/policy, availability dan claimed status dalam satu transaksi reservasi. Duplicate/concurrent request berbeda key tetap tidak membayar dua kali. Unknown/replaced transaction menahan reservation sampai aman direkonsiliasi; gagal transfer tidak menghapus hak/liability. Receipt terbit setelah finalized + domain reconciliation; D0 receipt synthetic tidak menyatakan transaksi on-chain.

Same-owner recovery D1 melalui bukti kontrol/identity dan issuer/security approval yang sah. Freeze/disable old recipient/representation sebelum replacement, fail closed saat unknown. Stable position/party IDs, snapshot hak dan claimed history tidak berubah. Recovery bukan assignment ke pemilik baru atau pemulihan private key. Tidak ada API yang meminta seed phrase/private key.

## Evidence, publikasi dan download

Public inquiry tidak menerima sensitive upload. Assigned staff/admin memakai upload intent private PUT lima menit, hash/size/MIME allowlist dan quarantine/scan. Complete upload hanya mengantrekan verifikasi; object belum boleh menjadi published evidence sampai server memeriksa bytes dan menyatakan verified. Reference block tidak menerima arbitrary HTML/URL/formula. Lima bentuk block awal selaras dengan `packages/content-schema`; perluasan tipe memerlukan kontrak/schema/renderer baru.

Fact updates menghasilkan draft snapshots. Editorial revision mengikat `factVersions`, terms/model dan typed blocks; investor projection memakai published snapshot sebelumnya sampai publish baru atomik. Exact draft version direview; corrections membuat version/reason/supersedes links baru. Published terms/report/document dan historical consent tidak ditimpa. `publishedAt`, approval actor dan version IDs dibuat server. Maker tidak mengesahkan pekerjaannya sendiri untuk keputusan ber-mandat; actor separation demo boleh synthetic berlabel, bukan grant admin dari client.

`getDocumentAccess` mengembalikan grant download terikat session/party/document/version, maksimal 60 detik, dan **path app proxy**. GET bytes memeriksa current session/grant/resource policy lagi, sehingga URL lama tanpa sesi atau sesudah revocation tidak memberi bytes. Original butuh capability `document:original:read`, bukan hanya eligibility. Private object storage read URL/object key tidak keluar ke investor response. Same-origin media proxy memakai aturan sama. Response binary `no-store`, Content-Type hasil verifikasi dan filename aman; byte-range belum menjadi bagian MVP contract.

## Retensi dan audit

Inquiry tidak berlanjut: hapus 90 hari sejak interaksi bermakna terakhir; aktif: review setiap 90 hari. Notification retry, poll atau sekadar buka halaman tidak mereset jam. Active review dapat mencatat alasan keep/not_proceeding; retention runner hanya menjalankan policy due, bukan force delete arbitrer. Inbox/provider/backup lifecycle harus dikonfigurasi sebelum retensi diaktifkan. Ledger/evidence investasi memiliki retensi terpisah. Audit deletion tidak mempertahankan PII inquiry yang diwajibkan dihapus; simpan tombstone minimum menurut policy yang disetujui.

Setiap mutation admin/domain mencatat actor, acting party, resource/version, request ID, reason bila relevan, before/after refs atau reversal links. Ledger final immutable; correction melalui reviewed reversal/correcting journal, bukan PATCH saldo. Queue/reconciliation jobs membawa business IDs dan menyimpan outcome/breaks. Query audit/ledger dibatasi scope/capability, tanpa credential atau signing material.

## Adapter provider yang belum dipilih

`POST /webhooks/providers/{providerKey}` mendefinisikan **internal normalized adapter contract**, bukan format webhook vendor final. Endpoint disabled sampai provider/key/schema mapping dikonfigurasi. Adapter vendor masa depan memverifikasi signature asli vendor, lalu menormalisasi event sesuai kontrak ini; jangan menganggap vendor otomatis memakai HMAC ini.

Internal wire: `X-GenZ-Timestamp` Unix seconds, `X-GenZ-Event-Id`, `X-GenZ-Signature: v1=<64 lowercase hex>`. Pilih secret aktif untuk provider/environment dari konfigurasi server. HMAC-SHA256 atas byte `timestamp + "\n" + eventId + "\n" + rawBody`; rawBody adalah bytes sebelum parse, tidak dire-serialize. Bandingkan constant time; timestamp toleransi 300 detik; event header cocok body; body limit 64 KiB. Key rotation diverifikasi terhadap daftar key aktif terbatas; key tidak dikirim client atau dicatat log.

Dedupe durable `(providerKey, environment, eventId)` + body hash: duplikat identik 202 dengan state duplicate, key sama/body berbeda 409 `IDEMPOTENCY_CONFLICT`. Invalid/expired signature 401; unavailable storage 503 tanpa ack palsu. Event hanya observation/hint: asset/chain/receipt/finality/FX/funding/recipient dan domain outcome diverifikasi ulang. POST financial notifications dari browser juga bukan bukti paid/funded.

## Batas fase dan apa yang belum selesai

D0: satu solar synthetic, wallet auth nyata, inquiry nyata, synthetic investment adapter terisolasi. Scenario controls memerlukan `demo:control`, ownership dan generation/version, tidak memberi grants atau login bypass. Generated offering/resource IDs mengikat run namespace server; reset generation baru tidak menghapus history/auth atau membuka double claim.

D1: kontrak/indexer/recovery/provider adapter memerlukan engineering review, test deployment registry dan test funds. Live dependency tracking read-only; tidak ada API enable-live, secondary transfer/swap/staking, functional reward, point redemption, native TGE atau portal operator penuh. Kesiapan API tidak membuktikan legal/custody/mandate/security/continuity terpenuhi. [Coverage](coverage.md) menjelaskan M15/M17 yang memerlukan bukti manusia/UI di luar kontrak HTTP.
