import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { existsSync } from "node:fs";
import { createServer } from "node:net";
import { resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { appRoot, repoRoot } from "./local.mjs";

assert.ok(
  existsSync(resolve(appRoot, ".next/BUILD_ID")),
  "Build the platform before UI tests.",
);
const socket = createServer();
socket.listen(0, "127.0.0.1");
await once(socket, "listening");
const port = socket.address().port;
await new Promise((accept) => socket.close(accept));
const origin = `http://127.0.0.1:${port}`;
const env = {
  ...process.env,
  NODE_ENV: "production",
  DATABASE_URL: "",
  GENZ_TEST_DATABASE_URL: "",
  GENZ_TEST_RUN: "gen-z-platform-test-ui-only",
  GENZ_APP_ORIGIN: origin,
  GENZ_MARKETING_ORIGIN: "",
  GENZ_MANAGED_DATABASE: "0",
  GENZ_EVM_CHAIN_ID: "84532",
  GENZ_BASE_RPC_URL: "",
  GENZ_ENVIRONMENT: "demo",
  NEXT_TELEMETRY_DISABLED: "1",
};
delete env.__NEXT_PROCESSED_ENV;
const server = spawn(
  process.execPath,
  [
    resolve(repoRoot, "node_modules/next/dist/bin/next"),
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    String(port),
  ],
  { cwd: appRoot, env, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] },
);
let log = "";
for (const stream of [server.stdout, server.stderr])
  stream.on("data", (data) => {
    log = (log + data).slice(-4000);
  });

try {
  let ready = false;
  for (let attempt = 0; attempt < 80; attempt++) {
    try {
      if (
        (
          await fetch(`${origin}/api/health`, {
            signal: AbortSignal.timeout(1000),
          })
        ).ok
      ) {
        ready = true;
        break;
      }
    } catch {
      /* Wait for this test server only. */
    }
    if (server.exitCode !== null) break;
    await delay(250);
  }
  assert.ok(ready, log);
  console.log(
    "UI tests use no database: modal, light-only theme, keyboard, responsive layout and rejected wallet connection.",
  );
  const tests = spawn(
    process.execPath,
    [
      "--test",
      "--test-name-pattern=wallet modal|wallet selection stays|wallet pending",
      resolve(appRoot, "tests/browser.test.mjs"),
    ],
    { cwd: appRoot, env, windowsHide: true, stdio: "inherit" },
  );
  const [code] = await once(tests, "exit");
  process.exitCode = code ?? 1;
} finally {
  if (server.exitCode === null) {
    server.kill("SIGTERM");
    await Promise.race([once(server, "exit"), delay(5000)]);
    if (server.exitCode === null) server.kill("SIGKILL");
  }
}
