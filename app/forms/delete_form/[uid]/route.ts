import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId } from "@/lib/route-utils";
import { getAuthSession } from "@/lib/auth-session";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ uid: string }> },
) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);

  const uid = parsePositiveId((await params).uid);
  if (!uid) return errorResponse("Ungültige Formular-ID.", 400);

  const existing = await prisma.ea_forms_items.findFirst({
    where: { uid_forms_item: uid, user_group: session.userGroup },
    select: { uid_forms_item: true },
  });
  if (!existing) return errorResponse("Formular nicht gefunden.", 404);

  await prisma.ea_forms_items.delete({ where: { uid_forms_item: uid } });
  return new Response(null, { status: 204 });
}
