type DeletionOrder = {
  order_status: string | null;
  invoice_no: number | null;
  invoice_date: string | Date | null;
};

const deletableStatuses = new Set(["Diagnose", "Costestimate", "CostConfirm", "Worksheet"]);

export function canDeleteOrder(order: DeletionOrder) {
  const status = order.order_status?.split("||")[0];
  return Boolean(status && deletableStatuses.has(status))
    && (order.invoice_no ?? 0) === 0
    && !order.invoice_date;
}
