import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId } from "@/lib/route-utils";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ uid_contact: string }> },
) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const uidContact = parsePositiveId((await params).uid_contact);
  if (!uidContact) return errorResponse("Ungültige Kontakt-ID.", 400);
  const contact = await prisma.ea_contacts.findFirst({
    where: { uid_contact: uidContact, user_group: session.userGroup },
  });
  if (!contact) return errorResponse("Kontakt nicht gefunden.", 404);
  await prisma.ea_contacts.delete({ where: { uid_contact: uidContact } });
  return Response.json(contact);
}
