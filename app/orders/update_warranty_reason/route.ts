import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId, readJsonObject } from "@/lib/route-utils";
import { findOwnedWarranty } from "@/lib/warranty-detail";

export async function PUT(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const body = await readJsonObject(request);
  if (!body) return errorResponse("Ungültige Daten.", 400);
  const uidWarranty = parsePositiveId(body.uid_warranty);
  if (!uidWarranty) return errorResponse("Ungültige Warranty-ID.", 400);
  if (!await findOwnedWarranty(uidWarranty, session.userGroup))
    return errorResponse("Warranty nicht gefunden.", 404);
  const warranty = await prisma.ea_warranty.update({
    where: { uid_warranty: uidWarranty },
    data: {
      warranty_reason: body.warranty_reason as string | null,
      updated_at: new Date(),
    },
  });
  return Response.json(warranty);
}
