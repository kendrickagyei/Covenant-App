import image from '../../assets/image/logo.PNG'
const SideBar = ({ activePage, onNavigate, logo }) => {
  const navItems = [
    {
      label: 'Dashboard',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M4 4h7v7H4V4zm9 0h7v4h-7V4zm0 6h7v8h-7V10zm-9 9h7v-5H4v5z" />
        </svg>
      ),
    },
    {
      label: 'Expenses',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M20 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 4H4V7h16zm-2 8H6v-4h12v4zm-2-2h-4v-2h4v2z" />
        </svg>
      ),
    },
    {
      label: 'Transactions',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M4 7h9V4l7 6-7 6v-3H4V7zm13 7v3h3V8.5L9.5 4v3H6l11 7z" />
        </svg>
      ),
    },
    {
      label: 'Portfolio',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm1 2.07V12h6.93A8.042 8.042 0 0 0 13 4.07zM11 4.07A8.053 8.053 0 0 0 4.07 11H11V4.07zM4.07 13A8.053 8.053 0 0 0 11 19.93V13H4.07zM13 19.93A8.042 8.042 0 0 0 19.93 13H13v6.93z" />
        </svg>
      ),
    },
    {
      label: 'Settings',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M19.43 12.98a7.49 7.49 0 0 0 0-1.96l2.11-1.65a.5.5 0 0 0 .12-.63l-2-3.46a.5.5 0 0 0-.6-.22l-2.49 1a7.28 7.28 0 0 0-1.7-.99L14.5 2.5a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 0-.5.5l-.38 2.59a7.28 7.28 0 0 0-1.7.99l-2.49-1a.5.5 0 0 0-.6.22l-2 3.46a.5.5 0 0 0 .12.63l2.11 1.65a7.49 7.49 0 0 0 0 1.96L2.57 14.63a.5.5 0 0 0-.12.63l2 3.46a.5.5 0 0 0 .6.22l2.49-1a7.28 7.28 0 0 0 1.7.99l.38 2.59a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5l.38-2.59a7.28 7.28 0 0 0 1.7-.99l2.49 1a.5.5 0 0 0 .6-.22l2-3.46a.5.5 0 0 0-.12-.63l-2.11-1.65zM12 15.5a3.5 3.5 0 1 1 3.5-3.5 3.504 3.504 0 0 1-3.5 3.5z" />
        </svg>
      ),
    },
    {
      label: 'Support',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M12 2a9 9 0 0 0-9 9c0 5.25 4 9.36 9 11 5-1.64 9-5.76 9-11a9 9 0 0 0-9-9zm1 14h-2v-2h2zm1.07-7.75l-.9.92A1.49 1.49 0 0 0 12 10h-1v-.5a1.5 1.5 0 0 1 1.5-1.5c.28 0 .54.07.76.19l.82-.84A2.978 2.978 0 0 0 11 5.5C9.62 5.5 8.5 6.64 8.5 8H7c0-1.93 1.57-3.5 3.5-3.5S14 6.07 14 8.5c0 .86-.35 1.62-.93 2.25z" />
        </svg>
      ),
    },
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