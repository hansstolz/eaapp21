"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";

const dialogSelector = '[data-slot="dialog-content"], [data-slot="alert-dialog-content"]';

export function useDialogShortcuts() {
  const ref = useRef<HTMLDivElement>(null);
  const [showShortcutHints, setShowShortcutHints] = useState(false);

  useEffect(() => {
    const update = (event: KeyboardEvent) => {
      setShowShortcutHints(event.ctrlKey);
    };
    const clear = () => setShowShortcutHints(false);
    const visibility = () => { if (document.hidden) clear(); };
    window.addEventListener("keydown", update, true);
    window.addEventListener("keyup", update, true);
    window.addEventListener("blur", clear);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.removeEventListener("keydown", update, true);
      window.removeEventListener("keyup", update, true);
      window.removeEventListener("blur", clear);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  const onKeyDownCapture = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.defaultPrevented || !event.ctrlKey || event.altKey || event.metaKey || event.shiftKey || event.nativeEvent.isComposing) return;
    const key = event.key.toUpperCase();
    if (key !== "C" && key !== "S") return;
    const dialog = event.currentTarget;
    if ((event.target as Element).closest(dialogSelector) !== dialog) return;
    // A nested modal owns the keyboard even if focus has not moved there yet.
    if (dialog.hasAttribute("data-nested-dialog-open")) return;
    const button = Array.from(dialog.querySelectorAll<HTMLButtonElement>(`button[aria-keyshortcuts="Control+${key}"]`))
      .find((candidate) => candidate.closest(dialogSelector) === dialog && candidate.getClientRects().length > 0);
    if (!button || button.hasAttribute("data-shortcut")) return;
    event.preventDefault();
    event.stopPropagation();
    if (!event.repeat && !button.disabled && button.getAttribute("aria-disabled") !== "true") button.click();
  };

  return { ref, onKeyDownCapture, showShortcutHints };
}
