import { z } from "zod";

export const customerSchema = z
  .object({
    uid_customer: z.number().nullable(),

    region: z.string().nullable().default(""),

    customer_no: z.number().default(0),

    mobile: z.string().nullable().default(""),

    cal_address: z.string().default(""),

    fax: z.string().nullable().default(""),

    fork_no: z.number().default(0),

    city: z.string().default(""),

    company: z.string().default(""),

    mail1: z.email().optional().or(z.literal("")),
    mail2: z.email().optional().or(z.literal("")),
    mail3: z.email().optional().or(z.literal("")),

    zip_postal_code: z.string().default(""),

    weight: z.string().nullable().default(""),

    height: z.string().nullable().default(""),

    cal_name_list: z.string().default(""),

    first_name: z
      .string()
      .nullable()
      .transform((v) => v ?? ""),

    bank_name: z.string().nullable().default(""),

    country: z.string().nullable().default(""),

    memo: z.string().nullable().default(""),

    last_name: z
      .string()
      .nullable()
      .transform((v) => v ?? ""),

    internet: z.string().nullable().default(""),

    bank_account: z.string().nullable().default(""),

    bank_payment: z.string().nullable().default(""),

    phonelist: z.string().nullable().default(""),

    fon: z.string().nullable().default(""),

    street_address: z.string().default(""),

    bank_id: z.string().nullable().default(""),

    customerclient_no: z.string().default(""),

    category_customer: z.enum(["Dealer", "Private"]),

    delivery_address: z.string().nullable().default(""),

    customer_cannondale_no: z.string().nullable().default(""),

    vat_no: z
      .string()
      .nullable()
      .transform((v) => v ?? ""),

    no_vat: z.number().default(0),
  })
  .refine((data) => data.last_name || data.company, {
    message: "Either lastname or company should be filled in.",
    path: ["last_name"],
  });

export type EaCustomerMails = z.input<typeof customerSchema>;

export const customerDefault = {
  uid_customer: 0,

  region: "",

  customer_no: 0,

  mobile: "",

  cal_address: "",

  fax: "",

  fork_no: 0,

  city: "",

  company: "",

  mail1: "",
  mail2: "",
  mail3: "",

  zip_postal_code: "",

  weight: "",

  height: "",

  user_group: "",

  cal_name_list: "",

  first_name: "",

  bank_name: "",

  country: "",

  internet: "",

  bank_account: "",

  bank_payment: "",
  memo: "",

  phonelist: "",

  last_name: "",
  fon: "",

  street_address: "",

  bank_id: "",

  customerclient_no: "",

  category_customer: "",

  delivery_address: "",

  customer_cannondale_no: "",

  vat_no: "",

  no_vat: 0,
};
