import { useMemo, useState } from 'react'
import { useApiData } from '../store/useApiData.js'

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
  const { data, loading } = useApiData()
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

  if (loading) {
    return (
      <main className="page-content">
        <section className="page-hero">
          <div>
            <h1>Portfolio</h1>
            <p className="page-subtitle">Church funds overview</p>
          </div>
        </section>
        <p style={{ padding: '32px', color: 'var(--text-secondary)' }}>Loading data from server...</p>
      </main>
    )
  }

  return (
    <main className="page-content">
      <section className="page-hero">
        <div>
          <h1>Portfolio</h1>
          <p className="page-subtitle">Church funds overview</p>
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

      <section className="support-grid" style={{ marginTop: 24 }}>
        <div className="summary-block">
          <h2>Income by Category</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-subtle)', textAlign: 'left' }}>
                <th style={{ padding: '10px 6px', color: 'var(--text-secondary)', fontWeight: 500 }}>Category</th>
                <th style={{ padding: '10px 6px', textAlign: 'right', color: 'var(--text-secondary)', fontWeight: 500 }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {incomeCategories.map((c) => (
                <tr key={c.category} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '10px 6px' }}>{c.category}</td>
                  <td style={{ padding: '10px 6px', textAlign: 'right', fontWeight: 600 }}>{tracker.currency} {c.income.toLocaleString()}</td>
                </tr>
              ))}
              <tr style={{ fontWeight: 'bold', borderTop: '2px solid var(--border-subtle)' }}>
                <td style={{ padding: '10px 6px' }}>Total</td>
                <td style={{ padding: '10px 6px', textAlign: 'right' }}>{tracker.currency} {totalIncome.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="summary-block">
          <h2>Expense by Category</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-subtle)', textAlign: 'left' }}>
                <th style={{ padding: '10px 6px', color: 'var(--text-secondary)', fontWeight: 500 }}>Category</th>
                <th style={{ padding: '10px 6px', textAlign: 'right', color: 'var(--text-secondary)', fontWeight: 500 }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenseCategories.map((c) => (
                <tr key={c.category} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '10px 6px' }}>{c.category}</td>
                  <td style={{ padding: '10px 6px', textAlign: 'right', fontWeight: 600 }}>{tracker.currency} {c.expense.toLocaleString()}</td>
                </tr>
              ))}
              <tr style={{ fontWeight: 'bold', borderTop: '2px solid var(--border-subtle)' }}>
                <td style={{ padding: '10px 6px' }}>Total</td>
                <td style={{ padding: '10px 6px', textAlign: 'right' }}>{tracker.currency} {totalExpense.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default Portfolio