import { useState, useEffect, useMemo } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { getCalls, getCallById } from '../../services/adminService'
import {
  PhoneCall,
  Bot,
  User,
  Sparkles,
  FileText,
  X,
  Volume2,
  VolumeX,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Zap,
  DollarSign,
  AlertCircle,
  Calendar,
  CheckCircle2,
  XCircle,
  Activity,
  Code,
} from 'lucide-react'
import toast from 'react-hot-toast'

export function AdminCallsPage() {
  const [calls, setCalls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCall, setSelectedCall] = useState<any | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  // Filters State
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [directionFilter, setDirectionFilter] = useState('all')
  const [agentFilter, setAgentFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')

  const loadCalls = async () => {
    setLoading(true)
    try {
      const data = await getCalls({
        search: searchQuery || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        direction: directionFilter !== 'all' ? directionFilter : undefined,
        agentId: agentFilter !== 'all' ? agentFilter : undefined,
      })
      setCalls(data || [])
    } catch (err) {
      console.error('Failed to load call logs from SnapServe API.')
      toast.error('Failed to load live call telemetry from SnapServe.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCalls()
  }, [statusFilter, directionFilter, agentFilter])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loadCalls()
  }

  const openCallDetails = async (call: any) => {
    setSelectedCall(call)
    setLoadingDetails(true)
    try {
      const details = await getCallById(call.id)
      if (details) {
        setSelectedCall(details)
      }
    } catch (err) {
      console.error('Failed to fetch detailed telemetry for call:', call.id)
      toast.error('Failed to fetch call details.')
    } finally {
      setLoadingDetails(false)
    }
  }

  // Extract unique agents for filter dropdown
  const uniqueAgents = useMemo(() => {
    const agentsMap = new Map<string, string>()
    calls.forEach((c) => {
      if (c.agentName) {
        agentsMap.set(String(c.agentId || c.agentName), c.agentName)
      }
    })
    return Array.from(agentsMap.entries()).map(([id, name]) => ({ id, name }))
  }, [calls])

  // Client-side date and search filtering for instant response
  const filteredCalls = useMemo(() => {
    return calls.filter((call) => {
      // Date filter
      if (dateFilter) {
        const callDate = new Date(call.createdAt).toISOString().split('T')[0]
        if (callDate !== dateFilter) return false
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchId = String(call.id).toLowerCase().includes(q)
        const matchExecutionId = call.executionId?.toLowerCase().includes(q)
        const matchTo = call.toNumber?.toLowerCase().includes(q)
        const matchFrom = call.fromNumber?.toLowerCase().includes(q)
        const matchAgent = call.agentName?.toLowerCase().includes(q)

        if (!matchId && !matchExecutionId && !matchTo && !matchFrom && !matchAgent) {
          return false
        }
      }

      return true
    })
  }, [calls, dateFilter, searchQuery])

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase()
    switch (s) {
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
            <CheckCircle2 className="h-3 w-3" /> Completed
          </span>
        )
      case 'failed':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-1 w-fit">
            <XCircle className="h-3 w-3" /> Failed
          </span>
        )
      case 'busy':
      case 'no_answer':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1 w-fit">
            <AlertCircle className="h-3 w-3" /> {status}
          </span>
        )
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center gap-1 w-fit">
            <Activity className="h-3 w-3" /> {status || 'Initiated'}
          </span>
        )
    }
  }

  const getEvaluationBadge = (evaluation: string | null) => {
    if (!evaluation) {
      return (
        <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-semibold">
          N/A
        </span>
      )
    }

    const evalLower = evaluation.toLowerCase()
    if (evalLower.includes('interested') || evalLower.includes('high_intent') || evalLower.includes('completed')) {
      return (
        <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
          {evaluation}
        </span>
      )
    } else if (evalLower.includes('not interested') || evalLower.includes('failed')) {
      return (
        <span className="px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
          {evaluation}
        </span>
      )
    } else {
      return (
        <span className="px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold">
          {evaluation}
        </span>
      )
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Call Management</h1>
            <p className="text-sm text-slate-400 mt-1">
              Live telemetry, audio recordings, LLM latencies, and AI call summaries powered by official SnapServe APIs.
            </p>
          </div>
        </div>

        {/* Search & Filters Controls */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search by Phone Number, Agent Name, Call ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-500 hidden md:block" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="busy">Busy</option>
                <option value="failed">Failed</option>
                <option value="initiated">Initiated</option>
              </select>

              {/* Direction Filter */}
              <select
                value={directionFilter}
                onChange={(e) => setDirectionFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Directions</option>
                <option value="inbound">Inbound</option>
                <option value="outbound">Outbound</option>
              </select>

              {/* Agent Filter */}
              <select
                value={agentFilter}
                onChange={(e) => setAgentFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Agents</option>
                {uniqueAgents.map((ag) => (
                  <option key={ag.id} value={ag.id}>
                    {ag.name}
                  </option>
                ))}
              </select>

              {/* Date Filter */}
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
              />

              <button
                type="submit"
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Calls List Table */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              Fetching live call records from SnapServe API...
            </div>
          ) : filteredCalls.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              No live call logs found matching your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 border-b border-slate-800 uppercase tracking-wider text-slate-400 text-[10px] font-bold">
                  <tr>
                    <th className="px-5 py-4">Call ID</th>
                    <th className="px-5 py-4">Lead Phone Number</th>
                    <th className="px-5 py-4">AI Agent</th>
                    <th className="px-5 py-4">Call Status</th>
                    <th className="px-5 py-4">Direction</th>
                    <th className="px-5 py-4">Duration</th>
                    <th className="px-5 py-4">Created Time</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredCalls.map((call) => {
                    const phoneNumber = call.toNumber || call.fromNumber || 'Unknown'
                    const direction = call.direction || 'outbound'
                    return (
                      <tr
                        key={call.id}
                        onClick={() => openCallDetails(call)}
                        className="hover:bg-slate-800/40 cursor-pointer transition"
                      >
                        <td className="px-5 py-4">
                          <span className="font-mono text-blue-400 font-semibold bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20">
                            #{call.id}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-slate-400 shrink-0" />
                            <span className="font-semibold text-slate-100 font-mono">
                              {phoneNumber}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <Bot className="h-4 w-4 text-indigo-400 shrink-0" />
                            <span className="font-medium text-slate-200">
                              {call.agentName || `Agent #${call.agentId}`}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">{getStatusBadge(call.status)}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              direction === 'outbound'
                                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                            }`}
                          >
                            {direction === 'outbound' ? (
                              <ArrowUpRight className="h-3 w-3" />
                            ) : (
                              <ArrowDownLeft className="h-3 w-3" />)}
                            {direction}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono font-semibold text-slate-300">
                          {call.durationSeconds !== null && call.durationSeconds !== undefined
                            ? `${call.durationSeconds}s`
                            : 'N/A'}
                        </td>
                        <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                          {new Date(call.createdAt).toLocaleDateString()}{' '}
                          {new Date(call.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              openCallDetails(call)
                            }}
                            className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white font-medium transition text-xs flex items-center gap-1.5 ml-auto"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span>View Telemetry</span>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Call Telemetry & Details Modal */}
        {selectedCall && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl space-y-6">
              <button
                onClick={() => setSelectedCall(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <PhoneCall className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">Call Telemetry Details</h3>
                    <span className="font-mono text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      #{selectedCall.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Agent: <strong className="text-slate-200">{selectedCall.agentName || selectedCall.agentId}</strong> • Created: {new Date(selectedCall.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {loadingDetails ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Loading detailed telemetry metrics...
                </div>
              ) : (
                <div className="space-y-5 text-xs">
                  {/* Status & Overview Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Status</span>
                      <div className="mt-1">{getStatusBadge(selectedCall.status)}</div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Customer Number</span>
                      <span className="font-mono text-slate-200 font-semibold mt-1 block">
                        {selectedCall.toNumber || selectedCall.fromNumber || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Business Number</span>
                      <span className="font-mono text-slate-200 font-semibold mt-1 block">
                        {selectedCall.fromNumber || selectedCall.toNumber || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Duration</span>
                      <span className="font-mono text-slate-200 font-semibold mt-1 block">
                        {selectedCall.durationSeconds !== null && selectedCall.durationSeconds !== undefined
                          ? `${selectedCall.durationSeconds}s`
                          : 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Timing & Success Evaluation Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
                      <Clock className="h-4 w-4 text-blue-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-500 font-semibold uppercase block">Start Time</span>
                        <span className="text-slate-200 font-mono text-[11px]">
                          {new Date(selectedCall.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-blue-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-500 font-semibold uppercase block">End Time</span>
                        <span className="text-slate-200 font-mono text-[11px]">
                          {selectedCall.endedAt ? new Date(selectedCall.endedAt).toLocaleTimeString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
                      <Sparkles className="h-4 w-4 text-purple-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-500 font-semibold uppercase block">Success Evaluation</span>
                        <div className="mt-0.5">{getEvaluationBadge(selectedCall.successEvaluation)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Audio Recording Section */}
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-300 font-semibold">
                        <Volume2 className="h-4 w-4 text-purple-400" />
                        <span>Call Audio Recording</span>
                      </div>
                      {selectedCall.recordingUrl ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                          Available
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-bold flex items-center gap-1">
                          <VolumeX className="h-3 w-3" /> Recording Not Available
                        </span>
                      )}
                    </div>

                    {selectedCall.recordingUrl ? (
                      <div className="space-y-2">
                        <audio controls className="w-full h-9 rounded-lg">
                          <source src={selectedCall.recordingUrl} />
                          Your browser does not support audio playback.
                        </audio>
                        <a
                          href={selectedCall.recordingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-blue-400 hover:underline inline-block font-mono"
                        >
                          Direct Audio Stream URL: {selectedCall.recordingUrl}
                        </a>
                      </div>
                    ) : (
                      <p className="text-slate-500 italic text-[11px]">
                        No audio recording stream available for this call session.
                      </p>
                    )}
                  </div>

                  {/* AI Call Summary */}
                  <div className="p-4 bg-purple-950/20 border border-purple-800/30 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-purple-300 font-bold">
                      <Sparkles className="h-4 w-4 text-purple-400" />
                      <span>AI Call Summary</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {selectedCall.callSummary || 'No AI summary generated for this call.'}
                    </p>
                  </div>

                  {/* Complete Transcript */}
                  <div>
                    <h4 className="font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 text-slate-500" />
                      <span>Complete Call Transcript</span>
                    </h4>
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 max-h-52 overflow-y-auto font-mono text-[11px] text-slate-300 space-y-2 whitespace-pre-wrap leading-relaxed">
                      {selectedCall.transcript || 'No transcript text logged.'}
                    </div>
                  </div>

                  {/* Telemetry Latency & Cost Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-amber-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-500 font-semibold block">STT Latency</span>
                        <span className="font-mono text-slate-200 font-bold">
                          {selectedCall.sttLatencyMs !== null && selectedCall.sttLatencyMs !== undefined
                            ? `${selectedCall.sttLatencyMs}ms`
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-blue-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-500 font-semibold block">LLM Latency</span>
                        <span className="font-mono text-slate-200 font-bold">
                          {selectedCall.llmLatencyMs !== null && selectedCall.llmLatencyMs !== undefined
                            ? `${selectedCall.llmLatencyMs}ms`
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-purple-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-500 font-semibold block">TTS Latency</span>
                        <span className="font-mono text-slate-200 font-bold">
                          {selectedCall.ttsFirstChunkMs !== null && selectedCall.ttsFirstChunkMs !== undefined
                            ? `${selectedCall.ttsFirstChunkMs}ms`
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-emerald-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-500 font-semibold block">Cost</span>
                        <span className="font-mono text-slate-200 font-bold">
                          {selectedCall.costCents !== null && selectedCall.costCents !== undefined
                            ? `$${(selectedCall.costCents / 100).toFixed(2)}`
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Metadata & Execution ID */}
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                      <span>Execution ID: <strong className="text-white">{selectedCall.executionId || 'N/A'}</strong></span>
                      {selectedCall.errorMessage && (
                        <span className="text-rose-400 font-semibold">Error: {selectedCall.errorMessage}</span>
                      )}
                    </div>
                    {selectedCall.metadata && (
                      <details className="text-[10px] text-slate-500 font-mono">
                        <summary className="cursor-pointer hover:text-slate-300 flex items-center gap-1 py-1">
                          <Code className="h-3 w-3" /> View Raw Telemetry Metadata
                        </summary>
                        <pre className="mt-2 p-3 bg-slate-900 rounded-xl overflow-x-auto text-slate-400 border border-slate-800 whitespace-pre-wrap">
                          {typeof selectedCall.metadata === 'string'
                            ? selectedCall.metadata
                            : JSON.stringify(selectedCall.metadata, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-3 border-t border-slate-800">
                <button
                  onClick={() => setSelectedCall(null)}
                  className="px-5 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700 text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
