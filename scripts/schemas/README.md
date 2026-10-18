# Schema validator OpenAPI

`openapi-3.1.schema.json` disalin dari [schema resmi OpenAPI 3.1 tanggal 2025-09-15](https://spec.openapis.org/oas/3.1/schema/2025-09-15), diakses 18 Oktober 2026. File sumber dipertahankan utuh; schema tersebut memeriksa struktur OpenAPI, tanpa validasi isi Schema Object.

`check-api-contract.mjs` memvalidasi isi Schema Object dan contoh payload secara terpisah dengan JSON Schema 2020-12/Ajv. Untuk validator struktur, referensi dinamis `#meta` pada base schema dinormalisasi ke target lokal ekuivalen `$defs/schema` karena resolusi non-root dynamic anchor Ajv; tidak ada extended dialect override dalam kontrak ini. File schema asal tidak diubah. Syntax lain, local refs dan requirement mapping diperiksa tambahan oleh script.
