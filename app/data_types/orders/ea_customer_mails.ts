import { EaCustomer } from "../customer/ea_customer";

export type EaCustomerMails = EaCustomer & {
  mail1: string | null;
  mail2: string | null;
  mail3: string | null;
  category_customer: "Dealer" | "Private";
};
