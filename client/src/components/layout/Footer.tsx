import { BriefcaseBusiness, Globe, Mail, MapPin, Phone, PlayCircle, Send } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="space-y-4 lg:col-span-2">
          <div className="text-2xl font-semibold">AI Nexus Academy</div>
          <p className="max-w-md text-sm text-slate-300">Premium AI education and consulting for ambitious companies and future-ready learners.</p>
          <div className="flex gap-3 text-slate-300">
            <a href="https://linkedin.com" className="rounded-full border border-slate-700 p-2 hover:text-white"><BriefcaseBusiness size={16} /></a>
            <a href="https://instagram.com" className="rounded-full border border-slate-700 p-2 hover:text-white"><Send size={16} /></a>
            <a href="https://youtube.com" className="rounded-full border border-slate-700 p-2 hover:text-white"><PlayCircle size={16} /></a>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Company</h3>
          <ul className="space-y-3 text-sm text-slate-300">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Quick Links</h3>
          <ul className="space-y-3 text-sm text-slate-300">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/courses">Course Catalog</Link></li>
            <li><Link to="/contact">Book Consultation</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Newsletter</h3>
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-center gap-2"><Mail size={14} /> hello@ainexusacademy.com</div>
            <div className="flex items-center gap-2"><Phone size={14} /> +1 (555) 421-2190</div>
            <div className="flex items-center gap-2"><MapPin size={14} /> 28 Mission Bay Blvd, San Francisco, CA</div>
            <div className="flex items-center gap-2"><Globe size={14} /> www.ainexusacademy.com</div>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 px-4 py-4 text-center text-sm text-slate-400 sm:px-6 lg:px-8">
        © 2026 AI Nexus Academy. All rights reserved.
      </div>
    </footer>
  )
}
