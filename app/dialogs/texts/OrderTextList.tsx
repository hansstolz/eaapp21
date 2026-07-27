"use client";

import { useState } from "react";
import type { EaOrdersText } from "@/app/data_types/orders/ea_orders_texts";
import ConfirmDialog from "@/components/app/confirm-dialog";
import Trash from "@/components/app/trash";
import { Button } from "@/components/ui/button";

type Props = {
  texts: EaOrdersText[];
  emptyText: string;
  onDelete: (uidOrdersText: number) => Promise<void>;
};

export default function OrderTextList({
  texts,
  emptyText,
  onDelete,
}: Props) {
  const [pendingDelete, setPendingDelete] = useState<EaOrdersText | null>(null);

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const uidOrdersText = pendingDelete.uid_orders_texts;
    setPendingDelete(null);
    void onDelete(uidOrdersText);
  };

  return (
    <>
      {texts.length ? (
        texts.map((text) => (
          <div
            key={text.uid_orders_texts}
            className="flex items-start justify-between gap-3 rounded-md border bg-slate-50 px-3 py-2 text-sm"
          >
            <span className="whitespace-pre-wrap">{text.text || "--"}</span>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              aria-label="Delete text"
              title="Delete text"
              onClick={() => setPendingDelete(text)}
            >
              <Trash />
            </Button>
          </div>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      )}
      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        title="Delete text"
        description="Are you sure you want to delete this text?"
        confirmText="Delete"
        onConfirm={confirmDelete}
      />
    </>
  );
}
