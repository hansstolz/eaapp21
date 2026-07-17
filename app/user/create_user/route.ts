import type { ea_userCreateInput } from "@/generated/prisma/models/ea_user";
import { prisma } from "@/lib/prisma";
import { errorResponse, pickDefinedFields, readJsonObject } from "@/lib/route-utils";
import { USER_CREATE_FIELDS } from "@/lib/user-fields";
import { getAuthSession } from "@/lib/auth-session";

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);

  const body = await readJsonObject(request);

  if (!body) {
    return Response.json({ error: "Ungültiger JSON-Body." }, { status: 400 });
  }

  const data = pickDefinedFields<ea_userCreateInput>(body, USER_CREATE_FIELDS);
  data.user_group = session.userGroup;
  const user = await prisma.ea_user.create({
    data: data as ea_userCreateInput,
  });

  return Response.json(user, { status: 201 });
}
