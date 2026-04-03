import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

// Layout
import Layout from './components/layout/Layout'
import ProtectedRoute from './router/ProtectedRoute'

// Auth pages (public)
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

// Client pages
import ClientDashboard from './pages/client/ClientDashboard'
import CreateTicketPage from './pages/client/CreateTicketPage'
import TicketDetailPage from './pages/client/TicketDetailPage'

// Agent page
import AgentDashboard from './pages/agent/AgentDashboard'

// Admin page
import AdminDashboard from './pages/admin/AdminDashboard'

// 404
import NotFoundPage from './pages/NotFoundPage'

/** Smart root redirect based on user role */
const RootRedirect = () => {
  const { user } = useAuth()
  if (user?.role === 'admin') return <Navigate to="/admin" replace />
  if (user?.role === 'agent') return <Navigate to="/agent" replace />
  return <Navigate to="/tickets" replace />
}

const App = () => {
  return (
    <Routes>
      {/* ── Public Routes ────────────────────────────────── */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ── Protected Routes (any authenticated user) ────── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          {/* Root → redirect to role dashboard */}
          <Route index element={<RootRedirect />} />

          {/* Client routes */}
          <Route element={<ProtectedRoute allowedRoles={['client']} />}>
            <Route path="/tickets" element={<ClientDashboard />} />
            <Route path="/tickets/new" element={<CreateTicketPage />} />
          </Route>

          {/* Ticket detail — accessible by all roles */}
          <Route path="/tickets/:id" element={<TicketDetailPage />} />

          {/* Agent routes */}
          <Route element={<ProtectedRoute allowedRoles={['agent', 'admin']} />}>
            <Route path="/agent" element={<AgentDashboard />} />
          </Route>

          {/* Admin routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Route>

      {/* ── 404 ─────────────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
