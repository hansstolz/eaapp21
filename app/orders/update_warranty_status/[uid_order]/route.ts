import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId, readJsonObject } from "@/lib/route-utils";
import { nextWarrantyNumber } from "@/lib/warranty-detail";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ uid_order: string }> },
) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const uidOrder = parsePositiveId((await params).uid_order);
  const body = await readJsonObject(request);
  if (!uidOrder || !body || !["accept", "no warranty"].includes(String(body.status)))
    return errorResponse("Ungültiger Auftrag oder Warranty-Status.", 400);

  const result = await prisma.$transaction(async (tx) => {
    // Serialize status changes for this order to prevent duplicate warranties.
    const orders = await tx.$queryRaw<{ uid_order: number; fork_model: string | null }[]>`
      SELECT uid_order, fork_model FROM ea_orders
      WHERE uid_order = ${uidOrder} AND user_group = ${session.userGroup}
      FOR UPDATE
    `;
    const order = orders[0];
    if (!order) return { found: false, warranty: null };
    const where = { uid_order: uidOrder, user_group: session.userGroup };
    if (body.status === "no warranty") {
      await tx.ea_warranty.deleteMany({ where });
      return { found: true, warranty: null };
    }
    const existing = await tx.ea_warranty.findFirst({ where });
    if (existing?.warranty_request === "accept" && (existing.warranty_no ?? 0) > 0)
      return { found: true, warranty: existing };
    const now = new Date();
    const data = {
      ...where,
      warranty_no: await nextWarrantyNumber(session.userGroup, tx),
      warranty_request: "accept",
      work_warranty_date: now,
      worker_warranty: session.username,
      wa_fork_model: order.fork_model,
      updated_at: now,
    };
    const warranty = existing
      ? await tx.ea_warranty.update({ where: { uid_warranty: existing.uid_warranty }, data })
      : await tx.ea_warranty.create({ data: { ...data, warranty_reason: "", created_at: now } });
    return { found: true, warranty };
  });
  if (!result.found) return errorResponse("Auftrag nicht gefunden.", 404);
  return Response.json(result.warranty);
}
