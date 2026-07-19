import type { Prisma } from "@/generated/prisma/client";
import { getAuthSession } from "@/lib/auth-session";
import { COSTESTIMATE_UPDATE_FIELDS } from "@/lib/costestimate-fields";
import { findOwnedCostestimate } from "@/lib/order-detail";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId, pickDefinedFields, readJsonObject } from "@/lib/route-utils";

export async function PUT(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const body = await readJsonObject(request);
  if (!body) return errorResponse("Ungültige Daten.", 400);
  const uid = parsePositiveId(body.uid_costestimates);
  if (!uid) return errorResponse("Ungültige Costestimate-ID.", 400);
  if (!await findOwnedCostestimate(uid, session.userGroup))
    return errorResponse("Costestimate nicht gefunden.", 404);
  const data = pickDefinedFields<Prisma.ea_orders_costestimatesUncheckedUpdateInput>(
    body, COSTESTIMATE_UPDATE_FIELDS,
  );
  for (const field of ["costestimate_date", "confirmed_when"] as const) {
    const value = data[field];
    if (typeof value === "string") data[field] = value ? new Date(value) : null;
  }
  const costestimate = await prisma.ea_orders_costestimates.update({
    where: { uid_costestimates: uid }, data: { ...data, updated_at: new Date() },
  });
  return Response.json(costestimate);
}
