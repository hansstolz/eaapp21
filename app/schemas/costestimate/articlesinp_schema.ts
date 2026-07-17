import { z } from "zod";

export const articlesSchema = z.object({
  uid_orders_position: z.number().int().nullable(),
  articlecharacter: z.string().nullable(),

  article_group: z.string().nullable(),
  article_no: z.number().int().nullable(),

  price_netto_categ1: z.string(),
  price_netto_categ2: z.string(),
  price_netto_categ3: z.string(),

  price_sum_categ1: z.string(),
  price_sum_categ2: z.string(),
  price_sum_categ3: z.string(),

  articlecode: z.string().nullable(),
  category_article: z.string().nullable(),
  quantity: z.coerce.number().nullable(),
  uid_article: z.number().int(),
  uid_ref_fork: z.number().int(),
  isWarranty: z.boolean().default(false),
  articledescription: z.string().nullable().default(""),
});

export type EaArticlesInp = z.input<typeof articlesSchema>;
