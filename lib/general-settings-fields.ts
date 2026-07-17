import type { ea_settingsUpdateInput } from "@/generated/prisma/models/ea_settings";

export const GENERAL_SETTINGS_SELECT = {
  uid_setting: true,
  mail_sender_address: true,
  tax_id: true,
  hint: true,
  height_unit_default: true,
  user_print_language: true,
  address_header: true,
  footer_lists: true,
  nb13: true,
  user_group: true,
  nb24: true,
  fiscal_office: true,
  bank_account: true,
  footer_mails: true,
  value_tax_default: true,
  sender: true,
  weight_unit_default: true,
  value_tax_id: true,
  bank_name: true,
  currency_text: true,
  address_warranty: true,
  email_signature: true,
} as const;

export const GENERAL_SETTINGS_UPDATE_FIELDS = Object.keys(
  GENERAL_SETTINGS_SELECT,
).filter(
  (field): field is Exclude<keyof typeof GENERAL_SETTINGS_SELECT, "uid_setting"> =>
    field !== "uid_setting",
) satisfies (keyof ea_settingsUpdateInput)[];
