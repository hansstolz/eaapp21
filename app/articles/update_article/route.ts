import type { ea_articlesUpdateInput } from "@/generated/prisma/models/ea_articles";
import { ARTICLE_FIELDS } from "@/lib/article-fields";
import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId, pickDefinedFields, readJsonObject } from "@/lib/route-utils";

export async function PUT(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const body = await readJsonObject(request);
  if (!body) return errorResponse("Ungültige Artikel-Daten.", 400);
  const uidArticle = parsePositiveId(body.uid_article);
  if (!uidArticle) return errorResponse("Ungültige Artikel-ID.", 400);
  const existing = await prisma.ea_articles.findFirst({
    where: { uid_article: uidArticle, user_group: session.userGroup },
    select: { uid_article: true },
  });
  if (!existing) return errorResponse("Artikel nicht gefunden.", 404);
  const data = pickDefinedFields<ea_articlesUpdateInput>(body, ARTICLE_FIELDS);
  data.user_group = session.userGroup;
  const article = await prisma.ea_articles.update({
    where: { uid_article: uidArticle },
    data,
  });
  return Response.json(article);
}
