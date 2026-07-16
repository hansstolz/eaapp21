import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId } from "@/lib/route-utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ uid_ref_fork: string }> },
) {
  const uidRefFork = parsePositiveId((await params).uid_ref_fork);

  if (!uidRefFork) return errorResponse("Ungültige Referenzgabel-ID.", 400);

  const refFork = await prisma.ea_ref_forks.findUnique({
    where: { uid_ref_fork: uidRefFork },
  });

  if (!refFork) return errorResponse("Referenzgabel nicht gefunden.", 404);

  return Response.json(refFork);
}
