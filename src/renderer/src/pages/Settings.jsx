const Settings = ({ theme, onThemeChange }) => {
  const isDark = theme === 'dark'

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

      <section className="settings-grid">
        <div className="summary-block">
          <h2>Profile</h2>
          <p>Signed in as <strong>Kendrick Agyei</strong></p>
          <p>{`Data source: `}<strong>Covenant church expense tracker</strong></p>
          <p>{`Period: `}<strong>January to June 2026</strong></p>
        </div>

        <div className="summary-block">
          <h2>Appearance</h2>
          <p>Switch between a bright workspace and a darker low-glare view.</p>
          <div className="theme-toggle-row">
            <span>{isDark ? 'Dark mode' : 'Light mode'}</span>
            <button
              type="button"
              className="theme-toggle"
              onClick={() => onThemeChange(isDark ? 'light' : 'dark')}
            >
              <span className={`theme-toggle-knob ${isDark ? 'dark' : 'light'}`} />
            </button>
          </div>
          <p className="theme-note">Current theme is <strong>{theme}</strong>.</p>
        </div>
      </section>

      <section className="page-section">
        <div className="summary-block">
          <h2>Preferences</h2>
          <ul className="bullet-list">
            <li>Notifications: Enabled</li>
            <li>Auto-save: On</li>
            <li>Local sync: Active</li>
          </ul>
        </div>
      </section>
    </main>
  )
}

export default Settings
