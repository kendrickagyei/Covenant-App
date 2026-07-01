// ─── Categories Routes ────────────────────────────────────────────────────────
// Categories group transactions, e.g. "Offertory", "Utilities", "Welfare".
// Each category has a type: "income", "expense", or "both".

import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { categories } from "../db/schema";
import { asyncRoute, parseIdParam } from "../http";
import { readBody, requiredEnum, requiredString } from "../validation";

const router = Router();

// GET /api/categories — Fetch all categories
router.get("/", asyncRoute(async (_req, res) => {
  const result = await db.select().from(categories);
  res.json(result);
}));

// POST /api/categories — Create a new category
router.post("/", asyncRoute(async (req, res) => {
  const body = readBody(req.body);
  const name = requiredString(body, "name", 50);
  const type = requiredEnum(body, "type", ["income", "expense", "both"] as const);

  const [newCategory] = await db
    .insert(categories)
    .values({ name, type })
    .returning();
  res.status(201).json(newCategory);
}));

// DELETE /api/categories/:id — Delete a category
router.delete("/:id", asyncRoute(async (req, res) => {
  const id = parseIdParam(req);
  await db.delete(categories).where(eq(categories.id, id));
  res.json({ message: "Category deleted" });
}));

export default router;
