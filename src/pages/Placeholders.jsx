// Generic placeholder for pages not yet implemented
export function ComingSoon({ title }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
      <div style={{ fontSize: 48 }}>🚧</div>
      <h2 style={{ fontSize: 24, fontWeight: 800 }}>{title}</h2>
      <p style={{ color: 'var(--muted)', fontSize: 14 }}>This section is coming soon. Scraping logic to be added.</p>
    </div>
  )
}

export function Courses() { return <ComingSoon title="Courses" /> }
export function CGPA() { return <ComingSoon title="My CGPA" /> }
export function ExamSection() { return <ComingSoon title="Exam Section" /> }
export function FeePayments() { return <ComingSoon title="Fee Payments" /> }
export function HallTicket() { return <ComingSoon title="Hall Ticket" /> }
