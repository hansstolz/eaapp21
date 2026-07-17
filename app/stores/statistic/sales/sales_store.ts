import { _getRefforks } from "@/app/api/refforks/crud";
import {
  _getForksStat,
  _getForksState,
  _getRefForks,
  _getRefs,
  _getRevenue,
  _getWarrantyRevenue,
  EaStatDate,
  ForkResult,
  RefForksResult,
} from "@/app/api/sales/sales";
import { Revenue, WarrantyRevenue } from "@/data_types/sales/sales";
import { create } from "zustand/react";

interface SalesStore {
  revenue: Revenue;
  warrantyRevenue: WarrantyRevenue;
  forkResult: ForkResult;
  refsForksResult: RefForksResult;
  refsResult: RefForksResult;
  loadRevenue: (date: EaStatDate) => Promise<void>;
  loadWarrantyRevenue: (date: EaStatDate) => Promise<void>;
  loadForksStat: (date: EaStatDate) => Promise<void>;
  loadRefsForksResult: () => Promise<void>;
  loadRefsResult: () => Promise<void>;
}

export const useSalesStore = create<SalesStore>((set, get) => ({
  revenue: {
    sumDealer: 0,
    sumPrivate: 0,
    sumDealerPaid: 0,
    sumPrivatePaid: 0,
    countDealer: 0,
    countPrivate: 0,
    sumTotal: 0,
    sumCount: 0,
    sumTotalPaid: 0,
    directSalesSum: 0,
    directSales: 0,
  },
  warrantyRevenue: {
    sum: 0,
    labour: 0,
    material: 0,
    freight: 0,
    count: "",
  },
  forkResult: {
    forks: [],
    count: 0,
    sum: 0,
    sumWarranty: 0,
    countDirektSales: 0,
  },
  refsForksResult: {
    forks: [],
    sum: 0,
  },
  refsResult: {
    forks: [],
    sum: 0,
  },

  loadRevenue: async (date: EaStatDate) => {
    const revenue = await _getRevenue(date);
    set({ revenue });
  },

  loadWarrantyRevenue: async (date: EaStatDate) => {
    const warrantyRevenue = await _getWarrantyRevenue(date);
    set({ warrantyRevenue });
  },
  loadForksStat: async (date: EaStatDate) => {
    const forkResult = await _getForksState(date);
    set({ forkResult });
  },

  loadRefsForksResult: async () => {
    const refsForksResult = await _getRefForks();
    set({ refsForksResult });
  },

  loadRefsResult: async () => {
    const refsResult = await _getRefs();
    set({ refsResult });
  },
}));
