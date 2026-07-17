export interface TArticleResult {
  uid_article: number;
  active: number;
  for_what: string;
  order_no: number;
  uid_ref_fork: number;
  price_categ3_rel: string;
  articlecharacter: string;
  memo: string;
  price_netto_categ3: number;
  file_name: string;
  article_no_rel: string;
  cost_price: number;
  user_group: string;
  cust_categ_2: number;
  core_item: number;
  price_categ1_rel: string;
  picture_show?: any;
  supplied: number;
  currancy: string;
  price_netto_categ2: number;
  article_group: string;
  articledescription: string;
  print_check: number;
  article_no: number;
  price_categ2_rel: string;
  url: string;
  price_netto_categ1: number;
  cust_categ_1: number;
  cust_categ_3: number;
  articlecode: string;
  category_article: string;
  storage_location2: string;
  selforder_only: string;
  storage_location1: string;
  manufacturer: string;
  company_article_no: string;
  quantity: number;
  unit: number;
  cal_cost_price_sum: number;
  created_at: string;
  updated_at: string;
  stati: TDropdownItem[];
  categories: TDropdownItem[];
  groups: TDropdownItem[];
}

export interface TDropdownItem {
  uid: number;
  label: string;
  value: string;
}

export type TArticleOptions = {
  stati: TDropdownItem[];
  categories: TDropdownItem[];
  groups: TDropdownItem[];
};
