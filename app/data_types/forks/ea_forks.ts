import { DropdownItem } from "../general/dropdown";

export type EaForks = {
  uid_customer: number;
  customer_no: number | null;
  order_no: string | null;
  fork_no: number | null;
  user_group: string | null;
  memo: string | null;
  customer: string | null;
  uid_client: number;
  uid_fork: number;
  fork_model: string | null;
  category_fork: string | null;
  colour: string | null;
  wheelsize: string | null;
  uid_ref_fork: number;
  client_name: string | null;
  cartridge: string | null;
  setting: string | null;
  url: string | null;
  bike: string | null;
  year_construction: number | null;
  customer_name: string | null;
  brakemount: string | null;
};

export type EaForksParts = {
  uid_forks_part: number;
  check_sort: number | null;
  forks_part_notes: string | null;
  category_fork: string | null;
  forks_part_name: string | null;
  forks_part_quality: string | null;
  check_selection: number | null;
  uid_ref_fork: number;
  uid_fork: number;
};

export type EaForksDetail = {
  fork: EaForks;
  parts: EaForksParts[];
};

export type EaForksReferences = {
  ref_forks: DropdownItem[];
  ref_categories: DropdownItem[];
  ref_colors: DropdownItem[];
  ref_wheelsizes: DropdownItem[];
};

export type RefHandlerTypes =
  | "fork_model"
  | "category_fork"
  | "colour"
  | "wheelsize";

export type TForkOrder = {
  uid_order: number;
  invoice_date: String | null;
  customer_no: number | null;
  customer_name: string | null;
  customer_client_name: string | null;
  fork_in_date: String | null;
};
