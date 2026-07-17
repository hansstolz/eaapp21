import type { ea_textsCreateInput } from "@/generated/prisma/models/ea_texts";
import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, pickDefinedFields, readJsonObject } from "@/lib/route-utils";
import { TEXT_FIELDS } from "@/lib/text-fields";

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);

  const body = await readJsonObject(request);
  if (!body) return errorResponse("Ungültiger JSON-Body.", 400);

  const data = pickDefinedFields<ea_textsCreateInput>(body, TEXT_FIELDS);
  data.user_group = session.userGroup;
  const text = await prisma.ea_texts.create({
    data: data as ea_textsCreateInput,
  });

  return Response.json(text, { status: 201 });
}
