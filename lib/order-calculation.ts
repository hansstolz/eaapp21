import type { EaOrdersPosition } from "@/app/data_types/orders/ea_orders_position";

const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export function calculateOrderTotals(positions: EaOrdersPosition[], valueTax: number) {
  const subtotalCents = [0, 0, 0];
  for (const position of positions) {
    const prices = [position.price_single_categ2, position.price_single_categ1, position.price_single_categ3];
    prices.forEach((price, index) => {
      // Warranty positions belong to the warranty column; all other positions
      // contribute to the private and dealer price comparison.
      if ((position.customer_category_no === 3) !== (index === 2)) return;
      subtotalCents[index] += Math.round((Number(price ?? 0) * Number(position.quantity ?? 0) + Number.EPSILON) * 100);
    });
  }
  const subtotal = subtotalCents.map((value) => value / 100);
  const tax = subtotal.map((value) => roundMoney(value * valueTax / 100));
  const total = subtotal.map((value, index) => roundMoney(value + tax[index]));
  return { subtotal, tax, total };
}
