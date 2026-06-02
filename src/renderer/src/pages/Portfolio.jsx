const Portfolio = () => {
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
          <p>Building Fund</p>
          <strong>GHS 9,200</strong>
        </article>
        <article className="stat-card">
          <p>Emergency Reserve</p>
          <strong>GHS 3,400</strong>
        </article>
        <article className="stat-card">
          <p>Mission Support</p>
          <strong>GHS 5,650</strong>
        </article>
      </section>

      <section className="page-section">
        <div className="summary-block">
          <h2>Allocation Breakdown</h2>
          <ul className="bullet-list">
            <li>50% Building fund</li>
            <li>20% Reserve savings</li>
            <li>30% Outreach initiatives</li>
          </ul>
        </div>
      </section>
    </main>
  )
}

export default Portfolio
