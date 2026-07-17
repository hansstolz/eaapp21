import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { twMerge } from "tailwind-merge";

interface FormSwitchProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> {
  className?: string;
  name: TName;
  label: string;
  disabled?: boolean;
  control: Control<TFieldValues, unknown, TTransformedValues>;
}

export function FormSwitch<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>({
  name,
  label,
  control,
  disabled = false,
  className = "",
}: FormSwitchProps<TFieldValues, TName, TTransformedValues>) {
  return (
    <div className="flex items-center space-x-2">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Switch
            id={name}
            checked={Number(field.value) === 1}
            onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)}
            disabled={disabled}
          />
        )}
      />
      <Label className={twMerge(`label-text`, className)} htmlFor={name}>
        {label}
      </Label>
    </div>
  );
}
