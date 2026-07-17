import type {
  ea_userCreateInput,
  ea_userUpdateInput,
} from "@/generated/prisma/models/ea_user";

export const USER_CREATE_FIELDS = [
  "mail_work",
  "country",
  "jobday_first",
  "user_name",
  "user_rights",
  "user_password",
  "user_group",
  "notes",
  "salutation",
  "suid_user",
  "mail_home",
  "name",
  "firstname",
  "titel",
  "company_name",
  "street_no",
  "postal_zip",
  "city",
] as const satisfies readonly (keyof ea_userCreateInput)[];

export const USER_UPDATE_FIELDS =
  USER_CREATE_FIELDS satisfies readonly (keyof ea_userUpdateInput)[];
