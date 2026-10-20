import z from "zod";

export const formSchema = z.object({
  uid_setting: z.number().optional(),
  mail_sender_address: z.string().email("This is not a valid email."),
  tax_id: z.string().nullable(),
  hint: z.string().nullable(),
  height_unit_default: z.string().nullable(),
  user_print_language: z.string().nullable(),
  address_header: z.string().min(2, { message: "required" }),
  footer_lists: z.string().nullable(),
  nb13: z.coerce.number<number>(),
  user_group: z.string(),
  nb24: z.coerce.number<number>(),
  fiscal_office: z.string().nullable(),
  bank_account: z.string().nullable(),
  footer_mails: z.string().nullable(),
  value_tax_default: z.coerce.number<number>(),
  sender: z.string().nullable(),
  weight_unit_default: z.string().nullable(),
  value_tax_id: z.string().nullable(),
  bank_name: z.string().nullable(),
  currency_text: z.string().nullable(),
  address_warranty: z.string().nullable(),
  email_signature: z.string().nullable(),
});
export type GeneralSettings = z.infer<typeof formSchema>;
