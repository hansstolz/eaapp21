import { getAuthSession } from "@/lib/auth-session";
import { findOwnedCostestimate } from "@/lib/order-detail";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId } from "@/lib/route-utils";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ uid_position: string }> },
) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const uidPosition = parsePositiveId((await params).uid_position);
  if (!uidPosition) return errorResponse("Ungültige Positions-ID.", 400);
  const position = await prisma.ea_orders_positions.findFirst({
    where: { uid_orders_position: uidPosition },
  });
  if (!position?.uid_costestimates)
    return errorResponse("Position nicht gefunden.", 404);
  if (!await findOwnedCostestimate(position.uid_costestimates, session.userGroup))
    return errorResponse("Position nicht gefunden.", 404);
  await prisma.ea_orders_positions.delete({
    where: { uid_orders_position: uidPosition },
  });
  return Response.json(position);
}
