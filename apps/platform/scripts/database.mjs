import { prepareEnvironment, compose } from "./local.mjs";

try {
  compose(process.argv[2], await prepareEnvironment());
} catch {
  console.error(
    "Local PostgreSQL is unavailable. Open Docker Desktop, wait for Engine running, then run npm run setup:platform. Database volumes are preserved.",
  );
  process.exitCode = 1;
}
