import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { getDashboardData } from '../../services/adminService'
import {
  Users,
  Calendar,
  Clock,
  PhoneCall,
  Bot,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react'

export function AdminDashboardPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const result = await getDashboardData()
        setData(result)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch dashboard telemetry.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64 text-slate-400">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading CRM Telemetry...</span>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error || !data) {
    return (
      <AdminLayout>
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400">
          {error || 'Unable to connect to CRM backend.'}
        </div>
      </AdminLayout>
    )
  }

  const { metrics, recentActivity } = data

  const statCards = [
    {
      title: 'Total Leads',
      value: metrics.totalLeads,
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-500/10 text-blue-400',
    },
    {
      title: "Today's Leads",
      value: metrics.todayLeads,
      icon: Calendar,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-500/10 text-emerald-400',
    },
    {
      title: 'Pending Leads',
      value: metrics.pendingLeads,
      icon: Clock,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-500/10 text-amber-400',
    },
    {
      title: 'Completed Calls',
      value: metrics.completedCalls,
      icon: PhoneCall,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-500/10 text-purple-400',
    },
    {
      title: 'Active Agents',
      value: metrics.activeAgents,
      icon: Bot,
      color: 'from-sky-500 to-cyan-600',
      bgColor: 'bg-sky-500/10 text-sky-400',
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Executive Dashboard</h1>
            <p className="text-sm text-slate-400 mt-1">
              Real-time overview of AI Nexus Academy leads, automated agent assignments & call logs.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/leads"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide uppercase transition shadow-lg shadow-blue-600/20 flex items-center gap-2"
            >
              <span>Manage Leads</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.title}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {card.title}
                  </span>
                  <div className={`p-2 rounded-xl ${card.bgColor}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-white">{card.value}</span>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                    <TrendingUp className="h-3 w-3" /> Live
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Recent Activity Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Leads */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <Users className="h-5 w-5 text-blue-400" />
                <h2 className="text-lg font-bold text-white">Recent Leads & Assignments</h2>
              </div>
              <Link to="/admin/leads" className="text-xs text-blue-400 hover:underline font-semibold">
                View All →
              </Link>
            </div>

            <div className="space-y-3 flex-1">
              {recentActivity.leads.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No recent leads submitted.</p>
              ) : (
                recentActivity.leads.map((lead: any) => (
                  <div
                    key={lead.id}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-4 hover:border-slate-700 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-100">{lead.fullName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                          {lead.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {lead.email} • {lead.interest || 'General Consulting'}
                      </p>
                    </div>

                    <div className="text-right">
                      {lead.assignedAgent ? (
                        <div className="flex items-center gap-1.5 justify-end">
                          <Bot className="h-3.5 w-3.5 text-indigo-400" />
                          <span className="text-xs font-medium text-indigo-300">
                            {lead.assignedAgent.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500">Unassigned</span>
                      )}
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Outbound Calls */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <PhoneCall className="h-5 w-5 text-purple-400" />
                <h2 className="text-lg font-bold text-white">Latest Dispatched Calls</h2>
              </div>
              <Link to="/admin/calls" className="text-xs text-purple-400 hover:underline font-semibold">
                View All →
              </Link>
            </div>

            <div className="space-y-3 flex-1">
              {recentActivity.calls.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No call dispatches recorded.</p>
              ) : (
                recentActivity.calls.map((call: any) => (
                  <div
                    key={call.id}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-4 hover:border-slate-700 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-100">
                          {call.lead ? call.lead.fullName : 'Lead Call'}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            call.status === 'COMPLETED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {call.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                        Agent: <span className="text-slate-200">{call.agent?.name}</span> • Eval:{' '}
                        <span className="text-emerald-400">{call.successEvaluation || 'HIGH_INTENT'}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-semibold text-purple-300">
                        {call.duration}s
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        {new Date(call.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
