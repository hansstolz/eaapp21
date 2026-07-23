import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/route-utils";

export async function GET(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const search = new URL(request.url).searchParams.get("search")?.trim() ?? "";
  const customerNo = Number(search);
  const customers = await prisma.ea_customer.findMany({
    where: {
      user_group: session.userGroup,
      ...(search ? { OR: [
        { cal_name_list: { contains: search } },
        { street_address: { contains: search } },
        { city: { contains: search } },
        ...(Number.isInteger(customerNo) ? [{ customer_no: customerNo }] : []),
      ] } : {}),
    },
    select: {
      uid_customer: true, customer_no: true, cal_name_list: true,
      street_address: true, city: true, category_customer: true,
    },
    orderBy: { customer_no: "desc" },
    take: 30,
  });
  return Response.json(customers);
}
