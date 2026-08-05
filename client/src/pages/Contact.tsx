import { Mail, MapPin, Phone } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { SectionHeading } from '../components/common/SectionHeading'
import { PrimaryButton } from '../components/common/PrimaryButton'
import { submitContactForm } from '../services/contactService'
import { contactFormSchema } from '../utils/formSchemas'
import type { z } from 'zod'

type ContactFormValues = z.infer<typeof contactFormSchema>

export function ContactPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      companyName: '',
      message: '',
    },
  })

  const onContactSubmit = async (values: ContactFormValues) => {
    try {
      await submitContactForm({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone || null,
        message: values.message,
      })

      toast.success('Your message has been sent successfully.')
      reset()
    } catch (error) {
      toast.error('Something went wrong while sending the message.')
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Contact" title="Let’s design your next AI move" description="Connect with our team for training strategy, consulting, or product guidance." centered />
      <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3 text-slate-950"><Mail size={18} /> hello@ainexusacademy.com</div>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3 text-slate-950"><Phone size={18} /> +1 (555) 421-2190</div>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3 text-slate-950"><MapPin size={18} /> 28 Mission Bay Blvd, San Francisco, CA</div>
          </div>
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            Google Map Placeholder
          </div>
        </div>

        <form onSubmit={handleSubmit(onContactSubmit)} className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-slate-700"><span className="mb-2 block">Full Name</span><input {...register('fullName')} className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Sameer R" />{errors.fullName && <span className="mt-1 block text-xs text-red-600">{errors.fullName.message}</span>}</label>
            <label className="text-sm text-slate-700"><span className="mb-2 block">Email</span><input {...register('email')} className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="sameer@company.com" />{errors.email && <span className="mt-1 block text-xs text-red-600">{errors.email.message}</span>}</label>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-slate-700"><span className="mb-2 block">Phone Number</span><input {...register('phone')} className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="+1 (555) 332-2201" />{errors.phone && <span className="mt-1 block text-xs text-red-600">{errors.phone.message}</span>}</label>
            <label className="text-sm text-slate-700"><span className="mb-2 block">Company Name</span><input {...register('companyName')} className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Northstar" />{errors.companyName && <span className="mt-1 block text-xs text-red-600">{errors.companyName.message}</span>}</label>
          </div>
          <div className="mt-4"><label className="text-sm text-slate-700"><span className="mb-2 block">Message</span><textarea {...register('message')} className="min-h-32 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="How can we help?" />{errors.message && <span className="mt-1 block text-xs text-red-600">{errors.message.message}</span>}</label></div>
          <div className="mt-5"><PrimaryButton type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? 'Sending...' : 'Send Message'}</PrimaryButton></div>
        </form>
      </div>
    </div>
  )
}
