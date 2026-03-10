import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const QUICK_LINKS = [
  { to: '/dashboard/attendance', label: 'Attendance', icon: '📊', desc: 'Check your attendance & bunk budget' },
  { to: '/dashboard/cgpa', label: 'My CGPA', icon: '🎓', desc: 'View your cumulative grade points' },
  { to: '/dashboard/courses', label: 'Courses', icon: '📚', desc: 'Browse registered courses' },
  { to: '/dashboard/exam', label: 'Exam Section', icon: '📝', desc: 'Hall tickets, results & schedules' },
  { to: '/dashboard/fees', label: 'Fee Payments', icon: '💳', desc: 'Check fee status and receipts' },
  { to: '/dashboard/hallticket', label: 'Hall Ticket', icon: '🎫', desc: 'Download exam hall tickets' },
]

export default function DashboardHome() {
  const { user } = useAuth()

  return (
    <div>
      <div style={styles.welcome}>
        <div>
          <p style={styles.welcomeLabel}>Welcome back</p>
          <h1 style={styles.welcomeName}>{user?.username || 'Student'}</h1>
        </div>
        <div style={styles.klBadge}>KL University ERP</div>
      </div>

      <div style={styles.grid}>
        {QUICK_LINKS.map(({ to, label, icon, desc }) => (
          <Link key={to} to={to} style={styles.card}>
            <div style={styles.cardIcon}>{icon}</div>
            <div style={styles.cardLabel}>{label}</div>
            <div style={styles.cardDesc}>{desc}</div>
            <div style={styles.cardArrow}>→</div>
          </Link>
        ))}
      </div>

      <div style={styles.notice}>
        <span style={styles.noticeDot} />
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>
          Data is fetched live from <strong style={{ color: 'var(--text)' }}>newerp.kluniversity.in</strong> — refresh any page to get latest data.
        </span>
      </div>
    </div>
  )
}

const styles = {
  welcome: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 36,
    flexWrap: 'wrap',
    gap: 16,
  },
  welcomeLabel: { color: 'var(--muted)', fontSize: 13, marginBottom: 4 },
  welcomeName: { fontSize: 32, fontWeight: 800, fontFamily: 'var(--font-mono)' },
  klBadge: {
    background: 'rgba(108,99,255,0.1)',
    border: '1px solid rgba(108,99,255,0.3)',
    color: 'var(--accent)',
    padding: '8px 16px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.05em',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: 16,
    marginBottom: 28,
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 14,
    padding: '24px',
    textDecoration: 'none',
    color: 'var(--text)',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    transition: 'all 0.2s',
    cursor: 'pointer',
    position: 'relative',
  },
  cardIcon: { fontSize: 28, marginBottom: 4 },
  cardLabel: { fontSize: 16, fontWeight: 700 },
  cardDesc: { fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, flex: 1 },
  cardArrow: {
    position: 'absolute',
    top: 20, right: 20,
    color: 'var(--muted)',
    fontSize: 18,
    transition: 'transform 0.2s',
  },
  notice: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 16px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
  },
  noticeDot: {
    width: 6, height: 6, borderRadius: '50%',
    background: 'var(--safe)',
    boxShadow: '0 0 8px var(--safe)',
    flexShrink: 0,
  },
}
