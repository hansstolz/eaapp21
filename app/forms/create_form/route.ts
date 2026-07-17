import type { ea_forms_itemsCreateInput } from "@/generated/prisma/models/ea_forms_items";
import { FORM_FIELDS } from "@/lib/forms-fields";
import { prisma } from "@/lib/prisma";
import { errorResponse, pickDefinedFields, readJsonObject } from "@/lib/route-utils";
import { getAuthSession } from "@/lib/auth-session";

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);

  const body = await readJsonObject(request);
  if (!body) return errorResponse("Ungültiger JSON-Body.", 400);

  const data = pickDefinedFields<ea_forms_itemsCreateInput>(body, FORM_FIELDS);
  data.user_group = session.userGroup;
  const form = await prisma.ea_forms_items.create({
    data: data as ea_forms_itemsCreateInput,
  });

  return Response.json(form, { status: 201 });
}
