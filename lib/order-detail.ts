import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { pickDefinedFields } from "@/lib/route-utils";

export const ORDER_UPDATE_FIELDS = [
  "bank_account", "bank_id", "bank_name", "bank_payment",
  "cal_amount_price_categ3", "cal_outstanding_money", "check_extras",
  "customer_address", "customer_address_alt", "costestimates_numbers",
  "customer_category_no", "customer_client_height", "customer_client_name",
  "customer_client_weight", "customer_email", "customer_fon", "customer_name",
  "customer_no", "date_modifikation", "dealers_client_form", "fork_color",
  "fork_freight_forwarder", "fork_freight_no", "fork_in_carrier",
  "fork_in_date", "fork_invoice_no", "fork_model", "fork_no",
  "fork_pickup_time", "fork_shipped_date", "invoice_date", "invoice_no",
  "notes_costestimate_extern", "notes_intern", "notes_invoice_extern",
  "order_modifikation", "order_no", "order_status", "price_categ1_subtotal",
  "price_categ1_total", "price_categ1_valuetax", "price_categ2_subtotal",
  "price_categ2_total", "price_categ2_valuetax",
  "price_categ3_freight_subtotal", "price_categ3_labor_subtotal",
  "price_categ3_material_subtotal", "price_categ3_subtotal",
  "price_categ3_total", "price_categ3_valuetax", "price_payments_total",
  "reminder_date", "text_payments", "user_print_language", "vat_no_customer",
  "worksheet_no", "uid_customer", "uid_fork", "diagnosis_no",
] as const satisfies readonly (keyof Prisma.ea_ordersUncheckedUpdateInput)[];

const ORDER_DATE_FIELDS = new Set<string>([
  "date_modifikation", "fork_in_date", "fork_pickup_time",
  "fork_shipped_date", "invoice_date", "reminder_date",
]);

export function orderUpdateData(body: Record<string, unknown>) {
  const data = pickDefinedFields<Prisma.ea_ordersUncheckedUpdateInput>(
    body,
    ORDER_UPDATE_FIELDS,
  );
  for (const field of ORDER_DATE_FIELDS) {
    const value = data[field as keyof typeof data];
    if (typeof value === "string") {
      data[field as keyof typeof data] = (value ? new Date(value) : null) as never;
    }
  }
  return data;
}

export async function findOwnedOrder(uidOrder: number, userGroup: string) {
  return prisma.ea_orders.findFirst({
    where: { uid_order: uidOrder, user_group: userGroup },
  });
}

export async function findOwnedCostestimate(uid: number, userGroup: string) {
  const costestimate = await prisma.ea_orders_costestimates.findUnique({
    where: { uid_costestimates: uid },
  });
  if (!costestimate) return null;

  const order = await findOwnedOrder(costestimate.uid_order, userGroup);
  return order ? costestimate : null;
}
