import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, BarChart3, Bot, Brain, GraduationCap, Mic, Sparkles } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { companies, courses, faqs, features, services, stats, testimonials } from '../../constants/siteData'
import { SectionHeading } from '../common/SectionHeading'
import { PrimaryButton } from '../common/PrimaryButton'
import { submitLeadForm } from '../../services/leadService'
import { getPublicCourses } from '../../services/courseService'
import { leadFormSchema } from '../../utils/formSchemas'
import type { z } from 'zod'

type LeadFormValues = z.infer<typeof leadFormSchema>

const iconMap = {
  Brain,
  GraduationCap,
  Sparkles,
  BarChart3,
  Bot,
  Mic,
}

const DEFAULT_COURSES = [
  'Full Stack AI',
  'Data Analytics',
  'GenAI & LLM',
  'AI Consulting',
  'Python for AI',
  'Executive AI Leadership & Strategy',
  'Enterprise Generative AI & LLM Systems',
  'AI Product Management & Architecture',
]

export function HomePageSections() {
  const [dbCourses, setDbCourses] = useState<string[]>(DEFAULT_COURSES)

  useEffect(() => {
    async function loadCourses() {
      try {
        const fetched = await getPublicCourses()
        if (fetched && fetched.length > 0) {
          const titles = fetched.map((c: any) => c.title)
          setDbCourses(titles)
        }
      } catch (err) {
        console.warn('Using default course offerings for dropdown fallback.')
      }
    }
    loadCourses()
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof leadFormSchema>>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      companyName: '',
      industry: '',
      interest: DEFAULT_COURSES[0],
      message: '',
    },
  })

  const onLeadSubmit = async (values: LeadFormValues) => {
    try {
      await submitLeadForm({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone || null,
        interest: values.interest,
        source: values.industry,
      })

      toast.success('Your request has been submitted successfully.')
      reset()
    } catch (error) {
      toast.error('Something went wrong while submitting the request.')
    }
  }

  return (
    <div className="space-y-20 pb-20">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded-[28px] border border-slate-200 bg-white p-6 sm:grid-cols-2 lg:grid-cols-6">
          {companies.map((company) => (
            <div key={company} className="rounded-2xl bg-slate-50 px-4 py-5 text-center text-sm font-semibold text-slate-500">{company}</div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Services" title="Enterprise-grade AI capability" description="From advisory to implementation, our programs align with real business objectives and technical execution." centered />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap]
            return (
              <motion.div key={service.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: index * 0.05 }} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-5 inline-flex rounded-2xl bg-blue-50 p-3 text-blue-700"><Icon size={20} /></div>
                <h3 className="text-xl font-semibold text-slate-950">{service.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{service.description}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Why choose us" title="Built for career acceleration and business growth" description="Our approach blends deep learning, direct mentorship, and measurable impact." centered />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature} className="rounded-[24px] border border-slate-200 bg-white p-5 text-center text-sm font-semibold text-slate-700 shadow-sm">
              {feature}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-[28px] border border-slate-200 bg-white p-7 text-center shadow-sm">
              <div className="text-4xl font-semibold text-blue-700">{stat.value}</div>
              <div className="mt-2 text-sm text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Courses preview" title="Programs that create immediate momentum" description="Each learning track is crafted to move learners from foundational AI principles to deployment-ready capability." centered />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {courses.map((course, index) => (
            <motion.article key={course.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.07 }} className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
              <img src={course.image} alt={course.title} className="h-56 w-full object-cover" />
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between text-sm text-slate-500"><span>{course.duration}</span><span>Premium track</span></div>
                <h3 className="text-xl font-semibold text-slate-950">{course.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{course.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {course.technologies.map((tech) => (
                    <span key={tech} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{tech}</span>
                  ))}
                </div>
                <div className="mt-6"><PrimaryButton className="w-full">Enroll Now</PrimaryButton></div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-[32px] border border-slate-200 bg-gradient-to-br from-blue-50 to-white p-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionHeading eyebrow="Lead generation" title="Book a strategy call with our AI experts" description="Tell us about your business goals and we’ll recommend the right consulting or training path." />
          </div>
          <form onSubmit={handleSubmit(onLeadSubmit)} className="grid gap-4 rounded-[28px] bg-white p-5 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm text-slate-700"><span className="mb-2 block font-medium">Full Name</span><input {...register('fullName')} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500" placeholder="Alex Morgan" />{errors.fullName && <span className="mt-1 block text-xs text-red-600">{errors.fullName.message}</span>}</label>
              <label className="text-sm text-slate-700"><span className="mb-2 block font-medium">Phone Number</span><input {...register('phone')} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500" placeholder="+1 (555) 333-1010" />{errors.phone && <span className="mt-1 block text-xs text-red-600">{errors.phone.message}</span>}</label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm text-slate-700"><span className="mb-2 block font-medium">Email</span><input {...register('email')} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500" placeholder="alex@company.com" />{errors.email && <span className="mt-1 block text-xs text-red-600">{errors.email.message}</span>}</label>
              <label className="text-sm text-slate-700"><span className="mb-2 block font-medium">Company Name</span><input {...register('companyName')} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500" placeholder="Nexa Labs" />{errors.companyName && <span className="mt-1 block text-xs text-red-600">{errors.companyName.message}</span>}</label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm text-slate-700"><span className="mb-2 block font-medium">Industry</span><input {...register('industry')} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500" placeholder="Fintech" />{errors.industry && <span className="mt-1 block text-xs text-red-600">{errors.industry.message}</span>}</label>
              
              {/* Searchable / Dynamic Course Dropdown */}
              <label className="text-sm text-slate-700">
                <span className="mb-2 block font-medium">Select Interested Course</span>
                <select
                  {...register('interest')}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 bg-white text-slate-900 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {dbCourses.map((cTitle) => (
                    <option key={cTitle} value={cTitle}>
                      {cTitle}
                    </option>
                  ))}
                </select>
                {errors.interest && <span className="mt-1 block text-xs text-red-600">{errors.interest.message}</span>}
              </label>
            </div>
            <label className="text-sm text-slate-700"><span className="mb-2 block font-medium">Message</span><textarea {...register('message')} className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500" placeholder="Tell us how AI can support your team." />{errors.message && <span className="mt-1 block text-xs text-red-600">{errors.message.message}</span>}</label>
            <div className="mt-1"><PrimaryButton type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? 'Submitting...' : 'Submit Request'}</PrimaryButton></div>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Testimonials" title="Leaders trust our AI transformation system" description="Our learners and consulting clients consistently describe the experience as practical, empathetic, and outcome-focused." centered />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.name} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm leading-7 text-slate-600">“{item.quote}”</p>
              <div className="mt-5 border-t border-slate-100 pt-4">
                <div className="font-semibold text-slate-950">{item.name}</div>
                <div className="text-sm text-slate-500">{item.title}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="FAQ" title="Answers for ambitious teams" description="Explore the most common questions from learners and enterprise leaders." centered />
        <div className="mt-8 space-y-3">
          {faqs.map((faq) => (
            <details key={faq.question} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <summary className="cursor-pointer list-none text-base font-semibold text-slate-950">{faq.question}</summary>
              <p className="mt-3 text-sm leading-7 text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[32px] bg-slate-950 px-8 py-12 text-center text-white">
          <h2 className="text-3xl font-semibold sm:text-4xl">Get a tailored AI roadmap for your team.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">Schedule a consultation and we’ll map high-impact opportunities across training, automation, and delivery.</p>
          <div className="mt-6 flex justify-center"><Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950">Book a Consultation <ArrowRight size={16} /></Link></div>
        </div>
      </section>
    </div>
  )
}
