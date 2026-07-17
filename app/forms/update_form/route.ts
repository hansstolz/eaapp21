import type { ea_forms_itemsUpdateInput } from "@/generated/prisma/models/ea_forms_items";
import { FORM_UPDATE_FIELDS } from "@/lib/forms-fields";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId, pickDefinedFields, readJsonObject } from "@/lib/route-utils";
import { getAuthSession } from "@/lib/auth-session";

export async function PUT(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);

  const body = await readJsonObject(request);
  if (!body) return errorResponse("Ungültiger JSON-Body.", 400);

  const uid = parsePositiveId(body.uid_forms_item);
  if (!uid) return errorResponse("Ungültige Formular-ID.", 400);

  const existing = await prisma.ea_forms_items.findFirst({
    where: { uid_forms_item: uid, user_group: session.userGroup },
    select: { uid_forms_item: true },
  });
  if (!existing) return errorResponse("Formular nicht gefunden.", 404);

  const data = pickDefinedFields<ea_forms_itemsUpdateInput>(body, FORM_UPDATE_FIELDS);
  data.user_group = session.userGroup;
  const form = await prisma.ea_forms_items.update({
    where: { uid_forms_item: uid },
    data,
  });

  return Response.json(form);
}
