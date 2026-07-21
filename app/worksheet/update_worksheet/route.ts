import type { Prisma } from "@/generated/prisma/client";
import { worksheetSchema } from "@/app/(startseite)/orders/detail/[id]/Tabs/worksheet/WorksheetSchema";
import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  parsePositiveId,
  readJsonObject,
} from "@/lib/route-utils";

export async function PUT(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const body = await readJsonObject(request);
  if (!body) return errorResponse("Ungültige Daten.", 400);
  const parsed = worksheetSchema.safeParse(body);
  if (!parsed.success) return errorResponse("Ungültige Worksheet-Daten.", 400);
  const uidWorksheet = parsePositiveId(body.uid_worksheet);
  if (!uidWorksheet) return errorResponse("Ungültige Worksheet-ID.", 400);

  const existing = await prisma.ea_worksheet.findFirst({
    where: { uid_worksheet: uidWorksheet },
  });
  if (!existing) return errorResponse("Worksheet nicht gefunden.", 404);
  const order = await prisma.ea_orders.findFirst({
    where: { uid_order: existing.uid_order, user_group: session.userGroup },
    select: { uid_order: true },
  });
  if (!order) return errorResponse("Worksheet nicht gefunden.", 404);

  const data = { ...parsed.data } as Prisma.ea_worksheetUncheckedUpdateInput & Record<string, unknown>;
  delete data.uid_worksheet;
  delete data.uid_order;
  delete data.created_at;
  delete data.updated_at;
  for (const field of ["work_worksheet_date", "worksheet_date"] as const) {
    if (typeof data[field] === "string") data[field] = data[field] ? new Date(data[field]) : null;
  }
  const worksheet = await prisma.ea_worksheet.update({
    where: { uid_worksheet: uidWorksheet },
    data: { ...data, user_group: session.userGroup, updated_at: new Date() },
  });
  return Response.json(worksheet);
}
