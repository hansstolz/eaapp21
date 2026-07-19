import {
  _createCostestimate,
  _getConfirmedCostestimate,
  _getCostestimate,
  _getCostestimatesNumbers,
  _updateCostestimate,
} from "@/app/api/costestimates/costestimate_crud";
import { DropdownItem } from "@/app/data_types/general/dropdown";
import { create } from "zustand/react";
import {
  EaCostestimate,
} from "@/app/data_types/costestimate/ea_costestimate";
import { EaConfirmCost } from "@/app/data_types/costestimate/ea_cofirm_cost";
import { OrderStatus } from "@/app/data_types/orders/order_status";
import { _updateOrderStatus } from "@/app/api/orders/orders_crud";
import { EaOrdersPosition } from "@/app/data_types/orders/ea_orders_position";
import { EaOrdersText } from "@/app/data_types/orders/ea_orders_texts";
import Order from "@/app/data_types/orders/order";
import { toast } from "sonner";
import { EaOrdersPositions } from "@/app/data_types/positions/ea_orders_positions";
import {
  createPaginatedSlice,
  PaginatedSlice,
  PaginatedSliceDelegate,
} from "../common/paginated_slice";

interface CostestimateStore {
  costestimate: EaCostestimate | null;
  positions: EaOrdersPosition[];
  texts: EaOrdersText[];
  costestimates: DropdownItem[];
  selectedNumber: number | null;
  isConfirmed: boolean;
  position: EaOrdersPositions | null;

  getCostestimatesNumbers: (uid_order: number) => Promise<void>;
  getCostestimate: (uid_costestimates: number) => Promise<void>;
  getConfirmedCostestimate: (uid_order: number) => Promise<void>;
  updateCostestimate: (confirm: EaConfirmCost) => Promise<void>;
  addCostestimate: (order: Order, username: string) => Promise<void>;
  addPosition: (position: EaOrdersPositions) => void;
  savePosition: (position: EaOrdersPositions) => void;
  getPosition: (selectedRow: number) => void;
}

export const createCostestimateStore = create<
  CostestimateStore & PaginatedSlice<EaOrdersPosition>
>((set, get, ...a) => {
  const delegate: PaginatedSliceDelegate<EaOrdersPosition> = {
    getItems: () => get().positions,
    onSelect: (_row, item) => {
      // optional: Render sparen
      if (get().position === item) return;
      set({ position: item });
    },
  };
  return {
    ...createPaginatedSlice<EaOrdersPosition>()(set, get, ...a),

    costestimates: [],
    selectedNumber: null,
    isConfirmed: false,
    costestimate: null,
    positions: [],
    texts: [],
    position: null,

    updateCostestimate: async (confirm: EaConfirmCost) => {
      const costestimate = get().costestimate;
      if (costestimate) {
        costestimate.confirmed_how = confirm.confirmed_how
          ? Number(confirm.confirmed_how)
          : null;
        costestimate.confirmed_by = confirm.confirmed_by;
        costestimate.confirmed_when = confirm.confirmed_when;
        costestimate.costestimate_confirm_check = Number(
          confirm.costestimate_confirm_check,
        );
        const result = await _updateCostestimate(costestimate);
        await _updateOrderStatus(
          costestimate.uid_order,
          result.costestimate_confirm_check === 1
            ? OrderStatus.CostestimateConf
            : OrderStatus.Costestimate,
        );

        if (result) {
          set({
            isConfirmed: result.costestimate_confirm_check === 1,
            costestimate: { ...costestimate },
          });
        }
      }
    },

    getCostestimatesNumbers: async (uid_order: number) => {
      const costestimates = await _getCostestimatesNumbers(uid_order);

      set({
        costestimates,
        selectedNumber: costestimates.length
          ? Number(costestimates[0].value)
          : null,
      });
    },

    getCostestimate: async (uid_costestimate: number) => {
      get().setDelegate(delegate);
      const costestimateDetail = await _getCostestimate(uid_costestimate);

      set({
        costestimate: costestimateDetail.costestimate,
        positions: costestimateDetail.positions,
        texts: costestimateDetail.texts,
        isConfirmed:
          costestimateDetail.costestimate.costestimate_confirm_check === 1,
      });
    },

    addCostestimate: async (order: Order, username: string) => {
      if (order) {
        const costestimate = await _createCostestimate(
          username,
          order.customer_category_no!,
          order.uid_order,
          order.user_group!,
        );
        toast.success("Costestimate created");
        if (costestimate) {
          get().getCostestimatesNumbers(order.uid_order);
        }
      }
    },

    getConfirmedCostestimate: async (uid_order: number) => {
      const confirmedCostestimate = await _getConfirmedCostestimate(uid_order);
      set({
        costestimate: confirmedCostestimate,
        positions: confirmedCostestimate ? confirmedCostestimate.positions : [],
        texts: confirmedCostestimate ? confirmedCostestimate.texts : [],
        isConfirmed: confirmedCostestimate !== null,
      });
    },

    addPosition: (position: EaOrdersPositions) => {
      const positions = [...get().positions, position];
      const nextRow = positions.length - 1;

      set({
        positions,
        selectedRow: nextRow,
        itemOf: `${nextRow + 1}/${positions.length}`,
      });
    },

    savePosition: (position: EaOrdersPositions) => {
      set((state) => {
        const positions = state.positions.map((pos) =>
          pos.uid_orders_position === position.uid_orders_position
            ? position
            : pos,
        );
        return { positions, position: null };
      });
    },

    getPosition: (selectedRow: number) => {
      //const positions = get().positions ?? [];
      //const getItemOf = get().getItemOf;
      get().goTo(selectedRow);

      set({
        position: get().position,
        selectedRow,
      });
    },
  };
});

export const useCostestimateStore = () => {
  const {
    costestimate,
    getCostestimatesNumbers,
    getConfirmedCostestimate,
    getCostestimate,
    costestimates,
    isConfirmed,
    updateCostestimate,
    addCostestimate,
    positions,
    position,
    texts,
    selectedNumber,
    itemOf,
    actions,
    addPosition,
    savePosition,
    getPosition,
  } = createCostestimateStore();

  return {
    costestimate,
    costestimates,
    isConfirmed,
    getCostestimate,
    getCostestimatesNumbers,
    getConfirmedCostestimate,
    updateCostestimate,
    addCostestimate,
    positions,
    texts,
    position,
    selectedNumber,
    itemOf,
    actions,
    addPosition,
    savePosition,
    getPosition,
  };
};
