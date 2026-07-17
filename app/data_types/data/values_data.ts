import { IconType } from "react-icons";

export type DropdownItem = {
  label: string;
  value: string | number;
  icon?: IconType;
};

export const valueMap = new Map<string, DropdownItem[]>([
  [
    "Forks",
    [
      { value: "ea_forks_category", label: "Category" },
      { value: "ea_forks_use", label: "Use" },
      { value: "ea_forks_settings", label: "Settings" },
      { value: "ea_forks_color", label: "Color" },
      { value: "ea_value_ws", label: "Wheelsize" },
    ],
  ],

  ["Customer", [{ value: "ea_customer_payment", label: "Customer" }]],
  ["Article", [{ value: "ea_articles_category", label: "Article" }]],

  ["Order", [{ value: "ea_value_tax", label: "Order" }]],
  ["ReferenceFork", [{ value: "ea_ref_forks_parts", label: "Reference Fork" }]],
  [
    "Diagnose",
    [
      { value: "ea_value_sb", label: "Shockboot" },
      { value: "ea_value_hs", label: "Headset" },
      { value: "ea_value_di", label: "Dial" },
      { value: "ea_value_ts", label: "Teleskope" },
      { value: "ea_value_car", label: "Cartridge" },
      { value: "ea_value_air", label: "Air" },
    ],
  ],
]);
