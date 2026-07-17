import { EaForksParts } from "./ea_forks_parts";
import { EaOrder } from "./ea_order";

export type EaDetailOrder = {
  order: EaOrder;
  fork_parts?: EaForksParts[];
};
