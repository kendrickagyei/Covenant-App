// seed.js — Populates the SQLite database with the bundled sample data.
// Run with: node seed.js

const fs = require('fs')
const path = require('path')
const Database = require('better-sqlite3')

// ─── Load data ──────────────────────────────────────────────────────
const dataPath = path.resolve(__dirname, '../ui/data.js')
let raw = fs.readFileSync(dataPath, 'utf8')
raw = raw.replace('export default data', 'module.exports = data')

const tmpPath = path.join(__dirname, '_tmp_seed_data.js')
fs.writeFileSync(tmpPath, raw)
const data = require(tmpPath)
fs.unlinkSync(tmpPath)

const tracker = data.church_expense_tracker
const records = tracker.records

console.log(`Loaded ${records.length} records from data.js`)

// ─── Open database ──────────────────────────────────────────────────
const dbPath = process.env.DATABASE_PATH
  ? path.resolve(__dirname, process.env.DATABASE_PATH)
  : path.join(__dirname, 'data', 'covenant.db')

const db = new Database(dbPath)
db.pragma('journal_mode = DELETE')
db.pragma('foreign_keys = ON')

// ─── Clear existing data (safe for re-seeding) ─────────────────────
db.exec(`
  DELETE FROM transactions;
  DELETE FROM subcategories;
  DELETE FROM categories;
  DELETE FROM recorders;
  DELETE FROM settings;
`)
console.log('Cleared existing data')

// ─── Prepared statements ────────────────────────────────────────────
const insertSettings = db.prepare(
  'INSERT INTO settings (congregation, currency, period) VALUES (?, ?, ?)'
)
const insertCategory = db.prepare(
  'INSERT INTO categories (name, type) VALUES (?, ?)'
)
const insertSubcategory = db.prepare(
  'INSERT INTO subcategories (category_id, name) VALUES (?, ?)'
)
const insertRecorder = db.prepare(
  'INSERT INTO recorders (name) VALUES (?)'
)
const insertTransaction = db.prepare(
  'INSERT INTO transactions (date, type, category_id, subcategory_id, amount, remarks, recorder_id) VALUES (?, ?, ?, ?, ?, ?, ?)'
)

// ─── Seed in a single transaction ──────────────────────────────────
const seed = db.transaction(() => {
  // 1. Settings
  insertSettings.run(tracker.congregation, tracker.currency, tracker.period)

  // 2. Categories
  const catMap = {}
  const catNames = [...new Set(records.map(r => r.category))]
  catNames.forEach(name => {
    catMap[name] = insertCategory.run(name, 'both').lastInsertRowid
  })

  // 3. Subcategories
  const subMap = {}
  const subcatSets = {}
  records.forEach(r => {
    if (!subcatSets[r.category]) subcatSets[r.category] = new Set()
    if (r.subcategory) subcatSets[r.category].add(r.subcategory)
  })
  Object.entries(subcatSets).forEach(([cat, subs]) => {
    subs.forEach(name => {
      subMap[`${cat}|${name}`] = insertSubcategory.run(catMap[cat], name).lastInsertRowid
    })
  })

  // 4. Recorders
  const recMap = {}
  const recNames = [...new Set(records.map(r => r.recorded_by))]
  recNames.forEach(name => {
    recMap[name] = insertRecorder.run(name).lastInsertRowid
  })

  // 5. Transactions
  records.forEach(r => {
    const catId = catMap[r.category]
    const subId = r.subcategory ? subMap[`${r.category}|${r.subcategory}`] : null
    const recId = recMap[r.recorded_by]
    insertTransaction.run(r.date, r.type, catId, subId, r.amount, r.remarks, recId)
  })
})

seed()

// ─── Verify ─────────────────────────────────────────────────────────
console.log('\nSeed complete! Verification:')
const tables = ['settings', 'categories', 'subcategories', 'recorders', 'transactions']
tables.forEach(t => {
  const { n } = db.prepare(`SELECT COUNT(*) as n FROM ${t}`).get()
  console.log(`  ${t}: ${n} rows`)
})

db.close()
console.log(`\nDatabase: ${dbPath}`)
