import { DropdownItem } from "../general/dropdown";
import { EaRefForks } from "../ref_forks/ref_forks";

export type EaForksParts = {
  created_at: Date | null;
  uid_fork: number;
  category_fork: string | null;
  uid_ref_fork: number;
  updated_at: Date | null;
  uid_forks_part: number;
  check_sort: number | null;
  forks_part_notes: string | null;
  forks_part_name: string | null;
  forks_part_quality: string | null;
  check_selection: number | null;
};

export type EaRefForksAndParts = EaRefForks & {
  fork_parts: DropdownItem[];
};
