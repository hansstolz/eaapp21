import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import ArticleSalesClient from "./ArticleSalesClient";

export default async function ArticleSalesPage() {
  const session = await getAuthSession();
  const customers = session ? await prisma.ea_customer.findMany({
    where: { user_group: session.userGroup },
    select: {
      uid_customer: true, customer_no: true, cal_name_list: true,
      street_address: true, city: true, category_customer: true,
    },
    orderBy: { customer_no: "desc" },
    take: 30,
  }) : [];
  return <ArticleSalesClient initialCustomers={customers} />;
}
