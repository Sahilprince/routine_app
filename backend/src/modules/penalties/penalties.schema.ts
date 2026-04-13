import { z } from "zod";

export const penaltySchema = z.object({
  assigneeId: z.string(),
  description: z.string().min(3),
});

export const penaltyStatusSchema = z.object({
  status: z.enum(["open", "completed", "waived"]),
});
