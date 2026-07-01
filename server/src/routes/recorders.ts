// ─── Recorders Routes ─────────────────────────────────────────────────────────
// Recorders are people or committees who record transactions.
// e.g. "Treasurer", "Welfare Committee", "Financial Secretary".

import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { recorders } from "../db/schema";
import { asyncRoute, parseIdParam } from "../http";
import { readBody, requiredString } from "../validation";

const router = Router();

// GET /api/recorders — Fetch all recorders
router.get("/", asyncRoute(async (_req, res) => {
  const result = await db.select().from(recorders);
  res.json(result);
}));

// POST /api/recorders — Create a new recorder
router.post("/", asyncRoute(async (req, res) => {
  const body = readBody(req.body);
  const name = requiredString(body, "name", 100);

  const [newRecorder] = await db
    .insert(recorders)
    .values({ name })
    .returning();
  res.status(201).json(newRecorder);
}));

// DELETE /api/recorders/:id — Delete a recorder
router.delete("/:id", asyncRoute(async (req, res) => {
  const id = parseIdParam(req);
  await db.delete(recorders).where(eq(recorders.id, id));
  res.json({ message: "Recorder deleted" });
}));

export default router;
