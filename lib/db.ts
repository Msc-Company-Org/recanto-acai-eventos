import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Singleton lazy: só conecta em runtime (não quebra o build sem DATABASE_URL).
const g = globalThis as unknown as { _db?: PostgresJsDatabase<typeof schema> };

export function getDb(): PostgresJsDatabase<typeof schema> {
  if (!g._db) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL não configurada");
    // prepare:false é necessário para o pooler do Supabase em modo transaction.
    const client = postgres(url, { prepare: false });
    g._db = drizzle(client, { schema });
  }
  return g._db;
}

export function hasDb(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
