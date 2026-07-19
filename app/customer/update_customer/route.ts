import type { ea_customerUpdateInput } from "@/generated/prisma/models/ea_customer";
import { calculatedCustomerFields, CUSTOMER_FIELDS, mailParts } from "@/lib/customer-fields";
import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId, pickDefinedFields, readJsonObject } from "@/lib/route-utils";

export async function PUT(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const body = await readJsonObject(request);
  if (!body) return errorResponse("Ungültige Kundendaten.", 400);
  const uidCustomer = parsePositiveId(body.uid_customer);
  if (!uidCustomer) return errorResponse("Ungültige Kunden-ID.", 400);
  const existing = await prisma.ea_customer.findFirst({
    where: { uid_customer: uidCustomer, user_group: session.userGroup },
    select: { uid_customer: true },
  });
  if (!existing) return errorResponse("Kunde nicht gefunden.", 404);
  const data = pickDefinedFields<ea_customerUpdateInput>(body, CUSTOMER_FIELDS);
  Object.assign(data, calculatedCustomerFields(body));
  data.user_group = session.userGroup;
  const customer = await prisma.ea_customer.update({
    where: { uid_customer: uidCustomer },
    data,
  });
  return Response.json({ ...customer, ...mailParts(customer.email) });
}
