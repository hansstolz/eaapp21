import { _getOrderById } from "@/app/api/orders/orders_crud";
import Order from "@/data_types/orders/order";
import { useEffect } from "react";
import { create } from "zustand/react";

export interface OrderStore {
  order: Order | null;
  getOrderById: (id: number) => Promise<void>;
  deleteOrderById: (id: number) => Promise<void>;
  updateOrder: () => void;
}

export const createOrderStore = create<OrderStore>((set, get) => ({
  order: null,

  getOrderById: async (id: number) => {
    const eaDetailOrder = await _getOrderById(id);
    const order = new Order(eaDetailOrder);
    set({ order });
  },
  deleteOrderById: async (id: number) => {
    // Implement the logic to delete the order by ID
  },

  updateOrder: () => {
    set({
      order: get().order?.newOrder(),
    });
  },
}));

export const useOrderStore = () => {
  const { order, getOrderById, deleteOrderById, updateOrder } =
    createOrderStore();

  return { order, getOrderById, deleteOrderById, updateOrder };
};
