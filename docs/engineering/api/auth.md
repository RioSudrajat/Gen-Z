# Auth dan health

> Dihasilkan dari [contract.mjs](contract.mjs); edit sumber lalu jalankan `node scripts/build-api-contract.mjs`. Baseline 18 Oktober 2026.

[Indeks API](../api.md) · [OpenAPI](openapi.json) · [Konvensi](conventions.md) · [M01–M17](coverage.md). Contoh JSON request/response lengkap beserta schemas nested ada di OpenAPI. Status **proposed** berarti belum diimplementasikan.

| Operation | Method/path | Status | Acceptance |
|---|---|---|---|
| [getHealth](#gethealth) | `GET /api/health` | source | operational |
| [getReadiness](#getreadiness) | `GET /api/ready` | source | operational |
| [createChallenge](#createchallenge) | `POST /api/v1/auth/challenges` | source | M03 |
| [verifyWallet](#verifywallet) | `POST /api/v1/auth/verify` | source | M03 |
| [getSession](#getsession) | `GET /api/v1/session` | source | M03, M04 |
| [logout](#logout) | `POST /api/v1/auth/logout` | source | M03 |

## getHealth

**Liveness platform** — `GET /api/health`

Status: **source**; fase D0; sukses 200 → `Health`.

Akses: publik. Publik; tetap mengikuti Origin/rate limit yang disebutkan.



Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: tidak ada error domain terstruktur yang dimodelkan untuk health/readiness.

Source: [handler](../../../apps/platform/src/app/api/health/route.ts).


## getReadiness

**Readiness domain platform** — `GET /api/ready`

Status: **source**; fase D0; sukses 503 → `Readiness`.

Akses: publik. Publik; tetap mengikuti Origin/rate limit yang disebutkan.



Read/model atau command tunduk pada invariant dan akses di konvensi.

Error: tidak ada error domain terstruktur yang dimodelkan untuk health/readiness.

Source: [handler](../../../apps/platform/src/app/api/ready/route.ts).


## createChallenge

**Buat challenge SIWE** — `POST /api/v1/auth/challenges`

Status: **source**; fase D0; sukses 200 → `ChallengeResponse`.

Akses: publik. Publik; tetap mengikuti Origin/rate limit yang disebutkan.

Wajib `Origin` yang diizinkan. 

Simpan challenge 5 menit; cookie genz_login 600 detik. Single use; tanpa idempotency key.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `address` | Ya | EvmAddress |
| `chainId` | Ya | 84532 |

Error: **400** `INVALID_JSON`; **403** `INVALID_ORIGIN`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`.

Source: [handler](../../../apps/platform/src/app/api/v1/auth/challenges/route.ts).


## verifyWallet

**Verifikasi proof dan buat sesi** — `POST /api/v1/auth/verify`

Status: **source**; fase D0; sukses 200 → `ProofResponse`.

Akses: cookie challenge binding. Exact challenge dan browser binding yang valid; Origin app.

Wajib `Origin` yang diizinkan. 

Consume nonce atomik dan rotate sesi lama; EOA 8 jam, contract 1 jam. Replay ditolak 401.

| Field | Wajib | Tipe / batas |
|---|---|---|
| `challengeId` | Ya | Id |
| `address` | Ya | EvmAddress |
| `message` | Ya | string; maks 2048 karakter |
| `signature` | Ya | string; maks 4098 karakter |

Error: **400** `INVALID_JSON`; **401** `INVALID_WALLET_PROOF`; **403** `INVALID_ORIGIN`; **413** `BODY_TOO_LARGE`; **415** `JSON_REQUIRED`; **422** `INVALID_INPUT`; **429** `TOO_MANY_ATTEMPTS`; **503** `SERVICE_UNAVAILABLE`, `WRONG_RPC_CHAIN`.

Source: [handler](../../../apps/platform/src/app/api/v1/auth/verify/route.ts).


## getSession

**Baca sesi yang tersedia** — `GET /api/v1/session`

Status: **source**; fase D0; sukses 200 → `SessionResponse`.

Akses: session cookie dan scope resource. Sesi + current resource scope; actor/party diputuskan server.



Workspaces sekarang kosong; tidak memberi role/eligibility.

Error: **401** `UNAUTHENTICATED`; **503** `SERVICE_UNAVAILABLE`.

Source: [handler](../../../apps/platform/src/app/api/v1/session/route.ts).


## logout

**Cabut sesi dan challenge binding** — `POST /api/v1/auth/logout`

Status: **source**; fase D0; sukses 204 tanpa body.

Akses: publik. Publik; tetap mengikuti Origin/rate limit yang disebutkan.

Wajib `Origin` yang diizinkan. 

Hapus sesi current dan cookie; tanpa sesi pun 204 bila service tersedia.

Error: **403** `INVALID_ORIGIN`; **503** `SERVICE_UNAVAILABLE`.

Source: [handler](../../../apps/platform/src/app/api/v1/auth/logout/route.ts).


## Model respons

Schema nested, constraints dan contoh nilai lengkap ada di [OpenAPI](openapi.json). Domain proposed dibungkus envelope; auth existing raw.

### Health

| Field | Wajib | Tipe / batas |
|---|---|---|
| `service` | Ya | "platform" |
| `environment` | Ya | `demo` / `testnet` / `live` |
| `status` | Ya | "foundation" |
| `ready` | Ya | false |
| `financialTransactionsEnabled` | Ya | false |

### Readiness

| Field | Wajib | Tipe / batas |
|---|---|---|
| `service` | Ya | "platform" |
| `environment` | Ya | `demo` / `testnet` / `live` |
| `status` | Ya | "foundation" |
| `ready` | Ya | false |
| `financialTransactionsEnabled` | Ya | false |
| `code` | Ya | "PLATFORM_FEATURES_NOT_IMPLEMENTED" |
| `walletAuthenticationReady` | Ya | boolean |

### ChallengeResponse

| Field | Wajib | Tipe / batas |
|---|---|---|
| `challengeId` | Ya | Id |
| `message` | Ya | string |
| `chainId` | Ya | 84532 |

### ProofResponse

| Field | Wajib | Tipe / batas |
|---|---|---|
| `address` | Ya | EvmAddress |
| `expiresAt` | Ya | Timestamp |

### SessionResponse

| Field | Wajib | Tipe / batas |
|---|---|---|
| `accountId` | Ya | Id |
| `address` | Ya | EvmAddress |
| `namespace` | Ya | "eip155" |
| `chainId` | Ya | 84532 |
| `proofMethod` | Ya | `siwe-eoa` / `siwe-contract` |
| `expiresAt` | Ya | Timestamp |
| `environment` | Ya | `demo` / `testnet` / `live` |
| `workspaces` | Ya | array<schema>; maks 0 item |
