import { Search } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import { Input } from "../ui/input";

type Props = {
  setQuery: (val: string) => void;
  placeHolder?: string;
  value?: string;
  className?: string;
  focus?: boolean;
  disabled?: boolean;
};

export default function Searchbar({
  setQuery,
  placeHolder = "Search",
  value,
  className = "",
  focus = true,
  disabled = false,
}: Props) {
  const firstInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (focus && firstInput.current) {
      firstInput.current.focus();
    }
  }, [firstInput]);

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            ref={firstInput}
            type="text"
            name="search"
            placeholder={placeHolder}
            value={value}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
            disabled={disabled}
          />
        </div>
      </div>
    </>
  );
}

/*
<div className={twMerge("flex flex-row text-gray-600", className)}>
        <input
          ref={firstInput}
          className={`border border-gray-500 bg-white h-10 px-3  rounded-l-lg text-sm focus:outline-none w-full`}
          type="search"
          name="search"
          value={value}
          placeholder={placeHolder}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          tabIndex={-1}
          type="submit"
          className="bg-linear-to-r from-secondary-300 to-secondary-400  text-white pl-3  h-10 w-10  rounded-r-lg"
        >
          <FiSearch />
        </button>
      </div>
      */
