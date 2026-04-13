import { z } from "zod";

export const completionSchema = z.object({
  routineId: z.string(),
  status: z.enum(["completed", "missed"]),
});
