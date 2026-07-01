// schema.ts
import {
  pgTable,
  serial,
  varchar,
  numeric,
  text,
  date,
  timestamp,
  integer,
  unique,
  check,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// ─── 0. SETTINGS (congregation metadata) ─────────────────────────────────────
export const settings = pgTable(
  "settings",
  {
    id: serial("id").primaryKey(),
    congregation: varchar("congregation", { length: 200 }).notNull(),
    currency: varchar("currency", { length: 10 }).notNull().default("GHS"),
    period: varchar("period", { length: 100 }).notNull(),
  }
);

// ─── 1. CATEGORIES ───────────────────────────────────────────────────────────
export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 50 }).notNull().unique(),
    type: varchar("type", { length: 10 }).notNull(),
  },
  (table) => ({
    typeCheck: check(
      "categories_type_check",
      sql`${table.type} IN ('income', 'expense', 'both')`
    ),
  })
);

// ─── 2. SUBCATEGORIES ────────────────────────────────────────────────────────
export const subcategories = pgTable(
  "subcategories",
  {
    id: serial("id").primaryKey(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    name: varchar("name", { length: 100 }).notNull(),
  },
  (table) => ({
    uniqueCategorySubcategory: unique().on(table.categoryId, table.name),
  })
);

// ─── 3. RECORDERS ────────────────────────────────────────────────────────────
export const recorders = pgTable("recorders", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
});

// ─── 4. TRANSACTIONS ─────────────────────────────────────────────────────────
export const transactions = pgTable(
  "transactions",
  {
    id: serial("id").primaryKey(),
    date: date("date").notNull(),
    type: varchar("type", { length: 10 }).notNull(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    subcategoryId: integer("subcategory_id").references(
      () => subcategories.id,
      { onDelete: "restrict" }
    ),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    remarks: text("remarks"),
    recorderId: integer("recorder_id")
      .notNull()
      .references(() => recorders.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    typeCheck: check(
      "transactions_type_check",
      sql`${table.type} IN ('income', 'expense')`
    ),
    amountCheck: check(
      "transactions_amount_check",
      sql`${table.amount} >= 0`
    ),
  })
);

// ─── RELATIONS ────────────────────────────────────────────────────────────────
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