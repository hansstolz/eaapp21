import { z } from "zod";

export const companiesSchema = z.object({
  uid_company: z.number().optional(),

  bank_name: z.string().nullish().default(""),

  country: z.string().nullish().default(""),

  street_address: z.string().nullish().default(""),

  fax: z.string().nullish().default(""),

  mobile: z.string().nullish().default(""),

  company_no: z.number().default(0),

  notes: z.string().nullish().default(""),

  email: z.string().nullish().default(""),

  first_name: z.string().nullish().default(""),

  company_no_rel: z.string().nullish().default(""),

  bank_payment: z.string().nullish().default(""),

  bank_account: z.string().nullish().default(""),

  zip_postal_code: z.string().nullish().default(""),

  category_company: z.string().nullish().default(""),

  cal_address: z.string().nullish().default(""),

  city: z.string().nullish().default(""),

  company_customer_no: z.string().nullish().default(""),

  bank_id: z.string().nullish().default(""),

  company: z.string().nullish().default(""),

  internet: z.string().nullish().default(""),

  cal_name_list: z.string().nullish().default(""),

  fon: z.string().nullish().default(""),

  last_name: z.string().nullish().default(""),

  mail_salut: z.string().nullish().default(""),

  uid_mail: z.number().default(0),

  cal_email_find: z.string().nullish().default(""),
  user_group: z.string().default(""),
});

export type EaCompanies = z.input<typeof companiesSchema>;
