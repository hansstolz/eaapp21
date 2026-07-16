import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId } from "@/lib/route-utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ uid_ref_fork: string }> },
) {
  const uidRefFork = parsePositiveId((await params).uid_ref_fork);

  if (!uidRefFork) return errorResponse("Ungültige Referenzgabel-ID.", 400);

  const articles = await prisma.ea_articles_ref_forks.findMany({
    where: { uid_ref_fork: uidRefFork },
    orderBy: { uid_article_ref_forks: "asc" },
  });

  return Response.json(articles);
}
