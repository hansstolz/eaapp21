import type {
  ea_ref_forksCreateInput,
  ea_ref_forksUpdateInput,
} from "@/generated/prisma/models/ea_ref_forks";
import type {
  ea_ref_partsCreateInput,
  ea_ref_partsUpdateInput,
} from "@/generated/prisma/models/ea_ref_parts";

export const REF_FORK_CREATE_FIELDS = [
  "year_construction",
  "fork_model",
  "damper",
  "damper_elements",
  "cartridge",
  "weight_lbs",
  "notes",
  "travel",
  "color",
  "cannondale_sn",
  "category_fork",
  "lockout",
  "weight_kg",
  "breakmount",
] as const satisfies readonly (keyof ea_ref_forksCreateInput)[];

export const REF_FORK_UPDATE_FIELDS =
  REF_FORK_CREATE_FIELDS satisfies readonly (keyof ea_ref_forksUpdateInput)[];

export const REF_PART_CREATE_FIELDS = [
  "ref_part_qualitiy",
  "check_sort",
  "ref_part_notes",
  "category_fork",
  "ref_part_name",
  "check_selection",
  "check_character_int",
  "uid_ref_fork",
] as const satisfies readonly (keyof ea_ref_partsCreateInput)[];

export const REF_PART_UPDATE_FIELDS =
  REF_PART_CREATE_FIELDS satisfies readonly (keyof ea_ref_partsUpdateInput)[];
