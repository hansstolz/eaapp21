"use client";

import { useId } from "react";
import { Controller, type Control } from "react-hook-form";
import type { EaCustomerMails } from "@/app/schemas/customer/customer_schema";
import { Field, FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/app/input";

const categories = [
  { value: "E", label: "E – Steuerbefreit", reason: "Steuerfreie Leistung" },
  { value: "AE", label: "AE – Reverse Charge", reason: "Steuerschuldnerschaft des Leistungsempfängers (Reverse Charge)" },
  { value: "K", label: "K – Innergemeinschaftliche Lieferung", reason: "Steuerfreie innergemeinschaftliche Lieferung" },
  { value: "G", label: "G – Ausfuhrlieferung", reason: "Steuerfreie Ausfuhrlieferung" },
];

export function CustomerExemptionFields({ control }: { control: Control<EaCustomerMails> }) {
  const id = useId();
  return (
    <>
      <Controller
        name="exemption_category"
        control={control}
        render={({ field, fieldState }) => (
          <Field className="gap-1" data-invalid={fieldState.invalid}>
            <Label htmlFor={`${id}-category`}>EXEMPTION CATEGORY</Label>
            <select
              {...field}
              id={`${id}-category`}
              value={field.value ?? ""}
              aria-invalid={fieldState.invalid}
              className="w-full min-w-0 rounded-sm border border-stone-300 bg-stone-50 p-2 text-sm"
            >
              <option value="">Keine Steuerbefreiung ausgewählt</option>
              {categories.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
            </select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="exemption_reason"
        control={control}
        render={({ field, fieldState }) => (
          <Field className="gap-1" data-invalid={fieldState.invalid}>
            <Label htmlFor={`${id}-reason`}>EXEMPTION REASON</Label>
            <Input
              {...field}
              id={`${id}-reason`}
              value={field.value ?? ""}
              list={`${id}-reasons`}
              maxLength={500}
              placeholder="Begründung auswählen oder eingeben"
              aria-invalid={fieldState.invalid}
              aria-describedby={`${id}-hint`}
              className="border-stone-300 bg-stone-50 rounded-sm text-black"
            />
            <datalist id={`${id}-reasons`}>
              {categories.map(({ value, reason }) => <option key={value} value={reason} />)}
            </datalist>
            <p id={`${id}-hint`} className="text-xs text-stone-500">Vorschläge können ergänzt werden, z. B. um die zutreffende Rechtsgrundlage (max. 500 Zeichen).</p>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </>
  );
}
