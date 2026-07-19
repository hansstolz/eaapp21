import { getAuthSession } from "@/lib/auth-session";
import { findOwnedOrder } from "@/lib/order-detail";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId, readJsonObject } from "@/lib/route-utils";

export async function PUT(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const body = await readJsonObject(request);
  if (!body) return errorResponse("Ungültige Daten.", 400);
  const uidOrder = parsePositiveId(body.uid_order);
  const uidCustomer = parsePositiveId(body.uid_customer);
  if (!uidOrder || !uidCustomer) return errorResponse("Ungültige Zuordnung.", 400);
  if (!await findOwnedOrder(uidOrder, session.userGroup))
    return errorResponse("Auftrag nicht gefunden.", 404);
  const customer = await prisma.ea_customer.findFirst({
    where: { uid_customer: uidCustomer, user_group: session.userGroup },
    select: { uid_customer: true },
  });
  if (!customer) return errorResponse("Kunde nicht gefunden.", 404);
  const order = await prisma.ea_orders.update({
    where: { uid_order: uidOrder },
    data: {
      uid_customer: uidCustomer,
      customer_no: body.customer_no as number | null,
      customer_address: body.cal_address as string | null,
      customer_fon: body.fon as string | null,
      customer_email: body.email as string | null,
      bank_account: body.bank_account as string | null,
      bank_payment: body.bank_payment as string | null,
      vat_no_customer: body.vat_no as string | null,
      no_vat: body.no_vat === "" ? null : Number(body.no_vat),
      customer_category_no: Number(body.customer_category_no),
      customer_address_alt: body.delivery_address as string | null,
      updated_at: new Date(),
    },
  });
  return Response.json(order);
}
