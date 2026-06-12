# Covenant App — Code Explanation

A reference document explaining the app's architecture, patterns, and potentially confusing code for future review.

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [App Shell & Routing (App.jsx)](#2-app-shell--routing-appjsx)
3. [Sidebar Navigation (sideBar.jsx)](#3-sidebar-navigation-sidebarjsx)
4. [Chart Architecture](#4-chart-architecture)
5. [Data Layer & Date Handling](#5-data-layer--date-handling)
6. [Theme Toggle System](#6-theme-toggle-system)
7. [Transactions Table](#7-transactions-table)
8. [Expenses Form Page](#8-expenses-form-page)

---

## 1. Project Structure

```
src/
  main/                   # Electron main process
  preload/                # Electron preload scripts
  renderer/
    src/
      App.jsx             # Root component (routing + theme)
      main.jsx            # React entry point
      assets/
        main.css          # All global styles (~1115 lines)
      chart/              # Data builders + Chart.js wrapper components
      components/
        Sidebar/
          sideBar.jsx     # Navigation sidebar
      pages/
        Dashboard.jsx     # Main dashboard with filters + charts
        Expenses.jsx      # Transaction form
        Transactions.jsx  # Data table
        Portfolio.jsx     # Placeholder page
        Settings.jsx      # Settings page
        Support.jsx       # Placeholder page
```

---

## 2. App Shell & Routing (App.jsx)

### What it does
The root `<App>` component handles:
- **Page routing** via a lookup object (not React Router)
- **Theme state** with `localStorage` persistence

### Confusing parts

**Dynamic component lookup (line 11-18, 29):**
```jsx
const pageComponents = { Dashboard, Expenses, Transactions, Portfolio, Settings, Support };
// ...
const Page = pageComponents[activePage]
// ...
<Page theme={theme} onThemeChange={setTheme} />
```
- Instead of React Router, it uses a JavaScript object `pageComponents` as a **component registry**.
- `activePage` is a string (e.g. `'Dashboard'`), and `pageComponents[activePage]` returns the actual component function.
- The variable `Page` is capitalized so it can be used as `<Page />` in JSX (React convention: components must start with capital letter).

**Lazy state initializer (line 22-28):**
```jsx
const [theme, setTheme] = useState(() => {
  try { return localStorage.getItem('covenant-theme') || 'light' }
  catch { return 'light' }
})
```
- The `useState` argument is a **function** `() => { ... }` not a value. React calls this only once on mount.
- The `try/catch` handles environments where `localStorage` is unavailable (e.g. private browsing, server-side rendering).

**Theme via `data-theme` attribute (line 32):**
```jsx
document.body.dataset.theme = theme
```
- Instead of React context or CSS classes, it sets a **data attribute** directly on `<body>`.
- All CSS variables in `main.css` swap based on `body[data-theme='dark']` selectors (CSS cascade).

---

## 3. Sidebar Navigation (sideBar.jsx)

### What it does
Renders a vertical nav bar with icons and labels, highlights the active page.

### Confusing parts

**Icon as JSX in a data array (line 6-52):**
```jsx
const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'Expenses', icon: <Wallet size={20} /> },
  // ...
]
```
- Each `icon` is a **JSX element** stored as object property value. When we render `<span className="sidebar-item-icon">{item.icon}</span>`, it embeds that pre-built JSX.
- The icons (`lucide-react`) use `currentColor` — they take the text color of whatever element wraps them, which makes them automatically work in light/dark mode.

**Active class conditional (line 70-71):**
```jsx
className={`sidebar-item ${activePage === item.label ? 'active' : ''}`}
```
- Template literal conditionally appends `'active'` class when the page name matches.

---

## 4. Chart Architecture

### What it does
The app uses **Chart.js** via `react-chartjs-2`. Each chart is split into two files:

| File | Role |
|------|------|
| `chart/barGraph.jsx` | Chart.js wrapper component => renders `<Bar>` |
| `chart/barGraph.js` | Would be the "data builder" (but data may be inline) |

**Actual pattern found:**
- `barGraph.jsx`, `doughnutChart.jsx`, `expenseDoughnutChart.jsx`, `netBalanceChart.jsx`, `subcategoryExpenseChart.jsx`, `topExpensesChart.jsx` — these are **Chart.js wrapper components**
- `doughnutData.js`, `expenseDoughnutData.js`, `netBalanceData.js`, `subcategoryExpenseData.js`, `topExpensesData.js`, `monthlyLineData.js` — these are **data builder modules** that transform raw records into Chart.js-compatible data objects

### Confusing parts

**Chart.js Registration (barGraph.jsx line 1-5):**
```jsx
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.defaults.font.style = "normal";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
```
- Chart.js v4+ requires **explicit registration** of components. If any scale or element is missing, charts break silently.
- `ChartJS.defaults.font.style = "normal"` — overrides Chart.js's default italic/bold fonts globally to avoid inheritance issues with Electron's rendering.

**Data builder pattern (doughnutData.js):**
```jsx
const buildDoughnutData = (records = data.church_expense_tracker.records) => {
```
- Default parameter: if `records` is `undefined`, it falls back to importing the full dataset directly.
- This means the function can be called **without arguments** (uses all data) or **with filtered records** (for date range filtering).

**Grouping records into categories (common pattern seen across all data builders):**
```jsx
const expenseByCategory = {};
expenseRecords.forEach((r) => {
  if (!expenseByCategory[r.category]) expenseByCategory[r.category] = 0;
  expenseByCategory[r.category] += r.amount;
});
```
- Creates an object where keys are category names, values are summed amounts.
- Then `Object.entries(expenseByCategory)` converts `{Offertory: 5000, Tithe: 3000}` into `[['Offertory', 5000], ['Tithe', 3000]]` for chart consumption.

**Color cycling with modulo (barGraph.jsx line 46):**
```jsx
backgroundColor: groupedExpenses.map((_, index) => barColors[index % barColors.length]),
```
- `index % barColors.length` ensures colors cycle if there are more categories than available colors.
- The `(_, index)` syntax: first parameter `_` is unused (the element value), second is the index.

**NetBalanceData: income minus expense per month (netBalanceData.js line 18):**
```jsx
const nextValue = record.type === 'income' ? current + record.amount : current - record.amount;
```
- Uses a single accumulated net value (income - expense) per month, rather than separate arrays.

**monthlyLineData.js — module-level side effects:**
```jsx
const records = data.church_expense_tracker.records;  // line 3
const incomeByMonth = {};                              // line 8
records.forEach(r => { /* mutates incomeByMonth */ }); // line 15
```
- Data processing runs **at import time**, not when the component renders.
- This means the data is computed once when the module first loads, and will not respond to props like `records` (filtered range).
- This contrasts with `buildDoughnutData(records)` which takes `records` as a parameter and recomputes each time.

---

## 5. Data Layer & Date Handling

### What it does
The data lives in `data.js` as a large exported object imported into multiple files.

### Confusing parts

**Import path traversing back several directories:**
```jsx
import data from '../../../../data.js'
```
- `covenantapp/src/renderer/src/chart/doughnutData.js` goes up 4 levels to reach `covenantapp/data.js`.
- The `data.js` file is at the root of the `covenantapp` package, not inside `src/`.

**Data access path (Dashboard.jsx line 30):**
```jsx
const transactions = data.church_expense_tracker.records;
```
- The data object has a nested structure: `data → church_expense_tracker → records[]`.

**Date parsing pattern (Dashboard.jsx line 24, also elsewhere):**
```jsx
const parseLocalDate = (dateString) => new Date(`${dateString}T12:00:00`);
```
- Dates in the data are `"2026-01-04"` (YYYY-MM-DD format).
- `new Date("2026-01-04")` would interpret this as UTC midnight.
- Appending `T12:00:00` forces noon local time, avoiding off-by-one-day errors caused by timezone offsets.

**Date range filtering (Dashboard.jsx line 16-21, 29-31):**
```jsx
const getRangeStart = (value) => {
  const days = Number(value);
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - days);
  return start;
};

const filteredTransactions = useMemo(() => {
  const start = getRangeStart(range);
  return transactions.filter((t) => parseLocalDate(t.date) >= start);
}, [range, transactions]);
```
- `useMemo` recomputes only when `range` or `transactions` changes.
- Filters by comparing parsed dates: keeps records where transaction date >= (today - N days).

**Range options with string values:**
```jsx
const RANGE_OPTIONS = [
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '365', label: 'Last year' },
];
```
- `value` is a **string** (`'7'`, not `7`), because `<select>` options return strings.
- `Number(value)` converts it back to a number in `getRangeStart`.

**data.js line 700-704 — exported side effect:**
```js
const chartdata = data.church_expense_tracker.records.map(item => ({
  x: item.date, y: item.amount
}));
console.log(chartdata)
```
- This runs when the module is imported and logs transformed data to console.
- The variable `chartdata` is not exported, so it's essentially dead code (runs but never used anywhere).

---

## 6. Theme Toggle System

### What it does
Settings.jsx renders a toggle button that switches between `'light'` and `'dark'`.

### Confusing parts

**Theme toggle button with CSS-only knob (Settings.jsx line 29-35):**
```jsx
<button type="button" className="theme-toggle" onClick={() => onThemeChange(isDark ? 'light' : 'dark')}>
  <span className={`theme-toggle-knob ${isDark ? 'dark' : 'light'}`} />
</button>
```
- The `<span>` is a visual knob/circle; the sliding animation is handled entirely by CSS.
- The condition `isDark ? 'light' : 'dark'` — when dark mode is on, switching sends `'light'` (i.e. toggle to light).

**`isDark` derived value (Settings.jsx line 2):**
```jsx
const isDark = theme === 'dark'
```
- Not stored in state — computed from prop each render.

---

## 7. Transactions Table

### What it does
Renders all filtered transactions in an HTML `<table>`.

### Confusing parts

**Dynamic class for type badge (Transactions.jsx line 65-66):**
```jsx
<span className={`type-badge type-${tx.type}`}>{tx.type}</span>
```
- Renders `class="type-badge type-income"` or `class="type-badge type-expense"`.
- CSS uses `.type-expense` / `.type-income` to apply different colors.

**Dynamic class for amount styling (line 69-70):**
```jsx
<td className={`amount-value amount-${tx.type}`}>GHS {tx.amount.toLocaleString()}</td>
```
- Similar pattern: `.amount-income` vs `.amount-expense` classes apply different text colors.

**Empty state (line 78):**
```jsx
{filteredTransactions.length === 0 && <p className="empty-state">No transactions found...</p>}
```
- Uses **short-circuit evaluation**: if the left side is `true`, the right side renders.
- If `filteredTransactions.length === 0` is `false`, React ignores the `<p>` entirely.

---

## 8. Expenses Form Page

### What it does
A controlled form with hardcoded default values (not connected to backend yet).

### Confusing parts

**Controlled form inputs (Expenses.jsx line 6-23):**
```jsx
const [formData, setFormData] = useState({
  date: '2026-01-04',
  type: 'income',
  // ...
});
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};
```
- Each `<input>` / `<select>` has `name` and `value={formData[name]}`.
- `handleChange` uses **computed property name** `[name]` to update the correct field without needing separate handlers.
- The callback form `setFormData((prev) => ...)` ensures state updates are based on the latest state (avoids stale closure bugs).

**Submit/Cancel buttons log to console only (line 26-30):**
```jsx
const handleSubmit = (e) => {
  e.preventDefault();
  console.log('Submitted Form Data:', formData);
};
```
- `e.preventDefault()` prevents the browser from reloading the page.
- No actual API call — data logging only.

**Input icon pattern (Expenses.jsx line 64-72):**
```jsx
<div className="input-with-icon">
  <Calendar className="input-icon-left" size={16} />
  <input type="date" name="date" ... className="form-input has-icon-left" />
</div>
```
- Icons (`Calendar`, `ChevronDown`, `FileText`) are placed inside the input wrapper alongside the actual `<input>`.
- CSS positions the icon absolutely inside the input border using `position: relative` on `.input-with-icon`.