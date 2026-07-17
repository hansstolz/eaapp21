import type { ea_userUpdateInput } from "@/generated/prisma/models/ea_user";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  parsePositiveId,
  pickDefinedFields,
  readJsonObject,
} from "@/lib/route-utils";
import { USER_UPDATE_FIELDS } from "@/lib/user-fields";
import { getAuthSession } from "@/lib/auth-session";

export async function PUT(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);

  const body = await readJsonObject(request);

  if (!body) return errorResponse("Ungültiger JSON-Body.", 400);

  const uid = parsePositiveId(body.uid_user);

  if (!uid) return errorResponse("Ungültige Benutzer-ID.", 400);

  const existing = await prisma.ea_user.findFirst({
    where: { uid_user: uid, user_group: session.userGroup },
    select: { uid_user: true },
  });

  if (!existing) return errorResponse("Benutzer nicht gefunden.", 404);

  const data = pickDefinedFields<ea_userUpdateInput>(body, USER_UPDATE_FIELDS);
  data.user_group = session.userGroup;
  const user = await prisma.ea_user.update({
    where: { uid_user: uid },
    data,
  });

  return Response.json(user);
}
