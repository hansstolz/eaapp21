import z from "zod";

export const formSchema = z.object({
  uid_setting: z.number().optional(),
  mail_sender_address: z.string().email("This is not a valid email."),
  tax_id: z.string(),
  hint: z.string(),
  height_unit_default: z.string(),
  user_print_language: z.string(),
  address_header: z.string().min(2, { message: "required" }),
  footer_lists: z.string(),
  nb13: z.number(),
  user_group: z.string(),
  nb24: z.number(),
  fiscal_office: z.string(),
  bank_account: z.string(),
  footer_mails: z.string(),
  value_tax_default: z.number(),
  sender: z.string(),
  weight_unit_default: z.string(),
  value_tax_id: z.string(),
  bank_name: z.string(),
  currency_text: z.string(),
  address_warranty: z.string(),
  email_signature: z.string(),
});
export type GeneralSettings = z.infer<typeof formSchema>;
