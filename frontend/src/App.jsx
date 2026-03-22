import { useState } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedLayout from './components/Layout'
import { ToastStack } from './components/Common'
import { readStoredUser, saveStoredUser } from './lib/session'
import BillingPage from './pages/BillingPage'
import DashboardPage from './pages/DashboardPage'
import InventoryPage from './pages/InventoryPage'
import LoginPage from './pages/LoginPage'
import PatientDetailPage from './pages/PatientDetailPage'
import PatientsPage from './pages/PatientsPage'
import PublicHome from './pages/PublicHome'
import SchedulePage from './pages/SchedulePage'
import VisitPage from './pages/VisitPage'
import './App.css'

function AppRoutes({ user, onLogout, onLogin, notify }) {
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <PublicHome />} />
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={onLogin} />}
      />
      <Route
        element={
          user ? (
            <ProtectedLayout user={user} onLogout={onLogout} notify={notify} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/patients/:id" element={<PatientDetailPage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/visits/:appointmentId" element={<VisitPage />} />
      </Route>
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/'} replace />} />
    </Routes>
  )
}

export default function App() {
  const [user, setUser] = useState(() => readStoredUser())
  const [toasts, setToasts] = useState([])

  function handleLogin(userData) {
    setUser(userData)
    saveStoredUser(userData)
  }

  function handleLogout() {
    setUser(null)
    saveStoredUser(null)
  }

  function dismissToast(id) {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }

  function notify(message, type = 'success') {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((current) => [...current, { id, message, type }].slice(-4))
    window.setTimeout(() => dismissToast(id), 3600)
  }

  return (
    <HashRouter>
      <AppRoutes user={user} onLogout={handleLogout} onLogin={handleLogin} notify={notify} />
      <ToastStack toasts={toasts} dismissToast={dismissToast} />
    </HashRouter>
  )
}
