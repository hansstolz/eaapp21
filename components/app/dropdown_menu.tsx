"use client";

import { DropdownItem } from "@/app/data_types/general/dropdown";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type Props = {
  onSelect?: (item: any) => void;
  items: DropdownItem[];
  title: string;
};

export function DropdownMenuItems(props: Props) {
  const { onSelect, items, title } = props;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button size="sm" className="w-full">
          {title}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full" align="start">
        <DropdownMenuGroup>
          {items.map((item) => (
            <DropdownMenuItem
              onSelect={() => onSelect && onSelect(item)}
              key={item.uid}
            >
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
