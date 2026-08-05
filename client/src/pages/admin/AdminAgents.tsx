import { useState, useEffect } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { getAgents, createAgent, updateAgent, deleteAgent } from '../../services/adminService'
import { getAdminCourses } from '../../services/courseService'
import {
  Bot,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Globe,
} from 'lucide-react'
import toast from 'react-hot-toast'

const DEFAULT_COURSES = [
  'Full Stack AI',
  'Data Analytics',
  'GenAI & LLM',
  'AI Consulting',
  'Python for AI',
  'Executive AI Leadership & Strategy',
  'Enterprise Generative AI & LLM Systems',
  'AI Product Management & Architecture',
]

export function AdminAgentsPage() {
  const [agents, setAgents] = useState<any[]>([])
  const [availableCourses, setAvailableCourses] = useState<string[]>(DEFAULT_COURSES)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAgent, setEditingAgent] = useState<any | null>(null)

  // Form State
  const [name, setName] = useState('')
  const [snapserveAgentId, setSnapserveAgentId] = useState('')
  const [languages, setLanguages] = useState('English')
  const [isActive, setIsActive] = useState(true)
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [agentsData, coursesData] = await Promise.all([
        getAgents(),
        getAdminCourses(),
      ])
      setAgents(agentsData)
      if (coursesData && coursesData.length > 0) {
        setAvailableCourses(coursesData.map((c: any) => c.title))
      }
    } catch (err) {
      toast.error('Failed to load agents or course directory.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const openCreateModal = () => {
    setEditingAgent(null)
    setName('')
    setSnapserveAgentId('')
    setLanguages('English, Spanish')
    setIsActive(true)
    setSelectedCourses([availableCourses[0] || 'Full Stack AI'])
    setIsModalOpen(true)
  }

  const openEditModal = (agent: any) => {
    setEditingAgent(agent)
    setName(agent.name)
    setSnapserveAgentId(agent.snapserveAgentId)
    setLanguages(agent.languages || 'English')
    setIsActive(agent.isActive)
    const existingCourses = agent.agentCourses?.map((ac: any) => ac.courseName) || []
    setSelectedCourses(existingCourses)
    setIsModalOpen(true)
  }

  const toggleCourseSelection = (courseName: string) => {
    if (selectedCourses.includes(courseName)) {
      setSelectedCourses(selectedCourses.filter((c) => c !== courseName))
    } else {
      setSelectedCourses([...selectedCourses, courseName])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !snapserveAgentId) {
      toast.error('Agent Name and SnapServe Agent ID are required.')
      return
    }

    setSubmitting(true)
    try {
      if (editingAgent) {
        await updateAgent(editingAgent.id, {
          name,
          snapserveAgentId,
          languages,
          isActive,
          courseNames: selectedCourses,
        })
        toast.success('Agent configuration updated.')
      } else {
        await createAgent({
          name,
          snapserveAgentId,
          languages,
          isActive,
          courseNames: selectedCourses,
        })
        toast.success('New AI Agent configured successfully.')
      }
      setIsModalOpen(false)
      fetchData()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error saving agent.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleActive = async (agent: any) => {
    try {
      const updated = await updateAgent(agent.id, { isActive: !agent.isActive })
      toast.success(`Agent ${agent.name} is now ${!agent.isActive ? 'Active' : 'Inactive'}`)
      setAgents((prev) => prev.map((a) => (a.id === agent.id ? updated : a)))
    } catch (err) {
      toast.error('Failed to update agent status.')
    }
  }

  const handleDeleteAgent = async (agentId: string) => {
    if (!window.confirm('Are you sure you want to delete this agent?')) return
    try {
      await deleteAgent(agentId)
      toast.success('Agent removed.')
      setAgents((prev) => prev.filter((a) => a.id !== agentId))
    } catch (err) {
      toast.error('Failed to delete agent.')
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Agent Management</h1>
            <p className="text-sm text-slate-400 mt-1">
              Configure SnapServe AI agents and specify course handling rules for automatic lead routing.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide uppercase transition shadow-lg shadow-blue-600/20 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Configure New Agent</span>
          </button>
        </div>

        {/* Agents Table */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              Loading AI Agents & Dynamic Course Directory...
            </div>
          ) : agents.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              No AI agents configured yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 border-b border-slate-800 uppercase tracking-wider text-slate-400 text-[10px] font-bold">
                  <tr>
                    <th className="px-5 py-4">Agent Name</th>
                    <th className="px-5 py-4">SnapServe ID</th>
                    <th className="px-5 py-4">Languages</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Supported Courses</th>
                    <th className="px-5 py-4 text-center">Assigned Leads</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {agents.map((agent) => (
                    <tr key={agent.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                            <Bot className="h-4 w-4" />
                          </div>
                          <span className="font-bold text-sm text-white">{agent.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-mono text-blue-400 font-semibold bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20">
                          {agent.snapserveAgentId}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Globe className="h-3.5 w-3.5 text-slate-500" />
                          <span>{agent.languages}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleToggleActive(agent)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition ${
                            agent.isActive
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {agent.isActive ? (
                            <>
                              <CheckCircle2 className="h-3 w-3" /> Active
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3" /> Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {agent.agentCourses && agent.agentCourses.length > 0 ? (
                            agent.agentCourses.map((ac: any) => (
                              <span
                                key={ac.id}
                                className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700"
                              >
                                {ac.courseName}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-500 italic">None</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center font-bold text-slate-200">
                        {agent._count?.leads || 0}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(agent)}
                            className="p-1.5 rounded-lg bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white transition"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteAgent(agent.id)}
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

        {/* Modal for Create / Edit Agent */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 relative shadow-2xl space-y-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {editingAgent ? 'Edit Agent Config' : 'Configure AI Agent'}
                  </h3>
                  <p className="text-xs text-slate-400">Set up automatic routing rules for lead dispatch.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Agent Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      SnapServe Agent ID
                    </label>
                    <input
                      type="text"
                      required
                      value={snapserveAgentId}
                      onChange={(e) => setSnapserveAgentId(e.target.value)}
                      placeholder="e.g. 459"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Languages
                    </label>
                    <input
                      type="text"
                      value={languages}
                      onChange={(e) => setLanguages(e.target.value)}
                      placeholder="English, Spanish"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="font-semibold text-slate-300">Active Status</span>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Supported Courses (Loaded Dynamically from Database)
                  </label>
                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                    {availableCourses.map((courseName) => {
                      const isSelected = selectedCourses.includes(courseName)
                      return (
                        <div
                          key={courseName}
                          onClick={() => toggleCourseSelection(courseName)}
                          className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                            isSelected
                              ? 'bg-blue-600/15 border-blue-500/40 text-blue-300'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <span className="font-medium text-xs">{courseName}</span>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="h-3.5 w-3.5 text-blue-600 rounded"
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 shadow-lg shadow-blue-600/20 disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : editingAgent ? 'Update Agent' : 'Create Agent'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
