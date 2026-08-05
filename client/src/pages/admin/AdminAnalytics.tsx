import { useState, useEffect } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { getAnalyticsData } from '../../services/adminService'
import {
  TrendingUp,
  PieChart,
  Bot,
  BookOpen,
  CheckCircle2,
  CalendarDays,
} from 'lucide-react'

export function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const result = await getAnalyticsData()
        setData(result)
      } catch (err: any) {
        setError('Failed to fetch analytics metrics.')
      } finally {
        setLoading(false)
      }
    }
    loadAnalytics()
  }, [])

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64 text-slate-400">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Computing Analytics & Chart Aggregations...</span>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error || !data) {
    return (
      <AdminLayout>
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400">
          {error || 'Unable to load analytics data.'}
        </div>
      </AdminLayout>
    )
  }

  const {
    leadsByCourse,
    callsByAgent,
    leadStatusDistribution,
    dailyLeads,
    monthlyLeads,
    callSuccessRate,
  } = data

  const maxCourseCount = Math.max(...leadsByCourse.map((c: any) => c.count), 1)
  const maxDailyCount = Math.max(...dailyLeads.map((d: any) => d.count), 1)
  const maxMonthlyCount = Math.max(...monthlyLeads.map((m: any) => m.count), 1)

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Analytics & Business Intelligence</h1>
            <p className="text-sm text-slate-400 mt-1">
              Performance metrics for course demand, AI agent utilization, conversion rates, and volume trends.
            </p>
          </div>
        </div>

        {/* Top Summary Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Success Rate Widget */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Call Success Rate
              </span>
              <span className="text-4xl font-extrabold text-emerald-400 mt-2 block">
                {callSuccessRate}%
              </span>
              <span className="text-xs text-slate-400 mt-1 block">
                Outbound call connection efficiency
              </span>
            </div>
            <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
          </div>

          {/* Top Requested Course */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Top Demand Program
              </span>
              <span className="text-lg font-bold text-blue-400 mt-2 block truncate max-w-[200px]">
                {leadsByCourse[0]?.course || 'AI Leadership'}
              </span>
              <span className="text-xs text-slate-400 mt-1 block">
                {leadsByCourse[0]?.count || 0} leads registered
              </span>
            </div>
            <div className="h-16 w-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <BookOpen className="h-8 w-8" />
            </div>
          </div>

          {/* Active AI Fleet */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Active AI Agents
              </span>
              <span className="text-4xl font-extrabold text-purple-400 mt-2 block">
                {callsByAgent.length}
              </span>
              <span className="text-xs text-slate-400 mt-1 block">
                Dispatched across SnapServe
              </span>
            </div>
            <div className="h-16 w-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Bot className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart 1: Leads by Course */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-400" />
                <h2 className="text-lg font-bold text-white">Leads by Course Program</h2>
              </div>
            </div>

            <div className="space-y-4">
              {leadsByCourse.map((item: any) => {
                const percentage = Math.round((item.count / maxCourseCount) * 100)
                return (
                  <div key={item.course} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-200">{item.course}</span>
                      <span className="font-bold text-blue-400">{item.count} leads</span>
                    </div>
                    <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 8)}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Chart 2: Calls by Agent */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-purple-400" />
                <h2 className="text-lg font-bold text-white">Calls Dispatched by Agent</h2>
              </div>
            </div>

            <div className="space-y-4">
              {callsByAgent.map((agent: any) => (
                <div
                  key={agent.agentName}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-white block">{agent.agentName}</span>
                      <span className="text-[10px] text-slate-500 font-mono block">
                        SnapServe Agent ID: {agent.snapserveAgentId}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-extrabold text-purple-400 block">
                      {agent.totalCalls}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Total Calls</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 3: Lead Status Distribution */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">Lead Status Pipeline</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {leadStatusDistribution.map((item: any) => (
                <div
                  key={item.status}
                  className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center"
                >
                  <span className="text-2xl font-black text-slate-100 block">{item.count}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mt-1 block">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 4: Daily Leads Trend (Last 7 Days) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-sky-400" />
                <h2 className="text-lg font-bold text-white">Daily Lead Submissions (7 Days)</h2>
              </div>
            </div>

            <div className="h-44 flex items-end justify-between gap-2 pt-6">
              {dailyLeads.map((day: any) => {
                const heightPercent = Math.round((day.count / maxDailyCount) * 100)
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[10px] font-bold text-sky-400">{day.count}</span>
                    <div
                      className="w-full bg-gradient-to-t from-sky-600 to-cyan-400 rounded-t-lg transition-all duration-500"
                      style={{ height: `${Math.max(heightPercent, 12)}%` }}
                    ></div>
                    <span className="text-[10px] text-slate-500 rotate-[-45deg] origin-top-left mt-2">
                      {day.date.slice(5)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Chart 5: Monthly Leads Growth Trend */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-indigo-400" />
                <h2 className="text-lg font-bold text-white">Monthly Lead Growth Trend (6 Months)</h2>
              </div>
            </div>

            <div className="h-48 flex items-end justify-between gap-4 pt-6 px-4">
              {monthlyLeads.map((m: any) => {
                const heightPercent = Math.round((m.count / maxMonthlyCount) * 100)
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs font-bold text-indigo-300">{m.count}</span>
                    <div
                      className="w-full bg-gradient-to-t from-indigo-700 to-purple-500 rounded-t-xl transition-all duration-500"
                      style={{ height: `${Math.max(heightPercent, 15)}%` }}
                    ></div>
                    <span className="text-xs font-semibold text-slate-400 mt-1">{m.month}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
