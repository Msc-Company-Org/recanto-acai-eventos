import { defineConfig } from "drizzle-kit";

// Para aplicar mudanças de schema no banco:  DATABASE_URL=... pnpm drizzle-kit push
export default defineConfig({
  schema: "./lib/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL || "" },
});
