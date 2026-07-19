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
  const number = Number(search);
  const where = {
    user_group: session.userGroup,
    ...(search ? { OR: [
      { fork_model: { contains: search } },
      { customer_name: { contains: search } },
      ...(Number.isInteger(number)
        ? [{ fork_no: number }, { customer_no: number }]
        : []),
    ] } : {}),
  };
  const select = {
    uid_fork: true, fork_no: true, fork_model: true, colour: true,
    customer_name: true, customer_no: true, client_name: true,
    category_fork: true, user_group: true,
  } as const;
  const [totalItems, items] = await Promise.all([
    prisma.ea_forks.count({ where }),
    prisma.ea_forks.findMany({
      where, select, orderBy: { fork_no: "desc" },
      skip: (page - 1) * perPage, take: perPage,
    }),
  ]);
  return Response.json({
    page, per_page: perPage, total_items: totalItems,
    total_pages: Math.ceil(totalItems / perPage), items,
  });
}
