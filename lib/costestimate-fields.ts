import type { Prisma } from "@/generated/prisma/client";

export const COSTESTIMATE_UPDATE_FIELDS = [
  "worker_costestimate", "worker_costestimate_no", "price_costestimate_total",
  "printstatus_costestimate", "price_costestimate_subtotal", "costestimate_date",
  "text_consult_costestimate", "notes_costestimate_extern",
  "price_costestimate_valuetax", "costestimate_confirm_check", "costestimate_no",
  "confirmed_when", "confirmed_how", "confirmed_by", "price_categ1_subtotal",
  "price_categ1_total", "price_categ1_valuetax", "price_categ2_subtotal",
  "price_categ2_total", "price_categ2_valuetax",
  "price_categ3_freight_subtotal", "price_categ3_labor_subtotal",
  "price_categ3_material_subtotal", "price_categ3_subtotal",
  "price_categ3_total", "price_categ3_valuetax", "price_outstanding_money",
  "price_payments_total", "customer_category_no",
] as const satisfies readonly (keyof Prisma.ea_orders_costestimatesUncheckedUpdateInput)[];
