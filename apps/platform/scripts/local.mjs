import {
  existsSync,
  readFileSync,
  appendFileSync,
  writeFileSync,
} from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";
import { randomBytes } from "node:crypto";
import { createServer } from "node:net";
import { spawnSync } from "node:child_process";

export const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const repoRoot = resolve(appRoot, "../..");
const readEnv = (file) =>
  existsSync(file) ? parseEnv(readFileSync(file, "utf8")) : {};
export const localEnv = () => ({
  ...readEnv(resolve(appRoot, ".env.local")),
  ...process.env,
});

function appendMissing(file, settings) {
  const current = readEnv(file);
  const lines = Object.entries(settings)
    .filter(([key]) => !current[key])
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`);
  if (lines.length) {
    if (!existsSync(file))
      writeFileSync(file, "# Private Gen-Z local settings. Do not commit.\n", {
        mode: 0o600,
      });
    appendFileSync(file, `\n${lines.join("\n")}\n`);
  }
}

async function databasePort() {
  const server = createServer();
  const selected = await new Promise((accept, reject) => {
    server.once("error", reject);
    server.listen({ host: "127.0.0.1", port: 5433 }, () => accept(5433));
  }).catch(async () => {
    return new Promise((accept, reject) => {
      const alternate = createServer();
      alternate.once("error", reject);
      alternate.listen(0, "127.0.0.1", () => {
        const port = alternate.address().port;
        alternate.close(() => accept(port));
      });
    });
  });
  if (server.listening) await new Promise((accept) => server.close(accept));
  return selected;
}

export async function prepareEnvironment() {
  appendMissing(resolve(appRoot, ".env.local"), {
    GENZ_EVM_CHAIN_ID: "84532",
    GENZ_MARKETING_ORIGIN: "http://localhost:4321",
  });
  const settings = localEnv();
  if (settings.DATABASE_URL) return settings;
  const rootFile = resolve(repoRoot, ".env");
  const root = readEnv(rootFile);
  appendMissing(rootFile, {
    POSTGRES_USER: root.POSTGRES_USER || "genz",
    POSTGRES_DB: root.POSTGRES_DB || "genz_demo",
    POSTGRES_PORT: root.POSTGRES_PORT || String(await databasePort()),
    POSTGRES_PASSWORD:
      root.POSTGRES_PASSWORD || randomBytes(32).toString("hex"),
  });
  const database = readEnv(rootFile);
  appendMissing(resolve(appRoot, ".env.local"), {
    DATABASE_URL: `postgresql://${encodeURIComponent(database.POSTGRES_USER)}:${encodeURIComponent(database.POSTGRES_PASSWORD)}@127.0.0.1:${database.POSTGRES_PORT}/${encodeURIComponent(database.POSTGRES_DB)}`,
    GENZ_MANAGED_DATABASE: "1",
    GENZ_APP_ORIGIN: "http://localhost:3001",
    GENZ_EVM_CHAIN_ID: "84532",
    GENZ_ENVIRONMENT: "demo",
  });
  return localEnv();
}

export function managedDatabase(settings) {
  const root = readEnv(resolve(repoRoot, ".env"));
  const expected = `postgresql://${encodeURIComponent(root.POSTGRES_USER ?? "")}:${encodeURIComponent(root.POSTGRES_PASSWORD ?? "")}@127.0.0.1:${root.POSTGRES_PORT}/${encodeURIComponent(root.POSTGRES_DB ?? "")}`;
  return (
    settings.GENZ_MANAGED_DATABASE === "1" && settings.DATABASE_URL === expected
  );
}

export function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    stdio: "inherit",
    windowsHide: true,
    ...options,
  });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(`${command} failed. Check the message above.`);
}

export function compose(action, settings) {
  if (!managedDatabase(settings)) {
    console.log(
      "External PostgreSQL connection preserved; local Docker commands skipped.",
    );
    return;
  }
  const args = [
    "compose",
    "--env-file",
    resolve(repoRoot, ".env"),
    "-f",
    resolve(repoRoot, "compose.yaml"),
  ];
  if (action === "up")
    args.push("up", "-d", "--wait", "--wait-timeout", "60", "postgres");
  else if (action === "down") args.push("stop", "postgres");
  else if (action === "status") args.push("ps", "postgres");
  else throw new Error("Unknown database action");
  run("docker", args);
}
