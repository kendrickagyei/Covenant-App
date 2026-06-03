import data from '../../../../data.js'

const Dashboard = () => {
  const transactions = data.church_expense_tracker.records;
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpense;

  return (
    <main className="page-content">
      <section className="page-hero">
        <div>
          <p className="page-subtitle">Welcome back, Covenant Leader</p>
          <h1>Dashboard</h1>
          <p className="page-description">
            Clean finance overview with totals, recent expenses, and giving trends.
          </p>
        </div>
      </section>

      <section className="dashboard-cards">
        <article className="stat-card">
          <p>Total Income</p>
          <strong>GHS {totalIncome.toLocaleString()}</strong>
        </article>
        <article className="stat-card">
          <p>Total Expense</p>
          <strong>GHS {totalExpense.toLocaleString()}</strong>
        </article>
        <article className="stat-card">
          <p>Net Balance</p>
          <strong>GHS {netBalance.toLocaleString()}</strong>
        </article>
      </section>

      <section className="dashboard-panel">
        <div className="dashboard-chart-card">
          <div className="panel-header">
            <div>
              <h2>Giving Trend</h2>
              <p className="panel-subtext">Last 6 months income and expense</p>
            </div>
            <span>Updated today</span>
          </div>
          <div className="chart-grid">
            <div className="chart-bar" style={{ height: '68%' }}>
              <span>Jan</span>
            </div>
            <div className="chart-bar" style={{ height: '82%' }}>
              <span>Feb</span>
            </div>
            <div className="chart-bar" style={{ height: '61%' }}>
              <span>Mar</span>
            </div>
            <div className="chart-bar" style={{ height: '95%' }}>
              <span>Apr</span>
            </div>
            <div className="chart-bar" style={{ height: '78%' }}>
              <span>May</span>
            </div>
            <div className="chart-bar" style={{ height: '88%' }}>
              <span>Jun</span>
            </div>
          </div>
        </div>

        <div className="recent-activity-card">
          <div className="panel-header">
            <div>
              <h2>Last 5 Expenses</h2>
              <p className="panel-subtext">Most recent outgoing payments</p>
            </div>
            <span>June 2026</span>
          </div>
          <ul className="activity-list">
            <li>
              <strong>GHS 415</strong>
              <span>Electricity bill</span>
            </li>
            <li>
              <strong>GHS 200</strong>
              <span>Pastor fuel allowance</span>
            </li>
            <li>
              <strong>GHS 160</strong>
              <span>Report printing</span>
            </li>
            <li>
              <strong>GHS 420</strong>
              <span>ECG bill payment</span>
            </li>
            <li>
              <strong>GHS 200</strong>
              <span>Visitation transport</span>
            </li>
          </ul>
        </div>
      </section>
    </main>
  )
}

export default Dashboard
