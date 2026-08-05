import { z } from 'zod';

export const leadSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(7).max(24).optional().or(z.literal('')).nullable(),
  companyName: z.string().max(120).optional().or(z.literal('')).nullable(),
  industry: z.string().max(120).optional().or(z.literal('')).nullable(),
  interest: z.string().max(150).optional().or(z.literal('')).nullable(),
  source: z.string().max(80).optional().or(z.literal('')).nullable(),
});

export const leadStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'CLOSED']),
});

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});
