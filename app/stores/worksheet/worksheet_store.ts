import { useEffect } from "react";
import { create } from "zustand/react";
import { toast } from "sonner";
import type { DropdownItem } from "@/app/data_types/data/values_data";
import type { WorksheetForm } from "@/app/(startseite)/orders/detail/[id]/Tabs/worksheet/WorksheetSchema";
import {
  _getWorksheetByUidOrder,
  _updateWorksheet,
} from "@/app/api/worksheet/worksheet_crud";
import { useOrderStore } from "@/app/stores/order/order_store";

type WorksheetStore = {
  worksheet: WorksheetForm | null;
  compr_in: DropdownItem[];
  neg_spring: DropdownItem[];
  oil_viscosity: DropdownItem[];
  coil_spring: DropdownItem[];
  air_pressure: DropdownItem[];
  loadWorksheet: (uidOrder: number) => Promise<void>;
  saveWorksheet: (data: WorksheetForm) => Promise<void>;
};

const createWorksheetStore = create<WorksheetStore>((set) => ({
  worksheet: null,
  compr_in: [],
  neg_spring: [],
  oil_viscosity: [],
  coil_spring: [],
  air_pressure: [],
  loadWorksheet: async (uidOrder) => {
    const detail = await _getWorksheetByUidOrder(uidOrder);
    set(detail);
  },
  saveWorksheet: async (data) => {
    const worksheet = await _updateWorksheet(data);
    set({ worksheet });
    toast.success("Worksheet updated");
  },
}));

export function useWorksheetStore() {
  const { order } = useOrderStore();
  const store = createWorksheetStore();
  const { loadWorksheet } = store;

  useEffect(() => {
    if (order) void loadWorksheet(order.uid_order);
  }, [loadWorksheet, order]);

  return store;
}
