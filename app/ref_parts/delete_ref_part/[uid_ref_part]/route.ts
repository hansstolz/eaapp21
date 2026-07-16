import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId } from "@/lib/route-utils";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ uid_ref_part: string }> },
) {
  const uidRefPart = parsePositiveId((await params).uid_ref_part);

  if (!uidRefPart) return errorResponse("Ungültige Feature-ID.", 400);

  const existing = await prisma.ea_ref_parts.findUnique({
    where: { uid_ref_part: uidRefPart },
    select: { uid_ref_part: true },
  });

  if (!existing) return errorResponse("Feature nicht gefunden.", 404);

  await prisma.ea_ref_parts.delete({ where: { uid_ref_part: uidRefPart } });

  return new Response(null, { status: 204 });
}
