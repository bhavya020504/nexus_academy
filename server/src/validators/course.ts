import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().min(5),
  level: z.string().optional(),
  duration: z.string().optional(),
  price: z.number().optional(),
  slug: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateCourseSchema = createCourseSchema.partial();
