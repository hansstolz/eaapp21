import type {
  ea_customerCreateInput,
  ea_customerUpdateInput,
} from "@/generated/prisma/models/ea_customer";

export const CUSTOMER_FIELDS = [
  "region", "customer_no", "mobile", "fax", "customer_no_rel", "order_no",
  "fork_no", "check_export_ups", "city", "company", "zip_postal_code",
  "weight", "height", "first_name", "bank_name", "birthday", "country",
  "memo", "mailing", "last_name", "internet", "fork_setup", "bank_account",
  "bank_payment", "phonelist", "fon", "street_address", "bank_id", "bike_no",
  "customerclient_no", "mail_salut", "category_customer", "mail_no",
  "delivery_address", "customer_cannondale_no", "vat_no", "uid_mail",
  "check_email_int", "cal_email_find", "cal_name_vl", "ftsearch",
] as const satisfies readonly (
  | keyof ea_customerCreateInput
  | keyof ea_customerUpdateInput
)[];

export function calculatedCustomerFields(body: Record<string, unknown>) {
  const text = (value: unknown) => (typeof value === "string" ? value : "");
  const company = text(body.company);
  const calNameList = company || `${text(body.last_name)} ${text(body.first_name)}`.trim();
  const vatNo = text(body.vat_no);
  const email = [body.mail1, body.mail2, body.mail3].map(text).join(";");
  return {
    cal_name_list: calNameList,
    cal_address: `${calNameList}\n${text(body.street_address)}\n${text(body.zip_postal_code)} ${text(body.city)}`,
    email,
    customer_category_no: body.category_customer === "Dealer" ? 2 : 1,
    no_vat: vatNo ? 1 : 0,
  };
}

export function mailParts(email: string | null) {
  const parts = email?.split(";") ?? [];
  return {
    mail1: parts[0] ?? "",
    mail2: parts[1] ?? "",
    mail3: parts[2] ?? "",
  };
}
