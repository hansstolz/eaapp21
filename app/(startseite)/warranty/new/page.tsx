import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import WarrantyDraft from "./WarrantyDraft";

type WarrantyTotal = {
  warranty_no: number;
  warranty_date: Date;
  customer_address: string | null; fork_no: number | null; fork_model: string | null;
  labor: Prisma.Decimal | null; material: Prisma.Decimal | null;
  freight: Prisma.Decimal | null; sum: Prisma.Decimal | null;
};

export default async function NewWarrantyPage() {
  const session = await getAuthSession();
  if (!session) redirect("/login");
  const [items, settings] = await Promise.all([
    prisma.$queryRaw<WarrantyTotal[]>`
      SELECT w.warranty_no, w.warranty_date,
        o.customer_address, o.fork_no, o.fork_model,
        SUM(CASE WHEN p.article_group = 'Labor' THEN p.price_single_categ3 * p.quantity ELSE 0 END) AS labor,
        SUM(CASE WHEN p.article_group = 'Material' THEN p.price_single_categ3 * p.quantity ELSE 0 END) AS material,
        SUM(CASE WHEN p.article_group = 'Freight' THEN p.price_single_categ3 * p.quantity ELSE 0 END) AS freight,
        SUM(p.price_single_categ3 * p.quantity) AS sum
      FROM ea_warranty AS w
      JOIN ea_orders_costestimates AS c ON c.uid_order = w.uid_order
      JOIN ea_orders_positions AS p ON p.uid_costestimates = c.uid_costestimates
      JOIN ea_orders AS o ON o.uid_order = w.uid_order
      WHERE c.costestimate_confirm_check = 1
        AND w.warranty_invoice_no = 0
        AND w.warranty_date IS NOT NULL
        AND w.user_group = ${session.userGroup}
        AND w.warranty_no > 0
      GROUP BY w.warranty_no, w.warranty_date,
        o.customer_address, o.fork_no, o.fork_model
      ORDER BY w.warranty_no
    `,
    prisma.ea_settings.findFirst({
      where: { user_group: session.userGroup },
      select: { address_warranty: true },
    }),
  ]);
  return <WarrantyDraft address={settings?.address_warranty ?? ""} items={items.map((item, index) => ({
    id: index, no: item.warranty_no,
    date: new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Berlin" }).format(item.warranty_date),
    customer: item.customer_address ?? "", forkNo: item.fork_no, fork: item.fork_model ?? "",
    labor: Number(item.labor ?? 0), material: Number(item.material ?? 0),
    freight: Number(item.freight ?? 0), sum: Number(item.sum ?? 0),
  }))} />;
}
