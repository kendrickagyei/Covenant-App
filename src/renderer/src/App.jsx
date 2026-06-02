import { useState } from 'react'
import SideBar from './components/Sidebar/sideBar'
import appLogo from './assets/wavy-lines.svg'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Transactions from './pages/Transactions'
import Portfolio from './pages/Portfolio'
import Settings from './pages/Settings'
import Support from './pages/Support'

const pageComponents = {
  Dashboard: <Dashboard />,
  Expenses: <Expenses />,
  Transactions: <Transactions />,
  Portfolio: <Portfolio />,
  Settings: <Settings />,
  Support: <Support />,
}

function App() {
  const [activePage, setActivePage] = useState('Dashboard')

  return (
    <div className="app-shell">
      <SideBar activePage={activePage} onNavigate={setActivePage} logo={appLogo} />
      <div className="app-main">{pageComponents[activePage]}</div>
    </div>
  )
}

export default App
