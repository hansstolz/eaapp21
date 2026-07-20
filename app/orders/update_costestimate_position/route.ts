import type { Prisma } from "@/generated/prisma/client";
import { getAuthSession } from "@/lib/auth-session";
import { findOwnedCostestimate } from "@/lib/order-detail";
import { ORDER_POSITION_FIELDS } from "@/lib/order-position-fields";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId, pickDefinedFields, readJsonObject } from "@/lib/route-utils";

export async function PUT(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const body = await readJsonObject(request);
  if (!body) return errorResponse("Ungültige Daten.", 400);
  const uidPosition = parsePositiveId(body.uid_orders_position);
  if (!uidPosition) return errorResponse("Ungültige Positions-ID.", 400);
  const existing = await prisma.ea_orders_positions.findFirst({
    where: { uid_orders_position: uidPosition },
  });
  if (!existing?.uid_costestimates)
    return errorResponse("Position nicht gefunden.", 404);
  if (!await findOwnedCostestimate(existing.uid_costestimates, session.userGroup))
    return errorResponse("Position nicht gefunden.", 404);
  const data = pickDefinedFields<Prisma.ea_orders_positionsUncheckedUpdateInput>(
    body, ORDER_POSITION_FIELDS,
  );
  delete data.uid_order;
  delete data.uid_costestimates;
  const position = await prisma.ea_orders_positions.update({
    where: { uid_orders_position: uidPosition },
    data: { ...data, user_group: session.userGroup, updated_at: new Date() },
  });
  return Response.json(position);
}
