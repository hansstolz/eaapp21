import { getAuthSession } from "@/lib/auth-session";
import { findOwnedOrder } from "@/lib/order-detail";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId, readJsonObject } from "@/lib/route-utils";

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const body = await readJsonObject(request);
  if (!body) return errorResponse("Ungültige Daten.", 400);
  const uidOrder = parsePositiveId(body.uid_order);
  if (!uidOrder) return errorResponse("Ungültige Auftrags-ID.", 400);
  if (!await findOwnedOrder(uidOrder, session.userGroup))
    return errorResponse("Auftrag nicht gefunden.", 404);
  const now = new Date();
  const costestimate = await prisma.ea_orders_costestimates.create({
    data: {
      worker_costestimate: String(body.user ?? ""),
      worker_costestimate_no: 0,
      price_costestimate_total: 0,
      price_costestimate_subtotal: 0,
      costestimate_date: now,
      text_consult_costestimate: "",
      notes_costestimate_extern: "",
      price_costestimate_valuetax: 0,
      costestimate_confirm_check: 0,
      uid_order: uidOrder,
      customer_category_no: Number(body.customer_category_no) || 0,
      user_group: session.userGroup,
      created_at: now, updated_at: now,
    },
  });
  return Response.json(costestimate, { status: 201 });
}
