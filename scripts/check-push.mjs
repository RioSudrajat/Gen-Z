import { readFileSync } from "node:fs";

const updates = readFileSync(0, "utf8").trim().split(/\r?\n/).filter(Boolean);
for (const update of updates) {
  const [, , remoteRef, remoteSha] = update.trim().split(/\s+/);
  if (remoteRef === "refs/heads/main" && !/^0+$/.test(remoteSha)) {
    console.error("Push langsung ke main ditolak. Push branch tugas lalu buat Pull Request. Import pertama ke remote kosong diperbolehkan.");
    process.exitCode = 1;
  }
}
