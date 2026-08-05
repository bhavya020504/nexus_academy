import { z } from 'zod';

export const leadSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(7).max(24).optional().or(z.literal('')),
  interest: z.string().min(2).max(150).optional().or(z.literal('')),
  source: z.string().min(2).max(80).optional().or(z.literal('')),
});

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});
