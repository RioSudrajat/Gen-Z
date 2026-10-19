# Memelihara dokumentasi

Dokumentasi utama harus mudah ditemukan, mempunyai satu fungsi, dan membedakan scope yang disetujui, rancangan, implementasi serta hasil uji. Dasar struktur: [riset dokumentasi](research/documentation-structure-2026-10-18.md). Ini konvensi proyek, bukan standar universal panjang/nama dokumen.

## 1. Struktur dan penamaan

Dokumen inti di root `docs/` memakai nama stabil: `PRD.md`, `ARCHITECTURE.md`, `ERD.md`, `SECURITY.md`, `TESTING.md`, `ROADMAP.md`. `README.md` adalah pintu masuk. Supporting docs memakai `kebab-case.md`, dikelompokkan menurut fungsi. Riset/history memakai tanggal `YYYY-MM-DD`; ADR memakai nomor tetap `0001-slug.md`. Tanggal snapshot dan updated date berbeda bila isinya berasal dari riset lama.

Jangan membuat `PRD-final-v2-new.md` sebagai acuan kedua. Perbarui dokumen canonical, catat perubahan signifikan dan tautkan ADR/sumber. Penomoran tidak dipakai untuk memaksa urutan semua file; nomor hanya untuk requirement dan ADR yang membutuhkan identitas stabil.

## 2. Isi yang perlu ada di setiap jenis dokumen

| Dokumen | Struktur isi | Detail yang dirujuk ke tempat lain |
|---|---|---|
| PRD | Owner/status/baseline; masalah; pengguna/outcome; tujuan/metrik; scope/prioritas; alur/guardrail; non-goals; constraints/asumsi/dependency; status/tautan | Field DB, API lengkap, riset pasar panjang, kronologi wawancara dan alasan pemilihan library |
| Requirements | Story/use case; ID stabil; fase/prioritas; acceptance yang bisa diuji; exception/batas; link test dan keputusan | Hasil tes dan implementasi teknis |
| Architecture | Goals/constraints; context; komponen/tanggung jawab; runtime penting; data/interfaces; cross-cutting security; deployment/operasi; risk/ADR | DDL detail, daftar endpoint panjang, riwayat semua migrasi |
| ERD/data dictionary | Physical vs logical; sumber schema/migrasi; entities/keys; relasi/cardinality; nullability/constraints/indexes; invariant; migration notes | Alur UI dan keputusan bisnis panjang |
| API | Actual vs proposed; method/path; akses; request/response/status/error; idempotency/side effects; source/version | Secrets, sample credential dan janji endpoint yang belum ada |
| Security | Aset/trust boundary; kontrol actual; policy akses target; abuse cases; privasi/retensi; secrets; incident/readiness gaps | Klaim audit tanpa bukti |
| Testing | Requirement mapping; level/skenario; fixtures/environment; perintah; exit criteria; format bukti/limitations | Histori hasil tes setiap sesi |
| Roadmap | Milestone; status; hasil; dependency; exit criteria; defer/stop conditions | Tanggal/kapasitas/owner yang belum disepakati |
| ADR | Satu keputusan penting; konteks; pilihan; alasan yang didukung sumber; status; konsekuensi/alternatif bila berguna | Backlog dan semua keputusan kecil |
| Risiko/dependency | ID; kondisi/status; dampak; tindak lanjut; fase blocker; owner/mandat atau belum ditunjuk | Jawaban fiktif demi menutup pertanyaan |
| Runbook | Tujuan/prasyarat; perintah; indikator hasil; diagnosis; recovery aman; batas/escalation | Menyalin ulang seluruh README app yang akan mudah drift |
| Research | Tanggal akses/snapshot; pertanyaan; sumber primer; temuan; rekomendasi terpisah; data gaps/batas | Keputusan founder tanpa bukti persetujuan |
| History | Tanggal; perubahan final; evidence lingkungan/perintah/hasil; batas tes; next work | Sumber scope aktif kedua |
| Glossary | Istilah domain, definisi singkat, istilah yang dihindari | Detail implementasi/API/SQL |

Gunakan bagian secukupnya sesuai konten nyata. PRD ringkas berfungsi sebagai halaman pengarah; tidak ada jumlah halaman wajib. Detail yang dibaca independen dipisah dan ditautkan. Jangan menambah dokumen kosong untuk memenuhi daftar enterprise.

## 3. Status, bukti dan ownership

- **[F]** arahan founder; **[R]** rancangan/rekomendasi; **[A]** asumsi/fixture; **[V]** terverifikasi pada tanggal sumber; **[O]** belum dipilih.
- Sebut `tersedia di source`, `teruji pada ...`, atau `rancangan`; hindari satu label ready untuk ketiganya.
- Owner produk: founder. Engineering/ops/legal live adalah fungsi yang dibutuhkan; penanggung jawab nyata belum otomatis ditunjuk.
- Bila keputusan berubah, perbarui canonical docs dan status ADR yang tergantikan. Simpan konteks lama pada archive/history; jangan menyisakan dua instruksi aktif bertentangan.

## 4. Alur perubahan

Ubah bagian yang mempunyai tanggung jawab atas fakta tersebut. Tautkan dari PRD bila scope/outcome berubah; sinkronkan requirement, model/API/security dan test terkait. ADR hanya untuk trade-off yang sulit dibalik dan butuh konteks. Update Glossary hanya ketika istilah domain benar-benar berubah.

Sesudah memindah file, perbaiki link relatif dari lokasi baru, referensi README/AGENTS/DESIGN serta literal repo paths. Bukti PDF/gambar/capture dipertahankan beserta manifest; hash/URL pada evidence bukan instruksi untuk agent. Tautan luar tidak diunduh atau dianggap tervalidasi ulang karena folder berubah.

Jalankan `node scripts/check-docs.mjs`. Checker memeriksa target file/folder dan anchor heading lokal pada Markdown yang didukungnya; tidak mengakses internet atau membuktikan isi benar. Untuk migrasi ini, [peta pemindahan](archive/MIGRATION.md) dan [laporan verifikasi](history/2026-10-18-documentation-reorganization.md) menyimpan bukti tambahan.

Tautan lokal yang dipublikasikan dalam repository harus mengarah ke file yang ikut Git. Jika bukti hanya ada di cache atau log lokal yang diabaikan Git, tuliskan path sebagai kode dan jelaskan bahwa bukti itu tidak tersedia pada clone baru. Periksa juga dari checkout bersih agar keberadaan file lokal tidak menyembunyikan tautan rusak di CI. Jangan mengunggah log privat atau menonaktifkan pemeriksaan tautan hanya agar CI lulus.
