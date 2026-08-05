import axios from 'axios'

export const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'

export const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexus_admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
