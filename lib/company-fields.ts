import type {
  ea_companiesCreateInput,
  ea_companiesUpdateInput,
} from "@/generated/prisma/models/ea_companies";

export const COMPANY_FIELDS = [
  "bank_name",
  "country",
  "street_address",
  "fax",
  "mobile",
  "company_no",
  "notes",
  "email",
  "first_name",
  "company_no_rel",
  "bank_payment",
  "bank_account",
  "zip_postal_code",
  "category_company",
  "city",
  "company_customer_no",
  "bank_id",
  "company",
  "internet",
  "fon",
  "last_name",
  "mail_salut",
  "uid_mail",
  "cal_email_find",
] as const satisfies readonly (
  | keyof ea_companiesCreateInput
  | keyof ea_companiesUpdateInput
)[];

export function calculatedCompanyFields(data: Record<string, unknown>) {
  const join = (values: unknown[], separator: string) =>
    values
      .filter((value): value is string => typeof value === "string" && value.length > 0)
      .join(separator);
  const calNameList = join(
    [data.company, data.last_name, data.first_name],
    " ",
  );
  const zipCity = join([data.zip_postal_code, data.city], " ");
  return {
    cal_name_list: calNameList,
    cal_address: join([calNameList, data.street_address, zipCity], "\n"),
  };
}
