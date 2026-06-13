import { getData } from '../store/dataStore.js'

const Support = () => {
  const data = getData()
  const tracker = data.church_expense_tracker

  return (
    <main className="page-content">
      <section className="page-hero">
        <div>
          <p className="page-subtitle">Need help?</p>
          <h1>Support</h1>
          <p className="page-description">
            Contact the finance team or review common questions.
          </p>
        </div>
      </section>

      <section className="support-grid">
        <div className="support-card">
          <h2>Contact</h2>
          <p>{tracker.congregation}</p>
          <p>Email: finance@covenantchurch.org</p>
          <p>Phone: +233 20 123 4567</p>
        </div>
        <div className="support-card">
          <h2>FAQs</h2>
          <ul className="bullet-list">
            <li>How are donations recorded?</li>
            <li>Where can I find the latest balance?</li>
            <li>Who approves expenses?</li>
          </ul>
        </div>
      </section>

      <section className="page-section">
        <div className="summary-block">
          <h2>Tracker details</h2>
          <p>Currency: <strong>{tracker.currency}</strong></p>
          <p>Current period: <strong>{tracker.period}</strong></p>
        </div>
      </section>
    </main>
  )
}

export default Support
