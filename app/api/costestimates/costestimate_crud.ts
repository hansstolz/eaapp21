import type {
  CostestimateDetail,
  EaCostestimate,
} from "@/app/data_types/costestimate/ea_costestimate";
import type { DropdownItem } from "@/app/data_types/general/dropdown";
import type { EaOrdersPositions } from "@/app/data_types/positions/ea_orders_positions";

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) throw new Error(`Request failed (${response.status}).`);
  return response.json() as Promise<T>;
}

const json = (method: "POST" | "PUT", data: unknown): RequestInit => ({
  method, headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

export const _getCostestimatesNumbers = (uidOrder: number) =>
  request<DropdownItem[]>(`/orders/get_costestimates_numbers/${uidOrder}`);
export const _getCostestimate = (uid: number) =>
  request<CostestimateDetail>(`/orders/get_costestimate/${uid}`);
export const _getConfirmedCostestimate = (uidOrder: number) =>
  request<(EaCostestimate & { positions: CostestimateDetail["positions"]; texts: CostestimateDetail["texts"] }) | null>(
    `/orders/get_confirmed_costestimate/${uidOrder}`,
  );
export const _updateCostestimate = (data: EaCostestimate) =>
  request<EaCostestimate>("/orders/update_costestimate", json("PUT", data));
export const _createCostestimate = (
  user: string,
  customerCategoryNo: number,
  uidOrder: number,
  _userGroup: string,
) => {
  void _userGroup;
  return request<EaCostestimate>("/orders/create_costestimate", json("POST", {
    user, customer_category_no: customerCategoryNo, uid_order: uidOrder,
  }));
};

export const _createCostestimatePosition = (position: EaOrdersPositions) =>
  request<EaOrdersPositions>(
    "/orders/create_costestimate_position",
    json("POST", position),
  );

export const _updateCostestimatePosition = (position: EaOrdersPositions) =>
  request<EaOrdersPositions>(
    "/orders/update_costestimate_position",
    json("PUT", position),
  );

export const _deleteCostestimatePosition = (uidPosition: number) =>
  request<EaOrdersPositions>(
    `/orders/delete_costestimate_position/${uidPosition}`,
    { method: "DELETE" },
  );
