import * as React from "react";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";

type InputDateProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  control: Control<TFieldValues>;
  name: TName;

  label?: string;
  description?: string;

  placeholder?: string;
  disabled?: boolean;

  /** Optional: min/max Einschränkungen */
  fromDate?: Date;
  toDate?: Date;

  /** Optional: Anzeigeformat */
  displayFormat?: string; // default: "dd.MM.yyyy"

  /** Optional: Styling */
  className?: string;
  buttonClassName?: string;
  classLabel?: string;

  /** Optional: Wenn du statt Date auch string speichern willst, sag Bescheid — hier ist Date | null */
};

export function InputDate<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(props: InputDateProps<TFieldValues, TName>) {
  const {
    control,
    name,
    label,
    description,
    placeholder = "Datum auswählen",
    disabled,
    fromDate,
    toDate,
    displayFormat = "dd.MM.yyyy",
    className,
    buttonClassName,
    classLabel,
  } = props;

  const buttonId = React.useId();

  return (
    <div className={cn("grid gap-2", className)}>
      {label ? (
        <label
          htmlFor={buttonId}
          className={cn("text-sm font-medium leading-none", classLabel)}
        >
          {label.toUpperCase()}
        </label>
      ) : null}

      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          const rawValue: unknown = field.value;
          const parsedValue = rawValue instanceof Date
            ? rawValue
            : typeof rawValue === "string" && rawValue
              ? new Date(rawValue)
              : null;
          const value = parsedValue && !Number.isNaN(parsedValue.getTime())
            ? parsedValue
            : null;

          return (
            <div className="grid gap-1">
              <Popover>
                <PopoverTrigger
                  render={<Button
                    id={buttonId}
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                      "justify-start text-left font-normal",
                      !value && "text-muted-foreground",
                      buttonClassName,
                    )}
                  />}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? format(value, displayFormat) : placeholder}
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={value ?? undefined}
                    onSelect={(date) => {
                      // Calendar gibt Date | undefined
                      field.onChange(date ? date.toISOString() : null);
                    }}
                    disabled={disabled}
                    hidden={{ before: fromDate!, after: toDate! }}
                  />
                </PopoverContent>
              </Popover>

              {description ? (
                <p className="text-sm text-muted-foreground">{description}</p>
              ) : null}

              {fieldState.error?.message ? (
                <p className="text-sm font-medium text-destructive">
                  {fieldState.error.message}
                </p>
              ) : null}
            </div>
          );
        }}
      />
    </div>
  );
}
