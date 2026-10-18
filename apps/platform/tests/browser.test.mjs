import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";
import { hexToString } from "viem";
import { repoRoot } from "../scripts/local.mjs";
import { origin, wallet } from "./helpers.mjs";

const screenshots = resolve(repoRoot, ".cache/platform-verification");
mkdirSync(screenshots, { recursive: true });

async function registerTestWallet(
  context,
  signer,
  reject = false,
  changeAccount = false,
  rejectSwitch = false,
) {
  await context.exposeBinding("genzTestSign", (_source, message) =>
    signer.signMessage({ message: hexToString(message) }),
  );
  await context.addInitScript(
    ({ address, reject, changeAccount, rejectSwitch }) => {
      let chain = "0x1",
        current = address;
      const events = new Map();
      const emit = (name, value) => {
        for (const fn of events.get(name) || []) fn(value);
      };
      const provider = {
        on(name, fn) {
          if (!events.has(name)) events.set(name, new Set());
          events.get(name).add(fn);
        },
        removeListener(name, fn) {
          events.get(name)?.delete(fn);
        },
        async request({ method, params }) {
          if (method === "eth_chainId") return chain;
          if (method === "eth_accounts" || method === "eth_requestAccounts")
            return [current];
          if (method === "wallet_requestPermissions")
            return [
              {
                parentCapability: "eth_accounts",
                caveats: [
                  { type: "restrictReturnedAccounts", value: [current] },
                ],
              },
            ];
          if (
            method === "wallet_switchEthereumChain" ||
            method === "wallet_addEthereumChain"
          ) {
            if (rejectSwitch)
              throw Object.assign(new Error("Network switch rejected"), {
                code: 4001,
              });
            chain = params[0].chainId;
            emit("chainChanged", chain);
            return null;
          }
          if (method === "personal_sign") {
            if (reject)
              throw Object.assign(new Error("Sign-in cancelled in wallet"), {
                code: 4001,
              });
            const signature = await window.genzTestSign(params[0]);
            if (changeAccount) {
              current = "0x0000000000000000000000000000000000000001";
              emit("accountsChanged", [current]);
            }
            return signature;
          }
          throw Object.assign(new Error("Unsupported test method: " + method), {
            code: 4200,
          });
        },
      };
      const announce = () =>
        window.dispatchEvent(
          new CustomEvent("eip6963:announceProvider", {
            detail: {
              info: {
                uuid: "ceffebc5-6ec0-4d22-9d00-a5d8d685f908",
                name: "Gen-Z test wallet",
                icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjMGY3NjZlIi8+PC9zdmc+",
                rdns: "test.genz.wallet",
              },
              provider,
            },
          }),
        );
      window.addEventListener("eip6963:requestProvider", announce);
      announce();
    },
    { address: signer.address, reject, changeAccount, rejectSwitch },
  );
}

async function inspectPage(page) {
  return page.evaluate(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const color = (value) => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = value;
      context.fillRect(0, 0, 1, 1);
      return Array.from(context.getImageData(0, 0, 1, 1).data);
    };
    const luminance = (values) => {
      const rgb = values.slice(0, 3).map((value) => {
        value /= 255;
        return value <= 0.04045
          ? value / 12.92
          : ((value + 0.055) / 1.055) ** 2.4;
      });
      return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
    };
    const background = (element) => {
      const chain = [];
      for (let node = element; node; node = node.parentElement)
        chain.push(node);
      let result = [255, 255, 255];
      for (const node of chain.reverse()) {
        const rgba = color(getComputedStyle(node).backgroundColor);
        result = result.map(
          (value, index) =>
            value * (1 - rgba[3] / 255) + (rgba[index] * rgba[3]) / 255,
        );
      }
      return result;
    };
    const lowContrast = [];
    for (const element of document.querySelectorAll("body *")) {
      if (
        !Array.from(element.childNodes).some(
          (node) => node.nodeType === 3 && node.textContent.trim(),
        )
      )
        continue;
      const style = getComputedStyle(element),
        box = element.getBoundingClientRect();
      if (
        !box.width ||
        !box.height ||
        style.visibility === "hidden" ||
        (element.classList.contains("sr-only") && !element.matches(":focus"))
      )
        continue;
      const foreground = luminance(color(style.color)),
        behind = luminance(background(element));
      const ratio =
        (Math.max(foreground, behind) + 0.05) /
        (Math.min(foreground, behind) + 0.05);
      const large =
        parseFloat(style.fontSize) >= 24 ||
        (parseFloat(style.fontSize) >= 18.66 &&
          Number(style.fontWeight) >= 700);
      if (ratio < (large ? 3 : 4.5))
        lowContrast.push({
          text: element.textContent.trim().slice(0, 60),
          ratio,
        });
    }
    return {
      overflow: document.documentElement.scrollWidth > innerWidth,
      lowContrast,
    };
  });
}

test("wallet modal, light-only theme, keyboard and mobile states work without email login", async () => {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({
      reducedMotion: "reduce",
      colorScheme: "dark",
    });
    await context.addInitScript(() =>
      localStorage.setItem("gen-z-theme", "dark"),
    );
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${origin}/auth`);
    const modal = page.getByRole("dialog");
    const connectButton = page.getByRole("button", {
      name: "Connect Wallet",
      exact: true,
    });
    assert.equal(await modal.count(), 0);
    assert.equal(
      await page.getByText("No wallet detected.", { exact: false }).isVisible(),
      false,
    );
    assert.equal(
      await page.getByRole("button", { name: "Switch theme" }).count(),
      0,
    );
    await connectButton.click();
    await modal.getByRole("heading", { name: "Connect Wallet" }).waitFor();
    assert.equal(
      await modal.getByRole("button", { name: /Solana Network/ }).isEnabled(),
      false,
    );
    assert.equal(
      await modal.getByRole("button", { name: /BNB Chain/ }).isEnabled(),
      false,
    );
    assert.equal(
      await modal.getByText("Coming soon", { exact: true }).count(),
      2,
    );
    await modal.getByRole("button", { name: /Base Network/ }).click();
    await modal.getByText("No wallet detected.", { exact: false }).waitFor();
    for (const name of ["MetaMask", "Rainbow", "Coinbase Wallet"])
      assert.equal(
        await modal.getByRole("link", { name: `${name} Get wallet` }).count(),
        1,
      );
    assert.equal(
      await page.locator('input[type="email"],input[type="password"]').count(),
      0,
    );
    await page.getByRole("button", { name: "Refresh wallet list" }).click();
    for (const width of [320, 390, 768, 1024, 1440, 2048]) {
      await page.setViewportSize({ width, height: 900 });
      for (const scheme of ["light", "dark"]) {
        await page.emulateMedia({ colorScheme: scheme });
        assert.equal(
          await page.evaluate(
            () => getComputedStyle(document.documentElement).colorScheme,
          ),
          "light",
        );
        assert.deepEqual(await inspectPage(page), {
          overflow: false,
          lowContrast: [],
        });
        if (width === 1440 && scheme === "dark") {
          await page.evaluate(
            () =>
              new Promise((resolve) =>
                requestAnimationFrame(() => requestAnimationFrame(resolve)),
              ),
          );
          await page.screenshot({
            path: resolve(screenshots, "wallet-modal-empty.png"),
            fullPage: true,
          });
        }
      }
      const bounds = await modal.boundingBox();
      assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= width);
      await modal.getByRole("button", { name: "Back", exact: true }).click();
      await modal.getByRole("heading", { name: "Connect Wallet" }).waitFor();
      assert.deepEqual(await inspectPage(page), {
        overflow: false,
        lowContrast: [],
      });
      assert.equal(
        await modal
          .locator("img")
          .evaluateAll((images) =>
            images.every((image) => image.complete && image.naturalWidth > 0),
          ),
        true,
      );
      if (width === 1440 || width === 390)
        await page.screenshot({
          path: resolve(screenshots, `wallet-networks-${width}.png`),
          fullPage: true,
        });
      await page.keyboard.press("Escape");
      assert.equal(
        await connectButton.evaluate((node) => node === document.activeElement),
        true,
      );
      assert.equal(await page.evaluate(() => document.body.style.overflow), "");
      assert.deepEqual(await inspectPage(page), {
        overflow: false,
        lowContrast: [],
      });
      if (width === 1440 || width === 390)
        await page.screenshot({
          path: resolve(screenshots, `wallet-login-${width}.png`),
          fullPage: true,
        });
      await connectButton.click();
      await modal.getByRole("button", { name: /Base Network/ }).click();
    }
    await page.getByRole("button", { name: "Close wallet selection" }).focus();
    await page.keyboard.press("Shift+Tab");
    assert.match(
      await page.locator(":focus").innerText(),
      /Refresh wallet list/,
    );
    await page.keyboard.press("Tab");
    assert.equal(
      await page.locator(":focus").getAttribute("aria-label"),
      "Close wallet selection",
    );
    await page.getByRole("button", { name: "Close wallet selection" }).click();
    assert.equal(await modal.count(), 0);
    await connectButton.click();
    await page.mouse.click(4, 4);
    assert.equal(await modal.count(), 0);
    await page.setViewportSize({ width: 1440, height: 900 });
    assert.equal(
      await page
        .locator(".genz-ecosystem svg")
        .evaluate((svg) => svg.animationsPaused()),
      true,
    );
    await page.screenshot({
      path: resolve(screenshots, "wallet-auth-desktop.png"),
      fullPage: true,
    });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.getByRole("button", { name: "Pause animation" }).click();
    assert.equal(
      await page
        .locator(".genz-ecosystem svg")
        .evaluate((svg) => svg.animationsPaused()),
      true,
    );
    const paused = await page.locator(".genz-ecosystem svg").innerHTML();
    await page.waitForTimeout(200);
    assert.equal(await page.locator(".genz-ecosystem svg").innerHTML(), paused);
    await page.getByRole("button", { name: "Play animation" }).click();
    await page.waitForFunction(
      () => !document.querySelector(".genz-ecosystem svg").animationsPaused(),
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.getByRole("button", { name: "Animation paused" }).waitFor();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: resolve(screenshots, "wallet-auth-mobile.png"),
      fullPage: true,
    });
    await page.reload();
    assert.equal(
      await page.evaluate(
        () => getComputedStyle(document.documentElement).colorScheme,
      ),
      "light",
    );
    assert.equal(
      await page.locator("html").getAttribute("data-theme"),
      "light",
    );
    await page.evaluate(() => document.fonts.ready);
    assert.match(
      await page
        .locator("h1")
        .evaluate((node) => getComputedStyle(node).fontFamily),
      /GenZ Display/,
    );
    assert.match(
      await connectButton.evaluate((node) => getComputedStyle(node).fontFamily),
      /GenZ UI/,
    );
    assert.equal(
      await page.evaluate(
        () =>
          document.fonts.check('500 16px "GenZ UI"') &&
          document.fonts.check('500 36px "GenZ Display"'),
      ),
      true,
    );
    await page.keyboard.press("Tab");
    assert.equal(await page.locator(":focus").innerText(), "Skip to content");
    await page.keyboard.press("Enter");
    assert.equal(new URL(page.url()).hash, "#main-content");
    await page.goto(`${origin}/app/assets`);
    await page.waitForURL(`${origin}/auth`);
    await page.goto(`${origin}/admin`);
    await page.waitForURL(`${origin}/auth`);
    assert.deepEqual(errors, []);
    await context.close();
  } finally {
    await browser.close();
  }
});

async function chooseTestWallet(page) {
  await page
    .getByRole("button", { name: "Connect Wallet", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: /Base Network/ })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: /Gen-Z test wallet/ })
    .click();
}

test("wallet pending state survives reopening and shows an API error without a session", async () => {
  const browser = await chromium.launch();
  let release;
  const responseGate = new Promise((resolve) => {
    release = resolve;
  });
  try {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    await registerTestWallet(context, wallet());
    await context.route("**/api/v1/auth/challenges", async (route) => {
      await responseGate;
      await route.fulfill({
        status: 503,
        json: {
          error: {
            message:
              "Wallet sign-in is temporarily unavailable. Please try again.",
          },
        },
      });
    });
    const page = await context.newPage();
    await page.goto(`${origin}/auth`);
    await page
      .getByRole("button", { name: "Connect Wallet", exact: true })
      .click();
    const modal = page.getByRole("dialog", { name: "Select Wallet" });
    await page
      .getByRole("dialog")
      .getByRole("button", { name: /Base Network/ })
      .click();
    await modal.getByRole("button", { name: /Gen-Z test wallet/ }).waitFor();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.screenshot({
      path: resolve(screenshots, "wallet-modal-selection.png"),
      fullPage: true,
    });
    await modal.getByRole("button", { name: /Gen-Z test wallet/ }).click();
    await modal
      .getByRole("status")
      .filter({ hasText: "Confirm the sign-in request" })
      .waitFor();
    assert.equal(
      await modal
        .getByRole("button", { name: /Gen-Z test wallet/ })
        .isDisabled(),
      true,
    );
    await page.keyboard.press("Escape");
    await page
      .getByRole("button", { name: "Connect Wallet", exact: true })
      .click();
    await modal
      .getByRole("status")
      .filter({ hasText: "Confirm the sign-in request" })
      .waitFor();
    release();
    await modal
      .getByRole("alert")
      .filter({ hasText: "temporarily unavailable" })
      .waitFor();
    assert.equal(
      await modal
        .getByRole("button", { name: /Gen-Z test wallet/ })
        .isEnabled(),
      true,
    );
    assert.equal(
      (await context.request.get(`${origin}/api/v1/session`)).status(),
      401,
    );
    await context.close();
  } finally {
    release();
    await browser.close();
  }
});

test("wallet selection stays in the modal and network rejection allows retry", async () => {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({
      colorScheme: "dark",
      reducedMotion: "reduce",
    });
    await registerTestWallet(context, wallet(), false, false, true);
    const page = await context.newPage();
    await page.goto(`${origin}/auth`);
    assert.equal(
      await page.getByRole("button", { name: /Gen-Z test wallet/ }).count(),
      0,
    );
    await chooseTestWallet(page);
    const modal = page.getByRole("dialog", { name: "Select Wallet" });
    await modal
      .getByRole("alert")
      .filter({ hasText: "Sign-in cancelled" })
      .waitFor();
    assert.equal(
      (await context.request.get(`${origin}/api/v1/session`)).status(),
      401,
    );
    assert.equal(
      await modal
        .getByRole("button", { name: /Gen-Z test wallet/ })
        .isEnabled(),
      true,
    );
    assert.deepEqual(await inspectPage(page), {
      overflow: false,
      lowContrast: [],
    });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.screenshot({
      path: resolve(screenshots, "wallet-modal-provider.png"),
      fullPage: true,
    });
    await page.setViewportSize({ width: 320, height: 568 });
    assert.deepEqual(await inspectPage(page), {
      overflow: false,
      lowContrast: [],
    });
    await page.screenshot({
      path: resolve(screenshots, "wallet-modal-mobile.png"),
      fullPage: true,
    });
    await page.keyboard.press("Escape");
    await chooseTestWallet(page);
    await modal
      .getByRole("alert")
      .filter({ hasText: "Sign-in cancelled" })
      .waitFor();
    await context.close();
  } finally {
    await browser.close();
  }
});

test("browser wallet sign-in verifies a real signature, persists the session, and signs out", async () => {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({
      reducedMotion: "reduce",
      colorScheme: "light",
    });
    const signer = wallet();
    await registerTestWallet(context, signer);
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${origin}/auth?returnTo=https://evil.example`);
    await chooseTestWallet(page);
    await page.waitForURL(`${origin}/app`);
    await page.getByText(signer.address, { exact: true }).waitFor();
    assert.ok(
      (await context.cookies()).some(
        (cookie) => cookie.name === "genz_session" && cookie.httpOnly,
      ),
    );
    await page.reload();
    await page
      .getByRole("heading", { name: "Your wallet session is verified" })
      .waitFor();
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const scheme of ["light", "dark"]) {
        await page.emulateMedia({ colorScheme: scheme });
        assert.equal(
          await page.evaluate(
            () => getComputedStyle(document.documentElement).colorScheme,
          ),
          "light",
        );
        assert.deepEqual(await inspectPage(page), {
          overflow: false,
          lowContrast: [],
        });
      }
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.screenshot({
      path: resolve(screenshots, "wallet-session-desktop.png"),
      fullPage: true,
    });
    await page
      .getByRole("link", { name: "Sign in with another wallet" })
      .click();
    await chooseTestWallet(page);
    await page.waitForURL(`${origin}/app`);
    await page.getByRole("button", { name: "Sign out", exact: true }).click();
    await page.waitForURL(`${origin}/auth`);
    await page.goto(`${origin}/app`);
    await page.waitForURL(`${origin}/auth`);
    assert.deepEqual(errors, []);
    await context.close();
  } finally {
    await browser.close();
  }
});

test("wallet rejection shows an error and never creates a browser session", async () => {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext();
    await registerTestWallet(context, wallet(), true);
    const page = await context.newPage();
    await page.goto(`${origin}/auth`);
    await chooseTestWallet(page);
    await page
      .getByRole("alert")
      .filter({ hasText: "Sign-in cancelled" })
      .waitFor();
    assert.equal(
      (await context.request.get(`${origin}/api/v1/session`)).status(),
      401,
    );
    await context.close();
  } finally {
    await browser.close();
  }
});

test("account changes during signing and rejected network switches cannot establish a session", async () => {
  const browser = await chromium.launch();
  try {
    for (const [changeAccount, rejectSwitch] of [
      [true, false],
      [false, true],
    ]) {
      const context = await browser.newContext();
      try {
        await registerTestWallet(
          context,
          wallet(),
          false,
          changeAccount,
          rejectSwitch,
        );
        const page = await context.newPage();
        await page.goto(`${origin}/auth`);
        await chooseTestWallet(page);
        const feedback = page.getByRole("dialog").getByRole("alert");
        await feedback.waitFor();
        assert.match(
          await feedback.innerText(),
          changeAccount ? /account or network changed/ : /cancelled/,
        );
        assert.equal(
          (await context.request.get(`${origin}/api/v1/session`)).status(),
          401,
        );
        assert.equal(new URL(page.url()).pathname, "/auth");
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
});
