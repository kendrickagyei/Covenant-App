// ─── Settings Routes ──────────────────────────────────────────────────────────
// Settings stores congregation metadata (name, currency, period).
// There's only ever one row — we upsert on PUT.

import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { settings } from "../db/schema";
import { asyncRoute } from "../http";
import { readBody, requiredString } from "../validation";

const router = Router();

// GET /api/settings — Fetch the congregation settings
router.get("/", asyncRoute(async (_req, res) => {
  const result = await db.select().from(settings);
  res.json(result[0] || null);
}));

// PUT /api/settings — Update (or create) the congregation settings
router.put("/", asyncRoute(async (req, res) => {
  const body = readBody(req.body);
  const congregation = requiredString(body, "congregation", 200);
  const currency = requiredString(body, "currency", 10);
  const period = requiredString(body, "period", 100);

  const existing = await db.select().from(settings);

  if (existing.length > 0) {
    await db
      .update(settings)
      .set({ congregation, currency, period })
      .where(eq(settings.id, existing[0].id));
  } else {
    await db.insert(settings).values({ congregation, currency, period });
  }

  res.json({ message: "Settings saved successfully" });
}));

export default router;
