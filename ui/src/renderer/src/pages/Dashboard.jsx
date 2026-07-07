import { useMemo, useState } from 'react';
import { useApiData } from '../store/useApiData.js';
import BarGraph from '../chart/components/barGraph.jsx';
import DoughnutChart from '../chart/components/doughnutChart.jsx';
import ExpenseDoughnutChart from '../chart/components/expenseDoughnutChart.jsx';
import TopExpensesChart from '../chart/components/topExpensesChart.jsx';
import NetBalanceChart from '../chart/components/netBalanceChart.jsx';
import SubcategoryExpenseChart from '../chart/components/subcategoryExpenseChart.jsx';

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

const Dashboard = () => {
  const [range, setRange] = useState('30');
  const { data, loading } = useApiData();
  const transactions = data.church_expense_tracker.records;
  const filteredTransactions = useMemo(() => {
    const start = getRangeStart(range);
    return transactions.filter((transaction) => parseLocalDate(transaction.date) >= start);
  }, [range, transactions]);

  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpense;

  if (loading) {
    return (
      <main className="page-content">
        <section className="page-hero" style={{ marginBottom: 18 }}>
          <h1 style={{ margin: 0 }}>Dashboard</h1>
        </section>
        <p style={{ padding: '32px', color: 'var(--text-secondary)' }}>Loading data from server...</p>
      </main>
    );
  }

  return (
    <main className="page-content">
      <section className="page-hero" style={{ marginBottom: 18 }}>
        <div>
          <h1 style={{ margin: 0 }}>Dashboard</h1>
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
              <h2>Giving Trends</h2>
              <p className="panel-subtext">Income vs Expense over categories</p>
            </div>
            <span>{RANGE_OPTIONS.find((option) => option.value === range)?.label}</span>
          </div>

          <div className="main-chart" style={{ marginBottom: 18, height: 350 }}>
            <BarGraph records={filteredTransactions} />
          </div>

          <div className="charts-grid">
            <div className="small-chart-card"><TopExpensesChart records={filteredTransactions} /></div>
            <div className="small-chart-card"><DoughnutChart records={filteredTransactions} /></div>
            <div className="small-chart-card"><ExpenseDoughnutChart records={filteredTransactions} /></div>
            <div className="small-chart-card"><NetBalanceChart records={filteredTransactions} /></div>
          </div>
        </div>

        <div className="recent-activity-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ height: '100%', padding: '16px' }}>
            <SubcategoryExpenseChart records={filteredTransactions} />
          </div>
        </div>
      </section>
    </main>
  )
}

export default Dashboard