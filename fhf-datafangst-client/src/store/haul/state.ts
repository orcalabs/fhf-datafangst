import { HaulsArgs } from "api/haulsApi";
import { HaulsFilter } from "models";
import { Haul } from "generated/openapi";

export interface HaulState {
  hauls?: Haul[];
  filteredHauls?: Haul[];
  haulsFilter?: HaulsFilter;
  haulsByArea?: Record<string, Haul[]>;
  haulsLoading: boolean;
  haulsSearch?: HaulsArgs;
}

export const initialHaulState: HaulState = {
  hauls: undefined,
  filteredHauls: undefined,
  haulsFilter: undefined,
  haulsByArea: undefined,
  haulsLoading: false,
  haulsSearch: undefined,
};
