import { api } from './api'

export async function submitContactForm(payload: unknown) {
  const response = await api.post('/contact', payload)
  return response.data
}
