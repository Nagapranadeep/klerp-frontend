import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, api } from '../context/AuthContext'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [captchaInput, setCaptchaInput] = useState('')
  const [captchaImg, setCaptchaImg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [captchaLoading, setCaptchaLoading] = useState(true)
  const { login } = useAuth()
  const navigate = useNavigate()

  const fetchCaptcha = useCallback(async () => {
    setCaptchaLoading(true)
    try {
      const res = await api.get('/api/captcha')
      setCaptchaImg(res.data.captchaImage)
      setCaptchaInput('')
    } catch {
      setError('Could not load captcha. Check your connection.')
    } finally {
      setCaptchaLoading(false)
    }
  }, [])

  useEffect(() => { fetchCaptcha() }, [fetchCaptcha])

  async function handleSubmit(e) {
  e.preventDefault()
  setError('')
  setLoading(true)
  try {
    await login(username, password, captchaInput)
    navigate('/dashboard')  // success — navigate immediately, don't touch captcha
  } catch (err) {
    setError(err.response?.data?.error || 'Login failed')
    fetchCaptcha()  // only refresh captcha on actual failure
  } finally {
    setLoading(false)
  }
}

  return (
    <div style={styles.page}>
      {/* Left panel */}
      <div style={styles.left}>
        <div style={styles.brand}>
          <div style={styles.brandDot} />
          <span style={styles.brandName}>KLERP</span>
        </div>
        <div style={styles.tagline}>
          <h1 style={styles.heroText}>Your college<br />portal,<br /><em style={styles.accent}>reimagined.</em></h1>
          <p style={styles.subText}>Attendance tracking, CGPA, schedules — all in one clean dashboard.</p>
        </div>
        <div style={styles.statsRow}>
          {[['75%', 'Min Attendance'], ['10+', 'Modules'], ['0', 'Ads']].map(([val, label]) => (
            <div key={label} style={styles.stat}>
              <span style={styles.statVal}>{val}</span>
              <span style={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - login form */}
      <div style={styles.right}>
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Sign in</h2>
          <p style={styles.formSub}>Use your KL University credentials</p>

          {error && <div style={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label>Student ID / Username</label>
              <input
                type="text"
                placeholder="e.g. 2520030390"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div style={styles.field}>
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <div style={styles.field}>
              <label>Verification Code</label>
              <div style={styles.captchaRow}>
                <div style={styles.captchaImgWrap}>
                  {captchaLoading
                    ? <div style={styles.captchaPlaceholder}>Loading...</div>
                    : <img src={captchaImg} alt="captcha" style={styles.captchaImg} />
                  }
                </div>
                <button type="button" onClick={fetchCaptcha} style={styles.refreshBtn} title="Refresh captcha">
                  ↻
                </button>
              </div>
              <input
                type="text"
                placeholder="Type the code above"
                value={captchaInput}
                onChange={e => setCaptchaInput(e.target.value)}
                required
                style={{ marginTop: 8 }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: '14px' }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>

          <p style={styles.disclaimer}>
            Your credentials are only used to authenticate with KL University servers and are never stored.
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    fontFamily: 'var(--font-head)',
  },
  left: {
    flex: 1,
    padding: '60px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    background: 'linear-gradient(135deg, #0a0a0f 0%, #12101e 100%)',
    borderRight: '1px solid var(--border)',
  },
  brand: {
    display: 'flex', alignItems: 'center', gap: 10,
  },
  brandDot: {
    width: 10, height: 10, borderRadius: '50%',
    background: 'var(--accent)',
    boxShadow: '0 0 12px var(--accent)',
  },
  brandName: {
    fontFamily: 'var(--font-mono)',
    fontWeight: 700, fontSize: 18,
    letterSpacing: '0.15em',
    color: 'var(--text)',
  },
  tagline: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  heroText: {
    fontSize: 'clamp(36px, 4vw, 56px)',
    fontWeight: 800, lineHeight: 1.1,
    color: 'var(--text)',
    marginBottom: 20,
  },
  accent: { color: 'var(--accent)', fontStyle: 'normal' },
  subText: { color: 'var(--muted)', fontSize: 16, lineHeight: 1.6, maxWidth: 360 },
  statsRow: { display: 'flex', gap: 40 },
  stat: { display: 'flex', flexDirection: 'column', gap: 4 },
  statVal: { fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--accent)' },
  statLabel: { fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' },
  right: {
    width: 440,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    background: 'var(--surface)',
  },
  formCard: { width: '100%', maxWidth: 360 },
  formTitle: { fontSize: 28, fontWeight: 800, marginBottom: 6 },
  formSub: { color: 'var(--muted)', fontSize: 14, marginBottom: 28 },
  errorBox: {
    background: 'rgba(255,77,109,0.1)',
    border: '1px solid rgba(255,77,109,0.3)',
    color: 'var(--danger)',
    padding: '10px 14px',
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 16,
  },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  field: { display: 'flex', flexDirection: 'column' },
  captchaRow: { display: 'flex', alignItems: 'center', gap: 10 },
  captchaImgWrap: {
    flex: 1, background: 'white',
    borderRadius: 8, overflow: 'hidden',
    minHeight: 50, display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  captchaImg: { display: 'block', width: '100%', height: 'auto' },
  captchaPlaceholder: { color: '#aaa', fontSize: 12, padding: '12px' },
  refreshBtn: {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    color: 'var(--text)',
    fontSize: 20,
    width: 44, height: 44,
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.2s',
  },
  disclaimer: {
    marginTop: 20,
    fontSize: 11,
    color: 'var(--muted)',
    lineHeight: 1.5,
    textAlign: 'center',
  },
}
