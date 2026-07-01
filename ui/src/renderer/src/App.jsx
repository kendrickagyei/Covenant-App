import { useEffect, useState } from 'react'
import SideBar from './components/Sidebar/Sidebar'
import appLogo from './assets/wavy-lines.svg'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Transactions from './pages/Transactions'
import Portfolio from './pages/Portfolio'
import Settings from './pages/Settings'
import Support from './pages/Support'

const pageComponents = {
  Dashboard,
  Expenses,
  Transactions,
  Portfolio,
  Settings,
  Support,
}

function App() {
  const [activePage, setActivePage] = useState('Dashboard')
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('covenant-theme') || 'light'
    } catch {
      return 'light'
    }
  })
  const Page = pageComponents[activePage]

  useEffect(() => {
    document.body.dataset.theme = theme
    try {
      localStorage.setItem('covenant-theme', theme)
    } catch {
      // Ignore environments where storage is unavailable.
    }
  }, [theme])

  return (
    <div className="app-shell">
      <SideBar activePage={activePage} onNavigate={setActivePage} logo={appLogo} />
      <div className="app-main">
        <div key={activePage} className="page-transition-shell">
          {Page ? (
            <Page theme={theme} onThemeChange={setTheme} />
          ) : (
            <div style={{ padding: '32px', color: 'var(--text-primary)' }}>
              <h2>Page not found</h2>
              <p>The selected page is not available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
