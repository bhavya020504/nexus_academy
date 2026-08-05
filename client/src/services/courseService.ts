import { api } from './api'

export async function getPublicCourses() {
  const response = await api.get('/courses')
  return response.data.data
}

export async function getAdminCourses(activeOnly?: boolean) {
  const response = await api.get('/admin/courses', {
    params: { activeOnly: activeOnly ? 'true' : undefined },
  })
  return response.data.data
}

export async function createCourse(data: {
  title: string
  description: string
  level?: string
  duration?: string
  price?: number
  slug?: string
  isActive?: boolean
}) {
  const response = await api.post('/admin/courses', data)
  return response.data.data
}

export async function updateCourse(
  id: string,
  data: {
    title?: string
    description?: string
    level?: string
    duration?: string
    price?: number
    slug?: string
    isActive?: boolean
  },
) {
  const response = await api.put(`/admin/courses/${id}`, data)
  return response.data.data
}

export async function deleteCourse(id: string) {
  const response = await api.delete(`/admin/courses/${id}`)
  return response.data
}

export async function toggleCourseActive(id: string) {
  const response = await api.patch(`/admin/courses/${id}/toggle`)
  return response.data.data
}
