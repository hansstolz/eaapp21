import { IconType } from "react-icons";

export type DropdownItem = {
  uid: string | number;
  label: string;
  value: string | number;
  icon?: IconType;
};
