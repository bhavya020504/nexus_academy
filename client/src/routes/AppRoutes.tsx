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

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Landing Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Admin CRM Portal Routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      <Route path="/admin/leads" element={<AdminLeadsPage />} />
      <Route path="/admin/agents" element={<AdminAgentsPage />} />
      <Route path="/admin/calls" element={<AdminCallsPage />} />
      <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />

      {/* Fallback */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
