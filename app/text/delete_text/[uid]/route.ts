import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId } from "@/lib/route-utils";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ uid: string }> },
) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);

  const uid = parsePositiveId((await params).uid);
  if (!uid) return errorResponse("Ungültige Text-ID.", 400);

  const existing = await prisma.ea_texts.findFirst({
    where: { uid_text: uid, user_group: session.userGroup },
    select: { uid_text: true },
  });
  if (!existing) return errorResponse("Text nicht gefunden.", 404);

  await prisma.ea_texts.delete({ where: { uid_text: uid } });
  return new Response(null, { status: 204 });
}
