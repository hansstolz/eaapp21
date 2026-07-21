import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId } from "@/lib/route-utils";

const VALUE_TYPES = {
  compr_in: "ea_compr_in",
  neg_spring: "ea_value_ns",
  oil_viscosity: "ea_value_ov",
  coil_spring: "ea_value_cs",
  air_pressure: "ea_value_ap",
} as const;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ uid_order: string }> },
) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const uidOrder = parsePositiveId((await params).uid_order);
  if (!uidOrder) return errorResponse("Ungültige Auftrags-ID.", 400);

  const order = await prisma.ea_orders.findFirst({
    where: { uid_order: uidOrder, user_group: session.userGroup },
    select: { uid_order: true },
  });
  if (!order) return errorResponse("Auftrag nicht gefunden.", 404);

  const [worksheet, ...valueGroups] = await Promise.all([
    prisma.ea_worksheet.findFirst({ where: { uid_order: uidOrder } }),
    ...Object.values(VALUE_TYPES).map((type) =>
      prisma.ea_values.findMany({
        where: { type, user_group: session.userGroup },
        select: { uid_value: true, value: true },
        orderBy: { value: "asc" },
      }),
    ),
  ]);
  const entries = Object.keys(VALUE_TYPES).map((key, index) => [
    key,
    valueGroups[index].map((item) => ({
      value: item.value ?? item.uid_value,
      label: item.value ?? "",
    })),
  ]);
  return Response.json({ worksheet, ...Object.fromEntries(entries) });
}
