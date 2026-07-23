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
  const uidFork = parsePositiveId(body.uid_fork);
  if (!uidCustomer || !uidFork) return errorResponse("Kunde und Gabel sind erforderlich.", 400);
  const worker = typeof body.worker === "string" ? body.worker : session.username;

  const [customer, fork, setting, tax] = await Promise.all([
    prisma.ea_customer.findFirst({ where: { uid_customer: uidCustomer, user_group: session.userGroup } }),
    prisma.ea_forks.findFirst({ where: { uid_fork: uidFork, uid_customer: uidCustomer, user_group: session.userGroup } }),
    prisma.ea_settings.findFirst({ where: { user_group: session.userGroup }, select: { user_print_language: true } }),
    prisma.ea_value_tax.findFirst({ where: { user_group: session.userGroup } }),
  ]);
  if (!customer || !fork) return errorResponse("Kunde oder Gabel nicht gefunden.", 404);
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
      customer_client_name: fork.client_name ?? "",
      fork_color: fork.colour ?? "",
      fork_in_date: now,
      fork_model: fork.fork_model ?? "",
      fork_no: fork.fork_no ?? 0,
      order_status: OrderStatus.Diagnose,
      user_print_language: setting?.user_print_language ?? "de",
      value_tax: noVat ? 0 : (tax?.value_tax ?? 0),
      value_tax2: noVat ? 0 : (tax?.value_tax2 ?? 0),
      uid_ref_fork: fork.uid_ref_fork,
      uid_customer: customer.uid_customer,
      uid_client: fork.uid_client,
      uid_fork: fork.uid_fork,
      wheelsize: fork.wheelsize,
      ftsearch: cleanSearch(customer.cal_address),
      created_at: now, updated_at: now,
    } });
    const uidOrder = created.uid_order;
    await Promise.all([
      tx.ea_orders_costestimates.create({ data: {
        uid_order: uidOrder, worker_costestimate: worker,
        costestimate_date: now, customer_category_no: customer.customer_category_no,
        user_group: session.userGroup, created_at: now, updated_at: now,
      } }),
      tx.ea_warranty.create({ data: {
        uid_order: uidOrder, wa_fork_model: fork.fork_model ?? "",
        warranty_request: "no warranty", warranty_reason: "",
        user_group: session.userGroup, created_at: now, updated_at: now,
      } }),
      tx.ea_worksheet.create({ data: {
        uid_order: uidOrder, worker_worksheet: worker, worksheet_date: now,
        notes_worksheet_extern: "", notes_intern_worksheet: "", text_consult_worksheet: "",
        user_group: session.userGroup, created_at: now, updated_at: now,
      } }),
      tx.ea_diagnosis.create({ data: {
        uid_order: uidOrder, worker_diagnosis: worker,
        work_diagnosis_date: now, diagnosis_date: now,
        notes_diagnosis_extern: "", customer_height: "", customer_weight: "",
        fork_setting: "", fork_use: "", notes_intern: "", notes_warranty_extern: "",
        user_group: session.userGroup, created_at: now, updated_at: now,
      } }),
    ]);
    return created;
  });
  return Response.json({ uid_order: order.uid_order }, { status: 201 });
}
