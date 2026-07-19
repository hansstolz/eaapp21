import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId } from "@/lib/route-utils";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ uid_payment: string }> },
) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const uidPayment = parsePositiveId((await params).uid_payment);
  if (!uidPayment) return errorResponse("Ungültige Zahlungs-ID.", 400);
  const payment = await prisma.ea_payments.findFirst({
    where: { uid_payment: uidPayment, user_group: session.userGroup },
  });
  if (!payment) return errorResponse("Zahlung nicht gefunden.", 404);
  await prisma.ea_payments.delete({ where: { uid_payment: uidPayment } });
  return Response.json(payment);
}
