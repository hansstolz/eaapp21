import type { ReactNode } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type UseFormRegisterReturn,
} from "react-hook-form";
import { Input } from "@/components/app/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DropdownItem } from "@/app/data_types/data/values_data";
import { cn } from "@/lib/utils";

export function WorksheetInput({
  register,
  label,
  error,
  type = "text",
  rows = 2,
}: {
  register: UseFormRegisterReturn;
  label: string;
  error?: string;
  type?: "text" | "textarea";
  rows?: number;
}) {
  return (
    <div className="grid w-full gap-1">
      {label && <Label>{label.toUpperCase()}</Label>}
      {type === "textarea" ? (
        <textarea
          {...register}
          rows={rows}
          className="min-h-20 rounded-sm border border-gray-300 bg-gray-100 p-2 text-sm"
        />
      ) : (
        <Input
          {...register}
          className="rounded-sm border border-gray-300 bg-gray-100 text-black"
        />
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function InputMenu<T extends FieldValues>({
  options,
  control,
  name,
  label,
  labelStyle,
}: {
  options: DropdownItem[];
  control: Control<T>;
  name: string;
  label?: string;
  labelStyle?: string;
}) {
  return (
    <div className={cn("grid gap-1", labelStyle)}>
      {label && <Label className="text-xs">{label}</Label>}
      <Controller
        control={control}
        name={name as never}
        render={({ field }) => (
          <Select
            value={field.value == null ? "" : String(field.value)}
            onValueChange={field.onChange}
          >
            <SelectTrigger className="w-full bg-gray-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={String(option.value)}
                  value={String(option.value)}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}

export function InfoLabel({
  label,
  labelStyle,
  children,
}: {
  label: string;
  labelStyle?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex gap-3 text-xs", labelStyle)}>
      <span className="text-secondary">{label}:</span>
      <span className="font-medium">{children}</span>
    </div>
  );
}

export function WorksheetReadonlyField({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="grid gap-1">
      <Label className="text-xs font-medium text-gray-700">
        {label.toUpperCase()}
      </Label>
      <div className="min-h-9 rounded-md border border-slate-300 bg-slate-100 px-2 py-1.5 text-sm text-slate-900">
        {value || "--"}
      </div>
    </div>
  );
}

export function WorksheetInfoRow({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-3 text-xs leading-4 text-gray-700">
      <span>{label}:</span>
      <span className="font-semibold">{value || "--"}</span>
    </div>
  );
}
