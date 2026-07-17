import {
  _getWarrantyBy,
  _resetWarrantyNumber,
  _updateWarrantyNumber,
  _updateWarrantyReason,
} from "@/app/api/warranty/warranty_crud";
import { EaWarranty } from "@/data_types/warranty/ea_warranty";
import { create } from "zustand/react";
import { useOrderStore } from "../order/order_store";
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
    const { warranty } = get();
    if (!warranty) return;
    status === "accept"
      ? warranty && (await _updateWarrantyNumber(warranty.uid_warranty))
      : warranty && (await _resetWarrantyNumber(warranty.uid_warranty));

    toast.success(
      `Warranty ${status === "accept" ? "accepted" : "reset"} successfully!`,
    );
  },

  updateWarrantyReason: async (warranty_reason: string) => {
    const { warranty } = get();
    if (!warranty) return;
    await _updateWarrantyReason({
      uid_warranty: warranty.uid_warranty,
      warranty_reason,
    });
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
  }, [order]);
  return { warranty, onWarrantyRequestChange, updateWarrantyReason };
};
