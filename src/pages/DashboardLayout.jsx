import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/dashboard', label: 'Home', icon: '⌂', end: true },
  { to: '/dashboard/attendance', label: 'Attendance', icon: '📊' },
  { to: '/dashboard/courses', label: 'Courses', icon: '📚' },
  { to: '/dashboard/cgpa', label: 'My CGPA', icon: '🎓' },
  { to: '/dashboard/exam', label: 'Exam Section', icon: '📝' },
  { to: '/dashboard/fees', label: 'Fee Payments', icon: '💳' },
  { to: '/dashboard/hallticket', label: 'Hall Ticket', icon: '🎫' },
]

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <div style={styles.shell}>
      {/* Sidebar */}
      <aside style={{ ...styles.sidebar, width: collapsed ? 64 : 220 }}>
        <div style={styles.sideTop}>
          <button onClick={() => setCollapsed(c => !c)} style={styles.collapseBtn}>
            {collapsed ? '→' : '←'}
          </button>
          {!collapsed && (
            <div style={styles.brand}>
              <div style={styles.brandDot} />
              <span style={styles.brandName}>KLERP</span>
            </div>
          )}
        </div>

        <nav style={styles.nav}>
          {NAV.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={({ isActive }) => ({
                ...styles.navLink,
                background: isActive ? 'rgba(108,99,255,0.15)' : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--muted)',
                borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
              })}
            >
              <span style={styles.navIcon}>{icon}</span>
              {!collapsed && <span style={styles.navLabel}>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div style={styles.sideBottom}>
          {!collapsed && user && (
            <div style={styles.userChip}>
              <div style={styles.userAvatar}>{user.username?.[0]?.toUpperCase() || 'S'}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{user.username}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>Student</div>
              </div>
            </div>
          )}
          <button onClick={handleLogout} style={styles.logoutBtn} title="Logout">
            {collapsed ? '⏻' : '⏻  Logout'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

const styles = {
  shell: {
    display: 'flex',
    minHeight: '100vh',
  },
  sidebar: {
    background: 'var(--surface)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.25s ease',
    position: 'sticky',
    top: 0,
    height: '100vh',
    overflow: 'hidden',
    flexShrink: 0,
  },
  sideTop: {
    padding: '20px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    borderBottom: '1px solid var(--border)',
  },
  brand: { display: 'flex', alignItems: 'center', gap: 8 },
  brandDot: {
    width: 8, height: 8, borderRadius: '50%',
    background: 'var(--accent)',
    boxShadow: '0 0 8px var(--accent)',
    flexShrink: 0,
  },
  brandName: {
    fontFamily: 'var(--font-mono)',
    fontSize: 15, fontWeight: 700,
    letterSpacing: '0.1em',
    whiteSpace: 'nowrap',
  },
  collapseBtn: {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 6,
    color: 'var(--muted)',
    width: 30, height: 30,
    cursor: 'pointer',
    fontSize: 12,
    flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  nav: {
    flex: 1,
    padding: '12px 8px',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    overflowY: 'auto',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 8,
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 600,
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  },
  navIcon: { fontSize: 16, flexShrink: 0, width: 20, textAlign: 'center' },
  navLabel: {},
  sideBottom: {
    padding: '16px 12px',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  userChip: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 10px',
    background: 'var(--surface2)',
    borderRadius: 8,
  },
  userAvatar: {
    width: 32, height: 32,
    borderRadius: '50%',
    background: 'var(--accent)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 700,
    flexShrink: 0,
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 8,
    color: 'var(--muted)',
    padding: '8px 12px',
    cursor: 'pointer',
    fontFamily: 'var(--font-head)',
    fontSize: 12,
    fontWeight: 600,
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
    textAlign: 'left',
  },
  main: {
    flex: 1,
    padding: '36px 40px',
    overflow: 'auto',
  },
}
