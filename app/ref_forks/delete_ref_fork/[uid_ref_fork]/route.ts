import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId } from "@/lib/route-utils";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ uid_ref_fork: string }> },
) {
  const uidRefFork = parsePositiveId((await params).uid_ref_fork);

  if (!uidRefFork) return errorResponse("Ungültige Referenzgabel-ID.", 400);

  const existing = await prisma.ea_ref_forks.findUnique({
    where: { uid_ref_fork: uidRefFork },
    select: { uid_ref_fork: true },
  });

  if (!existing) return errorResponse("Referenzgabel nicht gefunden.", 404);

  await prisma.ea_ref_forks.delete({
    where: { uid_ref_fork: uidRefFork },
  });

  return new Response(null, { status: 204 });
}
