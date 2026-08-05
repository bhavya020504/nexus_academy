import { motion } from 'framer-motion'
import { ArrowRight, Bot, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export function HeroSection() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
          <Sparkles size={16} /> Future-ready AI education
        </div>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
          Learn AI. Build AI. Get Hired.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          AI Nexus Academy helps ambitious learners and enterprise teams unlock practical AI capability with training, consulting, and real-world product delivery.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
            Get Free AI Consultation <ArrowRight size={16} />
          </Link>
          <Link to="/courses" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700">
            Explore Courses
          </Link>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-white to-blue-50 p-6 shadow-[0_20px_80px_rgba(37,99,235,0.12)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(34,211,238,0.16),_transparent_55%)]" />
        <div className="relative rounded-[28px] border border-white/70 bg-slate-950 p-6 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-blue-200">SaaS control center</p>
              <h3 className="mt-2 text-2xl font-semibold">AI readiness system</h3>
            </div>
            <div className="rounded-2xl bg-blue-500/20 p-3 text-blue-200"><Bot size={24} /></div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-slate-300">Workflow automation</p>
              <p className="mt-2 text-3xl font-semibold">82%</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-slate-300">Enterprise adoption</p>
              <p className="mt-2 text-3xl font-semibold">4.9/5</p>
            </div>
          </div>
          <div className="mt-4 rounded-2xl bg-blue-500/10 p-4 text-sm text-blue-100">
            Practical AI, from curriculum design to enterprise deployment.
          </div>
        </div>
      </motion.div>
    </section>
  )
}
