"use client";
import { Control, Controller, FieldValues } from "react-hook-form";
import { Field, FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { twJoin } from "tailwind-merge";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownItem } from "@/app/data_types/data/values_data";

type FormCheckboxGroupProps = {
  className?: string;
  label: string;
  control: any;
  name: string;
  options: DropdownItem[];
  disabled?: boolean;
};

export function FormCheckboxGroup({
  className,
  label,
  control,
  name,
  options,
  disabled,
}: FormCheckboxGroupProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field className="gap-2" data-invalid={fieldState.invalid}>
          <Label htmlFor={`form-${label.toLowerCase()}`}>
            {label.toLocaleUpperCase()}
          </Label>
          <div className="flex flex-col gap-3">
            {options.map((option) => {
              const isChecked = Array.isArray(field.value)
                ? field.value.includes(option.value)
                : false;

              return (
                <div key={option.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`${name}-${option.value}`}
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      const currentValue = Array.isArray(field.value)
                        ? field.value
                        : [];

                      if (checked) {
                        field.onChange([...currentValue, option.value]);
                      } else {
                        field.onChange(
                          currentValue.filter((v) => v !== option.value),
                        );
                      }
                    }}
                    className={
                      isChecked
                        ? "border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:text-white w-4 h-4"
                        : "w-4 h-4 border-black"
                    }
                  />
                  <Label
                    htmlFor={`${name}-${option.value}`}
                    className={twJoin(
                      `font-normal cursor-pointer ${
                        isChecked ? "text-red-500" : ""
                      }`,
                      className,
                    )}
                  >
                    {option.label}
                  </Label>
                </div>
              );
            })}
          </div>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
