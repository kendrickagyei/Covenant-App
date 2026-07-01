import { and, eq } from "drizzle-orm";
import { db } from "../db";
import {
  categories,
  recorders,
  settings,
  subcategories,
  transactions,
} from "../db/schema";
import { badRequest, HttpError } from "../http";
import type { RecordPayload, TransactionType } from "./recordValidation";

type TransactionRow = typeof transactions.$inferSelect;

const toFrontendRecord = (
  row: TransactionRow,
  categoryName: string,
  subcategoryName: string,
  recorderName: string
) => ({
  id: row.id,
  date: row.date,
  type: row.type,
  category: categoryName,
  subcategory: subcategoryName,
  amount: Number(row.amount),
  remarks: row.remarks ?? "",
  recorded_by: recorderName,
});

const validateCategoryType = (categoryType: string, transactionType: TransactionType) => {
  if (categoryType !== "both" && categoryType !== transactionType) {
    throw badRequest(`Category cannot be used for ${transactionType} records`);
  }
};

const findCategoryByName = async (name: string) => {
  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.name, name));

  return category;
};

const findOrCreateCategory = async (name: string, type: TransactionType) => {
  const existing = await findCategoryByName(name);

  if (existing) {
    validateCategoryType(existing.type, type);
    return existing;
  }

  const [created] = await db
    .insert(categories)
    .values({ name, type: "both" })
    .returning();

  return created;
};

const findSubcategory = async (categoryId: number, name: string) => {
  const [subcategory] = await db
    .select()
    .from(subcategories)
    .where(
      and(
        eq(subcategories.name, name),
        eq(subcategories.categoryId, categoryId)
      )
    );

  return subcategory;
};

const findOrCreateSubcategoryId = async (
  categoryId: number,
  name: string | null
) => {
  if (!name) {
    return null;
  }

  const existing = await findSubcategory(categoryId, name);

  if (existing) {
    return existing.id;
  }

  const [created] = await db
    .insert(subcategories)
    .values({ categoryId, name })
    .returning();

  return created.id;
};

const findRequiredSubcategoryId = async (
  categoryId: number,
  name: string | null
) => {
  if (!name) {
    return null;
  }

  const existing = await findSubcategory(categoryId, name);

  if (!existing) {
    throw badRequest(`Subcategory "${name}" not found`);
  }

  return existing.id;
};

const findRecorderByName = async (name: string) => {
  const [recorder] = await db
    .select()
    .from(recorders)
    .where(eq(recorders.name, name));

  return recorder;
};

const findOrCreateRecorder = async (name: string) => {
  const existing = await findRecorderByName(name);

  if (existing) {
    return existing;
  }

  const [created] = await db
    .insert(recorders)
    .values({ name })
    .returning();

  return created;
};

const findRequiredRecorder = async (name: string) => {
  const recorder = await findRecorderByName(name);

  if (!recorder) {
    throw badRequest(`Recorder "${name}" not found`);
  }

  return recorder;
};

export const getAllRecords = async () => {
  const rows = await db.select().from(transactions);

  const allCategories = await db.select().from(categories);
  const allSubcategories = await db.select().from(subcategories);
  const allRecorders = await db.select().from(recorders);

  const catMap = new Map(allCategories.map((category) => [category.id, category.name]));
  const subMap = new Map(
    allSubcategories.map((subcategory) => [subcategory.id, subcategory.name])
  );
  const recMap = new Map(allRecorders.map((recorder) => [recorder.id, recorder.name]));

  return rows.map((row) =>
    toFrontendRecord(
      row,
      catMap.get(row.categoryId) ?? "Unknown",
      row.subcategoryId ? subMap.get(row.subcategoryId) ?? "Unknown" : "",
      recMap.get(row.recorderId) ?? "Unknown"
    )
  );
};

export const getTrackerResponse = async () => {
  const [currentSettings] = await db.select().from(settings);

  return {
    church_expense_tracker: {
      congregation: currentSettings?.congregation ?? "Covenant Congregation",
      currency: currentSettings?.currency ?? "GHS",
      period: currentSettings?.period ?? "Current Period",
      records: await getAllRecords(),
    },
  };
};

export const getRecordById = async (id: number) => {
  const [row] = await db
    .select()
    .from(transactions)
    .where(eq(transactions.id, id));

  if (!row) {
    throw new HttpError(404, "Record not found");
  }

  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, row.categoryId));
  const subcategoryRows = row.subcategoryId
    ? await db
        .select()
        .from(subcategories)
        .where(eq(subcategories.id, row.subcategoryId))
    : [];
  const [recorder] = await db
    .select()
    .from(recorders)
    .where(eq(recorders.id, row.recorderId));

  return toFrontendRecord(
    row,
    category?.name ?? "Unknown",
    subcategoryRows[0]?.name ?? "",
    recorder?.name ?? "Unknown"
  );
};

export const createRecord = async (payload: RecordPayload) => {
  const category = await findOrCreateCategory(payload.category, payload.type);
  const subcategoryId = await findOrCreateSubcategoryId(
    category.id,
    payload.subcategory
  );
  const recorder = await findOrCreateRecorder(payload.recorded_by);

  const [newTransaction] = await db
    .insert(transactions)
    .values({
      date: payload.date,
      type: payload.type,
      categoryId: category.id,
      subcategoryId,
      amount: payload.amount,
      remarks: payload.remarks ?? null,
      recorderId: recorder.id,
    })
    .returning();

  return toFrontendRecord(
    newTransaction,
    payload.category,
    payload.subcategory ?? "",
    payload.recorded_by
  );
};

export const updateRecord = async (id: number, payload: RecordPayload) => {
  const category = await findCategoryByName(payload.category);

  if (!category) {
    throw badRequest(`Category "${payload.category}" not found`);
  }

  validateCategoryType(category.type, payload.type);

  const subcategoryId = await findRequiredSubcategoryId(
    category.id,
    payload.subcategory
  );
  const recorder = await findRequiredRecorder(payload.recorded_by);

  const [updatedTransaction] = await db
    .update(transactions)
    .set({
      date: payload.date,
      type: payload.type,
      categoryId: category.id,
      subcategoryId,
      amount: payload.amount,
      remarks: payload.remarks ?? null,
      recorderId: recorder.id,
    })
    .where(eq(transactions.id, id))
    .returning();

  if (!updatedTransaction) {
    throw new HttpError(404, "Record not found");
  }

  return toFrontendRecord(
    updatedTransaction,
    payload.category,
    payload.subcategory ?? "",
    payload.recorded_by
  );
};

export const deleteRecord = async (id: number) => {
  const [deletedTransaction] = await db
    .delete(transactions)
    .where(eq(transactions.id, id))
    .returning();

  if (!deletedTransaction) {
    throw new HttpError(404, "Record not found");
  }
};
