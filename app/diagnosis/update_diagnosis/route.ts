import type { Prisma } from "@/generated/prisma/client";
import { getAuthSession } from "@/lib/auth-session";
import { DIAGNOSIS_DATE_FIELDS, DIAGNOSIS_UPDATE_FIELDS } from "@/lib/diagnosis-fields";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId, pickDefinedFields, readJsonObject } from "@/lib/route-utils";

export async function PUT(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const body = await readJsonObject(request);
  if (!body) return errorResponse("Ungültige Daten.", 400);
  const uidDiagnosis = parsePositiveId(body.uid_diagnosis);
  if (!uidDiagnosis) return errorResponse("Ungültige Diagnose-ID.", 400);
  const existing = await prisma.ea_diagnosis.findFirst({
    where: { uid_diagnosis: uidDiagnosis, user_group: session.userGroup },
  });
  if (!existing) return errorResponse("Diagnose nicht gefunden.", 404);
  const order = await prisma.ea_orders.findFirst({
    where: { uid_order: existing.uid_order, user_group: session.userGroup },
    select: { uid_order: true },
  });
  if (!order) return errorResponse("Diagnose nicht gefunden.", 404);
  const data = pickDefinedFields<Prisma.ea_diagnosisUncheckedUpdateInput>(
    body, DIAGNOSIS_UPDATE_FIELDS,
  );
  for (const field of DIAGNOSIS_DATE_FIELDS) {
    const value = data[field];
    if (typeof value === "string") data[field] = value ? new Date(value) : null;
  }
  const diagnosis = await prisma.ea_diagnosis.update({
    where: { uid_diagnosis: uidDiagnosis },
    data: { ...data, user_group: session.userGroup, updated_at: new Date() },
  });
  return Response.json(diagnosis);
}
