import { z } from "zod";

export const contactsSchema = z.object({
  uid_contact: z.number().optional().default(0),

  height: z.string().nullish().default(""),

  fax: z.string().nullish().default(""),

  first_name: z.string().nullish().default(""),

  fon: z.string().nullish().default(""),

  streetaddress: z.string().nullish().default(""),
  last_name: z.string().nullish().default(""),

  customer_no: z.number().nullish().default(0),

  user_group: z.string().default(""),

  job_title: z.string().nullish().default(""),

  city: z.string().nullish().default(""),

  email: z.string().nullish().default(""),
  company_no: z.number().nullish().default(0),

  cal_last_first_name: z.string().nullish().default(""),

  fork_no: z.number().nullish().default(0),
  notes: z.string().nullish().default(""),

  zip: z.string().nullish().default(""),

  weight: z.string().nullish().default(""),
  customerclient_no: z.string().nullish().default(""),

  check_customer_address: z.number().nullish().default(0),

  bank_name: z.string().nullish().default(""),
  country: z.string().nullish().default(""),
  uid_customer: z.number().nullish().default(0),
  uid_company: z.number().nullish().default(0),
});
export type EaContacts = z.input<typeof contactsSchema>;
