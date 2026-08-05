import { Navigate, Route, Routes } from 'react-router-dom'
import { AboutPage } from '../pages/About'
import { ContactPage } from '../pages/Contact'
import { CoursesPage } from '../pages/Courses'
import { HomePage } from '../pages/Home'
import { NotFoundPage } from '../pages/NotFound'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
