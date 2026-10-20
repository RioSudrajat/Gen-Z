# Security, akses dan retensi

**Baseline:** 18 Oktober 2026. Dokumen ini mencatat kontrol source yang tersedia dan requirement target. Bukan laporan audit atau sertifikasi. Scope [PRD](PRD.md), data [ERD](ERD.md), acceptance [M03–M04/M11–M15](product/requirements.md).

## 1. Aset dan trust boundary

Lindungi sesi, data inquiry, dokumen original/investor copy, versi terms/consent, hak/posisi, dana/reservasi, ledger dan mandat reviewer/signers. Browser, payload editor, webhook, RPC dan data operator merupakan input yang perlu divalidasi. Source/provenance tidak otomatis membuktikan kebenaran data.

Marketing publik hanya membawa informasi yang disetujui untuk publik. Resource app, API, unduhan dan cache membutuhkan session serta resource authorization di server. Auth entry tetap publik. Private storage tidak boleh dibuka hanya karena URL sulit ditebak.

## 2. Kontrol auth yang tersedia di source

| Kontrol | Implementasi/batas |
|---|---|
| Proof | Exact SIWE message: address, domain/URI, chain, request ID, expiry dan environment |
| Browser binding | Cookie HttpOnly; hash binding di challenge |
| Replay/concurrency | Consume nonce conditional dalam transaksi sebelum sesi dibuat |
| Session | Opaque token; database menyimpan SHA-256; expiry/account disabled/context diperiksa |
| Cookie | HttpOnly, SameSite=Lax session/Strict challenge; Secure pada HTTPS |
| Input/abuse | Origin check pada mutation auth, strict schema, JSON body maksimum 8 KiB, rate limit PostgreSQL |
| Chain | Auth hanya Base Sepolia 84532; live environment ditolak |
| Legacy | Identity namespace/chain terpisah; proof legacy ditolak; tidak automatic account merge |
| Cache | Response auth/session private no-store dan Vary Cookie |

EOA session maksimum delapan jam; contract-account proof session satu jam. Contract-account verification memerlukan RPC server-only dengan chain yang benar dan support yang diuji. Connector tersedia tidak membuktikan seluruh vendor/mobile/smart account telah diuji. [API](engineering/api.md) dan [service](../apps/platform/src/server/auth/service.ts) menjadi sumber detail.

## 3. Authorization target yang belum diimplementasikan

| Resource/aksi | Policy wajib |
|---|---|
| Approved offering/tujuh tab/investor copies | Sesi + resource read scope; eligibility transaksi tidak menjadi gate baca umum |
| Original sensitif | Capability/mandat spesifik; redaction/restriction reason terlihat pada copy |
| Inquiry/admin | Founder/admin berwenang; least privilege dan audit akses |
| Quote/subscription | Owner/org mandate + offering gate + eligibility valid |
| Position/distribution/claim | Entitled owner/mandate dan recipient terverifikasi; hak dan funding mencukupi |
| Review/publish/funding/recovery | Scoped actor, exact version, audit; pemisahan maker-checker/signers live sesuai mandat |

Session saat ini mengembalikan `workspaces: []`; belum ada role/grant/eligibility. Protected shell tidak membuktikan resource authorization tersedia. Return path harus divalidasi internal ketika dipakai; jangan mengasumsikan parameter `returnTo` sudah menjadi routing yang diimplementasikan.

## 4. Abuse cases dan kontrol target

| Kasus | Kontrol yang harus dibuktikan |
|---|---|
| Anonim membuka blob/API/deep link | Server auth/resource policy dan cache isolation pada setiap boundary |
| Browser memalsukan role, eligibility atau paid | Abaikan klaim client; current grant dan hasil domain diverifikasi server |
| Dua claim/allocation/refund bersamaan | Atomic reservation, unique business IDs dan reconciliation |
| Webhook/reorg/replacement/unknown tx | Dedupe chain/log + business IDs, canonical finalized policy, jangan blind resend |
| Draft/formula/editor berbahaya | Typed payload validation, sanitasi renderer, review versioned; bukan formula keuangan bebas |
| Operator membuat meter=kas | Pisahkan operasi, invoice, collection; review dan fund availability |
| Wallet recovery dipakai double claim | Same-owner proof/issuer approval, old binding disabled, stable entitlement/claimed history |

## 5. Privasi, retensi dan rahasia

Inquiry publik tidak meminta dokumen sensitif dan tidak otomatis masuk marketing. Tidak berlanjut: hapus 90 hari sejak interaksi terakhir; aktif: review tiap 90 hari. Intake menyimpan due date 90 hari dan satu outbox atomik; penghapusan/review otomatis, admin inbox, notification delivery dan lifecycle backup belum tersedia. Notification retries tidak mereset jam retensi. Bukti investasi dan ledger mempunyai kebijakan tersendiri, bukan ikut dihapus oleh aturan inquiry.

Credential hanya pada environment privat service; `PUBLIC_*`/`NEXT_PUBLIC_*` dianggap terbaca browser. Jangan memasukkan database/RPC credential ke package pure, artefak riset, response error atau log. Gunakan [setup lokal](operations/runbook.md) yang menjaga konfigurasi/data existing.

## 6. Readiness dan respons insiden

Domain investasi, kontrak, job worker, backup/restore, security review dan mandat live belum tersedia. Saat integrasi dibuat, siapkan deteksi reconciliation break, pause transaksi sesuai mandat, pencatatan insiden, preservasi bukti, komunikasi pihak terdampak dan uji pemulihan. Owner/SLA/authority produksi masih [O], bukan peran yang sudah terisi. [Dependency register](product/risks-and-dependencies.md) mencatat blocker; [Testing](TESTING.md) menetapkan pembuktiannya.
