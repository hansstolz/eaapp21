import type { ea_valuesCreateInput } from "@/generated/prisma/models/ea_values";
import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, pickDefinedFields, readJsonObject } from "@/lib/route-utils";
import { VALUE_FIELDS } from "@/lib/value-fields";
import { isGlobalValueType } from "@/lib/value-access";

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);

  const body = await readJsonObject(request);
  if (!body) return errorResponse("Ungültiger JSON-Body.", 400);

  const data = pickDefinedFields<ea_valuesCreateInput>(body, VALUE_FIELDS);
  if (!isGlobalValueType(data.type)) data.user_group = session.userGroup;
  const value = await prisma.ea_values.create({
    data: data as ea_valuesCreateInput,
  });

  return Response.json(value, { status: 201 });
}
