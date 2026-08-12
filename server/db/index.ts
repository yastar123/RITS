import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;
let pool: pg.Pool | undefined;

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL belum diatur. Hubungkan aplikasi ke PostgreSQL terlebih dahulu.");
  }
  pool ??= new Pool({ connectionString: process.env.DATABASE_URL });
  return drizzle(pool, { schema });
}