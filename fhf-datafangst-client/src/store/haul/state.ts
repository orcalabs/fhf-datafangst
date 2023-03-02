import { HaulsArgs } from "api/haulsApi";
import { Haul } from "models";

export interface HaulState {
  hauls?: Haul[];
  haulsByArea?: Record<string, Haul[]>;
  haulsLoading: boolean;
  haulsSearch?: HaulsArgs;
}

export const initialHaulState: HaulState = {
  hauls: undefined,
  haulsByArea: undefined,
  haulsLoading: false,
  haulsSearch: undefined,
};
