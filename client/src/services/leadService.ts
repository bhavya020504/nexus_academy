import { api } from './api'

export async function submitLeadForm(payload: unknown) {
  const response = await api.post('/leads', payload)
  return response.data
}
