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
            { company: { contains: search } },
            { street_address: { contains: search } },
            { city: { contains: search } },
            { company_customer_no: { contains: search } },
          ],
        }
      : {}),
  };
  const [totalItems, items] = await Promise.all([
    prisma.ea_companies_overview.count({ where }),
    prisma.ea_companies_overview.findMany({
      where,
      orderBy: { company: "asc" },
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
