import { z } from "zod";

const text = (max: number) => z.string().max(max);
const email = z.email().max(254).or(z.literal(""));
export const eGeneralSchema = z.object({
  uid_esettings: z.number().int().positive(),
  name: text(150).trim().min(1, "Name is required."),
  name2: text(150),
  street: text(150),
  postcode: text(20),
  city: text(100),
  country: z.union([z.literal(""), z.string().regex(/^[A-Za-z]{2}$/, "Use a two-letter country code.")]).transform(value => value.toUpperCase()),
  invoiceDateIsDeliveryDate: z.boolean(),
  IBAN: text(42),
  BIC: text(11),
  tax_id: text(50),
  fon: text(50),
  fax: text(50),
  email,
  web: z.url().max(500).or(z.literal("")),
  currency_text: text(50),
  hint: text(16000),
  warranty_name: text(150),
  warranty_street: text(150),
  warranty_postcode: text(20),
  warranty_city: text(100),
  warranty_country: z.union([z.literal(""), z.string().regex(/^[A-Za-z]{2}$/, "Use a two-letter country code.")]).transform(value => value.toUpperCase()),
  warranty_vat_no: text(50),
  mail_sender_address: email,
  user_print_language: text(50),
  footer_company_name: text(150),
  bank_account_holder: text(150),
  bank_name: text(150),
});
export type EGeneralValues = z.infer<typeof eGeneralSchema>;
export type EGeneralSettings = EGeneralValues & {
  user_group: string;
  date_created: string;
  date_updated: string;
  sender: string;
  address_warranty: string;
  footer_lists: string;
  footer_mails: string;
};
