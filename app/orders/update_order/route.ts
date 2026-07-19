import { getAuthSession } from "@/lib/auth-session";
import { findOwnedOrder, orderUpdateData } from "@/lib/order-detail";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId, readJsonObject } from "@/lib/route-utils";

export async function PUT(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const body = await readJsonObject(request);
  if (!body) return errorResponse("Ungültige Daten.", 400);
  const uidOrder = parsePositiveId(body.uid_order);
  if (!uidOrder) return errorResponse("Ungültige Auftrags-ID.", 400);
  if (!await findOwnedOrder(uidOrder, session.userGroup))
    return errorResponse("Auftrag nicht gefunden.", 404);
  const order = await prisma.ea_orders.update({
    where: { uid_order: uidOrder },
    data: { ...orderUpdateData(body), user_group: session.userGroup, updated_at: new Date() },
  });
  return Response.json(order);
}
