import React, { useMemo } from "react";
import { DefaultValues, Form } from "react-hook-form";
import { z } from "zod";

export default function FormsSchema() {
  const formsSchema = useMemo(
    () =>
      z.object({
        alternative_costest_text: z.string().min(1).default("Alternativer KV"),
        amount_text: z.string().min(1).default("Gesamt"),
        articlecharacter_text: z.string().min(1).default("Artikel"),
        check_default: z.coerce.number().default(1),
        commission_text: z.string().min(1).default("Ihr Auftrag"),
        costestimate_text: z.string().default("Kostenvoranschlag"),
        costestimateno_text: z.string().default("Kost.voranschl.-Nr."),
        creditnote_text: z.string().default("Gutschrift"),
        creditnoteno_text: z.string().default("Gutschrift-Nr."),
        currency_text: z.string().default("Eur"),
        customerno_text: z.string().default("Kunden-Nr."),
        date_text: z.string().default("Datum"),
        delivery_note: z
          .string()
          .nullable()
          .transform((v) => v ?? "Lieferschein"),
        diagnosis_text: z.string().default("Diagnose"),
        fiscal_office_text: z.string().default("Finanzamt"),
        fork_text: z.string().default("Gabel"),
        forkcolor_text: z.string().default("Farbe"),
        forkno_text: z.string().default("Gabel-Nr."),
        foryourcustomer_text: z.string().default("Für Ihren Kunden"),
        freightforward_text: z.string().default("Spedition"),
        invoice_text: z.string().default("Rechnung"),
        invoice_total: z.string().default("Rechnungsbetrag"),
        no_text: z.string().default("Nr."),
        note_text: z.string().default("Notiz"),
        our_article_no: z.string().default("Artikel-Nr."),
        outstanding_money: z.string().default("Offene Forderung"),
        page_text: z.string().default("Seite"),
        payment_text: z.string().default("Zahlungsweise per:"),
        payments_total: z.string().default("Zahlungseingang"),
        preinvoice_text: z.string().default("Vorbeleg"),
        price_text: z.string().default("Preis"),
        reminder_text: z.string().default("Mahnung"),
        remindercategory_text: z.string().default("Mahnstufe"),
        selforder: z.string().default("Bestellung"),
        singleprice_text: z.string().default("Einzelpreis"),
        tax_id_text: z.string().default("Steuernummer"),
        total_text: z.string().default("Gesamtbetrag"),
        uid_forms_item: z.number().optional(),
        units_text: z.string().min(1).default("Menge"),
        user_group: z.string().default(""),
        user_print_language: z.string().default("german"),
        user_text: z.string().default("Benutzer"),
        value_tax_id_text: z.string().default("USt-ID"),
        valuetax_text: z.string().default("USt"),
        vat_no_text: z.string().default("Ihre USt ID"),
        warranty_text: z.string().default("Gewährleistung"),
        warrantyno_text: z.string().default("Gewährleistung-Nr."),
        worksheet_text: z.string().default("Arbeitsblatt"),
        worksheetno_text: z.string().default("Arbeitsblatt-Nr."),
        your_article_no: z.string().default("Artikel-Nr."),
      }),
    []
  );
  type FormValues = z.infer<typeof formsSchema>;
  const defaultValues: DefaultValues<FormValues> = {};

  return { formsSchema, defaultValues };
}
