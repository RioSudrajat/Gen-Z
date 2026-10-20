import assert from "node:assert/strict";
import test from "node:test";
import { createServer } from "node:http";
import { mkdir, readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { randomUUID } from "node:crypto";
import { chromium } from "@playwright/test";
import { Pool } from "pg";
import { origin, databaseUrl } from "./helpers.mjs";
import { repoRoot } from "../scripts/local.mjs";

test(
  "marketing Contact submits all topics into isolated PostgreSQL; Launch app reaches the real wallet UI",
  { timeout: 120000 },
  async () => {
    const root = resolve(repoRoot, "apps/marketing/dist");
    const types = {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      ".svg": "image/svg+xml",
      ".webp": "image/webp",
      ".woff2": "font/woff2",
    };
    const server = createServer(async (request, response) => {
      try {
        let path = resolve(
          root,
          "." +
            decodeURIComponent(
              new URL(request.url, "http://localhost").pathname,
            ),
        );
        if (!path.startsWith(root + sep)) throw new Error("Invalid path");
        if ((await stat(path)).isDirectory())
          path = resolve(path, "index.html");
        response.setHeader(
          "Content-Type",
          types[extname(path)] ?? "application/octet-stream",
        );
        response.end(await readFile(path));
      } catch {
        response.writeHead(404).end();
      }
    });
    await new Promise((accept) => server.listen(0, "127.0.0.1", accept));
    const marketing = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch({ headless: true });
    const pool = new Pool({ connectionString: databaseUrl });
    const errors = [];
    try {
      const screenshots = resolve(repoRoot, ".cache/intake-verification");
      await mkdir(screenshots, { recursive: true });
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        reducedMotion: "reduce",
      });
      // The public local fallback uses port 3001. Forward it only in this test to
      // the random-port isolated server; responses and persistence remain real.
      await context.route("http://localhost:3001/**", async (route) => {
        const url = new URL(route.request().url());
        if (route.request().isNavigationRequest())
          return route.fulfill({
            status: 302,
            headers: { location: origin + url.pathname + url.search },
          });
        const response = await route.fetch({
          url: origin + url.pathname,
          headers: route.request().headers(),
        });
        if (url.pathname === "/api/v1/public/inquiry-policy") {
          // Match the externally visible proxy origin for the client's same-origin
          // HTTP notice check. The notice version and server response stay real.
          const policy = await response.json();
          const notice = new URL(policy.noticeUrl);
          policy.noticeUrl = `http://localhost:3001${notice.pathname}${notice.hash}`;
          return route.fulfill({ response, json: policy });
        }
        return route.fulfill({ response });
      });
      const page = await context.newPage();
      page.on("pageerror", (error) => errors.push(error.message));
      for (const topic of ["operator", "investor", "partner"]) {
        await page.goto(`${marketing}/contact/?role=${topic}`);
        await page.locator("#contact-name").fill("Synthetic browser QA");
        const email = `${randomUUID()}@example.invalid`;
        await page.locator("#contact-email").fill(email);
        await page
          .getByRole("button", { name: "Continue", exact: true })
          .click();
        if (topic === "operator") {
          await page.locator("#contact-assetCategory").selectOption("energy");
          await page
            .locator("#contact-operationsState")
            .selectOption("operational");
          await page.locator("#contact-region").fill("West Java");
        }
        await page
          .locator("#contact-message")
          .fill("Synthetic inquiry from isolated browser verification.");
        await page.locator(".inquiry-actions button[type=submit]").click();
        await page.locator("#contact-privacyAcknowledged").check();
        await page
          .getByRole("button", { name: "Send inquiry", exact: true })
          .click();
        await page.locator(".inquiry-receipt strong").waitFor();
        await page.locator(".inquiry-receipt:focus").waitFor();
        const reference = await page
          .locator(".inquiry-receipt strong")
          .textContent();
        const { rows } = await pool.query(
          "SELECT i.topic, i.payload, o.state FROM intake.inquiries i JOIN intake.notification_outbox o ON o.inquiry_id=i.id WHERE i.reference=$1",
          [reference],
        );
        assert.equal(rows.length, 1);
        assert.equal(rows[0].payload.contact.email, email);
        assert.equal(rows[0].topic, topic);
        assert.equal(rows[0].state, "pending");
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          true,
        );
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({
          path: resolve(screenshots, `${topic}-receipt-mobile.png`),
          fullPage: true,
        });
      }
      await page.getByRole("link", { name: "Launch app", exact: true }).click();
      await page.waitForURL(`${origin}/auth?returnTo=%2Fapp`);
      await page.getByRole("heading", { name: "Login", exact: true }).waitFor();
      await page.getByRole("button", { name: /Connect wallet/i }).waitFor();
      await page.screenshot({
        path: resolve(screenshots, "launch-wallet-login.png"),
        fullPage: true,
      });
      assert.deepEqual(errors, []);
      await context.close();
    } finally {
      await browser.close();
      await pool.end();
      await new Promise((accept) => server.close(accept));
    }
  },
);
