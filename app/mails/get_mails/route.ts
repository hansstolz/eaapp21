import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/route-utils";

export async function GET(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);

  const params = new URL(request.url).searchParams;
  const page = Math.max(1, Number(params.get("page")) || 1);
  const perPage = Math.min(100, Math.max(1, Number(params.get("per_page")) || 25));
  const search = params.get("search")?.trim() ?? "";
  const where = {
    user_group: session.userGroup,
    mail_date: { not: null },
    ...(search
      ? { OR: [{ subject: { contains: search } }, { customer: { contains: search } }] }
      : {}),
  };

  const [totalItems, items] = await Promise.all([
    prisma.ea_mails.count({ where }),
    prisma.ea_mails.findMany({
      where,
      select: {
        uid_mail: true,
        mail_date: true,
        user_group: true,
        customer: true,
        subject: true,
        mail_status: true,
        company: true,
      },
      orderBy: { mail_date: "desc" },
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
