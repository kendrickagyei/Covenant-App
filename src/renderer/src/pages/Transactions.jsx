import data from '../../../../data.js'
export default function Transactions() {
  const transactions = data.church_expense_tracker.records;

  return (
    <main className="transaction-page">
      <section className="table-card">
        <h2>Transaction Records</h2>
        <div className="transaction-table-wrapper">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Remarks</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Recorded By</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.id}</td>
                  <td>{tx.date}</td>
                  <td>{tx.remarks}</td>
                  <td>{tx.category}</td>
                  <td>
                    <span className={`type-badge type-${tx.type}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`amount-value amount-${tx.type}`}>
                    GHS {tx.amount.toLocaleString()}
                  </td>
                  <td>{tx.recorded_by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
