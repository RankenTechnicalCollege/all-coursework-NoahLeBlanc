import { z } from 'zod';

export const bugSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  status: z.enum(['Open', 'In Progress', 'Closed']),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
});

export type BugFormData = z.infer<typeof bugSchema>;