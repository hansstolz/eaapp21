import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { twMerge } from "tailwind-merge";
import { DropdownItem } from "@/app/data_types/general/dropdown";

type Props = {
  options: DropdownItem[];
  labelText: string;
  onValueChange?: (value: string) => void;
  className?: string;
};

export default function ValueSelect(props: Props) {
  const { options, labelText, onValueChange, className } = props;
  return (
    <Select
      onValueChange={(value: any) => {
        onValueChange?.(value);
      }}
    >
      <SelectTrigger className={`w-full bg-gray-100 `}>
        <SelectValue placeholder={labelText} />
      </SelectTrigger>
      <SelectContent className={twMerge("bg-gray-100", className)}>
        {options.map((option, index) => (
          <SelectItem
            className="text-black text-sm"
            key={`${option.value}-${index}`}
            value={option.value as string}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
