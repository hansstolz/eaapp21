import type { ea_valuesUpdateInput } from "@/generated/prisma/models/ea_values";
import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId, pickDefinedFields, readJsonObject } from "@/lib/route-utils";
import { VALUE_UPDATE_FIELDS } from "@/lib/value-fields";
import {
  isGlobalValueType,
  valueAccessWhere,
} from "@/lib/value-access";

export async function PUT(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);

  const body = await readJsonObject(request);
  if (!body) return errorResponse("Ungültiger JSON-Body.", 400);

  const uid = parsePositiveId(body.uid_value);
  if (!uid) return errorResponse("Ungültige Werte-ID.", 400);

  const existing = await prisma.ea_values.findFirst({
    where: valueAccessWhere(uid, session.userGroup),
    select: { uid_value: true, type: true },
  });
  if (!existing) return errorResponse("Wert nicht gefunden.", 404);

  const data = pickDefinedFields<ea_valuesUpdateInput>(body, VALUE_UPDATE_FIELDS);
  const resultingType = data.type ?? existing.type;
  if (!isGlobalValueType(resultingType)) data.user_group = session.userGroup;
  const value = await prisma.ea_values.update({
    where: { uid_value: uid },
    data,
  });

  return Response.json(value);
}
