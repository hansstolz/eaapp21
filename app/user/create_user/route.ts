import type { ea_userCreateInput } from "@/generated/prisma/models/ea_user";
import { prisma } from "@/lib/prisma";
import { pickDefinedFields, readJsonObject } from "@/lib/route-utils";
import { USER_CREATE_FIELDS } from "@/lib/user-fields";

export async function POST(request: Request) {
  const body = await readJsonObject(request);

  if (!body) {
    return Response.json({ error: "Ungültiger JSON-Body." }, { status: 400 });
  }

  const data = pickDefinedFields<ea_userCreateInput>(body, USER_CREATE_FIELDS);
  const user = await prisma.ea_user.create({
    data: data as ea_userCreateInput,
  });

  return Response.json(user, { status: 201 });
}
