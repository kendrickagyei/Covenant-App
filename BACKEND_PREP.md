# 🗄️ Backend Preparation Guide

This document explains exactly what needs to change when you're ready to add a backend (database + API). **No code has been changed yet** — this is a blueprint for future work.

---

## 📋 Overview

Currently, all data lives in:
- `data.js` — bundled sample data (68 dummy records)
- `localStorage` — imported CSV/JSON data (via Settings page)

When you add a backend, the flow will change to:

```
Frontend (React)  ←→  API (e.g. Express/FastAPI)  ←→  Database (PostgreSQL/MongoDB)
```

The `data.js` file will be replaced by real database queries. The data import feature will upload to the server instead of `localStorage`.

---

## 🔧 What Stays the Same (No Changes Needed)

These parts of the code are **backend-ready** and don't need modification:

| File | Why It's Ready |
|---|---|
| `src/renderer/src/store/dataStore.js` | Centralized data access — change `getData()` to call an API once, and every page benefits |
| All chart `*Data.js` files (6 files) | They receive `records` as a parameter — no direct data dependency |
| `src/renderer/src/chart/*.jsx` (chart components) | Receive `records` as props — purely presentational |
| `src/renderer/src/pages/Dashboard.jsx` | Calls `getData()` and passes records to children |
| `src/renderer/src/pages/Transactions.jsx` | Calls `getData()` — just swap the source |
| `src/renderer/src/pages/Expenses.jsx` | Form is ready — just change `handleSubmit` to POST to API |
| `src/renderer/src/pages/Portfolio.jsx` | Calls `getData()` — minor change |
| `src/renderer/src/pages/Support.jsx` | Calls `getData()` — minor change |
| `src/renderer/src/pages/Settings.jsx` | Import UI is ready — just change `importData()` to upload to server |
| `src/renderer/src/components/Sidebar/sideBar.jsx` | Pure UI — no data dependency |
| `src/renderer/src/App.jsx` | Routing and theme — no changes needed |

---

## 🎯 What Needs to Change

### 1. `dataStore.js` — The Only Critical Change

**Current behavior:** Reads from `localStorage` or falls back to `data.js`

**For backend:** Replace the internal logic to call your API.

```jsx
// BEFORE (current — frontend only)
export const getData = () => {
  const stored = localStorage.getItem('covenant-imported-data')
  if (stored) return JSON.parse(stored)
  return defaultData
}

// AFTER (with backend)
let cachedData = null

export const getData = async () => {
  if (cachedData) return cachedData

  const response = await fetch('https://your-api.com/api/records')
  if (!response.ok) throw new Error('Failed to fetch data')

  const json = await response.json()
  cachedData = json
  return json
}

// For components that can't use async (like initial render),
// you can keep a sync fallback:
export const getDataSync = () => cachedData || defaultData
```

**Files affected:** Only `dataStore.js`
**Files that automatically benefit:** `Dashboard.jsx`, `Transactions.jsx`, `Portfolio.jsx`, `Support.jsx`, `Expenses.jsx`

---

### 2. Expenses Form — Submit to API

**Current:** Logs to console
**For backend:** POST to API

```jsx
// BEFORE
const handleSubmit = (e) => {
  e.preventDefault()
  console.log('Submitted Form Data:', formData)
}

// AFTER
const handleSubmit = async (e) => {
  e.preventDefault()
  const response = await fetch('https://your-api.com/api/records', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
  if (response.ok) {
    // Refresh data or show success
  }
}
```

**Files affected:** Only `Expenses.jsx`

---

### 3. Data Import — Upload to Server

**Current:** Saves to `localStorage`
**For backend:** Upload file to server

```jsx
// BEFORE (in Settings.jsx)
importData(parsed)
refreshDataInfo()

// AFTER (in Settings.jsx)
const response = await fetch('https://your-api.com/api/import', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(parsed)
})
if (response.ok) {
  setStatus({ type: 'success', message: 'Data uploaded to server' })
}
```

**Files affected:** Only `Settings.jsx`

---

### 4. `data.js` — Remove or Replace

This file contains 68 dummy records. Once the backend is live:
1. Delete or archive `data.js`
2. The `dataStore.js` fallback can return `{ church_expense_tracker: { records: [] } }` (empty)
3. Or keep it as a "seed data" reference for the database

**Files affected:** `data.js` (delete), `dataStore.js` (update fallback)

---

### 5. `monthlyLineData.js` — Module-Level Import

This file still imports `data.js` at the module level (lines 3-13 pre-fix). We already fixed it, but just be aware — the fix converts it to a function so it's already backend-ready.

---

## 📊 Suggested API Endpoints

You'll need roughly these endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/records` | Fetch all records (returns `{ church_expense_tracker: { records: [...] } }`) |
| `POST` | `/api/records` | Add a new record |
| `POST` | `/api/import` | Bulk import records (CSV/JSON) |
| `DELETE` | `/api/records/:id` | Delete a record |
| `PUT` | `/api/records/:id` | Update a record |

The current frontend uses this data structure:
```json
{
  "church_expense_tracker": {
    "congregation": "Church Name",
    "currency": "GHS",
    "period": "January–June 2026",
    "records": [
      {
        "id": "001",
        "date": "2026-01-04",
        "type": "income",
        "category": "Offertory",
        "subcategory": "Sunday Offertory",
        "amount": 1850,
        "remarks": "First Sunday offertory",
        "recorded_by": "Treasurer"
      }
    ]
  }
}
```

Your backend should return data in this same shape so the frontend works without changes.

---

## ⚙️ Technology Suggestions

| Layer | Options | Notes |
|---|---|---|
| **Backend Framework** | Express.js (Node), FastAPI (Python), Flask (Python) | Express is easiest if you're already using JS |
| **Database** | PostgreSQL, MongoDB, SQLite | SQLite for simplicity, PostgreSQL for production |
| **ORM** | Prisma (JS), SQLAlchemy (Python) | Helps with database queries |
| **Auth** | JWT tokens, session-based | You may want login for different churches |
| **Hosting** | Railway, Render, Fly.io, DigitalOcean | All have free tiers to start |

---

## 🚀 Migration Strategy (Step by Step)

1. **Build a simple API** that returns the same JSON structure as `data.js`
2. **Update `dataStore.js`** to call your API endpoint
3. **Test** — the app should work exactly as before, just with real data
4. **Add mutation endpoints** (POST/PUT/DELETE for records)
5. **Update `Expenses.jsx`** to POST new records
6. **Update `Settings.jsx`** import to upload to server
7. **Remove `data.js`** or keep as seed reference

---

## ✅ Summary: Files That Need Changes for Backend

| File | Change Required | Complexity |
|---|---|---|
| `src/renderer/src/store/dataStore.js` | Replace localStorage/fallback with API calls | Medium |
| `src/renderer/src/pages/Expenses.jsx` | Change `handleSubmit` to POST to API | Low |
| `src/renderer/src/pages/Settings.jsx` | Change import to upload to server | Low |
| `data.js` | Delete or archive | Low |
| Everything else | **No changes needed** | None |