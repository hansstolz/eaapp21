import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type Props = {
  disabled?: boolean;
  label: string;
  value: string;
  rows?: number;
};

export default function DisabledTextarea(props: Props) {
  const { disabled, label, value, rows = 10 } = props;
  return (
    <div className="flex flex-col">
      <label
        className="uppercase mb-1 text-xs text-secondary-400"
        htmlFor={label}
      >
        {label}
      </label>
      <textarea
        rows={rows}
        className="text-medium px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary bg-transparent  focus:bg-slate-100"
        disabled={disabled}
        value={value}
      />
    </div>
  );
}
