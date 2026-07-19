import type { EaWarranty } from "@/app/data_types/warranty/ea_warranty";

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) throw new Error(`Request failed (${response.status}).`);
  return response.json() as Promise<T>;
}

export const _getWarrantyBy = (uidOrder: number) =>
  request<EaWarranty | null>(`/orders/get_warranty_by_uid_order/${uidOrder}`);
export const _updateWarrantyNumber = (uidWarranty: number) =>
  request<EaWarranty>(`/orders/update_warranty_number/${uidWarranty}`, { method: "PUT" });
export const _resetWarrantyNumber = (uidWarranty: number) =>
  request<EaWarranty>(`/orders/reset_warranty_number/${uidWarranty}`, { method: "PUT" });
export const _updateWarrantyReason = (data: { uid_warranty: number; warranty_reason: string }) =>
  request<EaWarranty>("/orders/update_warranty_reason", {
    method: "PUT", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
