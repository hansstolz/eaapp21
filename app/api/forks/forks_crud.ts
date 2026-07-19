import type { EaForksOverview } from "@/app/data_types/forks/ea_forks_overview";
import type {
  EaForks,
  EaForksDetail,
  EaForksReferences,
  TForkOrder,
} from "@/app/data_types/forks/ea_forks";

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) throw new Error(`Request failed (${response.status}).`);
  return response.json() as Promise<T>;
}

export async function _getForksByCustomer(uidCustomer: number) {
  return request<EaForksOverview[]>(`/forks/get_forks_by_customer_id/${uidCustomer}`);
}

export function _getForkById(uidFork: number) {
  return request<EaForksDetail>(`/forks/get_fork_by_id/${uidFork}`);
}

export function _getForkReferences() {
  return request<EaForksReferences>(`/forks/get_fork_references`);
}

export function _getOrdersByForkId(uidFork: number) {
  return request<TForkOrder[]>(`/forks/get_orders_fork_by_id/${uidFork}`);
}

export function _updateFork(data: EaForks) {
  return request<EaForks | null>(`/forks/update_fork`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
