import type { ea_customerCreateInput } from "@/generated/prisma/models/ea_customer";
import { calculatedCustomerFields, CUSTOMER_FIELDS, mailParts } from "@/lib/customer-fields";
import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, pickDefinedFields, readJsonObject } from "@/lib/route-utils";

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const body = await readJsonObject(request);
  if (!body) return errorResponse("Ungültige Kundendaten.", 400);
  const data = pickDefinedFields<ea_customerCreateInput>(body, CUSTOMER_FIELDS);
  Object.assign(data, calculatedCustomerFields(body));
  data.user_group = session.userGroup;
  const customer = await prisma.ea_customer.create({
    data: data as ea_customerCreateInput,
  });
  return Response.json({ ...customer, ...mailParts(customer.email) }, { status: 201 });
}
