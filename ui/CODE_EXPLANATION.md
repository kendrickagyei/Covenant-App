# Covenant App — Code Explained for Beginners

This document explains every part of this app in simple terms.
Think of it as a map that shows what each file does, why certain code was written that way, and what to watch out for.

---

## Table of Contents

1. What Is This App?
2. Project Folder Structure
3. App.jsx — The Boss Component
4. Sidebar (Sidebar.jsx) — The Navigation Menu
5. The Data Store (dataStore.js) — Where All Data Lives
6. Dashboard (Dashboard.jsx) — The Main Page
7. Transaction Table (Transactions.jsx) — The Data Grid
8. Expenses Form (Expenses.jsx) — Adding Records
9. Chart System (chart/ folder) — The Graphs (now split into components/ and data/)
10. Settings Page (Settings.jsx) — Theme and Data Import
11. CSS System (main.css) — How Styling Works
12. data.js — The Bundled Sample Data
13. Bugs We Found and Fixed

---

## 1. What Is This App?

This is a church expense tracker built with React (a JavaScript library for building user interfaces), Electron (turns web apps into desktop apps), Chart.js (draws charts and graphs), and Lucide React (an icon library that automatically works in light/dark mode).

It helps a church track income and expenses, view charts, and manage financial data.

---

## 2. Project Folder Structure

```
covenantapp/                          The main app folder
  data.js                             Bundled sample data (68 records)
  package.json                        List of dependencies
  electron.vite.config.mjs            Build configuration

  src/
    main/                             Electron stuff (ignore for now)
    preload/                          Electron stuff (ignore for now)

    renderer/
      src/
        main.jsx                      Entry point — React starts here
        App.jsx                       Root component (page selector + theme)
        assets/
          main.css                    All the styles (~1150 lines)
        store/
          dataStore.js                Central data hub
        components/
          Sidebar/
            Sidebar.jsx               Left-side navigation menu
        pages/
          Dashboard.jsx               Main page with charts
          Transactions.jsx            Table of all records
          Expenses.jsx                Form to add new records
          Portfolio.jsx               Static info page
          Settings.jsx                Theme toggle and Data Import
          Support.jsx                 Contact and FAQ page
        chart/
          components/                 Chart.js component files
            barGraph.jsx              Bar chart for expenses
            doughnutChart.jsx         Ring chart for income
            expenseDoughnutChart.jsx  Ring chart for expenses
            netBalanceChart.jsx       Bar chart for net balance
            topExpensesChart.jsx      Top 5 expenses
            subcategoryExpenseChart.jsx Subcategory breakdown
            monthlyLineChart.jsx      Income vs Expense line chart
          data/                       Chart data transformation files
            doughnutData.js           Builds income chart data
            expenseDoughnutData.js    Builds expense chart data
            netBalanceData.js         Builds net balance data
            topExpensesData.js        Builds top expenses data
            subcategoryExpenseData.js Builds subcategory data
            monthlyLineData.js        Builds line chart data
```

---

## 3. App.jsx — The Boss Component

### What it does

Decides which page to show (Dashboard, Expenses, etc.) and manages theme (light/dark mode).

### How page routing works (no React Router!)

```jsx
const pageComponents = { Dashboard, Expenses, Transactions, Portfolio, Settings, Support };
// ...
const Page = pageComponents[activePage]   // Gets the right component by name
// ...
<Page theme={theme} onThemeChange={setTheme} />   // Renders it
```

For beginners: This is a simple "lookup table". When activePage is 'Dashboard', JavaScript does pageComponents['Dashboard'] which returns the Dashboard component. It is like looking up a word in a dictionary.

### Theme system

```jsx
const [theme, setTheme] = useState(() => {
  try { return localStorage.getItem('covenant-theme') || 'light' }
  catch { return 'light' }
})
```

localStorage is like a tiny database in your browser that survives page refreshes. The try/catch is a safety net — some browsers block localStorage in private mode. When the theme changes, it sets document.body.dataset.theme = theme which triggers CSS variables to swap colors.

The arrow function inside useState is called only once when the component first loads. If you just wrote localStorage.getItem(...), it would run on every render.

---

## 4. Sidebar (sideBar.jsx) — The Navigation Menu

### What it does

Shows the navigation buttons on the left side. Highlights the current page.

### How icons work

```jsx
import { LayoutDashboard, Wallet, ArrowLeftRight, PieChart, Settings, CircleHelp } from 'lucide-react'

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  // ...
]
```

Each icon is a React component from lucide-react. They use currentColor — meaning they take the text color of whatever surrounds them. This makes them automatically change color in dark mode without any extra code.

### Active page highlighting

```jsx
className={`sidebar-item ${activePage === item.label ? 'active' : ''}`}
```

If the page name matches, add the 'active' class. Otherwise, leave it empty.

---

## 5. The Data Store (dataStore.js) — Where All Data Lives

### The problem it solves

Originally, every page imported data.js directly. If someone wanted to use their own church data, they would have to edit data.js by hand. This was impossible for non-technical users.

### How it works now

```jsx
import defaultData from '../../../../data.js'

export const getData = () => {
  // 1. Check if user uploaded custom data (stored in localStorage)
  const stored = localStorage.getItem('covenant-imported-data')
  if (stored) {
    const parsed = JSON.parse(stored)
    // 2. Validate that it has the right structure
    if (parsed?.church_expense_tracker?.records) {
      return parsed
    }
  }
  // 3. Fall back to the bundled data
  return defaultData
}
```

The flow:
1. User uploads a CSV/JSON file on the Settings page and it gets saved to localStorage
2. Every page calls getData() which checks localStorage first
3. If nothing was uploaded, it uses the built-in data.js

### CSV parser (the tricky part)

CSV files store data as comma-separated values:
```
id,date,type,category,amount,remarks
001,2026-01-04,income,Offertory,1850,"First Sunday, January"
```

The bug we fixed: What if a remark contains a comma like "First Sunday, January"?
The original code used line.split(',') which would break it into 6 parts instead of 5.

The fix:

```jsx
const parseCSVLine = (line) => {
  // Walk through the line character by character
  // When we see a quote, toggle "quote mode"
  // Only split on commas when NOT inside quotes
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') inQuotes = !inQuotes
    else if (line[i] === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
    } else {
      current += line[i]
    }
  }
  values.push(current.trim())
}
```

---

## 6. Dashboard (Dashboard.jsx) — The Main Page

### What it does

Shows summary cards (Total Income, Total Expense, Net Balance), shows 4 charts, and has a date range filter (Last 7 days, 30 days, 1 year).

### Date filtering explained

```jsx
const RANGE_OPTIONS = [
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '365', label: 'Last year' },
];
```

The value is a string ('7' not 7) because HTML select elements always return string values. So even though it looks like a number, it comes back as "7". That is why getRangeStart calls Number(value) to convert it.

### Date parsing trick

```jsx
const parseLocalDate = (dateString) => new Date(`${dateString}T12:00:00`);
```

The data has dates like "2026-01-04". If you do new Date("2026-01-04"), JavaScript treats it as midnight UTC. Depending on your timezone, this could show as the previous day! Adding T12:00:00 forces noon local time, avoiding the timezone shift.

### Charts receive filtered data

```jsx
const filteredTransactions = useMemo(() => {
  const start = getRangeStart(range);
  return transactions.filter((t) => parseLocalDate(t.date) >= start);
}, [range, transactions]);
```

useMemo says: "only recompute when range or transactions changes". This prevents unnecessary recalculations.

---

## 7. Transaction Table (Transactions.jsx) — The Data Grid

### What it does

Shows all records in a table with date range filtering.

### CSS classes from data (the dynamic class trick)

```jsx
<span className={`type-badge type-${tx.type}`}>{tx.type}</span>
```

If tx.type is "income", the class becomes "type-badge type-income". If tx.type is "expense", the class becomes "type-badge type-expense". CSS then colors each differently (green for income, red for expense).

### Empty state

```jsx
{filteredTransactions.length === 0 && <p className="empty-state">No transactions found...</p>}
```

This uses short-circuit evaluation. JavaScript's && operator: if the left side is true, it returns the right side. React renders true as nothing and the paragraph element as the paragraph. When there ARE transactions, the left side is false, so the paragraph does not appear.

---

## 8. Expenses Form (Expenses.jsx) — Adding Records

### What it does

A form to add new records. Not connected to a database yet — just logs to console.

### Controlled form pattern

```jsx
const [formData, setFormData] = useState({ category: 'Offertory', ... });

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};
```

Every input has a name attribute that matches a key in formData. [name] is a computed property name — it uses the variable's value as the key. (prev) => ({ ...prev, ... }) spreads the previous state and overrides one field.

### Dynamic categories from data

```jsx
const allCategories = () => [...new Set(getRecords().map((r) => r.category))].sort();
```

In plain English:
1. Get all records
2. Extract just the category field from each
3. new Set() removes duplicates (like a unique filter)
4. [...set] converts it back to an array
5. .sort() alphabetizes

This means if you import data from a different church with different categories, the dropdown automatically updates.

### Subcategory filtering

```jsx
const getSubcategoriesForCategory = (category) =>
  [...new Set(getRecords().filter((r) => r.category === category).map((r) => r.subcategory))].sort();
```

Only shows subcategories that belong to the currently selected category.

---

## 9. Chart System (chart/ folder) — The Graphs

### How it is organized

Each chart has two files: a *Data.js file that transforms raw records into Chart.js format, and a *Chart.jsx file that renders the actual chart component.

### Chart.js requirements (the registration trap)

```jsx
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
```

Chart.js v4+ requires explicit registration of components. If you forget to register something, the chart silently fails (no error, just blank).

### Default parameter pattern (the bug we fixed)

BEFORE (BROKEN):

```jsx
// These imported data.js directly as fallback
const buildDoughnutData = (records = data.church_expense_tracker.records) => { ... }
```

AFTER (FIXED):

```jsx
// No import of data.js — records come from wherever calls this function
const buildDoughnutData = (records = []) => { ... }
```

Why was this a bug? The data.church_expense_tracker.records was evaluated at import time. So even if the user imported new data, the chart would still use the old default data.

### Color cycling with modulo

```jsx
backgroundColor: categories.map((_, index) => colors[index % colors.length])
```

If there are 7 colors and 10 categories: index % 7 gives 0,1,2,3,4,5,6,0,1,2 — colors cycle!

### Monthly Line Data — the biggest bug we fixed

BEFORE (BROKEN):

```jsx
// This ran ONCE when the file was imported — not when data changed!
const records = data.church_expense_tracker.records;
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];  // Only 6 months!
const incomeByMonth = {};
records.forEach(r => { incomeByMonth[month] += r.amount; });
// Exported a pre-computed object, not a function
export default monthlyLineData;
```

Problems:
1. Ran at import time (not when data changes)
2. Hardcoded to Jan-Jun only
3. Could not handle imported data (still referenced old data.js)
4. If you had 2025 data too, months would collide

AFTER (FIXED):

```jsx
const buildMonthlyLineData = (records = []) => {
  // Dynamically build from whatever records are passed in
  // Supports all 12 months
  // Uses "Jan 2026" as key (includes year, so no collisions)
  // Only shows months that actually have data
};
export default buildMonthlyLineData;
```

Now the chart component:

```jsx
const MonthlyLineChart = ({ records }) => {
  const data = buildMonthlyLineData(records || []);
  return <Line data={data} options={options} />;
};
```

---

## 10. Settings Page (Settings.jsx) — Theme and Data Import

### What it does

Toggle light/dark mode, upload CSV/JSON data files, download a sample CSV, and reset to default data.

### Upload flow

```jsx
<label className="import-btn">
  <Upload size={16} />
  <span>Upload CSV / JSON</span>
  <input type="file" accept=".csv,.json" onChange={handleFileUpload} style={{ display: 'none' }} />
</label>
```

The input is hidden (display: none). Clicking the label triggers the file picker.

### File processing

```jsx
const handleFileUpload = async (e) => {
  const file = e.target.files[0]
  const text = await file.text()           // Read file contents
  const ext = file.name.split('.').pop()   // Get extension (csv or json)

  let parsed
  if (ext === 'csv') parsed = parseCSV(text)
  else parsed = parseJSON(text)

  importData(parsed)  // Save to localStorage
}
```

### Status messages

```jsx
{status && (
  <div className={`import-status import-status-${status.type}`}>
    {status.type === 'success' ? <CheckCircle2 /> : <AlertCircle />}
    <span>{status.message}</span>
  </div>
)}
```

Green background for success, red for errors. The status message auto-updates on each import attempt.

---

## 11. CSS System (main.css) — How Styling Works

### CSS Variables (the theme engine)

```css
:root {
  --app-bg: #f5f5ff;
  --text-primary: #111827;
  /* light mode colors */
}

body[data-theme='dark'] {
  --app-bg: #0f172a;
  --text-primary: #f8fafc;
  /* dark mode colors */
}

body {
  background-color: var(--app-bg);
  color: var(--text-primary);
}
```

When App.jsx sets document.body.dataset.theme = 'dark', CSS changes all --app-bg, --text-primary variables. Everything that uses var(--app-bg) automatically updates.

### Layout system

```css
.app-shell { display: flex; }           /* sidebar + main side by side */
.sidebar-container { width: 250px; }    /* fixed width sidebar */
.app-main { flex: 1; overflow-y: auto; } /* remaining space for content */
```

---

## 12. data.js — The Bundled Sample Data

This is a large file containing 68 sample records for the church.

### Bug we fixed

At the bottom of the file, there was dead code:

```js
const chartdata = data.church_expense_tracker.records.map(item => ({
  x: item.date, y: item.amount
}));
console.log(chartdata)
```

This ran every time the file was imported — even in files that did not use chartdata. The variable was never used anywhere. We removed it.

---

## 13. Bugs We Found and Fixed

| # | Bug | File(s) | What Was Wrong | How We Fixed |
|---|---|---|---|---|
| 1 | Charts ignored imported data | All *Data.js files (6 files) | They imported data.js as default parameter fallback, so they always used old data | Removed imports — they now accept records parameter |
| 2 | Monthly chart only showed Jan-Jun | monthlyLineData.js | Hardcoded 6 months, ran at import time | Converted to function that handles all months and years |
| 3 | Monthly chart would crash with multi-year data | monthlyLineData.js | Months did not include year (Jan vs Jan 2026) | Added year to keys and chronological sort |
| 4 | CSV parser broke on quoted commas | dataStore.js — parseCSV | Used line.split(',') which splits inside quotes | Added parseCSVLine() that respects quotes |
| 5 | "Download sample CSV" scrolled page up | Settings.jsx | Used anchor tag with href="#" which jumps to top | Replaced with button element |
| 6 | Dead code logged to console on every import | data.js | console.log(chartdata) ran at import time | Removed the lines |
| 7 | Chart title color does not change in dark mode | netBalanceChart.jsx, monthlyLineChart.jsx | Title color hardcoded to #111827 | Documented as known limitation (Chart.js options are static) |
| 8 | Categories form showed only 3 of 15 categories | Expenses.jsx | Hardcoded option elements | Now auto-populates from data |
| 9 | Sidebar used inline SVGs without dark mode support | sideBar.jsx | SVG fill colors were static | Replaced with Lucide React icons (use currentColor) |