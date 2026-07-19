import type { EaCustomerOverview } from "@/app/data_types/customer/ea_customer_overview";
import type { TCustForkResult } from "@/app/data_types/customer/ea_customer_fork";
import type { PaginatedProps } from "@/app/data_types/general/tpaginated_props";
import type { EaCustomerMails } from "@/app/schemas/customer/customer_schema";
import type { EaOrdersCustomer } from "@/app/data_types/orders/ea_orders_customer";
import type { EaClients } from "@/app/data_types/clients/ea_clients";
import type { EaContacts } from "@/app/schemas/contacts/contact_schema";

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed (${response.status}).`);
  }
  return response.json() as Promise<T>;
}

export function _getCustomersOverview(props: PaginatedProps<EaCustomerOverview>) {
  const query = new URLSearchParams({
    page: String(props.paginated.page),
    per_page: String(props.paginated.per_page),
    search: props.search,
  });
  return request<TPaginatedResult<EaCustomerOverview>>(
    `/customer/get_customer_overview?${query}`,
  );
}

export function _getCustomerById(uidCustomer: number) {
  return request<{
    customer: EaCustomerMails | null;
    contacts: EaContacts[];
    clients: EaClients[];
    payments: { uid: number; label: string; value: string }[];
  }>(`/customer/get_customer_by_id/${uidCustomer}`);
}

export function _createCustomer(customer: unknown) {
  return request<EaCustomerMails>(`/customer/create_customer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customer),
  });
}

export function _updateCustomer(customer: unknown) {
  return request<EaCustomerMails>(`/customer/update_customer`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customer),
  });
}

export function _getOrdersByCustomer(uidCustomer: number) {
  return request<EaOrdersCustomer[]>(`/customer/get_orders_by_customer_id/${uidCustomer}`);
}

export function _getCustomerForkByIds(uidCustomer: number, uidFork: number) {
  return request<TCustForkResult | null>(
    `/customer/get_customer_fork_by_ids/${uidCustomer}/${uidFork}`,
  );
}
