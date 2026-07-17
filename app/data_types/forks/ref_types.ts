import { DropdownItem } from "../general/dropdown";
import { EaForksParts } from "./ea_forks";

export type TRefs = {
  refForks: DropdownItem[];
  refCategories: DropdownItem[];
  refColors: DropdownItem[];
  refWheelsizes: DropdownItem[];
};

export type RefTypes = TRefs & {
  parts: EaForksParts[];
};
