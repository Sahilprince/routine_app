import { z } from "zod";

export const routineSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  category: z.string().trim().min(1).max(40),
  shared: z.boolean().default(false),
  frequency: z.object({
    type: z.enum(["daily", "weekly", "custom"]),
    days: z.array(z.number().min(0).max(6)).optional(),
  }),
});
