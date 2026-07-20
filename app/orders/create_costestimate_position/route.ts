import type { Prisma } from "@/generated/prisma/client";
import { getAuthSession } from "@/lib/auth-session";
import { findOwnedCostestimate } from "@/lib/order-detail";
import { ORDER_POSITION_FIELDS } from "@/lib/order-position-fields";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId, pickDefinedFields, readJsonObject } from "@/lib/route-utils";

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const body = await readJsonObject(request);
  if (!body) return errorResponse("Ungültige Daten.", 400);
  const uidCostestimate = parsePositiveId(body.uid_costestimates);
  if (!uidCostestimate) return errorResponse("Ungültige Costestimate-ID.", 400);
  const costestimate = await findOwnedCostestimate(uidCostestimate, session.userGroup);
  if (!costestimate) return errorResponse("Costestimate nicht gefunden.", 404);
  const data = pickDefinedFields<Prisma.ea_orders_positionsUncheckedCreateInput>(
    body, ORDER_POSITION_FIELDS,
  );
  const position = await prisma.ea_orders_positions.create({
    data: {
      ...data,
      uid_order: costestimate.uid_order,
      uid_costestimates: uidCostestimate,
      user_group: session.userGroup,
      created_at: new Date(), updated_at: new Date(),
    } as Prisma.ea_orders_positionsUncheckedCreateInput,
  });
  return Response.json(position, { status: 201 });
}
