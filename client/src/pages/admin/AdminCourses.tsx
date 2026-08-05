import { useState, useEffect } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import {
  getAdminCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  toggleCourseActive,
} from '../../services/courseService'
import {
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Clock,
} from 'lucide-react'
import toast from 'react-hot-toast'

export function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<any | null>(null)

  // Form State
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [level, setLevel] = useState('Intermediate')
  const [duration, setDuration] = useState('4 weeks')
  const [price, setPrice] = useState<number>(499)
  const [slug, setSlug] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const fetchCoursesList = async () => {
    setLoading(true)
    try {
      const data = await getAdminCourses()
      setCourses(data)
    } catch (err) {
      toast.error('Failed to load courses.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoursesList()
  }, [])

  const openCreateModal = () => {
    setEditingCourse(null)
    setTitle('')
    setDescription('')
    setLevel('Intermediate')
    setDuration('6 weeks')
    setPrice(699)
    setSlug('')
    setIsActive(true)
    setIsModalOpen(true)
  }

  const openEditModal = (course: any) => {
    setEditingCourse(course)
    setTitle(course.title)
    setDescription(course.description)
    setLevel(course.level || 'Intermediate')
    setDuration(course.duration || '6 weeks')
    setPrice(course.price || 699)
    setSlug(course.slug)
    setIsActive(course.isActive !== undefined ? course.isActive : true)
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !description) {
      toast.error('Course title and description are required.')
      return
    }

    setSubmitting(true)
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, {
          title,
          description,
          level,
          duration,
          price: Number(price),
          slug: slug || undefined,
          isActive,
        })
        toast.success('Course updated successfully.')
      } else {
        await createCourse({
          title,
          description,
          level,
          duration,
          price: Number(price),
          slug: slug || undefined,
          isActive,
        })
        toast.success('New Course created successfully.')
      }
      setIsModalOpen(false)
      fetchCoursesList()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error saving course.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleActive = async (course: any) => {
    try {
      const updated = await toggleCourseActive(course.id)
      toast.success(`Course "${course.title}" is now ${updated.isActive ? 'Enabled' : 'Disabled'}`)
      setCourses((prev) => prev.map((c) => (c.id === course.id ? updated : c)))
    } catch (err) {
      toast.error('Failed to toggle course status.')
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return
    try {
      await deleteCourse(courseId)
      toast.success('Course deleted.')
      setCourses((prev) => prev.filter((c) => c.id !== courseId))
    } catch (err) {
      toast.error('Failed to delete course.')
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Course Management</h1>
            <p className="text-sm text-slate-400 mt-1">
              Create, edit, enable/disable courses for the public catalog and AI agent routing.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide uppercase transition shadow-lg shadow-blue-600/20 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Course</span>
          </button>
        </div>

        {/* Courses Table */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              Loading courses database...
            </div>
          ) : courses.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              No courses found in database.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 border-b border-slate-800 uppercase tracking-wider text-slate-400 text-[10px] font-bold">
                  <tr>
                    <th className="px-5 py-4">Course Program</th>
                    <th className="px-5 py-4">Level</th>
                    <th className="px-5 py-4">Duration</th>
                    <th className="px-5 py-4">Tuition</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Created Date</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold shrink-0">
                            <BookOpen className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="font-bold text-sm text-white block">{course.title}</span>
                            <span className="text-[10px] text-slate-500 line-clamp-1 max-w-sm block">
                              {course.description}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700">
                          {course.level}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-slate-500" />
                          <span>{course.duration}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono font-bold text-emerald-400">
                        ${course.price}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleToggleActive(course)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition ${
                            course.isActive
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {course.isActive ? (
                            <>
                              <CheckCircle2 className="h-3 w-3" /> Enabled
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3" /> Disabled
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                        {new Date(course.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(course)}
                            className="p-1.5 rounded-lg bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white transition"
                            title="Edit Course"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:bg-red-600 hover:text-white transition"
                            title="Delete Course"
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

        {/* Create / Edit Course Modal */}
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
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {editingCourse ? 'Edit Course Program' : 'Create New Course'}
                  </h3>
                  <p className="text-xs text-slate-400">Configure curriculum details for public and agent routing.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Course Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Full Stack AI"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Course overview and syllabus highlights..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Level
                    </label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Executive">Executive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g. 6 weeks"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      placeholder="699"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="font-semibold text-slate-300">Enable for Catalog & Routing</span>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
                  />
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
                    {submitting ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
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
