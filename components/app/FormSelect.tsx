"use client";

import { Controller } from "react-hook-form";
import { Field, FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type FormSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type FormSelectProps = {
  label: string;
  control: any;
  name: string;
  options: FormSelectOption[];
  placeholder?: string;
  disabled?: boolean;
};

export function FormSelect({
  label,
  control,
  name,
  options,
  placeholder,
  disabled,
}: FormSelectProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field className="gap-2" data-invalid={fieldState.invalid}>
          <Label htmlFor={`form-${label.toLowerCase()}`}>
            {label.toLocaleUpperCase()}
          </Label>
          <Select
            value={field.value ?? ""}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger
              id={`form-${label.toLowerCase()}`}
              className="border-gray-300 border rounded-sm"
            >
              <SelectValue placeholder={placeholder ?? label} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
