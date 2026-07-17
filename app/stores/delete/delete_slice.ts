import { create } from "zustand/react";

type DeleteRequest = {
  uid: number;
  label: string;
  title: string;
  delete: (uid: number) => Promise<void | boolean>;
};

export interface DeleteStore {
  isDeleteDialogOpen: boolean;
  deleteRequest: DeleteRequest | null;
  openDeleteDialog: (deleteRequest: DeleteRequest) => void;
  cancelDelete: () => void;
  confirmDelete: () => Promise<void>;
}

export const useDeleteStore = create<DeleteStore>((set, get) => ({
  isDeleteDialogOpen: false,
  deleteRequest: null,

  openDeleteDialog: (deleteRequest: DeleteRequest) =>
    set({
      isDeleteDialogOpen: true,
      deleteRequest,
    }),
  cancelDelete: () =>
    set({
      isDeleteDialogOpen: false,
      deleteRequest: null,
    }),
  confirmDelete: async () => {
    const { deleteRequest } = get();
    if (deleteRequest) {
      // Hier kannst du die Löschlogik implementieren
      await deleteRequest.delete(deleteRequest.uid);
    }
    set({
      isDeleteDialogOpen: false,
      deleteRequest: null,
    });
  },
}));
