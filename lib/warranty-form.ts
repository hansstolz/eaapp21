import { z } from "zod";

export const warrantyFormSchema = z.object({
  worker_warranty: z.string().max(50),
  work_warranty_date: z.union([z.string(), z.date()]).nullable(),
  warranty_reason: z.string(),
  text_consult_warranty: z.string(),
});

export type WarrantyForm = z.infer<typeof warrantyFormSchema>;
