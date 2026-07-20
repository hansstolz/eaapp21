import { DropdownItem } from "@/app/data_types/data/values_data";
import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  options: DropdownItem[];
  id: string;
  defaultValue?: number | string;
  className?: string;
  label?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export default function SelectValues(props: Props) {
  const {
    options,
    id,
    defaultValue,
    label,
    className,
    disabled = false,
    onChange,
  } = props;
  return (
    <div className="flex flex-col gap-0">
      <label
        htmlFor={id}
        className="block ml-1 mb-2 text-xs font-medium text-gray-900"
      >
        {label}
      </label>
      <select
        className={twMerge(
          "bg-gray-50 border border-gray-300 text-secondary-700 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5",
          className,
        )}
        name={id}
        id={id}
        disabled={disabled}
        defaultValue={defaultValue}
        onChange={onChange}
      >
        {options.map((m, index) => (
          <option key={index} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
    </div>
  );
}
