import { create } from "zustand";

export const useDocumentRefreshStore = create<{
  revision: number;
  refreshDocuments: () => void;
}>((set) => ({
  revision: 0,
  refreshDocuments: () => set((state) => ({ revision: state.revision + 1 })),
}));
