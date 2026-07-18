import type { ea_contactsCreateInput } from "@/generated/prisma/models/ea_contacts";
import { CONTACT_FIELDS, contactDisplayName } from "@/lib/contact-fields";
import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, pickDefinedFields, readJsonObject } from "@/lib/route-utils";

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const body = await readJsonObject(request);
  if (!body) return errorResponse("Ungültige Kontaktdaten.", 400);
  const data = pickDefinedFields<ea_contactsCreateInput>(body, CONTACT_FIELDS);
  data.user_group = session.userGroup;
  data.cal_last_first_name = contactDisplayName(body);
  data.uid_customer = Number(data.uid_customer) || 0;
  data.uid_company = Number(data.uid_company) || 0;
  const contact = await prisma.ea_contacts.create({
    data: data as ea_contactsCreateInput,
  });
  return Response.json(contact, { status: 201 });
}
