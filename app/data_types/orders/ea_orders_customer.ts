export type EaOrdersCustomer = {
  invoice_date: Date | null;
  uid_customer: number | null;
  order_no: number | null;
  fork_no: number | null;
  fork_model: string | null;
};

export type EaOrdersCustomerUpdate = {
  customer_no: number | null;
  uid_customer: number;
  cal_address: string | null;
  fon: string | null;
  email: string | null;
  bank_account: string;
  bank_payment: string;
  vat_no: string;
  no_vat: string | number;
  customer_category_no: number;
  delivery_address: string;
  uid_order: number;
};

export type EaOrdersForkUpdate = {
  fork_color: string | null;
  fork_model: string | null;
  wheelsize: string | null;
  customer_client_name: string | null;
  fork_in_carrier: string | null;
  fork_in_date: string | null;
  uid_order: number;
};
