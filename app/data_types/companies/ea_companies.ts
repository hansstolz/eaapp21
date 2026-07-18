import { EaCompanies } from "@/app/schemas/companies/company_schema";
import { EaPurchases } from "../purachases/ea_purchases";
import { EaMails } from "../forms/ea_mails";
import { EaContacts } from "@/app/schemas/contacts/contact_schema";

export type EaCompaniesDetail = {
  company: EaCompanies;
  mails: EaMails[];
  contacts: EaContacts[];
  purchases: EaPurchases[];
};
