import * as React from "react";
import type { IconType } from "react-icons";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type DropdownItem = {
  label: string;
  value: string | number;
  icon?: IconType;
};

type Props = {
  valuesIn: DropdownItem[];
  width?: string; // tailwind class, z.B. "w-48"
  handler?: (option: DropdownItem) => void;
  index?: number; // default 0, -1 => 0
  disabled?: boolean;
  id?: string;
};

export default function DropDown({
  index = 0,
  valuesIn,
  handler,
  disabled = false,
  width = "w-48",
  id,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState<
    string | number | null
  >(null);
  const selectedIndex = index === -1 ? 0 : index;
  const selected = valuesIn.find((item) => item.value === selectedValue)
    ?? valuesIn[Math.min(selectedIndex, valuesIn.length - 1)]
    ?? null;

  const onSelectItem = (item: DropdownItem) => {
    setSelectedValue(item.value);
    handler?.(item);
    setOpen(false);
  };

  return (
    <div className={width}>
      {valuesIn.length > 0 && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            render={
              <Button
                id={id}
                type="button"
                variant="outline"
                disabled={disabled}
                className={cn(
                  "w-full justify-between text-left text-xs shadow-md",
                  "rounded-lg py-1 pl-3 pr-2",
                )}
              />
            }
          >
            <span className="flex min-w-0 items-center gap-2">
              {selected?.icon ? (
                <selected.icon className="h-4 w-4 shrink-0" />
              ) : null}
              <span className="truncate">{selected?.label}</span>
            </span>

            <span className="ml-2 inline-flex items-center rounded-md bg-linear-to-r from-secondary-200 to-secondary-400 px-2 py-1">
              <ChevronDown className="h-4 w-4 text-white" />
            </span>
          </PopoverTrigger>

          <PopoverContent className={cn("p-0", width)} align="start">
            <Command shouldFilter={false}>
              <CommandList className="max-h-60">
                <CommandGroup>
                  {valuesIn.map((item) => {
                    const isSelected = selected?.value === item.value;

                    return (
                      <CommandItem
                        key={String(item.value)}
                        value={String(item.value)}
                        onSelect={() => onSelectItem(item)}
                        className={cn(
                          "cursor-pointer",
                          // optional: ähnliche aktive/hover Optik
                          "aria-selected:bg-secondary-light aria-selected:text-white",
                        )}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            isSelected ? "opacity-100" : "opacity-0",
                          )}
                        />

                        {item.icon ? (
                          <item.icon className="mr-2 h-4 w-4" />
                        ) : null}

                        <span className="truncate">{item.label}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
