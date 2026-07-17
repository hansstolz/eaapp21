import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DropdownItem } from "@/app/data_types/data/values_data";

type Props = {
  options: DropdownItem[];
  onChange?: (value: string | null) => void;
};

export default function BaseSelect({ options, onChange }: Props) {
  return (
    <Select onValueChange={onChange} defaultValue={options[0].value.toString()}>
      <SelectTrigger className="w-45 border-alternate">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
