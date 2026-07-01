// ─── Subcategories Routes ─────────────────────────────────────────────────────
// Subcategories further break down categories.
// e.g. "Sunday Offertory" under "Offertory", "Electricity" under "Utilities".

import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { subcategories } from "../db/schema";
import { asyncRoute, parseIdParam } from "../http";
import { readBody, requiredPositiveInteger, requiredString } from "../validation";

const router = Router();

// GET /api/subcategories — Fetch all subcategories
router.get("/", asyncRoute(async (_req, res) => {
  const result = await db.select().from(subcategories);
  res.json(result);
}));

// GET /api/subcategories/:categoryId — Subcategories for a specific category
router.get("/:categoryId", asyncRoute(async (req, res) => {
  const categoryId = parseIdParam(req, "categoryId");
  const result = await db
    .select()
    .from(subcategories)
    .where(eq(subcategories.categoryId, categoryId));
  res.json(result);
}));

// POST /api/subcategories — Create a new subcategory
router.post("/", asyncRoute(async (req, res) => {
  const body = readBody(req.body);
  const categoryId = requiredPositiveInteger(body, "categoryId");
  const name = requiredString(body, "name", 100);

  const [newSub] = await db
    .insert(subcategories)
    .values({ categoryId, name })
    .returning();
  res.status(201).json(newSub);
}));

// DELETE /api/subcategories/:id — Delete a subcategory
router.delete("/:id", asyncRoute(async (req, res) => {
  const id = parseIdParam(req);
  await db.delete(subcategories).where(eq(subcategories.id, id));
  res.json({ message: "Subcategory deleted" });
}));

export default router;
