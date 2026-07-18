import type {
  ea_articlesCreateInput,
  ea_articlesUpdateInput,
} from "@/generated/prisma/models/ea_articles";

export const ARTICLE_FIELDS = [
  "active",
  "for_what",
  "order_no",
  "uid_ref_fork",
  "articlecharacter",
  "memo",
  "price_netto_categ3",
  "cost_price",
  "cust_categ_2",
  "core_item",
  "supplied",
  "price_netto_categ2",
  "article_group",
  "articledescription",
  "print_check",
  "article_no",
  "price_netto_categ1",
  "cust_categ_1",
  "cust_categ_3",
  "articlecode",
  "category_article",
  "storage_location2",
  "selforder_only",
  "storage_location1",
  "manufacturer",
  "company_article_no",
  "quantity",
  "unit",
  "cal_cost_price_sum",
] as const satisfies readonly (
  | keyof ea_articlesCreateInput
  | keyof ea_articlesUpdateInput
)[];
