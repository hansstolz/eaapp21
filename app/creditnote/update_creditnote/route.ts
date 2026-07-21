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
  const date = typeof body.creditnote_date === "string" && body.creditnote_date
    ? new Date(body.creditnote_date)
    : body.creditnote_date instanceof Date ? body.creditnote_date : null;
  const values = {
    worker_creditnote: typeof body.worker_creditnote === "string" ? body.worker_creditnote : null,
    creditnote_date: date,
    user_group: session.userGroup,
    updated_at: new Date(),
  };
  const existing = await prisma.ea_credit.findFirst({ where: { uid_order: uidOrder } });
  const creditnote = existing
    ? await prisma.ea_credit.update({ where: { uid_credit: existing.uid_credit }, data: values })
    : await prisma.ea_credit.create({ data: { ...values, uid_order: uidOrder, created_at: new Date() } });
  return Response.json(creditnote);
}
