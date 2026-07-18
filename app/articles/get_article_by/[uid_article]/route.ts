import { getArticleOptions } from "@/lib/article-options";
import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId } from "@/lib/route-utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ uid_article: string }> },
) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const uidArticle = parsePositiveId((await params).uid_article);
  if (!uidArticle) return errorResponse("Ungültige Artikel-ID.", 400);
  const article = await prisma.ea_articles.findFirst({
    where: { uid_article: uidArticle, user_group: session.userGroup },
  });
  if (!article) return errorResponse("Artikel nicht gefunden.", 404);
  const options = await getArticleOptions(session.userGroup);
  return Response.json({ ...article, ...options, picture_show: null });
}
