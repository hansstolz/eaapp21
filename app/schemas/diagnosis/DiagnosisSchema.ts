import { z } from "zod";

export const diagnosisSchema = z.object({
  uid_diagnosis: z.number().int(),
  check_air: z.string().nullable(),
  check_cartridge: z.string().nullable(),
  check_dial: z.string().nullable(),
  check_headset: z.string().nullable(),
  check_shockboot: z.string().nullable(),
  check_telescope: z.string().nullable(),
  customer_height: z.string().nullable(),
  customer_weight: z.string().nullable(),
  diagnosis_no: z.number().int().nullable(),
  fork_invoice_date: z.string().nullable(),
  uses: z.array(z.string()).nullable(),
  settings: z.array(z.string()).nullable(),
  notes_diagnosis_extern: z.string().nullable(),
  notes_intern: z.string().nullable(),
  notes_warranty_extern: z.string().nullable(),
  warranty_request: z.string().nullable(),
  warranty_reason: z.string().nullable(),
  worker_diagnosis: z.string().nullable(),
  work_diagnosis_date: z.string().nullable(),
  uid_order: z.number().int(),
  diagnosis_date: z.string().nullable(),
  check_extras: z.string().nullable(),
});

export type DiagnosisType = z.input<typeof diagnosisSchema>;
