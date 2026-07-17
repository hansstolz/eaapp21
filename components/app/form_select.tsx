import React from "react";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// TypeScript Props für die wiederverwendbare Select-Komponente
interface FormSelectProps {
  name: string;
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
  control: any;
  error?: string;
}

// Wiederverwendbare Select-Komponente
export const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  placeholder,
  options,
  control,
  error,
}) => {
  const uniqueOptions = React.useMemo(() => {
    const map = new Map<string, { value: string; label: string }>();
    for (const option of options) {
      const key = String(option.value);
      if (!map.has(key)) map.set(key, option);
    }
    return Array.from(map.values());
  }, [options]);

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label.toLocaleUpperCase()}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            value={field.value === null || field.value === undefined ? "" : String(field.value)}
          >
            <SelectTrigger id={name} className="w-full bg-gray-100">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {uniqueOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
