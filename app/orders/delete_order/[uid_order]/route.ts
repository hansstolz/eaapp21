import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId } from "@/lib/route-utils";
import { canDeleteOrder } from "@/lib/order-deletion";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ uid_order: string }> },
) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const uidOrder = parsePositiveId((await params).uid_order);
  if (!uidOrder) return errorResponse("Ungültige Auftrags-ID.", 400);

  const deleted = await prisma.$transaction(async (tx) => {
    const orders = await tx.$queryRaw<{
      uid_order: number; order_no: number | null; order_status: string | null;
      invoice_no: number | null; invoice_date: Date | null;
    }[]>`
      SELECT uid_order, order_no, order_status, invoice_no, invoice_date FROM ea_orders
      WHERE uid_order = ${uidOrder} AND user_group = ${session.userGroup}
      FOR UPDATE
    `;
    if (!orders.length) return "missing";
    if (!canDeleteOrder(orders[0])) return "blocked";
    const where = { uid_order: uidOrder };
    await tx.ea_orders_positions.deleteMany({ where });
    await tx.ea_orders_texts.deleteMany({ where });
    await tx.ea_orders_costestimates.deleteMany({ where });
    await tx.ea_diagnosis.deleteMany({ where });
    await tx.ea_worksheet.deleteMany({ where });
    await tx.ea_credit.deleteMany({ where });
    await tx.ea_warranty.deleteMany({ where });
    await tx.ea_payments.deleteMany({ where });
    await tx.$executeRaw`DELETE FROM ea_orders_temp WHERE uid_order = ${uidOrder}`;
    if (orders[0].order_no && orders[0].order_no > 0) {
      await tx.ea_documents.deleteMany({
        where: { order_no: orders[0].order_no, user_group: session.userGroup },
      });
    }
    await tx.ea_orders.delete({ where: { uid_order: uidOrder } });
    return "deleted";
  });
  if (deleted === "missing") return errorResponse("Auftrag nicht gefunden.", 404);
  if (deleted === "blocked")
    return errorResponse("Löschen ist nur bis einschließlich Worksheet und ohne erstellte Rechnung erlaubt.", 409);
  return Response.json({ success: true });
}
