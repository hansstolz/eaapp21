import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/route-utils";

export async function GET(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const params = new URL(request.url).searchParams;
  const page = Math.max(1, Number(params.get("page")) || 1);
  const perPage = Math.min(200, Math.max(1, Number(params.get("per_page")) || 25));
  const search = params.get("search")?.trim() ?? "";
  const where = {
    user_group: session.userGroup,
    ...(search
      ? {
          OR: [
            { articlecode: { contains: search } },
            { category_article: { contains: search } },
            { article_group: { contains: search } },
            { articlecharacter: { contains: search } },
            { company_article_no: { contains: search } },
          ],
        }
      : {}),
  };
  const [totalItems, items] = await Promise.all([
    prisma.ea_articles_overview.count({ where }),
    prisma.ea_articles_overview.findMany({
      where,
      orderBy: { articlecode: "asc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
  ]);
  return Response.json({
    page,
    per_page: perPage,
    total_items: totalItems,
    total_pages: Math.ceil(totalItems / perPage),
    items,
  });
}
