import type { EaPayments } from "@/app/data_types/payments/ea_payments";

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) throw new Error(`Request failed (${response.status}).`);
  return response.json() as Promise<T>;
}

export const _getPayments = (uidOrder: number) =>
  request<EaPayments[]>(`/orders/get_payments_by_order_id/${uidOrder}`);

export const _addPayment = (payment: EaPayments) =>
  request<EaPayments>("/orders/add_payment", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payment),
  });

export const _deletePayment = (uidPayment: number) =>
  request<EaPayments>(`/orders/delete_payment/${uidPayment}`, {
    method: "DELETE",
  });
