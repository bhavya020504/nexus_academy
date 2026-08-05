import { z } from 'zod'

export const leadFormSchema = z.object({
  fullName: z.string().min(2, 'Full name is required').max(120),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(7, 'Enter a valid phone number').max(24).optional().or(z.literal('')),
  companyName: z.string().min(2, 'Company name is required').max(120),
  industry: z.string().min(2, 'Industry is required').max(120),
  interest: z.string().min(2, 'Interested service is required').max(150),
  message: z.string().min(10, 'Message should be at least 10 characters').max(2000),
})

export const contactFormSchema = z.object({
  fullName: z.string().min(2, 'Full name is required').max(120),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(7, 'Enter a valid phone number').max(24).optional().or(z.literal('')),
  companyName: z.string().min(2, 'Company name is required').max(120),
  message: z.string().min(10, 'Message should be at least 10 characters').max(2000),
})
