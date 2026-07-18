import "server-only";

import { prisma } from "@/lib/prisma";

export type StatisticPeriod = {
  year: number;
  startMonth: number;
  endMonth: number;
  from: Date;
  to: Date;
};

export function getStatisticPeriod(params: {
  year?: string;
  startMonth?: string;
  endMonth?: string;
}): StatisticPeriod {
  const now = new Date();
  const year = validInt(params.year, 2000, 2100) ?? now.getFullYear();
  const startMonth = validInt(params.startMonth, 1, 12) ?? now.getMonth() + 1;
  const requestedEnd = validInt(params.endMonth, 1, 12) ?? startMonth;
  const endMonth = Math.max(startMonth, requestedEnd);

  return {
    year,
    startMonth,
    endMonth,
    from: new Date(year, startMonth - 1, 1),
    to: new Date(year, endMonth, 1),
  };
}

function validInt(value: string | undefined, min: number, max: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= min && parsed <= max
    ? parsed
    : null;
}

const dateWhere = (period: StatisticPeriod) => ({
  gte: period.from,
  lt: period.to,
});

export async function getOpenItems(userGroup: string, period: StatisticPeriod) {
  const orders = await prisma.ea_orders.findMany({
    where: {
      user_group: userGroup,
      invoice_date: dateWhere(period),
      cal_outstanding_money: { gt: 0 },
    },
    select: {
      uid_order: true,
      invoice_date: true,
      invoice_no: true,
      customer_no: true,
      customer_address: true,
      cal_outstanding_money: true,
      cal_amount_price_categ3: true,
    },
    orderBy: { invoice_date: "asc" },
  });

  const today = Date.now();
  return orders.map((order) => ({
    uidOrder: order.uid_order,
    invoiceDate: order.invoice_date,
    invoiceNo: order.invoice_no,
    customerNo: order.customer_no,
    customerAddress: order.customer_address ?? "",
    calOutstandingMoney: order.cal_outstanding_money,
    calAmountPrice: order.cal_amount_price_categ3,
    days: order.invoice_date
      ? Math.max(0, Math.floor((today - order.invoice_date.getTime()) / 86_400_000))
      : 0,
  }));
}

export async function getArticleStatistics(
  userGroup: string,
  period: StatisticPeriod,
) {
  const orders = await prisma.ea_orders.findMany({
    where: {
      user_group: userGroup,
      created_at: dateWhere(period),
      invoice_no: { not: 0 },
    },
    select: { uid_order: true },
  });
  const orderIds = orders.map((order) => order.uid_order);
  if (!orderIds.length) return [];

  const costestimates = await prisma.ea_orders_costestimates.findMany({
    where: {
      uid_order: { in: orderIds },
      costestimate_confirm_check: 1,
    },
    select: { uid_costestimates: true },
  });
  const costestimateIds = costestimates.map(
    (costestimate) => costestimate.uid_costestimates,
  );
  if (!costestimateIds.length) return [];

  const positions = await prisma.ea_orders_positions.findMany({
    where: { uid_costestimates: { in: costestimateIds } },
    select: { articlecode: true, articlecharacter: true },
  });
  const grouped = new Map<
    string,
    { articlecode: string; articlecharacter: string; count: number }
  >();

  for (const position of positions) {
    const articlecode = position.articlecode;
    if (!articlecode) continue;
    const articlecharacter = position.articlecharacter ?? "";
    const groupKey = `${articlecode}\u0000${articlecharacter}`;
    const current = grouped.get(groupKey) ?? {
      articlecode,
      articlecharacter,
      count: 0,
    };
    current.count += 1;
    grouped.set(groupKey, current);
  }

  return [...grouped.values()].sort((a, b) => b.count - a.count);
}

export async function getSalesStatistics(
  userGroup: string,
  period: StatisticPeriod,
) {
  const [orders, warrantyInvoices] = await Promise.all([
    prisma.ea_orders.findMany({
      where: { user_group: userGroup, invoice_date: dateWhere(period) },
      select: {
        uid_order: true,
        uid_ref_fork: true,
        fork_model: true,
        customer_category_no: true,
        invoice_no: true,
        order_status: true,
        fork_no: true,
      },
    }),
    prisma.ea_warranty_invoices.findMany({
      where: {
        user_group: userGroup,
        warranty_invoice_date: dateWhere(period),
      },
      select: { warranty_invoice_no: true },
    }),
  ]);

  const orderIds = orders.map((order) => order.uid_order);
  const orderPositions = orderIds.length
    ? await prisma.ea_orders_positions.findMany({
        where: { uid_order: { in: orderIds } },
        select: {
          uid_order: true,
          quantity: true,
          article_warranty_int: true,
          price_single_categ1: true,
          price_single_categ2: true,
          price_single_categ3: true,
          article_group: true,
        },
      })
    : [];

  const warrantyNumbers = warrantyInvoices
    .map((invoice) => invoice.warranty_invoice_no)
    .filter((number): number is number => number !== null);
  const warrantyRows = warrantyNumbers.length
    ? await prisma.ea_warranty.findMany({
        where: { warranty_invoice_no: { in: warrantyNumbers } },
        select: { uid_order: true },
      })
    : [];
  const warrantyOrderIds = warrantyRows.map((warranty) => warranty.uid_order);
  const warrantyPositions = warrantyOrderIds.length
    ? await prisma.ea_orders_positions.findMany({
        where: {
          uid_order: { in: warrantyOrderIds },
          article_warranty_int: 1,
        },
        select: {
          quantity: true,
          price_single_categ3: true,
          article_group: true,
        },
      })
    : [];

  const sum = <T>(items: T[], value: (item: T) => number) =>
    items.reduce((total, item) => total + value(item), 0);

  const orderMap = new Map(orders.map((order) => [order.uid_order, order]));
  let sumDealer = 0;
  let sumPrivate = 0;
  let sumDealerPaid = 0;
  let sumPrivatePaid = 0;
  let directSalesSum = 0;

  for (const position of orderPositions) {
    if (position.article_warranty_int === 1) continue;
    const order = orderMap.get(position.uid_order);
    if (!order) continue;
    const quantity = position.quantity ?? 0;
    const isPaid = order.order_status?.startsWith("Invoice paid") ?? false;
    const value =
      order.customer_category_no === 1
        ? position.price_single_categ2 * quantity
        : order.customer_category_no === 2
          ? position.price_single_categ1 * quantity
          : 0;

    if (order.customer_category_no === 1) {
      sumPrivate += value;
      if (isPaid) sumPrivatePaid += value;
    } else if (order.customer_category_no === 2) {
      sumDealer += value;
      if (isPaid) sumDealerPaid += value;
    }
    if ((order.fork_no ?? 0) === 0) directSalesSum += value;
  }

  const invoiceOrders = new Map<number, (typeof orders)[number]>();
  for (const order of orders) invoiceOrders.set(order.invoice_no ?? 0, order);
  const countPrivate = [...invoiceOrders.values()].filter(
    (order) => order.customer_category_no === 1,
  ).length;
  const countDealer = [...invoiceOrders.values()].filter(
    (order) => order.customer_category_no === 2,
  ).length;

  const warrantyValue = (group: string) =>
    sum(
      warrantyPositions.filter((position) => position.article_group === group),
      (position) => position.price_single_categ3 * (position.quantity ?? 0),
    );
  const warrantyLabour = warrantyValue("Labor");
  const warrantyMaterial = warrantyValue("Material");
  const warrantyFreight = warrantyValue("Freight");
  const warrantySum = warrantyLabour + warrantyMaterial + warrantyFreight;

  const warrantyIds = new Set(warrantyOrderIds);

  const refIds = [...new Set(orders.map((order) => order.uid_ref_fork).filter(Boolean))];
  const refs = refIds.length
    ? await prisma.ea_ref_forks.findMany({
        where: { uid_ref_fork: { in: refIds } },
        select: { uid_ref_fork: true, category_fork: true, fork_model: true },
      })
    : [];
  const refMap = new Map(refs.map((ref) => [ref.uid_ref_fork, ref]));

  const forkGroups = new Map<
    string,
    { forkModel: string; count: number; invoices: number; warranties: number; revenue: number; invoiceRevenue: number; warrantyRevenue: number }
  >();
  const categoryGroups = new Map<string, number>();
  const modelGroups = new Map<string, number>();
  for (const order of orders) {
    const forkModel = order.fork_model?.trim() || "Unknown";
    const entry = forkGroups.get(forkModel) ?? {
      forkModel,
      count: 0,
      invoices: 0,
      warranties: 0,
      revenue: 0,
      invoiceRevenue: 0,
      warrantyRevenue: 0,
    };
    entry.count += 1;
    const positions = orderPositions.filter(
      (position) => position.uid_order === order.uid_order,
    );
    const invoiceRevenue = sum(positions, (position) => {
      if (position.article_warranty_int === 1) return 0;
      const quantity = position.quantity ?? 0;
      return order.customer_category_no === 1
        ? position.price_single_categ2 * quantity
        : order.customer_category_no === 2
          ? position.price_single_categ1 * quantity
          : 0;
    });
    const warrantyRevenue = sum(
      positions.filter((position) => position.article_warranty_int === 1),
      (position) => position.price_single_categ3 * (position.quantity ?? 0),
    );
    entry.revenue += invoiceRevenue + warrantyRevenue;
    if (warrantyIds.has(order.uid_order)) {
      entry.warranties += 1;
      entry.warrantyRevenue += warrantyRevenue;
    } else {
      entry.invoices += 1;
      entry.invoiceRevenue += invoiceRevenue;
    }
    forkGroups.set(forkModel, entry);

    const ref = refMap.get(order.uid_ref_fork);
    const category = ref?.category_fork?.trim() || "Unknown";
    const model = ref?.fork_model?.trim() || forkModel;
    categoryGroups.set(category, (categoryGroups.get(category) ?? 0) + 1);
    modelGroups.set(model, (modelGroups.get(model) ?? 0) + 1);
  }

  return {
    revenue: {
      countDealer,
      countPrivate,
      sumDealer,
      sumPrivate,
      sumDealerPaid,
      sumPrivatePaid,
      sumPaid: sumDealerPaid + sumPrivatePaid,
      directSalesSum,
    },
    warranty: {
      count: warrantyRows.length,
      sum: warrantySum,
      labour: warrantyLabour,
      material: warrantyMaterial,
      freight: warrantyFreight,
    },
    forks: [...forkGroups.values()].sort((a, b) => b.count - a.count),
    categories: [...categoryGroups].map(([name, count]) => ({ name, count })),
    models: [...modelGroups].map(([name, count]) => ({ name, count })),
  };
}
