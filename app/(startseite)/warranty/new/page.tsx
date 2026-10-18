import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import WarrantyDraft from "./WarrantyDraft";

type WarrantyPosition = {
  uid_order: number; uid_orders_position: number; warranty_no: number | null;
  warranty_date: Date | null;
  customer_address: string | null; fork_no: number | null; fork_model: string | null;
  article_group: string | null; price_single_categ3: number; quantity: number;
};

export default async function NewWarrantyPage() {
  const session = await getAuthSession();
  if (!session) redirect("/login");
  const [positions, settings] = await Promise.all([
    prisma.$queryRaw<WarrantyPosition[]>`
      SELECT DISTINCT o.uid_order, p.uid_orders_position,
        w.warranty_no, w.warranty_date,
        o.customer_address, o.fork_no, o.fork_model,
        p.article_group, p.price_single_categ3, p.quantity
      FROM ea_orders AS o
      JOIN ea_orders_costestimates AS c ON o.uid_order = c.uid_order
      JOIN ea_warranty AS w ON o.uid_order = w.uid_order
      JOIN ea_orders_positions AS p ON c.uid_costestimates = p.uid_costestimates
      WHERE o.user_group = ${session.userGroup}
        AND c.costestimate_confirm_check = 1
        AND p.article_warranty_int = 1
        AND w.warranty_invoice_no = 0
      ORDER BY o.uid_order, p.article_group, p.uid_orders_position
    `,
    prisma.ea_settings.findFirst({
      where: { user_group: session.userGroup },
      select: { address_warranty: true },
    }),
  ]);
  // Aggregate each order's positions into the three article-group columns.
  const orders = new Map<number, { position: WarrantyPosition; labor: number; material: number; freight: number; sum: number; seen: Set<number> }>();
  for (const position of positions) {
    const total = orders.get(position.uid_order) ?? {
      position, labor: 0, material: 0, freight: 0, sum: 0, seen: new Set<number>(),
    };
    if (total.seen.has(position.uid_orders_position)) continue;
    total.seen.add(position.uid_orders_position);
    const cents = Math.round(Number(position.price_single_categ3) * Number(position.quantity) * 100);
    const group = position.article_group?.trim().toLowerCase();
    if (group === "labor") total.labor += cents;
    else if (group === "freight") total.freight += cents;
    else total.material += cents;
    total.sum += cents;
    orders.set(position.uid_order, total);
  }
  return <WarrantyDraft address={settings?.address_warranty ?? ""} items={[...orders.values()].map(total => {
    const order = total.position;
    const date = order.warranty_date;
    return {
      id: order.uid_order, no: order.warranty_no,
      date: date ? new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Berlin" }).format(date) : "",
      customer: order.customer_address ?? "", forkNo: order.fork_no, fork: order.fork_model ?? "",
      labor: total.labor / 100, material: total.material / 100,
      freight: total.freight / 100, sum: total.sum / 100,
    };
  })} />;
}
