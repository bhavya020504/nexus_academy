import { api } from './api'

export async function adminLogin(email: string, password: string) {
  const response = await api.post('/admin/login', { email, password })
  return response.data.data
}

export async function getDashboardData() {
  const response = await api.get('/admin/dashboard')
  return response.data.data
}

export async function getAnalyticsData() {
  const response = await api.get('/admin/analytics')
  return response.data.data
}

export async function getLeads(filters?: { search?: string; status?: string; course?: string }) {
  const response = await api.get('/admin/leads', { params: filters })
  return response.data.data
}

export async function getLeadById(id: string) {
  const response = await api.get(`/admin/leads/${id}`)
  return response.data.data
}

export async function updateLeadStatus(id: string, status: string) {
  const response = await api.patch(`/admin/leads/${id}`, { status })
  return response.data.data
}

export async function deleteLead(id: string) {
  const response = await api.delete(`/admin/leads/${id}`)
  return response.data
}

export async function getAgents() {
  const response = await api.get('/admin/agents')
  return response.data.data
}

export async function createAgent(data: {
  name: string
  snapserveAgentId: string
  languages?: string
  isActive?: boolean
  courseNames: string[]
}) {
  const response = await api.post('/admin/agents', data)
  return response.data.data
}

export async function updateAgent(
  id: string,
  data: {
    name?: string
    snapserveAgentId?: string
    languages?: string
    isActive?: boolean
    courseNames?: string[]
  },
) {
  const response = await api.put(`/admin/agents/${id}`, data)
  return response.data.data
}

export async function deleteAgent(id: string) {
  const response = await api.delete(`/admin/agents/${id}`)
  return response.data
}

export async function getCalls(filters?: {
  agentId?: string
  status?: string
  direction?: string
  search?: string
}) {
  const response = await api.get('/admin/calls', { params: filters })
  return response.data.data
}

export async function getCallById(id: string) {
  const response = await api.get(`/admin/calls/${id}`)
  return response.data.data
}
