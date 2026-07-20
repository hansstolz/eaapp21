import type { Prisma } from "@/generated/prisma/client";

export const DIAGNOSIS_UPDATE_FIELDS = [
  "worker_diagnosis_no", "check_air", "check_cartridge", "check_dial",
  "check_headset", "check_shockboot", "check_telescope", "customer_height",
  "customer_weight", "diagnosis_no", "fork_invoice_date", "fork_setting",
  "fork_use", "notes_diagnosis_extern", "notes_intern",
  "notes_warranty_extern", "printstatus_diagnosis", "warranty_request",
  "work_diagnosis_time_end", "work_diagnosis_time_start", "worker_diagnosis",
  "work_diagnosis_date", "diagnosis_date", "check_extras",
] as const satisfies readonly (keyof Prisma.ea_diagnosisUncheckedUpdateInput)[];

export const DIAGNOSIS_DATE_FIELDS = [
  "fork_invoice_date", "work_diagnosis_time_end", "work_diagnosis_time_start",
  "work_diagnosis_date", "diagnosis_date",
] as const;

export function diagnosisDropdown(uid: number, value: string | null) {
  const [label, itemValue = label] = (value ?? "missing").split("|||");
  return { uid, label, value: itemValue };
}
