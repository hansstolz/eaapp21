import type {
  ea_contactsCreateInput,
  ea_contactsUpdateInput,
} from "@/generated/prisma/models/ea_contacts";

export const CONTACT_FIELDS = [
  "height",
  "fax",
  "first_name",
  "fon",
  "streetaddress",
  "last_name",
  "customer_no",
  "job_title",
  "city",
  "email",
  "company_no",
  "fork_no",
  "notes",
  "zip",
  "weight",
  "customerclient_no",
  "check_customer_address",
  "uid_customer",
  "uid_company",
] as const satisfies readonly (
  | keyof ea_contactsCreateInput
  | keyof ea_contactsUpdateInput
)[];

export function contactDisplayName(body: Record<string, unknown>) {
  const lastName = typeof body.last_name === "string" ? body.last_name : "";
  const firstName = typeof body.first_name === "string" ? body.first_name : "";
  return `${lastName} ${firstName}`;
}
