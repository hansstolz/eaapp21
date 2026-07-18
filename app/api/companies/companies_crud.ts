import type { EaCompaniesDetail } from "@/app/data_types/companies/ea_companies";
import type { EaCompanyOverview } from "@/app/data_types/companies/ea_companies_overview";
import type { PaginatedProps } from "@/app/data_types/general/tpaginated_props";
import type { EaCompanies } from "@/app/schemas/companies/company_schema";

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed (${response.status}).`);
  }
  return response.json() as Promise<T>;
}

export function _getCompaniesOverview(props: PaginatedProps<EaCompanyOverview>) {
  const query = new URLSearchParams({
    page: String(props.paginated.page),
    per_page: String(props.paginated.per_page),
    search: props.search,
  });
  return request<TPaginatedResult<EaCompanyOverview>>(
    `/companies/get_companies_overview?${query}`,
  );
}

export function _getCompanyById(uidCompany: number) {
  return request<EaCompaniesDetail>(`/companies/get_company_by_id/${uidCompany}`);
}

export function _createCompany(data: EaCompanies) {
  return request<EaCompanies>(`/companies/create_company`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function _updateCompany(data: EaCompanies) {
  return request<EaCompanies>(`/companies/update_company`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
