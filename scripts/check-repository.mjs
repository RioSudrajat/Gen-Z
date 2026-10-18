import { spawnSync } from "node:child_process";

function git(args, options = {}) {
  const result = spawnSync("git", args, {
    encoding: "utf8",
    windowsHide: true,
    maxBuffer: 32 * 1024 * 1024,
    ...options,
  });
  if (result.error || result.status !== 0) {
    throw new Error(`git ${args[0]} gagal. Jalankan pemeriksaan dari repository Git.`);
  }
  return result.stdout;
}

try {
  const entries = git(["ls-files", "--stage", "-z"]).split("\0").filter(Boolean).map(entry => {
    const tab = entry.indexOf("\t");
    const [mode, hash, stage] = entry.slice(0, tab).split(" ");
    return { mode, hash, stage, path: entry.slice(tab + 1) };
  });
  const failures = [];
  for (const entry of entries) {
    const name = entry.path.split("/").at(-1);
    if (entry.stage !== "0") failures.push(`${entry.path}: konflik belum diselesaikan`);
    if ((/^\.env(?:\.|$)/i.test(name) && name !== ".env.example") ||
        /\.(?:pem|key|p12|pfx|dump)$/i.test(name) ||
        /(?:^|\/)(?:\.aws|\.codex|node_modules|\.next|\.cache|coverage|test-results|playwright-report|blob-report)(?:\/|$)/.test(entry.path)) {
      failures.push(`${entry.path}: file privat atau hasil lokal tidak boleh dilacak`);
    }
    if (entry.mode === "120000" || entry.mode === "160000") {
      failures.push(`${entry.path}: symlink/submodule perlu kebijakan eksplisit sebelum ditambahkan`);
    }
  }
  if (entries.length) {
    const sizes = git(["cat-file", "--batch-check=%(objectsize)"], {
      input: entries.map(entry => entry.hash).join("\n") + "\n",
    }).trim().split("\n");
    sizes.forEach((size, index) => {
      if (Number(size) >= 95 * 1024 * 1024) failures.push(`${entries[index].path}: file >=95 MiB; gunakan penyimpanan aset yang sesuai`);
    });
    const pattern = "gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{60,}|AKIA[0-9A-Z]{16}|-----BEGIN (RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----";
    const scan = spawnSync("git", ["grep", "--cached", "-I", "-l", "-E", "--", pattern], {
      encoding: "utf8", windowsHide: true, maxBuffer: 8 * 1024 * 1024,
    });
    if (scan.error || ![0, 1].includes(scan.status)) throw new Error("Pemeriksaan pola credential gagal.");
    if (scan.status === 0) {
      for (const file of scan.stdout.trim().split("\n")) failures.push(`${file}: pola credential terdeteksi; nilai tidak ditampilkan`);
    }
  }
  if (failures.length) {
    console.error(failures.join("\n"));
    process.exitCode = 1;
  } else {
    console.log(`Repository policy PASS: ${entries.length} file pada index diperiksa. File baru harus di-stage sebelum ikut pemeriksaan ini.`);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
