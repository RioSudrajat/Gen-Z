import { randomBytes } from "node:crypto";
import { spawn, spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { createServer } from "node:net";
import { setTimeout as delay } from "node:timers/promises";
import { Pool } from "pg";
import { appRoot, repoRoot } from "./local.mjs";
import { migrate } from "./migrations.mjs";

const name = `gen-z-platform-test-${randomBytes(6).toString("hex")}`;
let server;
let databaseStarted = false;
let serverLog = "";
function docker(args) {
  const result = spawnSync("docker", args, {
    encoding: "utf8",
    windowsHide: true,
  });
  if (result.status !== 0)
    throw new Error(
      "Docker test command failed. Start Docker Desktop and retry.",
    );
  return result.stdout.trim();
}
async function freePort() {
  const socket = createServer();
  return new Promise((accept, reject) => {
    socket.once("error", reject);
    socket.listen(0, "127.0.0.1", () => {
      const port = socket.address().port;
      socket.close(() => accept(port));
    });
  });
}

try {
  if (!existsSync(resolve(appRoot, ".next/BUILD_ID")))
    throw new Error("Run npm run build:platform before integration tests.");
  console.log(
    "Testing wallet proof and sessions against isolated PostgreSQL. The app database is not used.",
  );
  const password = randomBytes(24).toString("hex");
  docker([
    "run",
    "-d",
    "--rm",
    "--name",
    name,
    "--label",
    "com.gen-z.purpose=platform-test",
    "--tmpfs",
    "/var/lib/postgresql/data",
    "-e",
    `POSTGRES_PASSWORD=${password}`,
    "-e",
    "POSTGRES_USER=genz_test",
    "-e",
    "POSTGRES_DB=genz_test",
    "-p",
    "127.0.0.1::5432",
    "postgres:17-alpine",
  ]);
  databaseStarted = true;
  const port = docker(["port", name, "5432"]).split(":").at(-1);
  const url = `postgresql://genz_test:${password}@127.0.0.1:${port}/genz_test`;
  const pool = new Pool({
    connectionString: url,
    connectionTimeoutMillis: 500,
  });
  let healthy = false;
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      await pool.query("SELECT 1");
      healthy = true;
      break;
    } catch {
      await delay(200);
    }
  }
  await pool.end();
  if (!healthy) throw new Error("Isolated PostgreSQL did not start.");
  await migrate(url);
  const origin = `http://127.0.0.1:${await freePort()}`;
  const env = {
    ...process.env,
    NODE_ENV: "production",
    DATABASE_URL: url,
    GENZ_TEST_DATABASE_URL: url,
    GENZ_TEST_RUN: name,
    GENZ_APP_ORIGIN: origin,
    GENZ_MANAGED_DATABASE: "0",
    GENZ_EVM_CHAIN_ID: "84532",
    GENZ_BASE_RPC_URL: "",
    GENZ_ENVIRONMENT: "demo",
    NEXT_TELEMETRY_DISABLED: "1",
  };
  delete env.__NEXT_PROCESSED_ENV;
  server = spawn(
    process.execPath,
    [
      resolve(repoRoot, "node_modules/next/dist/bin/next"),
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      new URL(origin).port,
    ],
    { cwd: appRoot, env, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] },
  );
  for (const stream of [server.stdout, server.stderr])
    stream.on("data", (chunk) => {
      serverLog = (serverLog + chunk).slice(-6000);
    });
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      if ((await fetch(`${origin}/api/health`)).ok) {
        ready = true;
        break;
      }
    } catch {
      /* Wait for this test server only. */
    }
    if (server.exitCode !== null) break;
    await delay(200);
  }
  if (!ready)
    throw new Error("Isolated Next.js server did not start: " + serverLog);
  const files = readdirSync(resolve(appRoot, "tests"))
    .filter((file) => file.endsWith(".test.mjs"))
    .map((file) => resolve(appRoot, "tests", file));
  const tests = spawn(
    process.execPath,
    ["--test", "--test-concurrency=1", ...files],
    { cwd: appRoot, env, windowsHide: true, stdio: "inherit" },
  );
  const code = await new Promise((accept, reject) => {
    tests.once("error", reject);
    tests.once("exit", accept);
  });
  process.exitCode = code ?? 1;
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  if (server && server.exitCode === null) {
    server.kill("SIGTERM");
    await Promise.race([
      new Promise((accept) => server.once("exit", accept)),
      delay(5000),
    ]);
  }
  if (databaseStarted) docker(["stop", name]);
}
