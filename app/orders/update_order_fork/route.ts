import { getAuthSession } from "@/lib/auth-session";
import { findOwnedOrder } from "@/lib/order-detail";
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
  const forkInDate = typeof body.fork_in_date === "string" && body.fork_in_date
    ? new Date(body.fork_in_date) : new Date();
  const order = await prisma.ea_orders.update({
    where: { uid_order: uidOrder },
    data: {
      fork_color: body.fork_color as string | null,
      fork_model: body.fork_model as string | null,
      wheelsize: body.wheelsize as string | null,
      customer_client_name: body.customer_client_name as string | null,
      fork_in_carrier: body.fork_in_carrier as string | null,
      fork_in_date: forkInDate,
      updated_at: new Date(),
    },
  });
  return Response.json(order);
}
