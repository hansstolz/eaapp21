"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useOrderStore } from "@/app/stores/order/order_store";
import { useCostestimateStore } from "@/app/stores/costestimate/costestimate_store";
import { calculateOrderTotals } from "@/lib/order-calculation";
import { usePaymentStore } from "@/app/stores/order/PaymentSlice";
import { TabNamesOrder } from "./order-tabs";

const number = new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const cell = "border border-border px-3 py-2";
const numericCell = `${cell} text-right tabular-nums whitespace-nowrap`;
const positionTabs = new Set([TabNamesOrder.Diagnose, TabNamesOrder.Worksheet, TabNamesOrder.Creditnote, TabNamesOrder.Payments, TabNamesOrder.Reminders]);

export default function OrderCalc({ activeTab }: { activeTab: TabNamesOrder }) {
  const { order } = useOrderStore();
  const { positions, costestimate, getConfirmedCostestimate } = useCostestimateStore();
  const payments = usePaymentStore((state) => state.payments);
  const uidOrder = order?.uid_order;
  const showPositions = positionTabs.has(activeTab);

  useEffect(() => {
    if (uidOrder && showPositions) {
      void getConfirmedCostestimate(uidOrder).catch(() => toast.error("Artikelpositionen konnten nicht geladen werden."));
    }
  }, [uidOrder, showPositions, getConfirmedCostestimate]);

  if (!order) return null;
  const data = order.getOrder();
  const currentPositions = costestimate?.uid_order === uidOrder ? positions.filter((position) => position.uid_order === uidOrder) : [];
  const valueTax = data.no_vat ? 0 : Number(data.value_tax ?? 0);
  const { subtotal, tax, total } = calculateOrderTotals(currentPositions, valueTax);
  const rows = [
    { label: "Subtotal", values: subtotal },
    { label: `Value Tax ${number.format(valueTax)} %`, values: tax },
    { label: "Total", values: total },
  ];
  const paid = payments.filter((payment) => payment.uid_order === uidOrder).reduce((sum, payment) => sum + Number(payment.payment_amount ?? 0), 0);
  const customerTotal = (data.customer_category_no === 2 ? total[1] : total[0]) + total[2];
  const outstanding = Math.round((customerTotal - paid + Number.EPSILON) * 100) / 100;

  return (
    <div className="rounded-xl border bg-card p-3 text-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-240 table-fixed border-collapse" aria-label="Artikelpositionen und Auftragssummen">
          <colgroup>
            <col className="w-20" />
            <col />
            <col className="w-72" />
            <col className="w-24" />
            <col className="w-24" />
            <col className="w-24" />
            <col className="w-24" />
          </colgroup>
          <thead className={showPositions ? "bg-muted text-left" : "sr-only"}>
            <tr>{["No", "Code", "Character", "Private", "Dealer", "Warranty", "Quant."].map((label, index) => <th key={label} scope="col" className={index >= 3 ? numericCell : cell}>{label}</th>)}</tr>
          </thead>
          {showPositions && (
            <tbody>
              {currentPositions.map((position) => (
                <tr key={position.uid_orders_position}>
                  <td className={cell}>{position.article_no}</td>
                  <td className={`${cell} break-words`}>{position.articlecode}</td>
                  <td className={`${cell} break-words`}>{position.articlecharacter}</td>
                  {[position.price_single_categ2, position.price_single_categ1, position.price_single_categ3].map((price, index) => <td key={index} className={numericCell}>{number.format(price ?? 0)}</td>)}
                  <td className={numericCell}>{position.quantity}</td>
                </tr>
              ))}
              {!currentPositions.length && <tr><td colSpan={7} className={`${cell} text-muted-foreground`}>Keine Artikelpositionen vorhanden.</td></tr>}
              <tr aria-hidden="true"><td colSpan={7} className="h-4" /></tr>
            </tbody>
          )}
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td colSpan={2} />
                <th scope="row" className={`${cell} bg-muted text-right font-normal`}>{row.label}</th>
                {row.values.map((value, index) => <td key={index} className={`${numericCell} bg-muted`}>{number.format(value ?? 0)}</td>)}
                <td />
              </tr>
            ))}
            <tr>
              <td colSpan={2} />
              <th scope="row" className={`${cell} bg-muted text-right font-normal`}>Outstanding Money</th>
              <td className={`${numericCell} bg-muted font-bold text-red-600`}>{number.format(outstanding)}</td>
              <td className={`${cell} bg-muted`} />
              <td colSpan={2} />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
