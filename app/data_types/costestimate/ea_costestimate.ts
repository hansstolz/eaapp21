import { EaOrdersPosition } from "../orders/ea_orders_position";
import { EaOrdersText } from "../orders/ea_orders_texts";

export type EaCostestimate = {
  uid_costestimates: number;
  worker_costestimate: string | null;
  worker_costestimate_no: number | null;
  price_costestimate_total: number;
  printstatus_costestimate: string | null;
  price_costestimate_subtotal: number;
  costestimate_date: string | null;
  text_consult_costestimate: string | null;
  notes_costestimate_extern: string | null;
  price_costestimate_valuetax: number;
  costestimate_confirm_check: number | null;
  costestimate_no: number | null;
  uid_order: number;
  created_at: string | null;
  updated_at: string | null;
  confirmed_when: string | null;
  confirmed_how: number | null;
  confirmed_by: string | null;
  price_categ1_subtotal: number | null;
  price_categ1_total: number | null;
  price_categ1_valuetax: number | null;
  price_categ2_subtotal: number | null;
  price_categ2_total: number | null;
  price_categ2_valuetax: number | null;
  price_categ3_freight_subtotal: number | null;
  price_categ3_labor_subtotal: number | null;
  price_categ3_material_subtotal: number | null;
  price_categ3_subtotal: number | null;
  price_categ3_total: number | null;
  price_categ3_valuetax: number | null;
  price_outstanding_money: number | null;
  price_payments_total: number | null;
  customer_category_no: number | null;
  user_group: string | null;
};

export type CostestimateDetail = {
  costestimate: EaCostestimate;
  positions: EaOrdersPosition[];
  texts: EaOrdersText[];
};
