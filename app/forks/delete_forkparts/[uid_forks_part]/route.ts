import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId } from "@/lib/route-utils";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ uid_forks_part: string }> },
) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const uidPart = parsePositiveId((await params).uid_forks_part);
  if (!uidPart) return errorResponse("Ungültige Feature-ID.", 400);
  const part = await prisma.ea_forks_parts.findUnique({
    where: { uid_forks_part: uidPart },
  });
  if (!part) return errorResponse("Fork-Feature nicht gefunden.", 404);
  const fork = await prisma.ea_forks.findFirst({
    where: { uid_fork: part.uid_fork, user_group: session.userGroup },
    select: { uid_fork: true },
  });
  if (!fork) return errorResponse("Fork-Feature nicht gefunden.", 404);
  await prisma.ea_forks_parts.delete({ where: { uid_forks_part: uidPart } });
  return Response.json(part);
}
