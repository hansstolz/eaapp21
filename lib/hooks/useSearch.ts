import React, { useEffect, useMemo, useState } from "react";
import useDebounce from "./useDebounce";

type Props = {
  updateQuery: (val: string) => void;
  placeHolderText?: string;
};

export default function useSearchOnTyping({
  updateQuery,
  placeHolderText,
}: Props) {
  const [placeHolder] = useState(placeHolderText || "Search");
  const [typing, setTyping] = useState("");
  const debouncedValue = useDebounce(typing, 100);

  useEffect(() => {
    if (debouncedValue) {
      updateQuery(debouncedValue);
    }
    return () => updateQuery("");
  }, [debouncedValue]);

  const onChange = (value: string) => {
    setTyping(value);
  };

  return { placeHolder, onChange, typing };
}
