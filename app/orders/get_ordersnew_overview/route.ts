import type { Prisma } from "@/generated/prisma/client";
import { getAuthSession } from "@/lib/auth-session";
import { exactDate, overviewPagination, paginatedResponse } from "@/lib/orders-overview";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/route-utils";

export async function GET(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);

  const { params, page, perPage } = overviewPagination(request);
  const search = params.get("search")?.trim() ?? "";
  const number = Number(search);
  const date = exactDate(search);
  const searchConditions: Prisma.ea_ordersnew_overviewWhereInput[] = search
    ? [
        { user_group: { contains: search } },
        { fork_model: { contains: search } },
        { warranty_request: { contains: search } },
        { customer_address: { contains: search } },
        { order_status: { contains: search } },
        { customer_client_name: { contains: search } },
        { costestimates_numbers: { contains: search } },
        ...(Number.isInteger(number)
          ? [
              { invoice_no: number },
              { fork_no: number },
              { warranty_no: number },
              { customer_no: number },
              { worksheet_no: number },
              { diagnosis_no: number },
            ]
          : []),
        ...(date ? [{ created_at: date }, { fork_in_date: date }] : []),
      ]
    : [];
  const where: Prisma.ea_ordersnew_overviewWhereInput = {
    user_group: session.userGroup,
    ...(searchConditions.length ? { OR: searchConditions } : {}),
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
