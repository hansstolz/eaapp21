import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId, readJsonObject } from "@/lib/route-utils";
import { OrderStatus } from "@/app/data_types/orders/order_status";

const cleanSearch = (value: string | null) =>
  (value ?? "").replace(/[.\-'*+´`\"]/g, "");

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const body = await readJsonObject(request);
  if (!body) return errorResponse("Ungültige Daten.", 400);
  const uidCustomer = parsePositiveId(body.uid_customer);
  if (!uidCustomer) return errorResponse("Ein Kunde ist erforderlich.", 400);
  const worker = typeof body.worker === "string" ? body.worker : session.username;
  const [customer, setting, tax] = await Promise.all([
    prisma.ea_customer.findFirst({ where: { uid_customer: uidCustomer, user_group: session.userGroup } }),
    prisma.ea_settings.findFirst({ where: { user_group: session.userGroup }, select: { user_print_language: true } }),
    prisma.ea_value_tax.findFirst({ where: { user_group: session.userGroup } }),
  ]);
  if (!customer) return errorResponse("Kunde nicht gefunden.", 404);
  const noVat = customer.no_vat === 1;
  const now = new Date();
  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.ea_orders.create({ data: {
      user_group: session.userGroup,
      bank_account: customer.bank_account,
      bank_id: customer.bank_id,
      bank_name: customer.bank_name,
      bank_payment: customer.bank_payment,
      customer_name: customer.cal_name_list,
      customer_no: customer.customer_no,
      customer_address: customer.cal_address,
      customer_address_alt: customer.delivery_address ?? "",
      customer_fon: customer.fon,
      customer_email: customer.email,
      customer_category_no: customer.customer_category_no,
      vat_no_customer: customer.vat_no,
      no_vat: customer.no_vat,
      fork_no: 0,
      fork_model: "Article Sales",
      order_status: OrderStatus.Costestimate,
      user_print_language: setting?.user_print_language ?? "de",
      value_tax: noVat ? 0 : (tax?.value_tax ?? 0),
      value_tax2: noVat ? 0 : (tax?.value_tax2 ?? 0),
      uid_ref_fork: 0,
      uid_customer: customer.uid_customer,
      uid_client: 0,
      uid_fork: 0,
      ftsearch: cleanSearch(customer.cal_address),
      created_at: now,
      updated_at: now,
    } });
    await tx.ea_orders_costestimates.create({ data: {
      uid_order: created.uid_order,
      worker_costestimate: worker,
      costestimate_date: now,
      customer_category_no: customer.customer_category_no,
      user_group: session.userGroup,
      created_at: now,
      updated_at: now,
    } });
    return created;
  });
  return Response.json({ uid_order: order.uid_order }, { status: 201 });
}
