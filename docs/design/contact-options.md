# Tiga opsi desain Contact Gen-Z

Eksplorasi 20 Oktober 2026, Asia/Jakarta. Permintaan founder: tiga alternatif Contact yang lebih profesional dan aesthetic, mengikuti kebutuhan data, dengan rekomendasi agent. **[F] Founder memilih Guided Inquiry dan meminta implementasi pada 20 Oktober 2026.** Source frontend sekarang memakai pilihan tersebut; [QA implementasi](../../design-qa.md) memisahkan bukti dari batas backend. Antislop `during` dipilih untuk sesi ini; preferensi global tidak diubah.

## Brief dan batas

Halaman publik `/contact/` membantu operator mengajukan konteks aset dan pembiayaan, serta mempertahankan jalur investor dan partnership. Arah onboarding mengikuti [dokumen produk](../product/partner-onboarding.md). Pengajuan bukan persetujuan pendanaan; pengumpulan dokumen sensitif tetap melalui kanal privat setelah screening.

Design Read: redesign Contact B2B untuk operator infrastruktur energi dengan bahasa visual tenang, kredibel dan sesuai brand. Antislop **ENERGY 2 / RHYTHM 2 / MOTION 1**. Untuk komposisi marketing yang relevan: `DESIGN_VARIANCE 4 / MOTION_INTENSITY 2 / VISUAL_DENSITY 4`. Pola marketing tidak dipaksakan pada interaksi form bertahap.

Fondasi: [DESIGN.md](../../DESIGN.md), [panduan UI](../../.agents/UI-GUIDELINES.md), source Contact dan screenshot QA existing. GenZ Display untuk heading, GenZ UI untuk body; light-only, putih/off-white, teks gelap, mint untuk aksi utama, deep teal untuk teks/link. Foto operator existing hanya ilustrasi infrastruktur, bukan bukti mitra atau anggota tim nyata. Tidak ada font, logo, testimonial, klaim bisnis, alamat atau kanal dukungan baru yang diadopsi dari referensi.

## Audit awal berbasis bukti

- **Observed, screenshot QA existing:** hierarki headline dan palette sudah konsisten dengan Gen-Z; form berada dalam panel berwarna lembut, dengan topik, kontak dan pesan. Screenshot merupakan rekaman QA sebelumnya, bukan capture deployment baru.
- **Observed, source:** semua kategori pengaju memakai nama, perusahaan opsional, email dan pesan yang sama. Data aset terstruktur belum ditampilkan. Kode tetap mempertahankan review pesan sebelum kirim serta draft/copy/download ketika pengiriman tidak terhubung.
- **Inferred:** kekurangan utama untuk screening operator adalah pengelompokan data dan penjelasan perjalanan. Mengganti radius atau memberi shadow tambahan tidak menyelesaikannya.
- **Preserve:** logo, keluarga font, palette, light theme, jalur operator/investor/partnership, label terlihat, optionality, validasi, review dan draft saat error.
- **Change proposed:** pisahkan data kontak, aset/pembiayaan, lalu review. Whitespace dan divider menggantikan kebutuhan menaruh seluruh isi dalam kotak besar. Tidak mengubah route, metadata atau SEO pada eksplorasi ini.

## Dasar riset

Diakses 20 Oktober 2026. Library dipakai untuk mempelajari komposisi; tidak ada template berbayar yang dibeli, disalin atau dipasang.

| Sumber | Temuan yang digunakan | Batas |
|---|---|---|
| [Untitled UI contact sections](https://www.untitledui.com/components/contact-sections) | Label tetap terlihat, kolom form dengan lebar terbaca, komposisi kontak dan konteks berdampingan | Halaman dan screenshot diperiksa; Figma hanya overview, bukan inspeksi setiap frame |
| [Shadcn Studio Contact Us](https://shadcnstudio.com/blocks/marketing-ui/contact-us-page) | Pengelompokan field dan variasi form-centered/split layout | Halaman, DOM dan preview publik diperiksa; tidak memakai maps, avatar, logo pelanggan atau klaim contoh |
| [W3C WAI multi-page forms](https://www.w3.org/WAI/tutorials/forms/multi-page/) | Form panjang boleh dipisah menjadi kelompok logis; progress dan optionality harus jelas | Tidak membuktikan wizard selalu lebih baik; perlu uji dengan calon mitra |
| [W3C labels or instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions) | Label/instruksi perlu menjelaskan input yang diharapkan | Screenshot belum membuktikan implementasi aksesibel |
| [GOV.UK question pages](https://design-system.service.gov.uk/patterns/question-pages/) | Hanya menanyakan data yang diperlukan; Back dan reuse jawaban; boleh menjawab tidak tahu bila valid | Prinsip UX digunakan, bukan identitas visual GOV.UK |

Flowbite ditemukan sebagai kandidat riset tetapi pembukaan langsung menghasilkan 403; tidak dipakai sebagai sumber visual. Panduan DesainPakeAI `design-quality`, `variant-exploration`, `accessibility` dan `evidence-and-reference` berhasil dibaca setelah percobaan koneksi awal gagal.

## Perbandingan opsi

Nomor mengikuti urutan tiga hasil Image Gen yang ditampilkan pada percakapan. Semua hasil merupakan mockup raster statis; tidak ada kontrol yang diklaim bisa diklik.

| Urutan | Arah | Struktur dan kegunaan | Trade-off |
|---|---|---|---|
| 1 | [Open Brief](references/contact-2026-10-20/open-brief.png) | Form satu halaman dengan kelompok kontak, aset dan financing; konteks serta ilustrasi berada di kiri. Seluruh pertanyaan terlihat sejak awal | Implementasi paling sederhana; tinggi halaman dan beban visual bertambah di mobile |
| 2 | [Guided Inquiry](references/contact-2026-10-20/guided-inquiry.png) | Tiga tahap: Your details → Asset & financing → Review inquiry. Mockup menampilkan tahap kedua | Perlu state, Back, focus dan validasi antar-tahap yang benar; jumlah klik lebih banyak |
| 3 | [Role-led Workspace](references/contact-2026-10-20/role-led-workspace.png) | Pilihan jenis pengaju dominan; kelompok form dapat dibuka langsung dalam satu halaman | Fleksibel untuk pengaju berulang, tetapi accordion dan pergantian kategori menambah state serta potensi kebingungan |

**Pilihan founder [F]: Guided Inquiry**, mengikuti rekomendasi agent. Kontak, konteks aset dan review merupakan tiga kelompok nyata. Pemisahan membuat jumlah data lebih mudah dipahami tanpa menambah pertanyaan. Dampak terhadap completion rate belum diukur. Open Brief tetap rekaman alternatif eksplorasi, bukan alur aktif kedua.

## Kesetaraan data

Kontrak operator tetap [proposed intake](../engineering/api/intake.md); eksplorasi ini tidak mengubah schema/API. Negara saat ini **Indonesia/ID**, bukan pilihan negara global. Jalur investor/partnership perlu routing dan payload yang sesuai pada implementasi; jangan memaksa keduanya mengisi aset atau menganggap endpoint operator sudah mendukung semua kategori.

| Data/kontrol | Open Brief | Guided Inquiry | Role-led Workspace |
|---|---|---|---|
| Topik operator/investor/partnership | Selector di awal | Selector sebelum langkah | Selector di rail |
| Nama, email; organisasi dan telepon boleh kosong | Your details terlihat | Tahap 1 | Kelompok Your details |
| Kategori energy/infrastructure | Your asset | Tahap 2 | Kelompok Asset & financing |
| Negara Indonesia dan provinsi/region | Your asset | Tahap 2 | Kelompok Asset & financing |
| Operational/maintenance/planned/unknown | Operating status | Tahap 2 | Kelompok Asset & financing |
| Deskripsi aset | Textarea | Tahap 2 | Kelompok Asset & financing |
| Kebutuhan pembiayaan nullable | Amount dan Not sure yet | Tahap 2 | Kelompok Asset & financing |
| Privacy acknowledgement dan versi notice | Sebelum review/send | Tahap review sebelum send | Review & privacy sebelum send |
| Review/edit sebelum send | Review setelah form | Tahap 3 | Kelompok review |

`Not sure yet` memetakan kebutuhan pembiayaan ke `null`, bukan nol; amount dinormalisasi ke format Money kontrak. `privacyNoticeVersionId` berasal dari kebijakan server, bukan field yang harus diketik pengguna. Tidak ada phone wajib, rekening, identitas, upload kontrak atau wallet gate pada kontak awal.

## Interaksi yang harus dipertahankan saat implementasi

- Semua opsi: label persisten, optional ditulis eksplisit, native controls bila sesuai, focus terlihat, error dekat field serta terhubung secara semantik; validation memindahkan focus ke field pertama yang perlu diperbaiki.
- Review menampilkan jawaban dan memungkinkan edit. Sukses hanya setelah server mengonfirmasi reference yang committed. Pending/sending, error, timeout dan retry tidak menghapus draft atau menggandakan inquiry. Draft/copy/download tetap tersedia saat pengiriman belum terhubung; mockup bukan bukti backend sudah ada.
- Guided: Back mempertahankan jawaban; title/heading mengumumkan tahap; validasi tidak menuntut field tahap lain sebelum waktunya. Mengganti topik menjaga draft terkait selama sesi, tanpa mengklaim penyimpanan lintas perangkat.
- Accordion: tombol header memiliki expanded/controls, kelompok tertutup tidak focusable, review membuka kelompok yang belum lengkap. Pergantian role tidak menghapus jawaban tanpa penjelasan.
- Mobile di bawah 768px: satu kolom; dua field berdampingan menjadi bertumpuk; konteks/foto tidak mendahului form dengan ruang berlebihan. Guided memakai progress ringkas di atas form; role selector menjadi kontrol tersusun vertikal atau select berlabel, tanpa overflow horizontal. Target sentuh minimal 44px dan reduced motion dihormati.

## Alasan keputusan visual

| Keputusan | Alasan |
|---|---|
| Font dan palette existing | Menjaga identitas Gen-Z dari landing hingga pengajuan |
| Mint pada satu aksi utama; deep teal pada pilihan/link | Membedakan aksi dan state dengan kontras teks gelap, bukan menyebar aksen ke setiap field |
| Kelompok berdasar pekerjaan pengguna | Membantu memahami data tanpa menambah filler |
| Spacing dan divider | Memisahkan konteks, input dan review dengan hirarki yang mudah dipindai |
| Radius lokal 10–12px pada control, lebih lembut pada media | Menjaga form familiar dan foto sebagai konteks; bukan standar global baru |
| Satu foto existing dengan caption | Menghubungkan form dengan infrastruktur energi tanpa mengarang tim/mitra |
| Motion minimal | Pengisian dan feedback menjadi fokus; tidak perlu autoplay atau dekorasi bergerak |

## Verifikasi dan Delivery Gate antislop

**Scope gate: tiga konsep statis, bukan halaman aplikasi selesai.** Inspeksi dilakukan terhadap gambar yang tampil, prompt, source existing dan pemetaan field di atas. Tidak ada build atau tes browser aplikasi baru karena source UI tidak diubah. Preview interaktif yang disarankan panduan varian ditunda sampai founder memilih visual, mengikuti gate ideation Product Design.

- **Hard Gate PASS untuk scope statis:** tiga gambar terpisah diperiksa; tidak ada klaim pendanaan/keamanan, angka traction, testimonial, dokumen sensitif atau tema gelap. Semua kontrol adalah gambaran konsep, bukan diklaim aktif. Hak data dijelaskan dalam pemetaan, termasuk bagian yang tidak sedang terbuka.
- **Purpose-Gate PASS:** typography, palette, layout, spacing, radius, foto serta motion memiliki alasan tertulis di tabel; tidak ada glow/glass/grid dekoratif atau penambahan kantor/maps/kanal dukungan.
- **Liveliness PASS:** dials dan Design Read dinyatakan; masing-masing mempunyai fokus pada input aktif, whitespace struktural, aksen selektif serta identitas font/foto Gen-Z. Varian berbeda pada struktur/interaksi, bukan tint.
- **Craftsmanship dan pre-flight konsep PASS:** teks/gambar dibaca ulang; CTA utama tidak terpotong, label terlihat, grouping logis dan tidak ada klaim hasil uji konversi. Tema light dan product vocabulary sesuai konteks.

**Not verified:** keyboard/semantik screen reader, focus, reflow 320px, 200% zoom, kontras piksel hasil generatif, reduced motion, runtime, states/error dan API/email delivery. Warna acuan mengikuti token proyek; gambar generatif tidak membuktikan nilai CSS atau metrik kontras aktual. Pemeriksaan ini wajib pada implementasi pilihan.

Detail generatif yang tidak boleh diadopsi mentah: gambar Guided menggambar chevron pada negara meskipun negara harus fixed Indonesia; gambar Role-led memakai navigasi landing dan lapisan border lebih banyak daripada brief. Implementasi memakai header Contact existing, negara read-only, font lokal asli, token exact dan group separator seperlunya. Mockup mengarahkan komposisi; dokumen/source menjadi acuan kontrak dan perilaku.

Hasil dibuat dengan built-in Image Gen dan disalin ke repo. [Prompt lengkap](references/contact-2026-10-20/prompts.md) menyimpan instruksi asli, referensi dan batas reproduksi.
