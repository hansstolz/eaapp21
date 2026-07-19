import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId } from "@/lib/route-utils";
import { findOwnedWarranty, nextWarrantyNumber } from "@/lib/warranty-detail";

export async function PUT(
  _request: Request,
  { params }: { params: Promise<{ uid_warranty: string }> },
) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const uidWarranty = parsePositiveId((await params).uid_warranty);
  if (!uidWarranty) return errorResponse("Ungültige Warranty-ID.", 400);
  if (!await findOwnedWarranty(uidWarranty, session.userGroup))
    return errorResponse("Warranty nicht gefunden.", 404);
  const warrantyNo = await nextWarrantyNumber(session.userGroup);
  const warranty = await prisma.ea_warranty.update({
    where: { uid_warranty: uidWarranty },
    data: { warranty_no: warrantyNo, warranty_request: "accept", updated_at: new Date() },
  });
  return Response.json(warranty);
}
