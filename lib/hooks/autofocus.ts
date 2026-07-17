import { useRef, useEffect } from "react";

const useAutoFocus = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const el = inputRef.current;

    if (el) {
      el.focus();
      const len = el.value.length;
      el.setSelectionRange(len, len);
    }
  }, [inputRef]);

  return inputRef;
};

export default useAutoFocus;
