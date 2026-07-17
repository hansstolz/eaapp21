import { EaCompanies } from "@/schemas/companies/company_schema";
import { EaPurchases } from "../purachases/ea_purchases";
import { EaMails } from "../forms/ea_mails";
import { EaContacts } from "@/schemas/contacts/contact_schema";

export type EaCompaniesDetail = {
  company: EaCompanies;
  mails: EaMails[];
  contacts: EaContacts[];
  purchases: EaPurchases[];
};
