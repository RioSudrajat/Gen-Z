import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/server/db/schema.ts",
  out: "./db/migrations",
  migrations: { prefix: "timestamp" },
  breakpoints: false,
  strict: true,
});
