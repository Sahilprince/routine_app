import { z } from "zod";

export const inviteSchema = z.object({
  email: z.string().email(),
});

export const acceptSchema = z.object({
  code: z.string().min(4),
});
