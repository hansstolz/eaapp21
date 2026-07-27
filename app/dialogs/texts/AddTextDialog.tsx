"use client";

import { useEffect, useMemo, useState } from "react";
import type { EaText } from "@/app/data_types/text/ea_text";
import MovableDialog from "@/components/app/movable_dialog";
import Searchbar from "@/components/app/Searchbar";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (text: EaText) => Promise<void>;
};

export default function AddTextDialog({
  open,
  onOpenChange,
  onAdd,
}: Props) {
  const [texts, setTexts] = useState<EaText[] | null>(null);
  const [query, setQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    void fetch("/text/get_all", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Failed to load predefined texts");
        setTexts((await response.json()) as EaText[]);
      })
      .catch((reason: unknown) => {
        if (!(reason instanceof DOMException && reason.name === "AbortError")) {
          setTexts([]);
          setError(reason instanceof Error ? reason.message : "Failed to load predefined texts");
        }
      });
    return () => controller.abort();
  }, [open]);

  const filteredTexts = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return texts ?? [];
    return (texts ?? []).filter(
      (text) =>
        text.text_code.toLocaleLowerCase().includes(normalized) ||
        text.text_value.toLocaleLowerCase().includes(normalized),
    );
  }, [query, texts]);

  const addSelectedText = async (text: EaText) => {
    if (isAdding) return;
    setIsAdding(true);
    setError("");
    try {
      await onAdd(text);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to add text");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <MovableDialog
      open={open}
      setOpen={onOpenChange}
      title="Predefined texts"
      className="min-w-2xl max-w-2xl"
    >
      <div className="grid gap-4">
        <p className="text-sm text-muted-foreground">
          Double-click a predefined text to add it. You can add multiple texts
          before closing this dialog.
        </p>
        <Searchbar
          setQuery={setQuery}
          value={query}
          placeHolder="Search text code or content"
        />
        <div className="max-h-80 overflow-auto rounded-lg border">
          {texts === null ? (
            <p className="p-4 text-sm text-muted-foreground">Loading texts…</p>
          ) : filteredTexts.length ? (
            <div className="divide-y">
              {filteredTexts.map((text) => (
                <button
                  key={text.uid_text ?? text.text_code}
                  type="button"
                  onDoubleClick={() => void addSelectedText(text)}
                  disabled={isAdding}
                  className="grid w-full grid-cols-[10rem_1fr] gap-3 px-4 py-3 text-left hover:bg-accent disabled:cursor-wait disabled:opacity-60"
                >
                  <span className="font-medium">{text.text_code}</span>
                  <span className="line-clamp-2 text-muted-foreground">
                    {text.text_value}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="p-4 text-sm text-muted-foreground">No texts found.</p>
          )}
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <DialogFooter className="mx-0 mb-0 rounded-b-none">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </div>
    </MovableDialog>
  );
}
