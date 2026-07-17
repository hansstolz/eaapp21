import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId } from "@/lib/route-utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ uid: string }> },
) {
  const uid = parsePositiveId((await params).uid);

  if (!uid) return errorResponse("Ungültige Benutzer-ID.", 400);

  const user = await prisma.ea_user.findUnique({
    where: { uid_user: uid },
  });

  if (!user) return errorResponse("Benutzer nicht gefunden.", 404);

  return Response.json(user);
}
