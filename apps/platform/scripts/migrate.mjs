import { localEnv } from "./local.mjs";
import { migrate } from "./migrations.mjs";

try {
  await migrate(localEnv().DATABASE_URL);
} catch {
  console.error(
    "Database migration failed. Check PostgreSQL access and migration checksums; no reset was performed.",
  );
  process.exitCode = 1;
}
