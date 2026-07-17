import type { ea_userUpdateInput } from "@/generated/prisma/models/ea_user";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  parsePositiveId,
  pickDefinedFields,
  readJsonObject,
} from "@/lib/route-utils";
import { USER_UPDATE_FIELDS } from "@/lib/user-fields";

export async function PUT(request: Request) {
  const body = await readJsonObject(request);

  if (!body) return errorResponse("Ungültiger JSON-Body.", 400);

  const uid = parsePositiveId(body.uid_user);

  if (!uid) return errorResponse("Ungültige Benutzer-ID.", 400);

  const existing = await prisma.ea_user.findUnique({
    where: { uid_user: uid },
    select: { uid_user: true },
  });

  if (!existing) return errorResponse("Benutzer nicht gefunden.", 404);

  const data = pickDefinedFields<ea_userUpdateInput>(body, USER_UPDATE_FIELDS);
  const user = await prisma.ea_user.update({
    where: { uid_user: uid },
    data,
  });

  return Response.json(user);
}
