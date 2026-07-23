export type NewOrderCustomer = {
  uid_customer: number;
  customer_no: number | null;
  cal_name_list: string | null;
  street_address: string | null;
  city: string | null;
  category_customer: string | null;
};

export type NewOrderFork = {
  uid_fork: number;
  fork_no: number | null;
  fork_model: string | null;
  colour: string | null;
  customer_name: string | null;
  customer_no: number | null;
  client_name: string | null;
  category_fork: string | null;
  user_group: string | null;
};
