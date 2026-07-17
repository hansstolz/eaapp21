import { create } from "zustand";
import {
  create_value,
  delete_value,
  get_value_by_type,
  update_value,
} from "@/app/api/values/crud";
import { EaValues } from "@/data_types/user/ea_values";
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
    const values = await get_value_by_type(currentType);
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
    const result = await delete_value(uid);
    if (result.status === 200) {
      const updatedValues = get().values.filter(
        (item) => item.uid_value !== uid
      );
      set({ values: updatedValues });
      toast.success("Form deleted successfully");
    } else {
      toast.error("Error deleting form");
    }
  },

  submitData: async (data) => {
    const mode = get().mode;
    const res =
      mode === "create" ? await create_value(data) : await update_value(data);

    if (res.uid_value) {
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
