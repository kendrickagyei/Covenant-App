const Transactions = () => {
  return (
    <main className="page-content">
      <section className="page-hero">
        <div>
          <p className="page-subtitle">Transaction history</p>
          <h1>Transactions</h1>
          <p className="page-description">
            A sample list of recent tranactions across giving and spending.
          </p>
        </div>
      </section>

      <section className="table-card">
        <h2>Latest Transactions</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>068</td>
              <td>2026-06-30</td>
              <td>Expense</td>
              <td>GHS 200</td>
              <td>Completed</td>
            </tr>
            <tr>
              <td>063</td>
              <td>2026-06-22</td>
              <td>Income</td>
              <td>GHS 4,200</td>
              <td>Completed</td>
            </tr>
            <tr>
              <td>055</td>
              <td>2026-06-01</td>
              <td>Expense</td>
              <td>GHS 1,200</td>
              <td>Completed</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  )
}

export default Transactions
