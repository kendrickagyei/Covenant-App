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
        map[t.category] = { category: t.category, type: t.type, income: 0, expense: 0, count: 0 }
      }
      if (t.type === 'income') map[t.category].income += t.amount
      else map[t.category].expense += t.amount
      map[t.category].count += 1
    })
    return Object.values(map).sort((a, b) => (b.income + b.expense) - (a.income + a.expense))
  }, [filteredTransactions])

  const subcategorySummary = useMemo(() => {
    const map = {}
    filteredTransactions.forEach((t) => {
      const key = `${t.category} - ${t.subcategory}`
      if (!map[key]) {
        map[key] = { category: t.category, subcategory: t.subcategory, type: t.type, income: 0, expense: 0, count: 0 }
      }
      if (t.type === 'income') map[key].income += t.amount
      else map[key].expense += t.amount
      map[key].count += 1
    })
    return Object.values(map).sort((a, b) => (b.income + b.expense) - (a.income + a.expense))
  }, [filteredTransactions])

  const incomeCategories = useMemo(
    () => [...new Set(filteredTransactions.filter((t) => t.type === 'income').map((t) => t.category))].sort(),
    [filteredTransactions]
  )

  const expenseCategories = useMemo(
    () => [...new Set(filteredTransactions.filter((t) => t.type === 'expense').map((t) => t.category))].sort(),
    [filteredTransactions]
  )

  return (
    <main className="page-content">
      <section className="page-hero" style={{ marginBottom: 18 }}>
        <div>
          <p className="page-subtitle">Church funds overview</p>
          <h1 style={{ margin: 0 }}>Portfolio</h1>
          <p className="page-description">
            Complete financial breakdown with categories, income, expenses, and totals.
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
        <article className="stat-card">
          <p>Income Categories</p>
          <strong>{incomeCategories.length}</strong>
        </article>
        <article className="stat-card">
          <p>Expense Categories</p>
          <strong>{expenseCategories.length}</strong>
        </article>
      </section>

      <section style={{ marginTop: 24 }}>
        <div className="support-grid">
          <div className="summary-block">
            <h2>Income Categories</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border, #e5e7eb)', textAlign: 'left' }}>
                  <th style={{ padding: '8px 4px' }}>Category</th>
                  <th style={{ padding: '8px 4px', textAlign: 'right' }}>Amount</th>
                  <th style={{ padding: '8px 4px', textAlign: 'right' }}>Records</th>
                </tr>
              </thead>
              <tbody>
                {categorySummary
                  .filter((c) => c.income > 0)
                  .map((c) => (
                    <tr key={c.category} style={{ borderBottom: '1px solid var(--border, #e5e7eb)' }}>
                      <td style={{ padding: '8px 4px' }}>{c.category}</td>
                      <td style={{ padding: '8px 4px', textAlign: 'right' }}>{tracker.currency} {c.income.toLocaleString()}</td>
                      <td style={{ padding: '8px 4px', textAlign: 'right' }}>{c.count}</td>
                    </tr>
                  ))}
                <tr style={{ fontWeight: 'bold', borderTop: '2px solid var(--border, #e5e7eb)' }}>
                  <td style={{ padding: '8px 4px' }}>Total</td>
                  <td style={{ padding: '8px 4px', textAlign: 'right' }}>{tracker.currency} {totalIncome.toLocaleString()}</td>
                  <td style={{ padding: '8px 4px', textAlign: 'right' }}>
                    {categorySummary.filter((c) => c.income > 0).reduce((s, c) => s + c.count, 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="summary-block">
            <h2>Expense Categories</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border, #e5e7eb)', textAlign: 'left' }}>
                  <th style={{ padding: '8px 4px' }}>Category</th>
                  <th style={{ padding: '8px 4px', textAlign: 'right' }}>Amount</th>
                  <th style={{ padding: '8px 4px', textAlign: 'right' }}>Records</th>
                </tr>
              </thead>
              <tbody>
                {categorySummary
                  .filter((c) => c.expense > 0)
                  .map((c) => (
                    <tr key={c.category} style={{ borderBottom: '1px solid var(--border, #e5e7eb)' }}>
                      <td style={{ padding: '8px 4px' }}>{c.category}</td>
                      <td style={{ padding: '8px 4px', textAlign: 'right' }}>{tracker.currency} {c.expense.toLocaleString()}</td>
                      <td style={{ padding: '8px 4px', textAlign: 'right' }}>{c.count}</td>
                    </tr>
                  ))}
                <tr style={{ fontWeight: 'bold', borderTop: '2px solid var(--border, #e5e7eb)' }}>
                  <td style={{ padding: '8px 4px' }}>Total</td>
                  <td style={{ padding: '8px 4px', textAlign: 'right' }}>{tracker.currency} {totalExpense.toLocaleString()}</td>
                  <td style={{ padding: '8px 4px', textAlign: 'right' }}>
                    {categorySummary.filter((c) => c.expense > 0).reduce((s, c) => s + c.count, 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Subcategory Breakdown</h2>
        <div className="table-scroll-wrapper" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border, #e5e7eb)', textAlign: 'left' }}>
                <th style={{ padding: '8px 4px' }}>Category</th>
                <th style={{ padding: '8px 4px' }}>Subcategory</th>
                <th style={{ padding: '8px 4px', textAlign: 'right' }}>Income</th>
                <th style={{ padding: '8px 4px', textAlign: 'right' }}>Expense</th>
                <th style={{ padding: '8px 4px', textAlign: 'right' }}>Net</th>
                <th style={{ padding: '8px 4px', textAlign: 'right' }}>Records</th>
              </tr>
            </thead>
            <tbody>
              {subcategorySummary.map((s) => (
                <tr key={`${s.category}-${s.subcategory}`} style={{ borderBottom: '1px solid var(--border, #e5e7eb)' }}>
                  <td style={{ padding: '8px 4px' }}>{s.category}</td>
                  <td style={{ padding: '8px 4px' }}>{s.subcategory}</td>
                  <td style={{ padding: '8px 4px', textAlign: 'right' }}>
                    {s.income > 0 ? `${tracker.currency} ${s.income.toLocaleString()}` : '-'}
                  </td>
                  <td style={{ padding: '8px 4px', textAlign: 'right' }}>
                    {s.expense > 0 ? `${tracker.currency} ${s.expense.toLocaleString()}` : '-'}
                  </td>
                  <td style={{ padding: '8px 4px', textAlign: 'right' }}>
                    <span style={{ color: s.income - s.expense >= 0 ? '#16a34a' : '#dc2626' }}>
                      {tracker.currency} {(s.income - s.expense).toLocaleString()}
                    </span>
                  </td>
                  <td style={{ padding: '8px 4px', textAlign: 'right' }}>{s.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>All Transactions ({filteredTransactions.length})</h2>
        <div className="table-scroll-wrapper" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border, #e5e7eb)', textAlign: 'left' }}>
                <th style={{ padding: '8px 4px' }}>Date</th>
                <th style={{ padding: '8px 4px' }}>Type</th>
                <th style={{ padding: '8px 4px' }}>Category</th>
                <th style={{ padding: '8px 4px' }}>Subcategory</th>
                <th style={{ padding: '8px 4px', textAlign: 'right' }}>Amount</th>
                <th style={{ padding: '8px 4px' }}>Remarks</th>
                <th style={{ padding: '8px 4px' }}>Recorded By</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--border, #e5e7eb)' }}>
                  <td style={{ padding: '8px 4px' }}>{t.date}</td>
                  <td style={{ padding: '8px 4px' }}>
                    <span className={`type-badge type-${t.type}`}>{t.type}</span>
                  </td>
                  <td style={{ padding: '8px 4px' }}>{t.category}</td>
                  <td style={{ padding: '8px 4px' }}>{t.subcategory}</td>
                  <td style={{ padding: '8px 4px', textAlign: 'right' }}>{tracker.currency} {t.amount.toLocaleString()}</td>
                  <td style={{ padding: '8px 4px' }}>{t.remarks}</td>
                  <td style={{ padding: '8px 4px' }}>{t.recorded_by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default Portfolio