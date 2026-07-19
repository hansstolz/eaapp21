import type { EaOrdersOverview } from "@/app/data_types/orders/ea_orders_overview";

async function request<T>(input: string): Promise<T> {
  const response = await fetch(input);
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed (${response.status}).`);
  }
  return response.json() as Promise<T>;
}

export function _getOrdersOverviewPagninated(
  page: number,
  pageSize: number,
  search: string,
) {
  const query = new URLSearchParams({
    page: String(page),
    per_page: String(pageSize),
    search,
  });
  return request<TPaginatedResult<EaOrdersOverview>>(
    `/orders/get_ordersnew_overview?${query}`,
  );
}

export function _getOrdersnewOverviewByStatus(
  page: number,
  pageSize: number,
  status: string,
) {
  const query = new URLSearchParams({
    page: String(page),
    per_page: String(pageSize),
    status,
  });
  return request<TPaginatedResult<EaOrdersOverview>>(
    `/orders/get_ordersnew_overview_by_status?${query}`,
  );
}
