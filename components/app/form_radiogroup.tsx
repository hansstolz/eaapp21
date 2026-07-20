"use client";
import { Controller } from "react-hook-form";
import { Field, FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { twJoin } from "tailwind-merge";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

export type FormRadioOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type FormRadioGroupProps = {
  className?: string;
  label: string;
  control: any;
  name: string;
  options: FormRadioOption[];
  disabled?: boolean;
  onValueChange?: (value: string) => void;
};

export function FormRadioGroup({
  className,
  label,
  control,
  name,
  options,
  disabled,
  onValueChange,
}: FormRadioGroupProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field className="gap-2" data-invalid={fieldState.invalid}>
          <Label htmlFor={`form-${label.toLowerCase()}`}>
            {label.toLocaleUpperCase()}
          </Label>
          <RadioGroup
            value={field.value ?? ""}
            onValueChange={(value) => {
              field.onChange(value);
              onValueChange?.(value);
            }}
            disabled={disabled}
            className="flex flex-col gap-3"
          >
            {options.map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <RadioGroupItem
                  id={`${name}-${option.value}`}
                  value={option.value}
                  disabled={option.disabled || disabled}
                  className={
                    field.value === option.value
                      ? "border-red-500 text-red-500 w-5 h-5"
                      : "w-5 h-5 border-black"
                  }
                />
                <Label
                  htmlFor={`${name}-${option.value}`}
                  className={twJoin(
                    `text-xl font-medium cursor-pointer ${
                      field.value === option.value ? "text-red-500" : ""
                    }`,
                    className,
                  )}
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
