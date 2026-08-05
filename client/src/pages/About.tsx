import { SectionHeading } from '../components/common/SectionHeading'

const timeline = [
  { year: '2020', text: 'AI Nexus Academy was founded with a mission to make world-class AI education accessible.' },
  { year: '2022', text: 'Expanded into enterprise AI consulting and talent transformation programs.' },
  { year: '2024', text: 'Partnered with leading teams to deliver live AI products and adoption roadmaps.' },
]

const values = ['Curiosity', 'Integrity', 'Execution', 'Impact']
const team = [
  { name: 'Aisha Velez', role: 'Head of Learning' },
  { name: 'Marco Chen', role: 'AI Program Director' },
  { name: 'Sana Iqbal', role: 'Client Success Lead' },
]

export function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="About us" title="A company engineered for AI impact" description="We bridge education, consulting, and customer outcomes with a premium delivery model that feels ambitious and deeply practical." centered />

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border border-slate-200 bg-white p-7">
          <h3 className="text-2xl font-semibold text-slate-950">Company Story</h3>
          <p className="mt-4 text-slate-600">AI Nexus Academy began with a simple idea: high-quality AI learning should be hands-on, business-aware, and outcome-focused. Over time, our advisory and training work evolved into a full capability-building platform for organizations.</p>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-7">
          <h3 className="text-2xl font-semibold text-slate-950">Mission</h3>
          <p className="mt-4 text-slate-600">Equip learners and enterprises with practical AI knowledge, modern delivery frameworks, and confidence to build, deploy, and scale AI products responsibly.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border border-slate-200 bg-white p-7">
          <h3 className="text-2xl font-semibold text-slate-950">Vision</h3>
          <p className="mt-4 text-slate-600">Create a global network where AI capability is not limited to elite technical teams, but becomes practical for every business leader and ambitious individual.</p>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-7">
          <h3 className="text-2xl font-semibold text-slate-950">Values</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {values.map((value) => (
              <span key={value} className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">{value}</span>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-10 rounded-[28px] border border-slate-200 bg-white p-7">
        <SectionHeading eyebrow="Journey" title="Timeline" description="The milestones that shaped our impact-led growth." />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {timeline.map((item) => (
            <div key={item.year} className="rounded-[24px] bg-slate-50 p-5">
              <div className="text-sm font-semibold text-blue-700">{item.year}</div>
              <p className="mt-3 text-sm text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border border-slate-200 bg-white p-7">
          <h3 className="text-2xl font-semibold text-slate-950">Achievements</h3>
          <ul className="mt-4 space-y-3 text-slate-600">
            <li>• 5,000+ learners trained through intensive AI bootcamps and enterprise cohorts</li>
            <li>• 200+ enterprise engagements across strategy, deployment, and upskilling</li>
            <li>• 95% learner satisfaction backed by measurable role-transition outcomes</li>
          </ul>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-7">
          <h3 className="text-2xl font-semibold text-slate-950">Our Team</h3>
          <div className="mt-4 grid gap-3">
            {team.map((member) => (
              <div key={member.name} className="rounded-[20px] bg-slate-50 p-4">
                <div className="font-semibold text-slate-950">{member.name}</div>
                <div className="text-sm text-slate-500">{member.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center">
        <div className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">Office Gallery Placeholder</div>
        <p className="mt-3 text-slate-600">A future office/culture gallery will appear here with photography and brand moments.</p>
      </section>
    </div>
  )
}
