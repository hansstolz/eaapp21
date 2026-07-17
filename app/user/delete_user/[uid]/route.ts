import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId } from "@/lib/route-utils";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ uid: string }> },
) {
  const uid = parsePositiveId((await params).uid);

  if (!uid) return errorResponse("Ungültige Benutzer-ID.", 400);

  const existing = await prisma.ea_user.findUnique({
    where: { uid_user: uid },
    select: { uid_user: true },
  });

  if (!existing) return errorResponse("Benutzer nicht gefunden.", 404);

  await prisma.ea_user.delete({ where: { uid_user: uid } });

  return new Response(null, { status: 204 });
}
