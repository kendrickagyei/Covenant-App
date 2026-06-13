import { useMemo, useState } from 'react'
import { getData } from '../store/dataStore.js'

const RANGE_OPTIONS = [
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '365', label: 'Last year' },
  { value: '0', label: 'All time' },
]

const getRangeStart = (value) => {
  const days = Number(value)
  if (days === 0) return new Date(0)
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - days)
  return start
}

const parseLocalDate = (dateString) => new Date(`${dateString}T12:00:00`)

const Portfolio = () => {
  const [range, setRange] = useState('0')
  const data = getData()
  const tracker = data.church_expense_tracker
  const records = tracker.records

  const filteredTransactions = useMemo(() => {
    const start = getRangeStart(range)
    return records.filter((t) => parseLocalDate(t.date) >= start)
  }, [range, records])

  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const netBalance = totalIncome - totalExpense

  const categorySummary = useMemo(() => {
    const map = {}
    filteredTransactions.forEach((t) => {
      if (!map[t.category]) {
        map[t.category] = { category: t.category, income: 0, expense: 0 }
      }
      if (t.type === 'income') map[t.category].income += t.amount
      else map[t.category].expense += t.amount
    })
    return Object.values(map).sort((a, b) => (b.income + b.expense) - (a.income + a.expense))
  }, [filteredTransactions])

  const incomeCategories = categorySummary.filter((c) => c.income > 0)
  const expenseCategories = categorySummary.filter((c) => c.expense > 0)

  return (
    <main className="page-content">
      <section className="page-hero" style={{ marginBottom: 18 }}>
        <div>
          <p className="page-subtitle">Church funds overview</p>
          <h1 style={{ margin: 0 }}>Portfolio</h1>
          <p className="page-description">
            Complete financial totals across all categories.
          </p>
        </div>
        <label className="filter-select-wrap">
          <span className="filter-label">Date range</span>
          <select className="filter-select" value={range} onChange={(e) => setRange(e.target.value)}>
            {RANGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="dashboard-cards">
        <article className="stat-card">
          <p>Total Income</p>
          <strong>{tracker.currency} {totalIncome.toLocaleString()}</strong>
        </article>
        <article className="stat-card">
          <p>Total Expense</p>
          <strong>{tracker.currency} {totalExpense.toLocaleString()}</strong>
        </article>
        <article className="stat-card">
          <p>Net Balance</p>
          <strong>{tracker.currency} {netBalance.toLocaleString()}</strong>
        </article>
        <article className="stat-card">
          <p>Total Records</p>
          <strong>{filteredTransactions.length}</strong>
        </article>
      </section>

      <section style={{ marginTop: 24 }}>
        <div className="support-grid">
          <div className="summary-block">
            <h2>Income by Category</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border, #e5e7eb)', textAlign: 'left' }}>
                  <th style={{ padding: '8px 4px' }}>Category</th>
                  <th style={{ padding: '8px 4px', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {incomeCategories.map((c) => (
                  <tr key={c.category} style={{ borderBottom: '1px solid var(--border, #e5e7eb)' }}>
                    <td style={{ padding: '8px 4px' }}>{c.category}</td>
                    <td style={{ padding: '8px 4px', textAlign: 'right' }}>{tracker.currency} {c.income.toLocaleString()}</td>
                  </tr>
                ))}
                <tr style={{ fontWeight: 'bold', borderTop: '2px solid var(--border, #e5e7eb)' }}>
                  <td style={{ padding: '8px 4px' }}>Total</td>
                  <td style={{ padding: '8px 4px', textAlign: 'right' }}>{tracker.currency} {totalIncome.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="summary-block">
            <h2>Expense by Category</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border, #e5e7eb)', textAlign: 'left' }}>
                  <th style={{ padding: '8px 4px' }}>Category</th>
                  <th style={{ padding: '8px 4px', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenseCategories.map((c) => (
                  <tr key={c.category} style={{ borderBottom: '1px solid var(--border, #e5e7eb)' }}>
                    <td style={{ padding: '8px 4px' }}>{c.category}</td>
                    <td style={{ padding: '8px 4px', textAlign: 'right' }}>{tracker.currency} {c.expense.toLocaleString()}</td>
                  </tr>
                ))}
                <tr style={{ fontWeight: 'bold', borderTop: '2px solid var(--border, #e5e7eb)' }}>
                  <td style={{ padding: '8px 4px' }}>Total</td>
                  <td style={{ padding: '8px 4px', textAlign: 'right' }}>{tracker.currency} {totalExpense.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Portfolio