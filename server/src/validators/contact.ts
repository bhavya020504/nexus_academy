import { z } from 'zod';

export const contactMessageSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(7).max(24).optional().or(z.literal('')),
  message: z.string().min(10).max(2000),
});
