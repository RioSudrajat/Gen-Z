# Fondasi Base: konfigurasi, identity dan login wallet

Tanggal: 18 Oktober 2026, Asia/Jakarta. Status: implementasi fondasi login, bukan rilis lifecycle investasi. Acuan produk: [spec v1.1-base](../archive/mvp-spec-2026-10-18.md), [arsitektur](../archive/app-architecture-2026-10-18.md), [schema/flows](../archive/schema-flows-2026-10-18.md), [riset Base](../research/base-evm-2026-10-18.md).

## Perilaku yang tersedia

Pengguna membuka `/auth`, memilih wallet EVM yang ditemukan, menyetujui Base Sepolia bila perlu, lalu menandatangani SIWE challenge. Server memverifikasi exact message, context dan signature; nonce dikonsumsi atomik sebelum sesi opaque disimpan di PostgreSQL. Reload tetap mengenali sesi, pergantian akun memerlukan proof baru dan merotasi sesi, logout mencabut sesi di server. Login tidak memberi grant/admin, eligibility atau izin transaksi dana.

Discovery memakai EIP-6963 dan injected fallback, tanpa allowlist merek. MetaMask, Phantom, OKX dan Binance Wallet dapat memakai jalur ini bila versi/account/network mendukung; nama wallet bukan chain. Ini tidak menyatakan seluruh extension vendor sudah diuji. Solflare yang hanya mendukung akun Solana tidak menjadi signer Base. QR WalletConnect belum dipasang/dikonfigurasi; mobile memakai provider browser dalam wallet bila tersedia.

| Bagian | Implementasi |
|---|---|
| Library | wagmi 3.7.7, viem 2.57.7, TanStack Query 5.104.3; versi dipin dalam satu lockfile root |
| Network | `GENZ_EVM_CHAIN_ID=84532`, Base Sepolia untuk demo/testnet; chain lain dan environment live ditolak |
| Registry | `src/lib/base.ts` memisahkan native USDC Base/Sepolia serta IDRX Base, 6/2 decimals; Mock IDRX belum diberi alamat palsu |
| Client | Provider hanya pada island login, config/QueryClient per instance; SSR aktif dengan noop storage, tidak menyimpan sesi auth dalam browser storage |
| API | `/api/v1/auth/challenges`, `/verify`, `/logout`, `/api/v1/session`; strict JSON/origin/size/schema dan private no-store |
| Proof | SIWE exact challenge berisi address, domain/URI, chain, nonce, intent, issued/expiry, request ID, environment; EOA ECDSA verification |
| Smart account | Jalur viem ERC-1271/6492 bersyarat `GENZ_BASE_RPC_URL` server-only, chain RPC dicek, timeout 5 detik dan retry 0; tanpa RPC proof yang tidak valid sebagai EOA ditolak |
| Session | Opaque HttpOnly cookie, SameSite=Lax, Secure di HTTPS; hanya hash token disimpan; EOA 8 jam, contract proof 1 jam; validasi namespace/chain/environment/expiry/disabled account |
| Persistence | PostgreSQL + Drizzle di atas pool `pg`; satu runner SQL checksum/advisory transaction lock |
| Financial state | Tetap nonaktif; tidak ada approval token, transfer, mint atau transaksi investasi saat login |

Smart-account policy/owner change tidak dideteksi secara real time oleh sesi yang sudah diterbitkan; expiry/revoke membatasi sesi. Perintah finansial belum tersedia dan nanti membutuhkan proof/mandate serta policy sensitif tersendiri. Kompatibilitas Safe, undeployed wallet, custom verifier dan RPC provider nyata belum dibuktikan lewat sesi ini; jangan memberi label dukungan produksi dari keberadaan jalur kode.

## Cutover dan data lama

`db/migrations/20261017175425_base_siwe_identity.sql` dihasilkan lewat Drizzle Kit, kemudian SQL direview dan ditambah pencabutan legacy proofs. Prefix file adalah timestamp UTC generator; tanggal laporan memakai Asia/Jakarta. Migrasi `0001_wallet_identity.sql` tidak diubah.

- Akun lama tetap dengan ID/address yang sama, `namespace=solana`, `chain_id=legacy`. Chain historis akun tidak pernah dicatat dalam tabel awal, sehingga tidak dikarang sebagai devnet/mainnet tertentu.
- Unique key baru namespace + chain ID + normalized address. EVM address disimpan lowercase, ditampilkan checksum; chain/namespace tidak digabung otomatis.
- Sesi dengan proof method legacy dihapus dan challenge legacy yang belum dikonsumsi ditutup saat migrasi pertama. Migrasi ulang tidak mencabut sesi EVM baru.
- Tidak ada reset volume, penghapusan akun, migrasi posisi atau account linking Solana ke EVM.

`npm run setup:platform` telah berhasil pada PostgreSQL demo lokal, mempertahankan konfigurasi/credentials dan menambahkan chain setting yang belum ada. Nama env Solana lama tidak lagi dibaca runtime. Snapshot source sebelum perubahan berada pada `.cache/base-auth-before-20261018`; file private environment tidak disalin ke snapshot tersebut.

## Verifikasi

Story yang diuji: `/auth` → provider EVM → SIWE challenge API → signature asli → server proof dan PostgreSQL → sesi → protected shell → reload/logout.

| Pemeriksaan | Hasil dan bukti |
|---|---|
| TypeScript dan routes | PASS: `npm run check --workspace=@gen-z/platform` |
| Production build | PASS: `npm run build:platform`, Next.js 16.4.2 dengan Webpack bawaan |
| Metadata migrasi | PASS: `npm run db:check --workspace=@gen-z/platform`; snapshot vs schema dan PostgreSQL introspection juga diuji |
| Auth/DB/browser | PASS: `npm run test:platform`, 15 tests, 15 pass, 0 fail; database/container sementara terisolasi |
| Signature/context | PASS: ECDSA asli, exact domain/URI/chain/nonce/intent/time/environment/request ID; wrong account/signature/browser ditolak |
| Replay/session | PASS: concurrent proof hanya satu sesi, expiry/disabled/wrong chain ditolak, case normalization satu identity, ganti akun merotasi sesi, logout berlaku server-side |
| Migration legacy | PASS: database legacy berisi akun/sesi/challenge dimigrasikan; akun utuh, proof lama dicabut, rerun mempertahankan sesi EVM baru |
| Browser | PASS: EIP-6963 fixture dengan signature asli, network switch, rejected switch/signature, account berubah saat signing, unavailable dan retry, reload/session/logout; tanpa bypass di app |
| UI | PASS: 320/390/1440px, light/dark, no horizontal overflow, calculated contrast AA, skip-link keyboard, visible focus CSS dan reduced-motion context; screenshots diperiksa |
| Dependency produksi | PASS: `npm audit --omit=dev`, 0 advisory produksi pada pemeriksaan setelah perubahan |
| Setup lokal | PASS: PostgreSQL healthy, migration runner berhasil, doctor memeriksa Base Sepolia dan kolom identity/SIWE |
| Server lokal yang sudah berjalan | PASS: `http://localhost:3001/auth` mengembalikan 200 dan copy EVM/Base Sepolia; `/api/health` 200; `/api/ready` 503 dengan `walletAuthenticationReady=true`, `financialTransactionsEnabled=false` sesuai batas fitur |

Turbopack lokal gagal menjalankan worker CSS, termasuk saat diulang di luar sandbox. Script build/dev kini memakai `--webpack`, flag resmi Next.js yang tersedia pada dokumentasi versi terpasang. Warning nonfatal dependency dinamis `ox/tempo` muncul dari `viem/chains`; aplikasi tidak mengintegrasikan Tempo. Tidak mengganti framework atau menambal dependency upstream. Kombinasi `ssr:true` dengan `storage:null` juga memicu hydration error pada wagmi terpasang; `createStorage({storage:noopStorage})` menjaga hydration dan tidak mempersistensikan sesi browser. Kedua masalah sudah diperbaiki pada jalur yang diuji.

Artefak visual: [login mobile](../../.cache/platform-verification/wallet-auth-mobile.png), [session desktop](../../.cache/platform-verification/wallet-session-desktop.png). Provider uji hanya ada di test harness, tidak dikirim dalam production source. Belum dilakukan: konfirmasi wallet extension vendor nyata, test contract-account melalui RPC/live EVM, contract test/deploy, konversi atau transaksi dana.

## React dan Delivery Gate antislop

Mode: DURING, pilihan pengguna dalam sesi ini. Arah: mempertahankan UI login Gen-Z yang ada, palette mint/netral, sans untuk keterbacaan, satu kolom untuk urutan pemilihan wallet dan proof. ENERGY 1 / RHYTHM 1 / MOTION 1. Tidak membuat logo, aset, navigasi atau ilustrasi baru.

React review: PASS. Config/QueryClient memakai lazy state per provider; provider hanya di login, bukan semua route. Domain/database/secrets tetap server-only; props hanya return path yang sudah di-allowlist. Signing dimulai lewat event, ref mencegah duplicate click, effect discovery mempunyai cleanup, identity/chain dicek ulang sebelum proof dikirim. Peran/sesi tidak dipercaya dari state client. native buttons, loading/error/status feedback dan escape-free inline flow dipertahankan.

| Gate | Status dan bukti |
|---|---|
| R-02 | PASS: copy baru tidak memakai em dash; scan source login/session |
| R-03 | PASS: browser 320/390/1440px tanpa overflow; screenshot mobile diperiksa |
| R-17 | PASS: tidak ada statistik marketing; chain 84532 berasal dari konfigurasi nyata |
| R-18 | PASS: tidak ada testimonial/avatar fiktif |
| R-23 | PASS: logo, palette, layout dan navigasi lama dipertahankan; tidak membuat aset baru |
| R-24 | PASS: Brand memiliki href `/auth` yang tersedia menurut source; switch-wallet dan skip link juga dijalankan dalam browser |
| R-25 | PASS: browser menghitung contrast AA pada auth/session dalam light/dark |
| R-26 | PASS: wallet sign-in, refresh, theme, switch-wallet dan logout memiliki efek dan diuji |
| R-27 | PASS: loading/discovery, wallet unavailable, pending dan error mempunyai feedback; rejection diuji |
| R-28 | PASS: tidak ada FAQ tambahan |
| R-32 | PASS: native button/link semantics dan focus-visible dipertahankan; skip-link keyboard diuji |
| R-33 | PASS: UI ditulis langsung di TSX melalui patch sumber; tidak memakai script pengganti UI/CSS |
| R-34 | PASS: light/dark theme, persistensi pilihan, layout dan contrast diuji |
| R-35 | PASS: production build serta click-through sign-in/retry/theme/switch/logout selesai; 15 test lulus |
| R-36 | PASS: tidak menambah klaim audit/compliance/keamanan; keterbatasan fitur terlihat |
| R-37 | PASS: Design Read diumumkan sebelum edit UI; preservasi layar existing, dial 1/1/1 |
| R-38 | PASS: session menampilkan address/proof nyata dari test, tanpa proyek/return/team palsu |
| R-01 | PASS: tidak menambah gradient/glow |
| R-04 | PASS: tidak menambah icon set atau ikon dekoratif |
| R-06 | PASS: sans existing dipertahankan untuk keterbacaan pesan/proof; tanpa monospace dekoratif |
| R-07 | PASS: tidak menambah grid/pola latar |
| R-08 | PASS: tidak menambah panah dekoratif |
| R-09 | PASS: environment ditampilkan sebagai teks untuk membedakan demo; tanpa capsule badge |
| R-10 | PASS: tidak menambah glassmorphism |
| R-12 | PASS: tidak menambah shadow |
| R-13 | PASS: tidak menambah glow |
| R-14 | PASS: daftar wallet adalah pilihan sejajar dalam list, bukan feature cards marketing |
| R-19 | PASS: tidak menambah motion; pending memakai teks; reduced-motion context diuji |
| R-22 | PASS: tidak menambah ilustrasi |
| Dials | PASS: 1/1/1 sesuai satu alur login yang tenang; tidak menambah choreography |
| Focal point | PASS: heading dan pemilihan wallet mengarahkan satu aksi sign-in |
| Whitespace | PASS: spacing existing memisahkan environment, instruksi, pilihan dan konsekuensi signature |
| Accent | PASS: mint dari brand existing, tanpa warna aksen baru |
| Motif | PASS: logo Gen-Z dan mint/netral existing dipertahankan pada auth/session |
| Design Read | PASS: arah preservasi dan dial diumumkan sebelum perubahan UI |
| C-1 | PASS: keputusan visual adalah preservasi; perubahan teks menjelaskan akun EVM dan demo Base Sepolia |
| C-2 | PASS: seluruh kontrol dalam scope punya perilaku, tanpa dead control |
| C-3 | PASS: konten hanya identitas, pemilihan wallet, proof dan status sesi |
| C-4 | PASS: responsive/theme/rejection/unavailable/race paths diuji |
| C-5 | PASS: tidak ada statistik/testimonial/security claim palsu |
| R-05 | PASS: tidak menambah template marketing; satu alur login existing |
| R-11 | PASS: radius existing membedakan button dan panel, bukan semua pill |
| R-15 | PASS: CTA spesifik Sign in with, Refresh wallet list, Sign out |
| R-16 | PASS: tidak menambah buzzword marketing |
| R-20 | PASS: identitas Gen-Z dipertahankan; tidak ada redesign/template baru |
| R-21 | PASS: light/dark toggle tetap berfungsi; dark tidak dipaksakan |
| R-29 | PASS: mint/teal + neutrals existing; tidak menambah palette |
| R-30 | PASS: tidak mengadopsi layout produk lain |
| R-31 | PASS: alasan warna/layout/font/spacing dan list dijelaskan di atas; tanpa teknik visual baru |

## Pekerjaan berikutnya dalam rencana

Fondasi ini menyelesaikan konfigurasi dan cutover/login dari urutan riset. Inquiry persisten/outbox, resource grants dan canonical project/terms model mendahului investment workspace. D0 finansial tetap synthetic. Kontrak Solidity, test ETH/USDC/Mock IDRX deployment, allocation/distributor/recovery, durable indexer/finality serta provider conversion/claim tetap tahap berikutnya. Tidak ada live funds atau mainnet readiness yang disiratkan oleh login yang berhasil.
