import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { readFile } from "node:fs/promises";
import { createServer } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const children = [];

async function packageBin(packageName, command) {
  const directory = path.join(root, "node_modules", packageName);
  const manifest = JSON.parse(await readFile(path.join(directory, "package.json"), "utf8"));
  return path.resolve(directory, typeof manifest.bin === "string" ? manifest.bin : manifest.bin[command]);
}

async function freePort() {
  const server = createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const port = server.address().port;
  await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  return port;
}

function start(name, cwd, args, extraEnvironment = {}) {
  const child = spawn(process.execPath, args, {
    cwd: path.join(root, cwd),
    windowsHide: true,
    env: {
      ...process.env,
      ASTRO_TELEMETRY_DISABLED: "1",
      NEXT_TELEMETRY_DISABLED: "1",
      GENZ_ENVIRONMENT: "demo",
      ...extraEnvironment,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  const running = { name, child, log: "", error: null };
  child.on("error", error => { running.error = error; });
  for (const stream of [child.stdout, child.stderr]) {
    stream.on("data", chunk => { running.log = (running.log + chunk.toString()).slice(-12000); });
  }
  children.push(running);
  return running;
}

async function waitForHealth(running, url) {
  const deadline = Date.now() + 45000;
  let lastProbe = "not attempted";
  while (Date.now() < deadline) {
    if (running.error || running.child.exitCode !== null || running.child.signalCode !== null) {
      throw new Error(`${running.name} exited before health: ${running.error ?? running.log}`);
    }
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(2000) });
      if (response.ok) return;
      lastProbe = `HTTP ${response.status}`;
    } catch (error) {
      lastProbe = `${error.message}: ${error.cause?.code ?? "no cause code"}`;
    }
    await delay(200);
  }
  throw new Error(`${running.name} health timeout (${lastProbe}): ${running.log}`);
}

async function verify(url, expectedStatus, expectedService) {
  const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
  assert.equal(response.status, expectedStatus, url);
  if (expectedService) {
    const data = await response.json();
    assert.equal(data.service, expectedService);
    assert.equal(data.environment, "demo");
    assert.equal(data.ready, false);
    assert.equal(data.financialTransactionsEnabled, false);
  }
  console.log(`PASS ${url.replace(/:\d+/, ":PORT")} -> ${expectedStatus}`);
}

try {
  const marketingPort = await freePort();
  const marketing = start("marketing", "apps/marketing", [
    await packageBin("astro", "astro"), "preview", "--ignore-lock", "--host", "127.0.0.1", "--port", String(marketingPort),
  ]);
  const marketingOrigin = `http://127.0.0.1:${marketingPort}`;
  await waitForHealth(marketing, `${marketingOrigin}/health.json`);
  await verify(`${marketingOrigin}/health.json`, 200, "marketing");
  for (const route of ["/", "/contact/", "/auth/", "/dashboard/", "/assets/"]) {
    await verify(`${marketingOrigin}${route}`, 200);
  }
  const landingHTML = await (await fetch(marketingOrigin)).text();
  for (const id of ["top", "energy-context", "why", "ecosystem", "assets", "opportunities", "stack", "evidence", "platform", "comparison", "connect"]) {
    assert.ok(landingHTML.includes(`id="${id}"`), `marketing renders ${id} without client JavaScript`);
  }
  const contactHTML = await (await fetch(`${marketingOrigin}/contact/`)).text();
  assert.ok(contactHTML.includes('id="contact-email"'));
  const accessHTML = await (await fetch(`${marketingOrigin}/auth/`)).text();
  assert.ok(!accessHTML.includes('id="access-email"'), "marketing must not restore legacy email session login");
  await verify(`${marketingOrigin}/api/v1/inquiries`, 404);
  await verify(`${marketingOrigin}/app`, 404);
  console.log("PASS marketing public HTML, contact and platform handoff boundaries");

  const platformPort = await freePort();
  const platform = start("platform", "apps/platform", [
    await packageBin("next", "next"), "start", "--hostname", "127.0.0.1", "--port", String(platformPort),
  ]);
  const platformOrigin = `http://127.0.0.1:${platformPort}`;
  await waitForHealth(platform, `${platformOrigin}/api/health`);
  await verify(`${platformOrigin}/api/health`, 200, "platform");
  await verify(`${platformOrigin}/api/ready`, 503, "platform");
  for (const route of ["/api/v1/assets", "/api/v1/documents/example/access", "/sign-in", "/sign-up"]) {
    await verify(`${platformOrigin}${route}`, 404);
  }
  await verify(`${platformOrigin}/auth`, 200);
  await verify(`${platformOrigin}/api/v1/session`, 401);
  for (const route of ["/app", "/app/assets", "/admin", "/operator/projects/example"]) {
    const gated = await fetch(`${platformOrigin}${route}`);
    const body = await gated.text();
    const redirected = new URL(gated.url).pathname === "/auth" || (body.includes("NEXT_REDIRECT") && body.includes("/auth"));
    assert.ok(redirected, `${route} redirects anonymous visitors, including streamed Next.js redirects`);
    assert.ok(!body.includes("Your wallet session is verified"), `${route} does not render private account content`);
  }
  const post = await fetch(`${platformOrigin}/api/health`, { method: "POST" });
  assert.equal(post.status, 405);
  console.log("PASS platform health rejects POST -> 405");

  const workerPort = await freePort();
  const operations = start("operations", "workers/operations", ["dist/index.js"], { WORKER_HEALTH_PORT: String(workerPort) });
  const workerOrigin = `http://127.0.0.1:${workerPort}`;
  await waitForHealth(operations, `${workerOrigin}/health`);
  await verify(`${workerOrigin}/health`, 200, "operations");
  await verify(`${workerOrigin}/ready`, 503, "operations");
  console.log("PASS app entry uses wallet auth; anonymous sessions are denied; unimplemented private APIs stay unavailable.");
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await Promise.all(children.map(async ({ child }) => {
    if (child.exitCode !== null || child.signalCode !== null) return;
    const closed = once(child, "close");
    child.kill("SIGTERM");
    await Promise.race([closed, delay(5000)]);
    if (child.exitCode === null && child.signalCode === null) {
      child.kill("SIGKILL");
      await closed;
    }
  }));
}
