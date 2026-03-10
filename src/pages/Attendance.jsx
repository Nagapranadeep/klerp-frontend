import { useState, useEffect } from 'react'
import { api } from '../context/AuthContext'

export default function Attendance() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [academicYear, setAcademicYear] = useState('2025-2026')
  const [semesterId, setSemesterId] = useState('Odd Sem')

  async function fetchAttendance() {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/api/attendance', {
        params: { academicYear, semesterId }
      })
      setRows(res.data.rows)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch attendance')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAttendance() }, [])

  const overallAvg = rows.length
    ? Math.round(rows.reduce((s, r) => s + r.percentage, 0) / rows.length)
    : 0

  const safeCount = rows.filter(r => r.status === 'safe').length
  const dangerCount = rows.filter(r => r.status === 'danger').length

  return (
    <div>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Attendance</h1>
          <p style={styles.pageSubtitle}>Track your attendance and bunk budget</p>
        </div>
        <div style={styles.filterRow}>
          <select
            style={styles.select}
            value={academicYear}
            onChange={e => setAcademicYear(e.target.value)}
          >
            <option value="2026-2027">2026-2027</option>
            <option value="2025-2026">2025-2026</option>
            <option value="2024-2025">2024-2025</option>
            <option value="2023-2024">2023-2024</option>
            <option value="2022-2023">2022-2023</option>
          </select>
          <select
            style={styles.select}
            value={semesterId}
            onChange={e => setSemesterId(e.target.value)}
          >
            <option value="Odd Sem">Odd Sem</option>
            <option value="Even Sem">Even Sem</option>
            <option value="Summer Term">Summer Term</option>
          </select>
          <button className="btn btn-primary" onClick={fetchAttendance}>
            Refresh
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div style={styles.summaryGrid}>
        <SummaryCard label="Overall Average" value={`${overallAvg}%`}
          color={overallAvg >= 75 ? 'var(--safe)' : 'var(--danger)'}
          sub={overallAvg >= 75 ? 'You\'re good ✓' : 'Below 75% ⚠'}
        />
        <SummaryCard label="Subjects Safe" value={safeCount}
          color="var(--safe)" sub="≥ 75% attendance"
        />
        <SummaryCard label="Subjects At Risk" value={dangerCount}
          color="var(--danger)" sub="< 75% attendance"
        />
        <SummaryCard label="Total Subjects" value={rows.length}
          color="var(--accent)" sub="This semester"
        />
      </div>

      {/* Table */}
      {loading && <div style={styles.loadState}>Fetching attendance data...</div>}
      {error && <div style={styles.errorBox}>{error}</div>}

      {!loading && !error && rows.length > 0 && (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Course', 'Type', 'Section', 'Conducted', 'Attended', 'Absent', 'Percentage', 'Bunk Budget'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={styles.courseName}>{row.courseDesc}</div>
                    <div style={styles.courseCode}>{row.courseCode}</div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.badge}>{row.ltps}</span>
                  </td>
                  <td style={styles.td}>{row.section}</td>
                  <td style={{ ...styles.td, fontFamily: 'var(--font-mono)' }}>{row.conducted}</td>
                  <td style={{ ...styles.td, fontFamily: 'var(--font-mono)' }}>{row.attended}</td>
                  <td style={{ ...styles.td, fontFamily: 'var(--font-mono)', color: row.absent > 0 ? 'var(--danger)' : 'var(--muted)' }}>
                    {row.absent}
                  </td>
                  <td style={styles.td}>
                    <PercentBar pct={row.percentage} />
                  </td>
                  <td style={styles.td}>
                    <BunkBudget row={row} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <div style={styles.empty}>No attendance data found for this semester.</div>
      )}
    </div>
  )
}

function SummaryCard({ label, value, color, sub }) {
  return (
    <div style={styles.summaryCard}>
      <div style={{ fontSize: 32, fontWeight: 800, color, fontFamily: 'var(--font-mono)' }}>
        {value}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{label}</div>
      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{sub}</div>
    </div>
  )
}

function PercentBar({ pct }) {
  const color = pct >= 85 ? 'var(--safe)' : pct >= 75 ? 'var(--warn)' : 'var(--danger)'
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color }}>{pct}%</span>
      </div>
      <div style={{ background: 'var(--surface2)', borderRadius: 4, height: 4, width: 80 }}>
        <div style={{ background: color, width: `${Math.min(pct, 100)}%`, height: '100%', borderRadius: 4 }} />
      </div>
    </div>
  )
}

function BunkBudget({ row }) {
  if (row.status === 'safe' && row.canMiss > 0) {
    return (
      <div style={styles.bunkSafe}>
        <span style={{ fontSize: 16 }}>😴</span>
        <span>Can skip <strong>{row.canMiss}</strong> more</span>
      </div>
    )
  }
  if (row.status === 'danger') {
    return (
      <div style={styles.bunkDanger}>
        <span style={{ fontSize: 16 }}>⚠️</span>
        <span>Attend <strong>{row.needAttend}</strong> more</span>
      </div>
    )
  }
  return (
    <div style={{ color: 'var(--muted)', fontSize: 12 }}>On the edge</div>
  )
}

const styles = {
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: 28, flexWrap: 'wrap', gap: 16,
  },
  pageTitle: { fontSize: 28, fontWeight: 800 },
  pageSubtitle: { color: 'var(--muted)', fontSize: 14, marginTop: 4 },
  filterRow: { display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' },
  select: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    color: 'var(--text)',
    padding: '10px 14px',
    fontFamily: 'var(--font-head)',
    fontSize: 13,
    cursor: 'pointer',
    outline: 'none',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 16, marginBottom: 28,
  },
  summaryCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '20px',
  },
  tableWrap: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 14,
    overflow: 'auto',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '14px 16px',
    textAlign: 'left',
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    borderBottom: '1px solid var(--border)',
    whiteSpace: 'nowrap',
  },
  tr: { borderBottom: '1px solid rgba(255,255,255,0.04)' },
  td: { padding: '14px 16px', fontSize: 13, verticalAlign: 'middle' },
  courseName: { fontWeight: 600, fontSize: 13 },
  courseCode: { color: 'var(--muted)', fontSize: 11, fontFamily: 'var(--font-mono)', marginTop: 2 },
  badge: {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 4,
    padding: '2px 8px',
    fontSize: 11,
    fontFamily: 'var(--font-mono)',
  },
  bunkSafe: {
    display: 'flex', alignItems: 'center', gap: 6,
    color: 'var(--safe)', fontSize: 12,
  },
  bunkDanger: {
    display: 'flex', alignItems: 'center', gap: 6,
    color: 'var(--danger)', fontSize: 12,
  },
  loadState: {
    textAlign: 'center', color: 'var(--muted)',
    padding: 40, fontFamily: 'var(--font-mono)', fontSize: 13,
  },
  errorBox: {
    background: 'rgba(255,77,109,0.1)',
    border: '1px solid rgba(255,77,109,0.3)',
    color: 'var(--danger)',
    padding: '14px 18px',
    borderRadius: 10, marginBottom: 20, fontSize: 13,
  },
  empty: { textAlign: 'center', color: 'var(--muted)', padding: 40, fontSize: 14 },
}
