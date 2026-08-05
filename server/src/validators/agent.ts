import { z } from 'zod';

export const createAgentSchema = z.object({
  name: z.string().min(2).max(100),
  snapserveAgentId: z.string().min(1).max(50),
  languages: z.string().optional(),
  isActive: z.boolean().optional(),
  courseNames: z.array(z.string()).default([]),
});

export const updateAgentSchema = createAgentSchema.partial();
