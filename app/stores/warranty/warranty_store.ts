import {
  _getWarrantyBy,
  _updateWarrantyStatus,
  _updateWarrantyReason,
} from "@/app/api/warranty/warranty_crud";
import { EaWarranty } from "@/app/data_types/warranty/ea_warranty";
import { create } from "zustand/react";
import { createOrderStore, useOrderStore } from "../order/order_store";
import { useEffect } from "react";
import { toast } from "sonner";

interface WarrantyStore {
  warranty: EaWarranty | null;

  getWarrantyByUidOrder: (uid_order: number) => Promise<void>;
  onWarrantyRequestChange: (value: string) => Promise<void>;
  updateWarrantyReason: (reason: string) => Promise<void>;
}

export const createWarrantyStore = create<WarrantyStore>((set, get) => ({
  warranty: null,

  getWarrantyByUidOrder: async (uid_order: number) => {
    const warranty = await _getWarrantyBy(uid_order);
    set({ warranty });
  },

  onWarrantyRequestChange: async (status: string) => {
    const { order } = createOrderStore.getState();
    if (!order) return;
    try {
      const warranty = await _updateWarrantyStatus(order.uid_order, status);
      set({ warranty });
    } catch {
      toast.error("Warranty status could not be updated.");
      await get().getWarrantyByUidOrder(order.uid_order);
      return;
    }

    toast.success(
      `Warranty ${status === "accept" ? "accepted" : "reset"} successfully!`,
    );
  },

  updateWarrantyReason: async (warranty_reason: string) => {
    const { warranty } = get();
    if (!warranty) return;
    const updated = await _updateWarrantyReason({
      uid_warranty: warranty.uid_warranty,
      warranty_reason,
    });
    set({ warranty: updated });
    toast.success(`Warranty reason updated successfully!`);
  },
}));

export const useWarrantyStore = () => {
  const { order } = useOrderStore();
  const {
    getWarrantyByUidOrder,
    warranty,
    onWarrantyRequestChange,
    updateWarrantyReason,
  } = createWarrantyStore();

  useEffect(() => {
    if (order) {
      getWarrantyByUidOrder(order.uid_order);
    }
  }, [getWarrantyByUidOrder, order]);
  return { warranty, getWarrantyByUidOrder, onWarrantyRequestChange, updateWarrantyReason };
};
