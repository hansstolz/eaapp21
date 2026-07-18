import type { ea_contactsUpdateInput } from "@/generated/prisma/models/ea_contacts";
import { CONTACT_FIELDS, contactDisplayName } from "@/lib/contact-fields";
import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId, pickDefinedFields, readJsonObject } from "@/lib/route-utils";

export async function PUT(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const body = await readJsonObject(request);
  if (!body) return errorResponse("Ungültige Kontaktdaten.", 400);
  const uidContact = parsePositiveId(body.uid_contact);
  if (!uidContact) return errorResponse("Ungültige Kontakt-ID.", 400);
  const existing = await prisma.ea_contacts.findFirst({
    where: { uid_contact: uidContact, user_group: session.userGroup },
    select: { uid_contact: true },
  });
  if (!existing) return errorResponse("Kontakt nicht gefunden.", 404);
  const data = pickDefinedFields<ea_contactsUpdateInput>(body, CONTACT_FIELDS);
  data.user_group = session.userGroup;
  data.cal_last_first_name = contactDisplayName(body);
  const contact = await prisma.ea_contacts.update({
    where: { uid_contact: uidContact },
    data,
  });
  return Response.json(contact);
}
