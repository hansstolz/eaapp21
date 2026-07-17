import type { ea_textsUpdateInput } from "@/generated/prisma/models/ea_texts";
import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId, pickDefinedFields, readJsonObject } from "@/lib/route-utils";
import { TEXT_UPDATE_FIELDS } from "@/lib/text-fields";

export async function PUT(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);

  const body = await readJsonObject(request);
  if (!body) return errorResponse("Ungültiger JSON-Body.", 400);

  const uid = parsePositiveId(body.uid_text);
  if (!uid) return errorResponse("Ungültige Text-ID.", 400);

  const existing = await prisma.ea_texts.findFirst({
    where: { uid_text: uid, user_group: session.userGroup },
    select: { uid_text: true },
  });
  if (!existing) return errorResponse("Text nicht gefunden.", 404);

  const data = pickDefinedFields<ea_textsUpdateInput>(body, TEXT_UPDATE_FIELDS);
  data.user_group = session.userGroup;
  const text = await prisma.ea_texts.update({
    where: { uid_text: uid },
    data,
  });

  return Response.json(text);
}
