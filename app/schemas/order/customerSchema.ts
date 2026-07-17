import { z } from "zod";

export const customerSchema = z
  .object({
    email: z.string().nullable(),
    last_name: z.string().nullable(),
    fork_no: z.number().nullable(),
    fon: z.string().nullable(),
    first_name: z.string().nullable(),
    city: z.string().nullable(),
    fax: z.string().nullable(),
    customer_no: z.number().nullable(),
    weight: z.string().nullable(),
    user_group: z.string().nullable(),
    customerclient_no: z.string().nullable(),
    height: z.string().nullable(),
    uid_customer: z.number(),
    created_at: z.date().nullable(),
    updated_at: z.date().nullable(),
    region: z.string().nullable(),
    mobile: z.string().nullable(),
    cal_address: z.string().nullable(),
    customer_no_rel: z.string().nullable(),
    order_no: z.number().nullable(),
    check_export_ups: z.number().nullable(),
    company: z.string().nullable(),
    no_vat: z.number().nullable(),
    bank_account: z.string().nullable(),
    bank_payment: z.string().nullable(),
    vat_no: z.string().nullable(),
    customer_category_no: z.number().nullable(),
    delivery_address: z.string().nullable(),
    mail1: z.string().nullable(),
    mail2: z.string().nullable(),
    mail3: z.string().nullable(),
    category_customer: z.enum(["Dealer", "Private"]),
  })
  .refine((data) => data.last_name || data.company, {
    message: "Either lastname or company should be filled in.",
    path: ["last_name"],
  });

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
