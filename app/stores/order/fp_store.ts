"use client";

import {
  _createForkPart,
  _deleteForkPart,
  _getForkPartsByForkId,
  _updateForkPart,
} from "@/app/api/forksparts/forksparts_crud";
import { EaForksParts } from "@/data_types/forks/ea_forks";
import { create } from "zustand";
import {
  createPaginatedSlice,
  PaginatedSlice,
  PaginatedSliceDelegate,
} from "../common/paginated_slice";
import { toast } from "sonner";

export interface ForkPartsStore {
  items: EaForksParts[];
  forkPart: EaForksParts | null;
  newRec: boolean;

  onOpenDialog: (
    newRec: boolean,
    selectedRow: number,
    forkPart: EaForksParts | null,
  ) => void;

  getForkParts: (uid_fork: number) => Promise<void>;
  addForkPart: (part: EaForksParts) => Promise<void>;
  deleteForkPart: (uid: number) => Promise<boolean>;
  updateForkPart: (part: EaForksParts) => Promise<void>;
  setNewRec: (newRec: boolean) => void;
}

export const useForkPartsStore = create<
  ForkPartsStore & PaginatedSlice<EaForksParts>
>((set, get, ...a) => {
  // Delegate lebt im Store und greift auf items zu (einzige Quelle)
  const delegate: PaginatedSliceDelegate<EaForksParts> = {
    getItems: () => get().items,
    onSelect: (_row, item) => {
      // optional: Render sparen
      if (get().forkPart === item) return;
      set({ forkPart: item });
    },
  };

  return {
    ...createPaginatedSlice<EaForksParts>()(set, get, ...a),

    items: [],
    forkPart: null,
    newRec: false,

    setNewRec: (newRec) => set({ newRec }),

    onOpenDialog: (newRec, selectedRow, forkPart) => {
      // erst Row setzen (setzt auch forkPart via delegate.onSelect)
      get().goTo(selectedRow);

      set({
        newRec,
        // wenn explizit ein forkPart übergeben wird, überschreibt er:
        forkPart: forkPart ?? get().forkPart,
      });
    },

    getForkParts: async (uid_fork: number) => {
      // Delegate einmal setzen (damit Pagination weiß, wo items herkommen)
      get().setDelegate(delegate);

      const forkParts = await _getForkPartsByForkId(uid_fork);

      set({ items: forkParts, forkPart: null });

      // Pagination + Auswahl konsistent machen:
      if (forkParts.length > 0) {
        get().goTo(0); // setzt selectedRow, itemOf, forkPart über delegate
      } else {
        set({ selectedRow: 0, itemOf: "0/0" });
      }
    },

    addForkPart: async (part: EaForksParts) => {
      const result = await _createForkPart(part);

      toast.success("Fork part added");

      set((state) => {
        const nextItems = [...state.items, result];
        const nextRow = nextItems.length - 1;

        return {
          items: nextItems,
          selectedRow: nextRow,
          itemOf: `${nextRow + 1}/${nextItems.length}`,
          forkPart: result,
        };
      });
    },

    deleteForkPart: async (uid: number) => {
      const ok = await _deleteForkPart(uid);
      if (!ok) return false;

      toast.success("Fork part deleted");
      set((state) => {
        const nextItems = state.items.filter(
          (item) => item.uid_forks_part !== uid,
        );

        if (nextItems.length === 0) {
          return {
            items: [],
            forkPart: null,
            selectedRow: 0,
            itemOf: "0/0",
          };
        }

        const nextRow = Math.min(state.selectedRow, nextItems.length - 1);
        return {
          items: nextItems,
          selectedRow: nextRow,
          itemOf: `${nextRow + 1}/${nextItems.length}`,
          forkPart: nextItems[nextRow],
        };
      });
      return true;
    },

    updateForkPart: async (part: EaForksParts) => {
      const result = await _updateForkPart(part);
      toast.success("Fork part updated");

      set((state) => {
        const nextItems = state.items.map((p) =>
          p.uid_forks_part === result.uid_forks_part ? result : p,
        );

        const nextForkPart =
          state.forkPart?.uid_forks_part === result.uid_forks_part
            ? result
            : state.forkPart;

        return {
          items: nextItems,
          forkPart: nextForkPart,
        };
      });
    },
  };
});
