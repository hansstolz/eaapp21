import type { EaDiagnosis } from "@/app/data_types/diagnosis/ea_diagnosis";
import type { TValuesDiagnosis } from "@/app/data_types/diagnosis/values_diagnosis";

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed (${response.status}).`);
  }
  return response.json() as Promise<T>;
}

export const _getValuesDiagnosis = () =>
  request<TValuesDiagnosis>("/values/get_values_diagnosis");

export const _getDiagnosisByUidOrder = (uidOrder: number) =>
  request<EaDiagnosis | null>(`/diagnosis/get_diagnosis_by_uid_order/${uidOrder}`);

export const _updateDiagnosis = (data: EaDiagnosis) =>
  request<EaDiagnosis>("/diagnosis/update_diagnosis", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
