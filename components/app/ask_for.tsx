"use client";

import { AlertDialog } from "@/app/dialogs/general/alert_dialog";
import { useDeleteStore } from "@/app/stores/delete/delete_slice";
import { useShallow } from "zustand/react/shallow";

export default function AskFor() {
  const { isDeleteDialogOpen, cancelDelete, confirmDelete, deleteRequest } =
    useDeleteStore(
      useShallow((s) => ({
        isDeleteDialogOpen: s.isDeleteDialogOpen,
        deleteRequest: s.deleteRequest,
        cancelDelete: s.cancelDelete,
        confirmDelete: s.confirmDelete,
      })),
    );

  return (
    <AlertDialog
      open={isDeleteDialogOpen}
      setOpen={() => cancelDelete()}
      onConfirm={confirmDelete}
      // optional: falls dein AlertDialog Text anzeigen kann
      title={deleteRequest?.title || "Caution"}
      description={deleteRequest?.label}
    />
  );
}
