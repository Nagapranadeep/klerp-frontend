import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import DashboardLayout from './pages/DashboardLayout'
import DashboardHome from './pages/DashboardHome'
import Attendance from './pages/Attendance'
import { Courses, CGPA, ExamSection, FeePayments, HallTicket } from './pages/Placeholders'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardLayout /></ProtectedRoute>
          }>
            <Route index element={<DashboardHome />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="courses" element={<Courses />} />
            <Route path="cgpa" element={<CGPA />} />
            <Route path="exam" element={<ExamSection />} />
            <Route path="fees" element={<FeePayments />} />
            <Route path="hallticket" element={<HallTicket />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
