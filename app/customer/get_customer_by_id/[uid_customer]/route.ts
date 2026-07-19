import { getAuthSession } from "@/lib/auth-session";
import { mailParts } from "@/lib/customer-fields";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId } from "@/lib/route-utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ uid_customer: string }> },
) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const uidCustomer = parsePositiveId((await params).uid_customer);
  if (!uidCustomer) return errorResponse("Ungültige Kunden-ID.", 400);
  const customer = await prisma.ea_customer.findFirst({
    where: { uid_customer: uidCustomer, user_group: session.userGroup },
  });
  if (!customer) return errorResponse("Kunde nicht gefunden.", 404);
  const [contacts, clients, values] = await Promise.all([
    prisma.ea_contacts.findMany({
      where: { uid_customer: uidCustomer, user_group: session.userGroup },
      orderBy: { last_name: "asc" },
    }),
    prisma.ea_clients.findMany({
      where: { uid_customer: uidCustomer, user_group: session.userGroup },
      orderBy: { last_name: "asc" },
    }),
    prisma.ea_values.findMany({
      where: { type: "ea_customer_payment", user_group: session.userGroup },
      select: { uid_value: true, value: true },
      orderBy: { value: "asc" },
    }),
  ]);
  const payments = values.map(({ uid_value, value }) => {
    const [label, optionValue = label] = (value ?? "missing").split("|||");
    return { uid: uid_value, label, value: optionValue };
  });
  return Response.json({
    customer: { ...customer, ...mailParts(customer.email) },
    contacts,
    clients,
    payments,
  });
}
