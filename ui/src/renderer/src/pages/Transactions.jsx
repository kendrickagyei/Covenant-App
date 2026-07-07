import { useMemo, useState } from 'react';
import { useApiData } from '../store/useApiData.js';

const RANGE_OPTIONS = [
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '365', label: 'Last year' },
];

const getRangeStart = (value) => {
  const days = Number(value);
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - days);
  return start;
};

const parseLocalDate = (dateString) => new Date(`${dateString}T12:00:00`);

export default function Transactions() {
  const [range, setRange] = useState('30');
  const { data, loading } = useApiData();
  const transactions = data.church_expense_tracker.records;
  const filteredTransactions = useMemo(() => {
    const start = getRangeStart(range);
    return transactions.filter((transaction) => parseLocalDate(transaction.date) >= start);
  }, [range, transactions]);

  if (loading) {
    return (
      <main className="transaction-page">
        <section className="table-card">
          <h2>Transaction Records</h2>
          <p style={{ padding: '32px', color: 'var(--text-secondary)' }}>Loading data from server...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="transaction-page">
      <section className="table-card">
        <div className="table-header-row">
          <h2>Transaction Records</h2>
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
        </div>
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
              {filteredTransactions.map((tx) => (
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
        {filteredTransactions.length === 0 && <p className="empty-state">No transactions found for this range.</p>}
      </section>
    </main>
  );
}
