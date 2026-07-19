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
  const payment = await prisma.ea_payments.create({
    data: {
      payment_amount: Number(body.payment_amount) || 0,
      payment_user: body.payment_user as string | null,
      payment_currency: body.payment_currency as string | null,
      payment_note: body.payment_note as string | null,
      payment_date: typeof body.payment_date === "string" && body.payment_date
        ? new Date(body.payment_date) : null,
      user_print_language: body.user_print_language as string | null,
      user_group: session.userGroup,
      uid_order: uidOrder,
      created_at: new Date(), updated_at: new Date(),
    },
  });
  return Response.json(payment, { status: 201 });
}
