import { useState, useEffect } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { getLeads, updateLeadStatus, deleteLead } from '../../services/adminService'
import {
  Search,
  Filter,
  Bot,
  Trash2,
  Eye,
  X,
  Phone,
  Mail,
} from 'lucide-react'
import toast from 'react-hot-toast'

export function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [courseFilter, setCourseFilter] = useState('')
  const [selectedLead, setSelectedLead] = useState<any | null>(null)

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const data = await getLeads({
        search: search || undefined,
        status: statusFilter || undefined,
        course: courseFilter || undefined,
      })
      setLeads(data)
    } catch (err) {
      toast.error('Failed to load leads.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [search, statusFilter, courseFilter])

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const updated = await updateLeadStatus(leadId, newStatus)
      toast.success(`Lead status updated to ${newStatus}`)
      setLeads((prev) => prev.map((l) => (l.id === leadId ? updated : l)))
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(updated)
      }
    } catch (err) {
      toast.error('Failed to update lead status.')
    }
  }

  const handleDeleteLead = async (leadId: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return
    try {
      await deleteLead(leadId)
      toast.success('Lead deleted.')
      setLeads((prev) => prev.filter((l) => l.id !== leadId))
      if (selectedLead?.id === leadId) setSelectedLead(null)
    } catch (err) {
      toast.error('Failed to delete lead.')
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Lead Management</h1>
            <p className="text-sm text-slate-400 mt-1">
              Search, filter, and manage enterprise lead submissions and automated agent assignments.
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search name, email, company, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400">
              <Filter className="h-3.5 w-3.5" />
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-white focus:outline-none font-medium cursor-pointer"
              >
                <option value="" className="bg-slate-900">All Statuses</option>
                <option value="PENDING" className="bg-slate-900">PENDING</option>
                <option value="CONTACTED" className="bg-slate-900">CONTACTED</option>
                <option value="QUALIFIED" className="bg-slate-900">QUALIFIED</option>
                <option value="CONVERTED" className="bg-slate-900">CONVERTED</option>
                <option value="CLOSED" className="bg-slate-900">CLOSED</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400">
              <span>Program:</span>
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="bg-transparent text-white focus:outline-none font-medium cursor-pointer max-w-[140px] truncate"
              >
                <option value="" className="bg-slate-900">All Programs</option>
                <option value="Leadership" className="bg-slate-900">Leadership</option>
                <option value="Generative" className="bg-slate-900">Generative AI</option>
                <option value="Product" className="bg-slate-900">Product Mgmt</option>
                <option value="Prompt" className="bg-slate-900">Prompt Eng</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lead Table */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              Loading leads database...
            </div>
          ) : leads.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              No leads match your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 border-b border-slate-800 uppercase tracking-wider text-slate-400 text-[10px] font-bold">
                  <tr>
                    <th className="px-5 py-4">Lead Name</th>
                    <th className="px-5 py-4">Contact</th>
                    <th className="px-5 py-4">Company & Industry</th>
                    <th className="px-5 py-4">Selected Course</th>
                    <th className="px-5 py-4">Assigned Agent</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Submitted</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-5 py-4 font-semibold text-slate-100">{lead.fullName}</td>
                      <td className="px-5 py-4 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Mail className="h-3 w-3 text-slate-500" />
                          <span>{lead.email}</span>
                        </div>
                        {lead.phone && (
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Phone className="h-3 w-3 text-slate-500" />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-medium text-slate-200 block">
                          {lead.companyName || 'N/A'}
                        </span>
                        <span className="text-slate-500 block text-[10px]">
                          {lead.industry || 'General Industry'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                          {lead.interest || 'AI Consulting'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {lead.assignedAgent ? (
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                              <Bot className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <span className="font-medium text-slate-200 block">
                                {lead.assignedAgent.name}
                              </span>
                              <span className="text-[10px] text-slate-500 block">
                                ID: {lead.assignedAgent.snapserveAgentId}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-emerald-400 focus:outline-none cursor-pointer"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="QUALIFIED">QUALIFIED</option>
                          <option value="CONVERTED">CONVERTED</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                      </td>
                      <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleDateString()}{' '}
                        {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            title="View Details"
                            className="p-1.5 rounded-lg bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white transition"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            title="Delete Lead"
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:bg-red-600 hover:text-white transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Lead Detail Modal */}
        {selectedLead && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 relative shadow-2xl space-y-6">
              <button
                onClick={() => setSelectedLead(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-lg">
                  {selectedLead.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedLead.fullName}</h3>
                  <span className="text-xs text-slate-400">Lead ID: {selectedLead.id}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block mb-1">Email Address</span>
                  <span className="text-slate-200 font-semibold">{selectedLead.email}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block mb-1">Phone Number</span>
                  <span className="text-slate-200 font-semibold">{selectedLead.phone || 'N/A'}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block mb-1">Company Name</span>
                  <span className="text-slate-200 font-semibold">{selectedLead.companyName || 'N/A'}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block mb-1">Industry</span>
                  <span className="text-slate-200 font-semibold">{selectedLead.industry || 'N/A'}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Selected Course / Interest:</span>
                  <span className="text-blue-400 font-semibold">{selectedLead.interest || 'AI Consulting'}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-slate-800/80 pt-2">
                  <span className="text-slate-400 font-medium">Automatically Assigned AI Agent:</span>
                  <span className="text-indigo-400 font-semibold">
                    {selectedLead.assignedAgent ? selectedLead.assignedAgent.name : 'Unassigned'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-500">
                  Submitted on {new Date(selectedLead.createdAt).toLocaleString()}
                </span>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700 text-xs font-semibold"
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
