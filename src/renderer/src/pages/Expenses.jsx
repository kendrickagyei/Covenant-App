const Expenses = () => {
  return (
    <main className="page-content">
      <section className="page-hero">
        <div>
          <p className="page-subtitle">Spend tracking</p>
          <h1>Expenses</h1>
          <p className="page-description">
            Review planned and recorded church expenses for the current period.
          </p>
        </div>
      </section>

      <section className="page-section">
        <div className="summary-block">
          <h2>Overview</h2>
          <p>
            Expenses include utilities, transport, welfare support, and fellowship events.
          </p>
        </div>
        <div className="summary-list">
          <div>
            <strong>GHS 3,720</strong>
            <span>Total expenses this month</span>
          </div>
          <div>
            <strong>5</strong>
            <span>Major categories</span>
          </div>
          <div>
            <strong>12</strong>
            <span>Transactions posted</span>
          </div>
        </div>
      </section>

      <section className="table-card">
        <h2>Recent Expense Records</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2026-06-08</td>
              <td>Electricity</td>
              <td>GHS 415</td>
              <td>ECG bill payment</td>
            </tr>
            <tr>
              <td>2026-06-19</td>
              <td>Stationery</td>
              <td>GHS 160</td>
              <td>Financial report printing</td>
            </tr>
            <tr>
              <td>2026-06-01</td>
              <td>Salaries</td>
              <td>GHS 1,200</td>
              <td>Caretaker salary</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  )
}

export default Expenses
