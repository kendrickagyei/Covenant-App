import "dotenv/config";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

const databasePath = process.env.DATABASE_PATH ?? "./data/covenant.db";

// Use default journal mode (rollback) instead of WAL.
// WAL is faster but gets corrupted if the process is force-killed.
const sqlite = new Database(databasePath);
sqlite.pragma("journal_mode = DELETE");
sqlite.pragma("foreign_keys = ON");

// Integrity check on startup
const result = sqlite.pragma("integrity_check");
if (result[0]?.integrity_check !== "ok") {
  console.error("⚠️  Database integrity check failed! Run: node seed.js");
} else {
  console.log("✅ Database integrity OK");
}

export const db = drizzle(sqlite, { schema });

// Graceful shutdown — checkpoint and close
process.on("SIGINT", () => {
  try { sqlite.close(); } catch {}
  process.exit(0);
});
process.on("SIGTERM", () => {
  try { sqlite.close(); } catch {}
  process.exit(0);
});
