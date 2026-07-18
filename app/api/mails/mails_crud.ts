import type { PaginatedProps } from "@/app/data_types/general/tpaginated_props";
import type { EaMailOverview } from "@/app/data_types/mails/mail_overview";
import type { EaMails } from "@/app/data_types/forms/ea_mails";
import type { TCustSup } from "@/app/data_types/mails/cust_sup";

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed (${response.status}).`);
  }
  return response.json() as Promise<T>;
}

export function _getMailsOverview(props: PaginatedProps<EaMailOverview>) {
  const query = new URLSearchParams({
    page: String(props.paginated.page),
    per_page: String(props.paginated.per_page),
    search: props.search,
  });
  return request<TPaginatedResult<EaMailOverview>>(`/mails/get_mails?${query}`);
}

export function _deleteMail(uidMail: number) {
  return request<EaMails>(`/mails/delete_mail/${uidMail}`, { method: "DELETE" });
}

export function _getMailById(uidMail: number) {
  return request<EaMails>(`/mails/get_mail/${uidMail}`);
}

export function _searchCustSup(input: string, type: number) {
  const query = new URLSearchParams({ inp: input, type: String(type) });
  return request<TCustSup[]>(`/search/search_custsup?${query}`);
}

export default _searchCustSup;

export function _createMail(data: { value: unknown; type?: string }) {
  return request<EaMails>(`/mails/create_mail`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data.value),
  });
}

export function _getMailsByCompany(uidCompany: number) {
  return request<EaMails[]>(`/mails/get_mails_by_company_id/${uidCompany}`);
}

export function _getMailsByCustomer(uidCustomer: number) {
  return request<EaMails[]>(`/mails/get_mails_by_customer_id/${uidCustomer}`);
}
