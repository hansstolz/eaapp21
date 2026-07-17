import { UserRights } from "./rights";

export type EaUser = {
  uid_user?: number;
  mail_work?: string;
  country?: string;
  jobday_first?: Date;
  user_name: string;
  user_rights: UserRights;
  user_password: string;
  user_group: string;
  notes: string;
  salutation: string;
  suid_user: string;
  mail_home: string;
  name: string;
  firstname: string;
  titel: string;
  company_name: string;
  street_no: string;
  postal_zip: string;
  city: string;
  created_at: Date;
  updated_at: Date;
};
