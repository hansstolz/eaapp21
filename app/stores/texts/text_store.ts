import { EaText } from "@/app/data_types/text/ea_text";
import { EaTextUpdate } from "@/app/data_types/text/ea_text_update";
import { toast } from "sonner";
import { create } from "zustand";

type Mode = "create" | "edit" | null;

interface TextStore {
  mode: Mode;
  texts: EaText[];
  selectedTextID: number | null | undefined;
  hasChanges: boolean;
  showDialog: boolean;
  setTexts: (texts: EaText[]) => void;
  loadTexts: () => Promise<void>;
  deleteText: (uid: number | undefined) => Promise<void>;
  reorderTexts: (texts: EaText[]) => void;
  updateOrderTexts: () => Promise<void>;
  isUpdating: boolean;
  selectText: (uid: number | undefined) => void;
  setShowDialog: (open: boolean) => void;
  submitData: (data: EaText) => Promise<boolean>;
}

export const useTextStore = create<TextStore>((set, get) => ({
  mode: null,
  texts: [],
  selectedTextID: null,
  hasChanges: false,
  isUpdating: false,
  showDialog: false,
  setTexts: (texts: EaText[]) => set({ texts }),
  loadTexts: async () => {
    const response = await fetch("/text/get_all");
    if (!response.ok) {
      toast.error("Failed to load texts");
      return;
    }
    const texts = (await response.json()) as EaText[];
    set({ texts });
  },

  deleteText: async (uid_text: number | undefined) => {
    if (uid_text === undefined) return;
    const response = await fetch(`/text/delete_text/${uid_text}`, {
      method: "DELETE",
    });
    if (response.ok) {
      const updated = get()
        .texts.filter((item) => item.uid_text !== uid_text)
        .map((item, index) => ({
          ...item,
          text_no: index + 1,
        }));
      set({ texts: updated });
      toast.success("Text deleted successfully");
    } else {
      toast.error("Error deleting text");
    }
  },

  reorderTexts: (reorderedTexts: EaText[]) => {
    const texts = reorderedTexts.map((item, index) => ({
      ...item,
      text_no: index + 1,
    }));

    set({ texts, hasChanges: true });
  },
  updateOrderTexts: async () => {
    const texts = useTextStore.getState().texts;
    set({ isUpdating: true });
    const updatedData: EaTextUpdate[] = texts.map((item) => ({
      uid_text: item.uid_text,
      text_no: item.text_no,
    }));
    const response = await fetch("/text/update_order", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) toast.error("Failed to update text order");
    set({ hasChanges: !response.ok, isUpdating: false });
  },

  selectText: (uid) => {
    set({
      selectedTextID: uid,
      showDialog: true,
      mode: uid ? "edit" : "create",
    });
  },
  setShowDialog: (open: boolean) => set({ showDialog: open }),

  submitData: async (data: EaText) => {
    const mode = useTextStore.getState().mode;
    const response = await fetch(
      mode === "create" ? "/text/create_text" : "/text/update_text",
      {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );
    const res = response.ok ? ((await response.json()) as EaText) : null;

    if (res?.uid_text) {
      toast.success("Text updated successfully");
      get().setShowDialog(false);
      await get().loadTexts();
      set({ mode: null, selectedTextID: null });
      return true;
    } else {
      toast.error("Failed to update text");
      return false;
    }
  },
}));

export const useSelectedText = () =>
  useTextStore(
    (s) => s.texts.find((f) => f.uid_text === s.selectedTextID) ?? null,
  );
