import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId } from "@/lib/route-utils";
import { valueAccessWhere } from "@/lib/value-access";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ uid: string }> },
) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);

  const uid = parsePositiveId((await params).uid);
  if (!uid) return errorResponse("Ungültige Werte-ID.", 400);

  const existing = await prisma.ea_values.findFirst({
    where: valueAccessWhere(uid, session.userGroup),
    select: { uid_value: true },
  });
  if (!existing) return errorResponse("Wert nicht gefunden.", 404);

  await prisma.ea_values.delete({ where: { uid_value: uid } });
  return new Response(null, { status: 204 });
}
