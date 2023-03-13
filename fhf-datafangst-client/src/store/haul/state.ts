import { HaulsArgs } from "api/haulsApi";
import { HaulsFilter } from "models";
import { Haul, HaulsGrid } from "generated/openapi";

export interface HaulState {
  hauls?: Haul[];
  haulsGrid?: HaulsGrid;
  haulsFilter?: HaulsFilter;
  haulsByArea?: Record<string, Haul[]>;
  haulsLoading: boolean;
  haulsGridLoading: boolean;
  haulsSearch?: HaulsArgs;
  selectedHaul?: Haul;
}

export const initialHaulState: HaulState = {
  hauls: undefined,
  haulsGrid: undefined,
  haulsFilter: undefined,
  haulsByArea: undefined,
  haulsLoading: false,
  haulsGridLoading: false,
  haulsSearch: undefined,
  selectedHaul: undefined,
};
