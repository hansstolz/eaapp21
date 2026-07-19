import type { Prisma } from "@/generated/prisma/client";

export const FORK_UPDATE_FIELDS = [
  "client_name", "customer", "cartridge", "setting", "url", "bike",
  "customer_no", "year_construction", "rel_forks_clients", "fork_no",
  "fork_id", "fork_model", "customer_name", "brakemount", "cannondale_sn",
  "colour", "order_no", "wheelsize", "category_fork", "orders_amount_calc",
  "order_no_rel", "file_name", "memo", "uid_client", "uid_customer",
  "uid_ref_fork",
] as const satisfies readonly (keyof Prisma.ea_forksUncheckedUpdateInput)[];

export const FORK_ORDER_UPDATE_FIELDS = [
  "client_name", "fork_no", "fork_model", "colour", "wheelsize",
  "category_fork",
] as const satisfies readonly (keyof Prisma.ea_forksUncheckedUpdateInput)[];

export const FORK_PART_FIELDS = [
  "check_sort", "forks_part_notes", "category_fork", "forks_part_name",
  "forks_part_quality", "check_selection", "uid_ref_fork", "uid_fork",
] as const satisfies readonly (keyof Prisma.ea_forks_partsUncheckedUpdateInput)[];

export function dropdownValue(uid: number, value: string | null) {
  const [label, itemValue = label] = (value ?? "missing").split("|||");
  return { uid, label, value: itemValue };
}
