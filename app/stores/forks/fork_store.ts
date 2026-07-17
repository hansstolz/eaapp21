import { _getCustomerForkByIds } from "@/app/api/customers/customers_crud";
import {
  _getForkById,
  _getForkReferences,
  _getOrdersByForkId,
  _updateFork,
} from "@/app/api/forks/forks_crud";
import { TCustForkResult } from "@/data_types/customer/ea_customer_fork";
import {
  EaForks,
  EaForksParts,
  EaForksReferences,
  TForkOrder,
} from "@/data_types/forks/ea_forks";
import { DropdownItem } from "@/data_types/general/dropdown";
import { FiFilePlus, FiUser } from "react-icons/fi";
import { toast } from "sonner";
import { create } from "zustand/react";

export interface ForkStore {
  fork: EaForks | null;
  ref_parts: EaForksParts[];
  ref_forks: DropdownItem[];
  ref_categories: DropdownItem[];
  ref_colors: DropdownItem[];
  ref_wheelsizes: DropdownItem[];
  orders: TForkOrder[];
  isNew: boolean;
  uid: number;
  tabValues: DropdownItem[];
  customerFork: TCustForkResult | null;

  setFork: (fork: EaForks | null) => void;
  setRefParts: (parts: EaForksParts[]) => void;
  getForkById: (uid_fork: number) => Promise<void>;
  getForkReferences: () => Promise<void>;
  getCustomerForkByIds: () => Promise<void>;
  getOrdersByForkId: () => Promise<void>;
  updateFork: (data: EaForks) => Promise<void>;
}

export const useForkStore = create<ForkStore>((set, get) => ({
  fork: null,
  ref_parts: [],
  ref_forks: [],
  ref_categories: [],
  ref_colors: [],
  ref_wheelsizes: [],
  isNew: false,
  orders: [],
  customerFork: null,
  uid: 0,
  tabValues: [
    { uid: 1, label: "Customer", value: "Customer", icon: FiUser },
    { uid: 2, label: "Orders", value: "Orders", icon: FiFilePlus },
  ],

  setFork: (fork: EaForks | null) => set({ fork }),
  setRefParts: (parts: EaForksParts[]) => set({ ref_parts: parts }),

  getForkById: async (uid_fork: number) => {
    if (uid_fork > 0) {
      const forkDetail = await _getForkById(uid_fork);
      set({
        fork: forkDetail.fork,
        ref_parts: forkDetail.parts,
        isNew: false,
        uid: uid_fork,
      });
    } else {
      set({ fork: null, ref_parts: [], isNew: true, uid: 0 });
    }
  },
  getForkReferences: async () => {
    const references: EaForksReferences = await _getForkReferences();
    set({
      ref_forks: references.ref_forks,
      ref_categories: references.ref_categories,
      ref_colors: references.ref_colors,
      ref_wheelsizes: references.ref_wheelsizes,
    });
  },

  getCustomerForkByIds: async () => {
    const fork = get().fork;
    if (!fork) {
      return;
    }
    const uid_customer = fork.uid_customer;
    const uid_fork = fork.uid_fork;
    const customerFork = await _getCustomerForkByIds(uid_customer, uid_fork);
    set({ customerFork });
  },

  getOrdersByForkId: async () => {
    const fork = get().fork;
    if (!fork) {
      return;
    }
    const uid_fork = fork.uid_fork;
    const orders = await _getOrdersByForkId(uid_fork);
    set({ orders });
  },

  updateFork: async (data: EaForks) => {
    data.uid_fork = get().uid;
    const updatedFork = await _updateFork(data);
    if (!updatedFork) {
      toast.error("Error updating fork");
      return;
    }
    toast.success("Fork updated successfully");
    set({ fork: updatedFork });
  },
}));
