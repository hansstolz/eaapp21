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
  const where: Prisma.ea_warranty_invoicesWhereInput = {
    user_group: session.userGroup,
    warranty_invoice_no: { gt: 0 },
    ...(search ? { OR: [
      { address_warranty: { contains: search } },
      { warranty_invoice_status: { contains: search } },
      { warranty_invoice_text: { contains: search } },
      ...(Number.isSafeInteger(number) && number >= 0 && number <= 2147483647
        ? [{ warranty_invoice_no: number }] : []),
      ...(date ? [{ warranty_invoice_date: date }, { payment_date: date }] : []),
    ] } : {}),
  };
  const [totalItems, items] = await Promise.all([
    prisma.ea_warranty_invoices.count({ where }),
    prisma.ea_warranty_invoices.findMany({
      where, orderBy: [{ warranty_invoice_date: "desc" }, { uid_warranty_invoice: "desc" }],
      skip: (page - 1) * perPage, take: perPage,
    }),
  ]);
  return paginatedResponse(page, perPage, totalItems, items);
}
