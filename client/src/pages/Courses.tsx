import { SectionHeading } from '../components/common/SectionHeading'
import { PrimaryButton } from '../components/common/PrimaryButton'
import { courses } from '../data/siteData'

export function CoursesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Courses" title="Career-ready AI programs" description="Learn the core tools, architectures, and applied patterns that employers and teams need most." centered />
      <div className="mt-10 space-y-6">
        {courses.map((course) => (
          <article key={course.title} className="grid gap-6 overflow-hidden rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[0.9fr_1.1fr] lg:p-6">
            <img src={course.image} alt={course.title} className="h-72 w-full rounded-[24px] object-cover" />
            <div className="flex flex-col justify-between gap-4 p-2">
              <div>
                <div className="flex flex-wrap gap-2 text-xs font-semibold text-blue-700">
                  <span className="rounded-full bg-blue-50 px-3 py-1">{course.duration}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">Live mentorship</span>
                </div>
                <h2 className="mt-4 text-2xl font-semibold text-slate-950">{course.title}</h2>
                <p className="mt-3 text-slate-600">{course.description}</p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold text-slate-950">Overview</h3>
                    <p className="mt-2 text-sm text-slate-600">Intensive, project-led learning designed to make AI concepts business-ready and production-aware.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-950">Curriculum</h3>
                    <p className="mt-2 text-sm text-slate-600">Foundations, implementation labs, evaluation, deployment simulations, and portfolio review.</p>
                  </div>
                </div>
                <div className="mt-5">
                  <h3 className="font-semibold text-slate-950">Skills</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {course.technologies.map((tech) => (
                      <span key={tech} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{tech}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-5">
                  <h3 className="font-semibold text-slate-950">Career Opportunities</h3>
                  <p className="mt-2 text-sm text-slate-600">AI Engineer, Analytics Specialist, Prompt Product Manager, Automation Strategist, and Growth Technologist.</p>
                </div>
              </div>
              <PrimaryButton className="w-fit">Enroll Now</PrimaryButton>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
