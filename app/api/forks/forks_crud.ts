import type { EaForksOverview } from "@/app/data_types/forks/ea_forks_overview";
import type { PaginatedProps } from "@/app/data_types/general/tpaginated_props";
import type { EaForkDialog } from "@/app/schemas/forks/fork_schema_dialog";
import type { EaForkHistory } from "@/app/data_types/forks/ea_fork_history";
import type {
  EaForks,
  EaForksDetail,
  EaForksReferences,
  TForkOrder,
} from "@/app/data_types/forks/ea_forks";

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed (${response.status}).`);
  }
  return response.json() as Promise<T>;
}

export function _getForksOverview(props: PaginatedProps<EaForksOverview>) {
  const query = new URLSearchParams({
    page: String(props.paginated.page),
    per_page: String(props.paginated.per_page),
    search: props.search,
  });
  return request<TPaginatedResult<EaForksOverview>>(
    `/forks/get_forks_overview?${query}`,
  );
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

export function _updateForkOrder(data: EaForkDialog) {
  return request<EaForks | null>(`/forks/update_fork_order`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      uid_fork: data.uid_fork,
      client_name: data.client_name,
      fork_no: data.fork_no,
      fork_model: data.fork_model,
      colour: data.colour,
      wheelsize: data.wheelsize,
      category_fork: data.category_fork,
    }),
  });
}

export function _getForksHistoryByForkId(uidFork: number) {
  return request<EaForkHistory[]>(`/forks/get_fork_history/${uidFork}`);
}
