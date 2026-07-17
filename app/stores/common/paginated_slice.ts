import { de } from "date-fns/locale";
import { StateCreator } from "zustand";

export interface PaginatedSliceDelegate<T> {
  getItems: () => T[];
  onSelect: (selectedRow: number, item: T) => void; // statt getItem
}

export interface PaginatedActions {
  start: () => void;
  prev: () => void;
  next: () => void;
  end: () => void;
}

export interface PaginatedSlice<T> {
  delegate: PaginatedSliceDelegate<T> | null;

  selectedRow: number;
  itemOf: string;

  setDelegate: (delegate: PaginatedSliceDelegate<T>) => void;

  goTo: (row: number) => void;
  moveBy: (dir: number) => void;

  actions: PaginatedActions;
}

const wrapIndex = (idx: number, len: number) => ((idx % len) + len) % len;

export const createPaginatedSlice =
  <T>(): StateCreator<PaginatedSlice<T>, [], [], PaginatedSlice<T>> =>
  (set, get) => ({
    delegate: null,
    selectedRow: 0,
    itemOf: "0/0",

    setDelegate: (delegate) => {
      set({ delegate });

      const items = delegate.getItems();
      const len = items.length;

      if (len === 0) {
        set({ selectedRow: 0, itemOf: "0/0" });
        return;
      }

      // auf 0 initialisieren
      delegate.onSelect(0, items[0]);
      set({ selectedRow: 0, itemOf: `1/${len}` });
    },

    goTo: (row) => {
      const delegate = get().delegate;
      if (!delegate) return;

      const items = delegate.getItems();
      const len = items.length;

      if (len === 0) {
        set({ selectedRow: 0, itemOf: "0/0" });
        return;
      }

      const nextRow = wrapIndex(row, len);
      delegate.onSelect(nextRow, items[nextRow]);

      set({ selectedRow: nextRow, itemOf: `${nextRow + 1}/${len}` });
    },

    moveBy: (dir) => {
      const delegate = get().delegate;
      if (!delegate) return;

      const items = delegate.getItems();
      const len = items.length;
      if (len === 0) return;

      const nextRow = wrapIndex(get().selectedRow + dir, len);
      delegate.onSelect(nextRow, items[nextRow]);

      set({ selectedRow: nextRow, itemOf: `${nextRow + 1}/${len}` });
    },

    actions: {
      start: () => get().goTo(0),
      prev: () => get().moveBy(-1),
      next: () => get().moveBy(1),
      end: () => {
        const delegate = get().delegate;
        if (!delegate) return;

        const len = delegate.getItems().length;
        if (len === 0) {
          set({ selectedRow: 0, itemOf: "0/0" });
          return;
        }
        get().goTo(len - 1);
      },
    },
  });
