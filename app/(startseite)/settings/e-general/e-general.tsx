"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveIcon } from "lucide-react";
import { toast } from "sonner";
import { eGeneralSchema, type EGeneralSettings, type EGeneralValues } from "@/app/schemas/general/e-general-schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LabeledInput } from "@/components/app/LabeledInput";
import { FormSwitch } from "@/components/app/form_switch";
import LineLR from "@/components/app/LineLR";
import Section from "@/components/app/Section";
import { PageColumns } from "@/components/app/TwoPageColumns";

const sections: { title: string; fields: { name: keyof EGeneralValues; label: string; multiline?: boolean }[] }[] = [
  { title: "Company / Address", fields: [
    { name: "name", label: "Company name" },
    { name: "name2", label: "Name / Owner" },
    { name: "street", label: "Street" },
    { name: "postcode", label: "Postal code" },
    { name: "city", label: "City" },
    { name: "country", label: "Country code" },
    { name: "footer_company_name", label: "Company name for list footer" },
  ] },
  { title: "Communication", fields: [
    { name: "fon", label: "Phone" },
    { name: "fax", label: "Fax" },
    { name: "email", label: "E-Mail" },
    { name: "web", label: "Website" },
    { name: "mail_sender_address", label: "E-Mail sender" },
  ] },
  { title: "Bank / Tax", fields: [
    { name: "bank_account_holder", label: "Bank account holder" },
    { name: "bank_name", label: "Bank name" },
    { name: "IBAN", label: "IBAN" },
    { name: "BIC", label: "BIC" },
    { name: "tax_id", label: "VAT ID" },
    { name: "currency_text", label: "Currency" },
  ] },
  { title: "Warranty", fields: [
    { name: "warranty_name", label: "Warranty company" },
    { name: "warranty_street", label: "Warranty street" },
    { name: "warranty_postcode", label: "Warranty postal code" },
    { name: "warranty_city", label: "Warranty city" },
    { name: "warranty_country", label: "Warranty country code" },
    { name: "warranty_vat_no", label: "Warranty VAT ID" },
  ] },
  { title: "Defaults / Notes", fields: [
    { name: "user_print_language", label: "Print language" },
    { name: "hint", label: "Notes", multiline: true },
  ] },
];
const calculatedFields = [
  { name: "sender", label: "Sender" },
  { name: "address_warranty", label: "Warranty address" },
  { name: "footer_lists", label: "List footer" },
  { name: "footer_mails", label: "Mail footer" },
] as const;

export default function EGeneral({ settings }: { settings: EGeneralSettings[] }) {
  const [records, setRecords] = useState(settings);
  const [selectedId, setSelectedId] = useState(settings[0].uid_esettings);
  const selected = records.find(record => record.uid_esettings === selectedId)!;
  return (
    <>
      {records.length > 1 && (
        <div className="p-2 space-y-2">
          <Label htmlFor="e-general-record">Settings record</Label>
          <select id="e-general-record" className="rounded border bg-white p-2" value={selectedId} onChange={event => setSelectedId(Number(event.target.value))}>
            {records.map(record => <option key={record.uid_esettings} value={record.uid_esettings}>{record.user_print_language} – {record.name} (#{record.uid_esettings})</option>)}
          </select>
        </div>
      )}
      <SettingsForm key={selectedId} initial={selected} onSaved={saved => setRecords(current => current.map(record => record.uid_esettings === saved.uid_esettings ? saved : record))} />
    </>
  );
}

function SettingsForm({ initial, onSaved }: { initial: EGeneralSettings; onSaved: (record: EGeneralSettings) => void }) {
  const [saved, setSaved] = useState(initial);
  const { control, handleSubmit, reset, formState: { isDirty, isSubmitting } } = useForm<EGeneralValues>({
    resolver: zodResolver(eGeneralSchema),
    defaultValues: initial,
  });
  async function submit(values: EGeneralValues) {
    try {
      const response = await fetch("/settings/e-general/update", {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Einstellungen konnten nicht gespeichert werden.");
      const updated = result as EGeneralSettings;
      reset(updated);
      setSaved(updated);
      onSaved(updated);
      toast.success("E-General settings updated successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Speichern fehlgeschlagen.");
    }
  }
  return (
    <form onSubmit={handleSubmit(submit, () => toast.error("Bitte die markierten Felder prüfen."))}>
      <LineLR>
        <Button disabled={!isDirty || isSubmitting} type="submit"><SaveIcon className="h-4 w-4" />{isSubmitting ? "Saving…" : "Save"}</Button>
      </LineLR>
      <fieldset disabled={isSubmitting} className="min-w-0">
        <PageColumns className="grid-cols-1 lg:grid-cols-2">
          {sections.map((section, index) => (
            <Card key={section.title} className="card-brand">
              <Section no={index + 1} title={section.title}>
                <div className="flex flex-col gap-4">
                  {section.fields.map(field => <LabeledInput key={field.name} control={control} name={field.name} label={field.label} type={field.multiline ? "textarea" : "text"} rows={4} />)}
                  {section.title === "Defaults / Notes" && <FormSwitch control={control} name="invoiceDateIsDeliveryDate" label="Invoice date is delivery date" valueType="boolean" />}
                </div>
              </Section>
            </Card>
          ))}
          <Card className="card-brand">
            <Section no={6} title="Record information">
              <dl className="space-y-3 text-sm">
                <div><dt className="text-stone-500">ID</dt><dd>{saved.uid_esettings}</dd></div>
                <div><dt className="text-stone-500">User Group</dt><dd>{saved.user_group}</dd></div>
                <div><dt className="text-stone-500">Created</dt><dd>{formatDate(saved.date_created)}</dd></div>
                <div><dt className="text-stone-500">Updated</dt><dd>{formatDate(saved.date_updated)}</dd></div>
              </dl>
            </Section>
          </Card>
          <Card className="card-brand lg:col-span-2">
            <Section no={7} title="Calculated fields">
              <p className="mb-4 text-sm text-stone-500">Diese Felder werden automatisch aus den Stammdaten berechnet. Nach dem Speichern wird die Anzeige aktualisiert.</p>
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {calculatedFields.map(field => (
                  <div key={field.name} className="space-y-2 min-w-0">
                    <Label htmlFor={`e-general-${field.name}`}>{field.label.toUpperCase()}</Label>
                    <textarea id={`e-general-${field.name}`} readOnly value={saved[field.name]} rows={field.name === "sender" ? 13 : 5} className="w-full resize-y rounded-sm border border-stone-300 bg-stone-100 p-3 text-sm" />
                  </div>
                ))}
              </div>
            </Section>
          </Card>
        </PageColumns>
      </fieldset>
    </form>
  );
}
const dateFormatter = new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Berlin" });
function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}
