import { Navigate, Route, Routes } from 'react-router-dom'
import { AboutPage } from '../pages/About'
import { ContactPage } from '../pages/Contact'
import { CoursesPage } from '../pages/Courses'
import { HomePage } from '../pages/Home'
import { NotFoundPage } from '../pages/NotFound'

import { AdminLoginPage } from '../pages/admin/AdminLogin'
import { AdminDashboardPage } from '../pages/admin/AdminDashboard'
import { AdminLeadsPage } from '../pages/admin/AdminLeads'
import { AdminAgentsPage } from '../pages/admin/AdminAgents'
import { AdminCallsPage } from '../pages/admin/AdminCalls'
import { AdminAnalyticsPage } from '../pages/admin/AdminAnalytics'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('nexus_admin_token')
  if (!token) {
    return <Navigate to="/admin/login" replace />
  }
  return <>{children}</>
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Landing Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Admin Login (Public) */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Admin CRM Portal Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/leads"
        element={
          <ProtectedRoute>
            <AdminLeadsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/agents"
        element={
          <ProtectedRoute>
            <AdminAgentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/calls"
        element={
          <ProtectedRoute>
            <AdminCallsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute>
            <AdminAnalyticsPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
