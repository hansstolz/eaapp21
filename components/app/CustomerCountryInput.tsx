"use client";

import { useId } from "react";
import { Controller, type Control } from "react-hook-form";
import type { EaCustomerMails } from "@/app/schemas/customer/customer_schema";
import { Field, FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/app/input";

const countries = [
  { name: "Andorra", code: "AD" },
  { name: "Austria", code: "AT" },
  { name: "Belgium", code: "BE" },
  { name: "France", code: "FR" },
  { name: "Germany", code: "DE" },
  { name: "Ireland", code: "IE" },
  { name: "Italy", code: "IT" },
  { name: "Liechtenstein", code: "LI" },
  { name: "Luxembourg", code: "LU" },
  { name: "Monaco", code: "MC" },
  { name: "Netherlands", code: "NL" },
  { name: "Portugal", code: "PT" },
  { name: "San Marino", code: "SM" },
  { name: "Spain", code: "ES" },
  { name: "Switzerland", code: "CH" },
  { name: "United Kingdom", code: "GB" },
  { name: "Vatican City", code: "VA" },
] as const;

export function CustomerCountryInput({ control }: { control: Control<EaCustomerMails> }) {
  const id = useId();
  return (
    <Controller
      name="country"
      control={control}
      render={({ field, fieldState }) => (
        <Field className="gap-1" data-invalid={fieldState.invalid}>
          <Label className="text-stone-500" htmlFor={id}>COUNTRY</Label>
          <Input
            {...field}
            id={id}
            value={field.value ?? ""}
            list={`${id}-countries`}
            autoComplete="country-name"
            placeholder="Select or enter country code"
            required
            aria-required="true"
            aria-invalid={fieldState.invalid}
            aria-describedby={fieldState.invalid ? `${id}-error` : undefined}
            className="border-stone-300 bg-stone-50 rounded-sm text-black"
          />
          <datalist id={`${id}-countries`}>
            {countries.map(({ name, code }) => (
              <option key={code} value={code} label={`${name} - ${code}`} />
            ))}
          </datalist>
          {fieldState.invalid && <FieldError id={`${id}-error`} errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
