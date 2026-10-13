import type { Prisma } from "@/generated/prisma/client";
import { OrderStatus } from "@/app/data_types/orders/order_status";

const stages = [OrderStatus.Diagnose, OrderStatus.Costestimate, OrderStatus.CostestimateConf,
  OrderStatus.Worksheet, OrderStatus.Invoice, OrderStatus.InvoicePaid, OrderStatus.Credit];

export async function advanceOrderStatus(
  db: Pick<Prisma.TransactionClient, "ea_orders">,
  uidOrder: number,
  userGroup: string,
  status: OrderStatus,
  revokeConfirmation = false,
) {
  const allowed = stages.slice(0, stages.indexOf(status) + 1);
  if (revokeConfirmation) allowed.push(OrderStatus.CostestimateConf);
  await db.ea_orders.updateMany({
    where: {
      uid_order: uidOrder, user_group: userGroup,
      OR: [{ order_status: null }, { order_status: "" }, {
        order_status: { in: allowed.flatMap((value) => [value, value.split("||")[0]]) },
      }],
    },
    data: { order_status: status, updated_at: new Date() },
  });
}
