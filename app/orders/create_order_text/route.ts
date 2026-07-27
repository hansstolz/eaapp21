import type { Prisma } from "@/generated/prisma/client";
import { getAuthSession } from "@/lib/auth-session";
import { findOwnedCostestimate } from "@/lib/order-detail";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  parsePositiveId,
  readJsonObject,
} from "@/lib/route-utils";

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);

  const body = await readJsonObject(request);
  if (!body) return errorResponse("Ungültige Daten.", 400);

  const uidCostestimate = parsePositiveId(body.uid_costestimates);
  const uidOrder = parsePositiveId(body.uid_order);
  const type = Number(body.type);
  const textNo = Number(body.text_no);
  const text = typeof body.text === "string" ? body.text : "";

  if (!uidCostestimate || !uidOrder)
    return errorResponse("Ungültige Auftragsdaten.", 400);
  if (!Number.isInteger(type) || type < 0)
    return errorResponse("Ungültiger Texttyp.", 400);
  if (!text.trim()) return errorResponse("Text darf nicht leer sein.", 400);

  const costestimate = await findOwnedCostestimate(
    uidCostestimate,
    session.userGroup,
  );
  if (!costestimate || costestimate.uid_order !== uidOrder)
    return errorResponse("Costestimate nicht gefunden.", 404);

  const now = new Date();
  const orderText = await prisma.ea_orders_texts.create({
    data: {
      type,
      text_no: Number.isInteger(textNo) ? textNo : 0,
      text,
      uid_order: uidOrder,
      uid_costestimates: uidCostestimate,
      created_at: now,
      updated_at: now,
    } satisfies Prisma.ea_orders_textsUncheckedCreateInput,
  });

  return Response.json(orderText, { status: 201 });
}
