import { z } from "zod";

export const invoiceSchema = z.object({
  worker_invoice: z.string().nullable(),
  invoice_date: z.union([z.string(), z.date()]).nullable(),
});

export type InvoiceForm = z.infer<typeof invoiceSchema>;
