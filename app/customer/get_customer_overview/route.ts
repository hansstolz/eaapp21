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
  const customerNo = Number(search);
  const where = {
    user_group: session.userGroup,
    ...(search
      ? {
          OR: [
            { cal_name_list: { contains: search } },
            { street_address: { contains: search } },
            { city: { contains: search } },
            { category_customer: { contains: search } },
            ...(Number.isInteger(customerNo) ? [{ customer_no: customerNo }] : []),
          ],
        }
      : {}),
  };
  const select = {
    uid_customer: true, customer_no: true, cal_name_list: true,
    street_address: true, city: true, zip_postal_code: true, fon: true,
    email: true, category_customer: true, user_group: true,
  } as const;
  const [totalItems, items] = await Promise.all([
    prisma.ea_customer.count({ where }),
    prisma.ea_customer.findMany({
      where,
      select,
      orderBy: { cal_name_list: "asc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
  ]);
  return Response.json({
    page, per_page: perPage, total_items: totalItems,
    total_pages: Math.ceil(totalItems / perPage), items,
  });
}
