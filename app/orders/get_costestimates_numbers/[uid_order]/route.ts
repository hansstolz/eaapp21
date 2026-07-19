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
  const costs = await prisma.ea_orders_costestimates.findMany({
    where: { uid_order: uidOrder, user_group: session.userGroup },
    select: { uid_costestimates: true, costestimate_no: true, costestimate_confirm_check: true },
    orderBy: [
      { costestimate_confirm_check: "desc" },
      { costestimate_no: "desc" },
    ],
  });
  return Response.json(costs.map((cost) => ({
    uid: cost.uid_costestimates,
    label: `${cost.costestimate_no ?? 0}. Costestimate`,
    value: String(cost.uid_costestimates),
  })));
}
