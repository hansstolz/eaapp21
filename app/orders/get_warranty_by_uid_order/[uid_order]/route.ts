import { getAuthSession } from "@/lib/auth-session";
import { findOwnedOrder } from "@/lib/order-detail";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId } from "@/lib/route-utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ uid_order: string }> },
) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const uidOrder = parsePositiveId((await params).uid_order);
  if (!uidOrder) return errorResponse("Ungültige Auftrags-ID.", 400);
  if (!await findOwnedOrder(uidOrder, session.userGroup))
    return errorResponse("Auftrag nicht gefunden.", 404);
  const warranty = await prisma.ea_warranty.findFirst({
    where: { uid_order: uidOrder, user_group: session.userGroup },
  });
  return Response.json(warranty);
}
