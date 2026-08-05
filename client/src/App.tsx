import { Footer } from './components/layout/Footer'
import { Navbar } from './components/layout/Navbar'
import { AppRoutes } from './routes/AppRoutes'

export function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main>
        <AppRoutes />
      </main>
      <Footer />
    </div>
  )
}
