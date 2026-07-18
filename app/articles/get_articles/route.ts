import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/route-utils";

export async function GET(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const search = new URL(request.url).searchParams.get("search")?.trim() ?? "";
  const articles = await prisma.ea_articles.findMany({
    where: {
      user_group: session.userGroup,
      active: 1,
      ...(search
        ? {
            OR: [
              { articlecode: { contains: search } },
              { articlecharacter: { contains: search } },
              { company_article_no: { contains: search } },
            ],
          }
        : {}),
    },
    orderBy: { articlecode: "asc" },
  });
  return Response.json(articles);
}
