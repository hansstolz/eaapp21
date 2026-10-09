import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId, readJsonObject } from "@/lib/route-utils";
import { warrantyFormSchema } from "@/lib/warranty-form";

export async function PUT(request: Request, { params }: { params: Promise<{ uid_warranty: string }> }) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const uidWarranty = parsePositiveId((await params).uid_warranty);
  const parsed = warrantyFormSchema.safeParse(await readJsonObject(request));
  if (!uidWarranty || !parsed.success) return errorResponse("Ungültige Warranty-Daten.", 400);
  const value = parsed.data.work_warranty_date;
  const workDate = value ? new Date(value) : null;
  if (workDate && Number.isNaN(workDate.getTime())) return errorResponse("Ungültiges Datum.", 400);
  const warranty = await prisma.ea_warranty.updateMany({
    where: { uid_warranty: uidWarranty, user_group: session.userGroup, warranty_request: "accept" },
    data: { ...parsed.data, work_warranty_date: workDate, updated_at: new Date() },
  });
  if (!warranty.count) return errorResponse("Akzeptierte Warranty nicht gefunden.", 404);
  return Response.json({ success: true });
}
