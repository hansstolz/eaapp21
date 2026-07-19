import type { EaOrder } from "@/app/data_types/orders/ea_order";
import type {
  EaOrdersCustomerUpdate,
  EaOrdersForkUpdate,
} from "@/app/data_types/orders/ea_orders_customer";
import type { OrderStatus } from "@/app/data_types/orders/order_status";
import type { TDocument } from "@/app/data_types/documents/tdocument";

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed (${response.status}).`);
  }
  return response.json() as Promise<T>;
}

const json = (method: "POST" | "PUT", data: unknown): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

export const _getOrderById = (uidOrder: number) =>
  request<EaOrder>(`/orders/get_order_by_id/${uidOrder}`);

export const _getDocumentBy = (orderNo: number) =>
  request<TDocument[]>(`/orders/get_documents?order_no=${orderNo}`);

export const _updateOrder = (data: EaOrder) =>
  request<EaOrder>("/orders/update_order", json("PUT", data));

export const _updateOrderCustomer = (data: EaOrdersCustomerUpdate) =>
  request<EaOrder>("/orders/update_order_customer", json("PUT", data));

export const _updateOrderFork = (data: EaOrdersForkUpdate) =>
  request<EaOrder>("/orders/update_order_fork", json("PUT", data));

export const _updateOrderStatus = (
  uidOrder: number,
  orderStatus: OrderStatus,
) => request<EaOrder>(
  "/orders/update_orderstatus",
  json("PUT", { uid_order: uidOrder, order_status: orderStatus }),
);
