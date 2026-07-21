import type { WorksheetForm } from "@/app/(startseite)/orders/detail/[id]/Tabs/worksheet/WorksheetSchema";
import type { DropdownItem } from "@/app/data_types/data/values_data";

export type WorksheetDetail = {
  worksheet: WorksheetForm | null;
  compr_in: DropdownItem[];
  neg_spring: DropdownItem[];
  oil_viscosity: DropdownItem[];
  coil_spring: DropdownItem[];
  air_pressure: DropdownItem[];
};

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed (${response.status}).`);
  }
  return response.json() as Promise<T>;
}

export const _getWorksheetByUidOrder = (uidOrder: number) =>
  request<WorksheetDetail>(`/worksheet/get_worksheet_by_uid_order/${uidOrder}`);

export const _updateWorksheet = (data: WorksheetForm) =>
  request<WorksheetForm>("/worksheet/update_worksheet", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
