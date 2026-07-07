// schema.ts
import {
  sqliteTable,
  integer,
  text,
  unique,
  real,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// --- 0. SETTINGS (congregation metadata) ---
export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  congregation: text("congregation", { length: 200 }).notNull(),
  currency: text("currency", { length: 10 }).notNull().default("GHS"),
  period: text("period", { length: 100 }).notNull(),
});

// --- 1. CATEGORIES ---
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name", { length: 50 }).notNull().unique(),
  type: text("type", { length: 10 }).notNull(),
});

// --- 2. SUBCATEGORIES ---
export const subcategories = sqliteTable(
  "subcategories",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    name: text("name", { length: 100 }).notNull(),
  },
  (table) => ({
    uniqueCategorySubcategory: unique().on(table.categoryId, table.name),
  })
);

// --- 3. RECORDERS ---
export const recorders = sqliteTable("recorders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name", { length: 100 }).notNull().unique(),
});

// --- 4. TRANSACTIONS ---
export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  type: text("type", { length: 10 }).notNull(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "restrict" }),
  subcategoryId: integer("subcategory_id").references(
    () => subcategories.id,
    { onDelete: "restrict" }
  ),
  amount: real("amount").notNull(),
  remarks: text("remarks"),
  recorderId: integer("recorder_id")
    .notNull()
    .references(() => recorders.id, { onDelete: "restrict" }),
  createdAt: text("created_at"),
});

// --- RELATIONS ---
export const categoriesRelations = relations(categories, ({ many }) => ({
  subcategories: many(subcategories),
  transactions: many(transactions),
}));

export const subcategoriesRelations = relations(
  subcategories,
  ({ one, many }) => ({
    category: one(categories, {
      fields: [subcategories.categoryId],
      references: [categories.id],
    }),
    transactions: many(transactions),
  })
);

export const recordersRelations = relations(recorders, ({ many }) => ({
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
  subcategory: one(subcategories, {
    fields: [transactions.subcategoryId],
    references: [subcategories.id],
  }),
  recorder: one(recorders, {
    fields: [transactions.recorderId],
    references: [recorders.id],
  }),
}));
