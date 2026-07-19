import type { Prisma } from "@/generated/prisma/client";
import { getAuthSession } from "@/lib/auth-session";
import { overviewPagination, paginatedResponse } from "@/lib/orders-overview";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/route-utils";

export async function GET(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);

  const { params, page, perPage } = overviewPagination(request);
  const status = params.get("status")?.trim() ?? "";
  const statusPrefix = status === "Invoice" ? "invoice||" : status;
  const where: Prisma.ea_ordersnew_overviewWhereInput = {
    user_group: session.userGroup,
    ...(statusPrefix
      ? { order_status: { startsWith: statusPrefix } }
      : {}),
  };
  const [totalItems, items] = await Promise.all([
    prisma.ea_ordersnew_overview.count({ where }),
    prisma.ea_ordersnew_overview.findMany({
      where,
      orderBy: { uid_order: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
  ]);
  return paginatedResponse(page, perPage, totalItems, items);
}
