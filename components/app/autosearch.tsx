import * as React from "react";
import { Check, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

type Props<T> = {
  setQuery: (val: string) => void;
  placeholder?: string;
  data: T[];
  showLabel: (item: T, full?: boolean) => string;
  getId: (item: T) => number;
  handleSelection?: (item: T) => void;
};

export default function AutoSearch<T>(props: Props<T>) {
  const { placeholder, data, showLabel, getId, setQuery, handleSelection } =
    props;

  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<T | null>(null);
  const popoverId = React.useId();

  const effectiveSelected = selected && data.some(
    (item) => getId(item) === getId(selected),
  ) ? selected : null;

  const onSelectItem = (item: T) => {
    setSelected(item);
    handleSelection?.(item);
    setOpen(false);
    // Optional: nach Auswahl Query zurücksetzen (wie "afterLeave" früher)
    setQuery("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-controls={popoverId}
            className="w-full justify-between"
          />
        }
      >
        <span className="truncate">
          {effectiveSelected
            ? showLabel(effectiveSelected, false)
            : `Search ${placeholder ?? ""}`}
        </span>
        <Search className="ml-2 h-4 w-4 opacity-70" />
      </PopoverTrigger>

      <PopoverContent
        id={popoverId}
        className="w-(--radix-popover-trigger-width) p-0"
      >
        <Command shouldFilter={false}>
          <CommandInput
            autoFocus
            placeholder={`Search ${placeholder ?? ""}`}
            onValueChange={(val) => setQuery(val)}
          />

          <CommandList>
            <CommandEmpty>Nothing found.</CommandEmpty>

            <CommandGroup>
              {data?.map((item) => {
                const id = getId(item);
                const isSelected = effectiveSelected != null
                  && getId(effectiveSelected) === id;

                return (
                  <CommandItem
                    key={id}
                    value={String(id)}
                    onSelect={() => onSelectItem(item)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {/* Wenn showLabel HTML liefert: wie vorher rendern */}
                    <span
                      className="truncate"
                      dangerouslySetInnerHTML={{ __html: showLabel(item) }}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
