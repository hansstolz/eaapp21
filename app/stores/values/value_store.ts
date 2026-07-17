import { create } from "zustand";
import { EaValues } from "@/app/data_types/user/ea_values";
import { toast } from "sonner";

type Mode = "create" | "edit" | null;

interface ValueStore {
  values: EaValues[];
  selectedType: string;
  selectedValueId: number | null;
  showDialog: boolean;
  mode: Mode;
  setSelectedType: (type: string) => void;
  loadValues: (type?: string) => Promise<void>;
  openCreate: () => void;
  openEdit: (uid: number) => void;
  setShowDialog: (open: boolean) => void;
  closeDialog: () => void;
  deleteValue: (uid: number) => Promise<void>;
  submitData: (data: EaValues) => Promise<boolean>;
}

export const useValueStore = create<ValueStore>((set, get) => ({
  values: [],
  selectedType: "",
  selectedValueId: null,
  showDialog: false,
  mode: null,

  setSelectedType: (type) => set({ selectedType: type }),

  loadValues: async (type) => {
    const currentType = type ?? get().selectedType;
    if (!currentType) return;
    const response = await fetch(
      `/values/get_values/${encodeURIComponent(currentType)}`,
    );
    if (!response.ok) {
      toast.error("Failed to load values");
      return;
    }
    const values = (await response.json()) as EaValues[];
    set({ values, selectedType: currentType });
  },

  openCreate: () => {
    set({
      mode: "create",
      selectedValueId: null,
      showDialog: true,
    });
  },

  openEdit: (uid) => {
    set({
      mode: "edit",
      selectedValueId: uid,
      showDialog: true,
    });
  },

  setShowDialog: (open) => set({ showDialog: open }),

  closeDialog: () => {
    set({
      showDialog: false,
      mode: null,
      selectedValueId: null,
    });
  },

  deleteValue: async (uid) => {
    const response = await fetch(`/values/delete_values/${uid}`, {
      method: "DELETE",
    });
    if (response.ok) {
      const updatedValues = get().values.filter(
        (item) => item.uid_value !== uid
      );
      set({ values: updatedValues });
      toast.success("Value deleted successfully");
    } else {
      toast.error("Error deleting value");
    }
  },

  submitData: async (data) => {
    const mode = get().mode;
    const response = await fetch(
      mode === "create" ? "/values/create_values" : "/values/update_values",
      {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );
    const res = response.ok ? ((await response.json()) as EaValues) : null;

    if (res?.uid_value) {
      toast.success("Values updated successfully");
      get().closeDialog();
      await get().loadValues();
      return true;
    }

    toast.error("Failed to update values");
    return false;
  },
}));

export const useSelectedValue = () =>
  useValueStore(
    (s) => s.values.find((v) => v.uid_value === s.selectedValueId) ?? null
  );
