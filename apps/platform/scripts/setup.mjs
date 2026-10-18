import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { prepareEnvironment, compose, repoRoot, run } from "./local.mjs";

try {
  if (Number(process.versions.node.split(".")[0]) !== 24)
    throw new Error("Use Node.js 24 as recorded in the root .nvmrc.");
  if (
    !existsSync(resolve(repoRoot, "node_modules/next/package.json")) ||
    !existsSync(resolve(repoRoot, "node_modules/pg/package.json")) ||
    !existsSync(resolve(repoRoot, "node_modules/drizzle-orm/package.json"))
  ) {
    if (!process.env.npm_execpath)
      throw new Error("Run setup through npm run setup:platform.");
    run(process.execPath, [process.env.npm_execpath, "ci"]);
  }
  const { migrate } = await import("./migrations.mjs");
  const { doctor } = await import("./doctor.mjs");
  const settings = await prepareEnvironment();
  compose("up", settings);
  await migrate(settings.DATABASE_URL);
  await doctor(settings);
  console.log(
    "Gen-Z platform is ready for local wallet sign-in. App origin: " +
      (settings.GENZ_APP_ORIGIN || "http://localhost:3001"),
  );
} catch (error) {
  console.error(
    "Setup stopped. Start Docker Desktop and check local configuration. Existing data was preserved.",
  );
  if (error?.message?.startsWith("Use Node")) console.error(error.message);
  process.exitCode = 1;
}
