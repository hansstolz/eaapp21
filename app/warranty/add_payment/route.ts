import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId, readJsonObject } from "@/lib/route-utils";
import { paymentCents, remainingWarrantyCents } from "@/lib/warranty-payment";

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const body = await readJsonObject(request);
  const id = parsePositiveId(body?.uid_warranty_invoice);
  const cents = paymentCents(body?.amount);
  const date = body?.payment_date;
  if (!id || !cents || typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date))
    return errorResponse("Bitte einen gültigen Betrag und ein gültiges Datum eingeben.", 400);
  const paymentDate = new Date(`${date}T00:00:00.000Z`);
  if (!Number.isFinite(paymentDate.getTime()) || paymentDate.toISOString().slice(0, 10) !== date)
    return errorResponse("Ungültiges Zahlungsdatum.", 400);

  return prisma.$transaction(async tx => {
    const invoice = await tx.ea_warranty_invoices.findFirst({
      where: { uid_warranty_invoice: id, user_group: session.userGroup, warranty_invoice_no: { gt: 0 } },
    });
    if (!invoice) return errorResponse("Warranty-Rechnung nicht gefunden.", 404);
    const remaining = remainingWarrantyCents(invoice.total_price_warranty, invoice.total_payment_warranty);
    if (!remaining) return errorResponse("Die Rechnung ist bereits vollständig bezahlt.", 409);
    if (cents > remaining) return errorResponse("Der Betrag darf den offenen Betrag nicht überschreiten.", 400);
    const paid = (Math.round(invoice.total_payment_warranty * 100) + cents) / 100;
    const open = (remaining - cents) / 100;
    const updated = await tx.ea_warranty_invoices.updateMany({
      where: { uid_warranty_invoice: id, user_group: session.userGroup,
        total_payment_warranty: invoice.total_payment_warranty, total_price_warranty: invoice.total_price_warranty },
      data: { total_payment_warranty: paid, open_price_warranty: open, payment_date: paymentDate, updated_at: new Date() },
    });
    if (!updated.count) return errorResponse("Die Rechnung wurde zwischenzeitlich geändert. Bitte neu laden.", 409);
    return Response.json({ ...invoice, total_payment_warranty: paid, open_price_warranty: open, payment_date: paymentDate });
  });
}
