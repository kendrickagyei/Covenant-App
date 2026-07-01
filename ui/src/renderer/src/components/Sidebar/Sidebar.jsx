import image from '../../assets/image/logo.PNG'
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  PieChart,
  Settings,
  CircleHelp
} from 'lucide-react'

const SideBar = ({ activePage, onNavigate, logo }) => {
  const navItems = [
    {
      label: 'Dashboard',
      icon: <LayoutDashboard size={20} />
    },
    {
      label: 'Expenses',
      icon: <Wallet size={20} />
    },
    {
      label: 'Transactions',
      icon: <ArrowLeftRight size={20} />
    },
    {
      label: 'Portfolio',
      icon: <PieChart size={20} />
    },
    {
      label: 'Settings',
      icon: <Settings size={20} />
    },
    {
      label: 'Support',
      icon: <CircleHelp size={20} />
    }
  ]

  return (
    <aside className="sidebar-container">
      <div className="sidebar-header">
        {logo ? (
          <img src={image} alt="Logo" className="sidebar-logo" />
        ) : (
          <>
            <p className="sidebar-greeting">Hello,</p>
            <h2 className="sidebar-username">Hermes</h2>
          </>
        )}
      </div>

      <nav className="sidebar-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`sidebar-item ${activePage === item.label ? 'active' : ''}`}
            type="button"
            onClick={() => onNavigate(item.label)}
          >
            <span className="sidebar-item-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default SideBar