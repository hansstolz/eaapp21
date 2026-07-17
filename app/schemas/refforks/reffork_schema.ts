import { z } from "zod";

export const refforkSchema = z.object({
  uid_ref_fork: z.number().optional(),
  fork_model: z.string().min(3, "Fork model is required"),
  notes: z.string().optional(),
  category_fork: z.string().optional(),
});

export type RefForkType = z.infer<typeof refforkSchema>;
