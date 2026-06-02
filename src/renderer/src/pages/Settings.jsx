const Settings = () => {
  return (
    <main className="page-content">
      <section className="page-hero">
        <div>
          <p className="page-subtitle">Application settings</p>
          <h1>Settings</h1>
          <p className="page-description">
            Adjust the app experience and review connection details.
          </p>
        </div>
      </section>

      <section className="page-section">
        <div className="summary-block">
          <h2>Profile</h2>
          <p>Signed in as <strong>kendrickagyei</strong></p>
          <p>Data sync is currently set to local mode.</p>
        </div>
        <div className="summary-block">
          <h2>Preferences</h2>
          <ul className="bullet-list">
            <li>Dark mode: Off</li>
            <li>Notifications: Enabled</li>
            <li>Auto-save: On</li>
          </ul>
        </div>
      </section>
    </main>
  )
}

export default Settings
