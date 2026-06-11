import data from '../../../../data.js'

const Portfolio = () => {
  const tracker = data.church_expense_tracker

  return (
    <main className="page-content">
      <section className="page-hero">
        <div>
          <p className="page-subtitle">Church funds overview</p>
          <h1>Portfolio</h1>
          <p className="page-description">
            Static view of current fund allocations and reserve balances.
          </p>
        </div>
      </section>

      <section className="dashboard-cards">
        <article className="stat-card">
          <p>{tracker.congregation}</p>
          <strong>{tracker.currency}</strong>
        </article>
        <article className="stat-card">
          <p>Financial period</p>
          <strong>{tracker.period}</strong>
        </article>
        <article className="stat-card">
          <p>Record schema</p>
          <strong>{Object.keys(tracker.schema).length} fields</strong>
        </article>
      </section>

      <section className="support-grid">
        <div className="summary-block">
          <h2>Allocation Breakdown</h2>
          <ul className="bullet-list">
            <li>50% Building fund</li>
            <li>20% Reserve savings</li>
            <li>30% Outreach initiatives</li>
          </ul>
        </div>
        <div className="summary-block">
          <h2>Tracker summary</h2>
          <p>Currency: <strong>{tracker.currency}</strong></p>
          <p>Period: <strong>{tracker.period}</strong></p>
          <p>Entries are stored locally in the JSON tracker.</p>
        </div>
      </section>
    </main>
  )
}

export default Portfolio
