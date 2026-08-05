import { useState, useEffect } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { getCalls } from '../../services/adminService'
import {
  PhoneCall,
  Bot,
  User,
  Sparkles,
  FileText,
  X,
  Volume2,
} from 'lucide-react'

export function AdminCallsPage() {
  const [calls, setCalls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCall, setSelectedCall] = useState<any | null>(null)

  useEffect(() => {
    async function loadCalls() {
      setLoading(true)
      try {
        const data = await getCalls()
        setCalls(data)
      } catch (err) {
        console.error('Failed to load call logs.')
      } finally {
        setLoading(false)
      }
    }
    loadCalls()
  }, [])

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Call Management</h1>
            <p className="text-sm text-slate-400 mt-1">
              Review completed SnapServe AI agent calls, transcripts, audio recordings, and evaluation metrics.
            </p>
          </div>
        </div>

        {/* Calls List */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              Loading call logs...
            </div>
          ) : calls.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              No completed or logged calls found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 border-b border-slate-800 uppercase tracking-wider text-slate-400 text-[10px] font-bold">
                  <tr>
                    <th className="px-5 py-4">Lead</th>
                    <th className="px-5 py-4">AI Agent</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Duration</th>
                    <th className="px-5 py-4">Evaluation</th>
                    <th className="px-5 py-4">AI Summary</th>
                    <th className="px-5 py-4">Call Time</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {calls.map((call) => (
                    <tr key={call.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-slate-400 shrink-0" />
                          <div>
                            <span className="font-semibold text-sm text-slate-100 block">
                              {call.lead ? call.lead.fullName : 'Web Lead'}
                            </span>
                            <span className="text-[10px] text-slate-500 block">
                              {call.lead?.email || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Bot className="h-4 w-4 text-indigo-400 shrink-0" />
                          <div>
                            <span className="font-medium text-slate-200 block">
                              {call.agent ? call.agent.name : 'System Agent'}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono block">
                              ID: {call.agent?.snapserveAgentId}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            call.status === 'COMPLETED'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}
                        >
                          {call.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono font-semibold text-slate-300">
                        {call.duration}s
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold text-[10px]">
                          {call.successEvaluation || 'HIGH_INTENT'}
                        </span>
                      </td>
                      <td className="px-5 py-4 max-w-xs truncate text-slate-400">
                        {call.aiSummary || 'Outbound call executed successfully.'}
                      </td>
                      <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                        {new Date(call.createdAt).toLocaleDateString()}{' '}
                        {new Date(call.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelectedCall(call)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white font-medium transition text-xs flex items-center gap-1.5 ml-auto"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          <span>View Transcript</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detailed Call & Transcript Modal */}
        {selectedCall && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 relative shadow-2xl space-y-6">
              <button
                onClick={() => setSelectedCall(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Call Recording & Analysis</h3>
                  <p className="text-xs text-slate-400">
                    Lead: {selectedCall.lead?.fullName} • Agent: {selectedCall.agent?.name}
                  </p>
                </div>
              </div>

              {/* Audio Player & Evaluation */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <Volume2 className="h-4 w-4 text-purple-400" />
                    <span>Call Audio Recording ({selectedCall.duration}s)</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                    {selectedCall.status}
                  </span>
                </div>

                {selectedCall.recordingUrl ? (
                  <audio controls className="w-full h-9 rounded-lg">
                    <source src={selectedCall.recordingUrl} type="audio/ogg" />
                    Your browser does not support audio playback.
                  </audio>
                ) : (
                  <p className="text-xs text-slate-500 italic">No audio recording link attached.</p>
                )}
              </div>

              {/* AI Summary & Evaluation */}
              <div className="p-4 bg-purple-950/20 border border-purple-800/40 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span>AI Call Summary & Evaluation</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedCall.aiSummary || 'Outbound AI call completed.'}
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-medium">Evaluation Result:</span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                    {selectedCall.successEvaluation || 'HIGH_INTENT'}
                  </span>
                </div>
              </div>

              {/* Full Transcript */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Full Call Transcript
                </h4>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 max-h-48 overflow-y-auto font-mono text-xs text-slate-300 space-y-2 whitespace-pre-wrap">
                  {selectedCall.transcript || 'No transcript generated.'}
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-800">
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
