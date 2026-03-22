import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/patients', label: 'Patients' },
  { to: '/billing', label: 'Billing' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/schedule', label: 'Schedule' },
]

function pageTitle(pathname) {
  if (pathname.startsWith('/patients/')) return 'Patient Detail'
  if (pathname.startsWith('/patients')) return 'Patients'
  if (pathname.startsWith('/billing')) return 'Billing'
  if (pathname.startsWith('/inventory')) return 'Inventory'
  if (pathname.startsWith('/schedule')) return 'Schedule'
  if (pathname.startsWith('/visits/')) return 'Visit Workspace'
  return 'Dashboard'
}

export default function ProtectedLayout({ user, onLogout, notify }) {
  const location = useLocation()

  return (
    <div className="shell">
      <aside className="sidebar">
        <Link className="brand" to="/dashboard">
          <span className="brand-mark">DC</span>
          <div>
            <strong>DentalCare IMS</strong>
            <small>Clinic operations cockpit</small>
          </div>
        </Link>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-card">
            <span className="user-chip">{user.username.slice(0, 1).toUpperCase()}</span>
            <div>
              <strong>{user.username}</strong>
              <small>{user.role}</small>
            </div>
          </div>
          <button type="button" className="ghost-button" onClick={onLogout}>
            Sign out
          </button>
        </div>
      </aside>
      <main className="workspace">
        <header className="workspace-header">
          <div>
            <p className="eyebrow">Dental Clinic Information Management System</p>
            <h1>{pageTitle(location.pathname)}</h1>
          </div>
          <div className="header-note">{new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}</div>
        </header>
        <div className="workspace-body">
          <Outlet context={{ user, notify }} />
        </div>
      </main>
    </div>
  )
}
