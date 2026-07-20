import { getAuthSession } from "@/lib/auth-session";
import { findOwnedCostestimate } from "@/lib/order-detail";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId } from "@/lib/route-utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ uid_costestimates: string }> },
) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const uid = parsePositiveId((await params).uid_costestimates);
  if (!uid) return errorResponse("Ungültige Costestimate-ID.", 400);
  const costestimate = await findOwnedCostestimate(uid, session.userGroup);
  if (!costestimate) return errorResponse("Costestimate nicht gefunden.", 404);
  const [positions, texts] = await Promise.all([
    prisma.ea_orders_positions.findMany({
      where: { uid_costestimates: uid },
      orderBy: { uid_orders_position: "asc" },
    }),
    prisma.ea_orders_texts.findMany({
      where: { uid_costestimates: uid },
      orderBy: { uid_orders_texts: "asc" },
    }),
  ]);
  return Response.json({ costestimate, positions, texts });
}
