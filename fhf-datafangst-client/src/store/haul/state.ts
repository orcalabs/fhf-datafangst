import { HaulsArgs } from "api/haulsApi";
import { Haul } from "models";

export interface HaulState {
  hauls?: Haul[];
  haulsLoading: boolean;
  haulsSearch?: HaulsArgs;
}

export const initialHaulState: HaulState = {
  hauls: undefined,
  haulsLoading: false,
  haulsSearch: undefined,
};
