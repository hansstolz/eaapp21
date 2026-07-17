import type {
  ea_forms_itemsCreateInput,
  ea_forms_itemsUpdateInput,
} from "@/generated/prisma/models/ea_forms_items";

export const FORM_FIELDS = [
  "warranty_text", "payment_text", "customerno_text", "foryourcustomer_text",
  "user_print_language", "user_group", "units_text", "commission_text",
  "valuetax_text", "preinvoice_text", "total_text", "worksheet_text",
  "value_tax_id_text", "check_default", "alternative_costest_text",
  "creditnote_text", "note_text", "our_article_no", "price_text",
  "delivery_note", "costestimateno_text", "diagnosis_text",
  "fiscal_office_text", "fork_text", "no_text", "invoice_text", "date_text",
  "forkno_text", "your_article_no", "invoice_total", "outstanding_money",
  "payments_total", "tax_id_text", "user_text", "creditnoteno_text",
  "currency_text", "worksheetno_text", "reminder_text", "singleprice_text",
  "freightforward_text", "forkcolor_text", "warrantyno_text", "amount_text",
  "costestimate_text", "selforder", "remindercategory_text",
  "articlecharacter_text", "page_text", "vat_no_text",
] as const satisfies readonly (keyof ea_forms_itemsCreateInput)[];

export const FORM_UPDATE_FIELDS =
  FORM_FIELDS satisfies readonly (keyof ea_forms_itemsUpdateInput)[];
