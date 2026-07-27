import { getAuthSession } from "@/lib/auth-session";
import { findOwnedCostestimate } from "@/lib/order-detail";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId } from "@/lib/route-utils";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ uid_orders_texts: string }> },
) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);

  const uidOrdersText = parsePositiveId((await params).uid_orders_texts);
  if (!uidOrdersText) return errorResponse("Ungültige Text-ID.", 400);

  const text = await prisma.ea_orders_texts.findUnique({
    where: { uid_orders_texts: uidOrdersText },
  });
  if (!text?.uid_costestimates)
    return errorResponse("Text nicht gefunden.", 404);

  const costestimate = await findOwnedCostestimate(
    text.uid_costestimates,
    session.userGroup,
  );
  if (!costestimate || costestimate.uid_order !== text.uid_order)
    return errorResponse("Text nicht gefunden.", 404);

  await prisma.ea_orders_texts.delete({
    where: { uid_orders_texts: uidOrdersText },
  });

  return new Response(null, { status: 204 });
}
