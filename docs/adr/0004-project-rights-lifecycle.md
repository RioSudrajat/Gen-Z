---
status: accepted
decision_date: 2026-10-20
recorded: 2026-10-20
---
# Unit hak proyek dengan distribusi dan penyelesaian hak terpisah

Founder menerima rekomendasi riset mekanisme RWA pada 20 Oktober 2026: gunakan restricted ERC-20 per offering/series dengan kelas hak identik, unit partisipasi tetap selama haknya berlaku, mint setelah net settlement dan closing, serta distribusi kas dan pencatatan modal yang terpisah. Pilihan ini sesuai cashflow infrastruktur yang illiquid dan mencegah payout income atau pengembalian modal mengurangi hak partisipasi melalui burn tanpa dasar terms. Dasar perbandingan: [riset mekanisme](../research/rwa-mechanisms-2026-10-20.md); aturan aktif: [lifecycle RWA](../engineering/rwa-lifecycle.md) dan [finance](../product/finance.md).

## Konsekuensi

- Income claim tidak membakar unit. Capital recovery tidak otomatis mengurangi unit atau bobot partisipasi; hak modal, income dan residual ditetapkan per offering.
- Burn hanya mengikuti pengakhiran hak yang sah atau pembatalan issuance yang direkonsiliasi. Payout dan burn harus atomic, atau klaim pembayaran pengganti sudah persisten dan didukung dana terikat. Akhir tenor menghentikan accrual sesuai terms tanpa menghapus accrued unpaid claims, default atau sengketa yang masih berlaku.
- Transfer rutin dan allowance bypass ditolak oleh kontrak. Recovery mempunyai jalur khusus, menjaga total hak dan claimed history. Admin memakai authority minimum, approval dan audit; mandat produksi, signers serta upgrade model tetap dependency.
- Chain menegakkan unit, business IDs, funding reserve, recipient binding dan claimed state. Legal evidence, identity, collection serta calculation tetap off-chain berversi dan direkonsiliasi. Wallet, saldo dan nominal on-chain dapat terlihat publik; dokumen sensitif dan identity mapping tidak dipublikasikan.
- Target capital recovery bertahap boleh diuji melalui underwriting; ini bukan keputusan principal guarantee, bentuk debt wajib, tenor atau angka proyek nyata. Daftar field/ABI, versi library, interface tambahan dan kontrak produksi memerlukan engineering review.

## Alternatif yang dipertimbangkan

Rebase atau kenaikan NAV/token dapat sesuai fund yang mengakumulasi income, tetapi tidak menjadi default payout hybrid proyek Gen-Z. Burn native token seperti model protocol-fee tidak menyelesaikan kewajiban kepada investor proyek. Vault dengan redemption terbuka memerlukan hak dan sumber likuiditas tersendiri; ERC-4626/7540, AMM, lending atau multichain tidak ditambahkan ke MVP. ERC-3643/7943 dan B20 tetap kandidat evaluasi sesuai kebutuhan mitra dan network, bukan klaim compliance atau pengganti terms.

Status accepted berlaku untuk arah lifecycle dan boundary, bukan bukti implementasi. Kontrak investasi, domain keuangan dan indexer belum tersedia; D0 tetap sintetis dan D1 hanya testnet setelah review.
