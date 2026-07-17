import { EaClients } from "../clients/ea_clients";

export type TCustomerFork = {
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  cal_address: string | null;
  clients: EaClients[];
};

export type TCustForkResult = TCustomerFork & {
  client_name: string;
};
