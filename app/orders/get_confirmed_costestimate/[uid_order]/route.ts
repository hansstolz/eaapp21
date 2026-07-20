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
  const costestimate = await prisma.ea_orders_costestimates.findFirst({
    where: {
      uid_order: uidOrder,
      costestimate_confirm_check: 1,
    },
  });
  if (!costestimate) return Response.json(null);
  const [rawPositions, texts] = await Promise.all([
    prisma.ea_orders_positions.findMany({
      where: {
        uid_costestimates: costestimate.uid_costestimates,
      },
      orderBy: { uid_orders_position: "asc" },
    }),
    prisma.ea_orders_texts.findMany({
      where: {
        uid_costestimates: costestimate.uid_costestimates,
      },
      orderBy: { uid_orders_texts: "asc" },
    }),
  ]);
  const positions = rawPositions.map((position, index) => ({
    ...position, lfd: index + 1,
  }));
  return Response.json({ ...costestimate, positions, texts });
}
