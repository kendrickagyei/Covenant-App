import data from '../../../../data.js';
import LineGraph from '../chart/lineGraph.jsx';
import BarGraph from '../chart/barGraph.jsx';
import DoughnutChart from '../chart/doughnutChart.jsx';
import ExpenseDoughnutChart from '../chart/expenseDoughnutChart.jsx';
import TopExpensesChart from '../chart/topExpensesChart.jsx';
import NetBalanceChart from '../chart/netBalanceChart.jsx';
import SubcategoryExpenseChart from '../chart/subcategoryExpenseChart.jsx';
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
      <section className="page-hero" style={{ marginBottom: 18 }}>
        <div>
          <h1 style={{ margin: 0 }}>Dashboard</h1>
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
              <h2>Giving Trends</h2>
              <p className="panel-subtext">Income vs Expense over categories</p>
            </div>
            <span>June 2026</span>
          </div>

          <div className="main-chart" style={{ marginBottom: 18, height: 350 }}>
            <BarGraph />
          </div>

          <div className="charts-grid">
            <div className="small-chart-card"><TopExpensesChart /></div>
            <div className="small-chart-card"><DoughnutChart /></div>
            <div className="small-chart-card"><ExpenseDoughnutChart /></div>
            <div className="small-chart-card"><NetBalanceChart /></div>
          </div>
        </div>

        <div className="recent-activity-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ height: '100%', padding: '16px' }}>
            <SubcategoryExpenseChart />
          </div>
        </div>
      </section>
    </main>
  )
}

export default Dashboard
