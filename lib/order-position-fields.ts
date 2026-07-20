import type { Prisma } from "@/generated/prisma/client";

export const ORDER_POSITION_FIELDS = [
  "article_creditnote_int", "articlecharacter", "cal_value_tax",
  "fork_no_rel", "currency", "order_no", "article_warranty_int",
  "amount_price_categ3_labor", "cal_price", "price_single_categ2",
  "amount_price_categ1", "customer_category_no",
  "amount_price_categ3_freight", "user_print_language", "article_group",
  "price_single_categ3", "articlediscription",
  "amount_price_categ3_material", "article_no_rel", "cal_price_categ3",
  "customer_no", "cal_price_categ2", "articlecode", "cal_price_categ1",
  "article_no", "customer_no_rel", "fork_no", "order_no_rel",
  "amount_price_categ2", "price_single_categ1", "amount_price_categ3",
  "quantity", "units", "uid_article", "uid_customer", "uid_ref_fork",
  "uid_order", "uid_costestimates", "cal_value_tax2",
] as const satisfies readonly (keyof Prisma.ea_orders_positionsUncheckedUpdateInput)[];
