import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId } from "@/lib/route-utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ uid: string }> },
) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);

  const uid = parsePositiveId((await params).uid);
  if (!uid) return errorResponse("Ungültige Text-ID.", 400);

  const text = await prisma.ea_texts.findFirst({
    where: { uid_text: uid, user_group: session.userGroup },
  });
  if (!text) return errorResponse("Text nicht gefunden.", 404);

  return Response.json(text);
}
