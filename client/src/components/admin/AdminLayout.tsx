import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Bot,
  PhoneCall,
  BarChart3,
  LogOut,
  Sparkles,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [adminEmail, setAdminEmail] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('nexus_admin_token')
    const email = localStorage.getItem('nexus_admin_email')
    if (!token) {
      navigate('/admin/login')
    } else {
      setAdminEmail(email || 'admin@ainexus.com')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('nexus_admin_token')
    localStorage.removeItem('nexus_admin_email')
    navigate('/admin/login')
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Lead Management', path: '/admin/leads', icon: Users },
    { label: 'Agent Management', path: '/admin/agents', icon: Bot },
    { label: 'Call Management', path: '/admin/calls', icon: PhoneCall },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white block">AI Nexus</span>
              <span className="text-xs text-blue-400 font-semibold tracking-wider uppercase block">CRM Portal</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive =
              item.path === '/admin'
                ? location.pathname === '/admin' || location.pathname === '/admin/dashboard'
                : location.pathname.startsWith(item.path)

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="h-3.5 w-3.5 text-blue-400" />}
              </Link>
            )
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-blue-400 shrink-0">
                AD
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-200 truncate">{adminEmail}</p>
                <p className="text-[10px] text-emerald-400 font-medium">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950 overflow-y-auto">
        {/* Header */}
        <header className="h-16 px-6 border-b border-slate-800 bg-slate-900/40 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">
              Live System Telemetry
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <ShieldAlert className="h-3.5 w-3.5 text-blue-400" />
              <span>SnapServe Outbound Dispatch Active</span>
            </div>
            <Link
              to="/"
              className="text-xs font-medium text-slate-400 hover:text-blue-400 transition-colors"
            >
              ← Back to Main Website
            </Link>
          </div>
        </header>

        <div className="p-6 md:p-8 flex-1">{children}</div>
      </main>
    </div>
  )
}
