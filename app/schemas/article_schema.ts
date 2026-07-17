import { z } from "zod";

export const EaArticlesSchema = z.object({
  uid_article: z.number().default(0),

  active: z.coerce.number().default(1),

  for_what: z.string().default(""),

  order_no: z.number().default(0),

  uid_ref_fork: z.number().default(0),

  articlecharacter: z.string().min(2).optional(),

  memo: z.string().default(""),

  price_netto_categ3: z.coerce.number().default(0),

  cost_price: z.coerce.number().default(0),

  user_group: z.string().default(""),

  cust_categ_2: z.number().default(0),

  core_item: z.coerce.number().default(0),

  supplied: z.number().default(0),

  price_netto_categ2: z.coerce.number().default(0),

  article_group: z.string().default("Material"),

  articledescription: z.string().nullable().default(""),

  print_check: z.number().default(0),

  article_no: z.number().default(0),

  price_netto_categ1: z.coerce.number().default(0),

  cust_categ_1: z.coerce.number().default(0),

  cust_categ_3: z.coerce.number().default(0),

  articlecode: z.string().min(2).optional(),

  category_article: z.string().default(""),

  storage_location2: z.string().default(""),

  selforder_only: z.string().default(""),

  storage_location1: z.string().default(""),

  manufacturer: z.string().default(""),

  company_article_no: z.string().default(""),

  quantity: z.coerce.number().default(0),

  unit: z.number().default(0),
  cal_cost_price_sum: z.number().default(0),
});
export type EaArticles = z.input<typeof EaArticlesSchema>;
