"use client";

import { createContext, useContext } from "react";

export const DialogShortcutHintsContext = createContext(false);

export function DialogShortcutHint({ shortcut }: { shortcut?: string }) {
  const visible = useContext(DialogShortcutHintsContext);
  if (!visible || !shortcut || !/^Control\+[CS]$/.test(shortcut)) return null;
  return <span aria-hidden="true">(Ctrl+{shortcut.slice(-1)})</span>;
}
