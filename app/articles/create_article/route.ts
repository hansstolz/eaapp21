import type { ea_articlesCreateInput } from "@/generated/prisma/models/ea_articles";
import { ARTICLE_FIELDS } from "@/lib/article-fields";
import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, pickDefinedFields, readJsonObject } from "@/lib/route-utils";

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const body = await readJsonObject(request);
  if (!body) return errorResponse("Ungültige Artikel-Daten.", 400);
  const data = pickDefinedFields<ea_articlesCreateInput>(body, ARTICLE_FIELDS);
  data.user_group = session.userGroup;
  const article = await prisma.ea_articles.create({
    data: data as ea_articlesCreateInput,
  });
  return Response.json(article, { status: 201 });
}
