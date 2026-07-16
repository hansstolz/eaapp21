import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId } from "@/lib/route-utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ uid_ref_fork: string }> },
) {
  const uidRefFork = parsePositiveId((await params).uid_ref_fork);

  if (!uidRefFork) return errorResponse("Ungültige Referenzgabel-ID.", 400);

  const features = await prisma.ea_ref_parts.findMany({
    where: { uid_ref_fork: uidRefFork },
    orderBy: [{ check_sort: "asc" }, { uid_ref_part: "asc" }],
  });

  return Response.json(features);
}
