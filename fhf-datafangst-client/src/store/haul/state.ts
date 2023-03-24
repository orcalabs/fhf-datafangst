import { HaulsArgs } from "api/haulsApi";
import { Haul, HaulsGrid } from "generated/openapi";
import { FilterStats } from "models";

export interface HaulState {
  hauls?: Haul[];
  haulsGrid?: HaulsGrid;
  haulsByArea?: Record<string, Haul[]>;
  haulsLoading: boolean;
  haulsGridLoading: boolean;
  haulsSearch?: HaulsArgs;
  selectedHaul?: Haul;
  gearFilterStats?: FilterStats[];
  specieFilterStats?: FilterStats[];
  vesselLengthStats?: FilterStats[];
}

export const initialHaulState: HaulState = {
  hauls: undefined,
  haulsGrid: undefined,
  haulsByArea: undefined,
  haulsLoading: false,
  haulsGridLoading: false,
  haulsSearch: undefined,
  selectedHaul: undefined,
  gearFilterStats: undefined,
  specieFilterStats: undefined,
  vesselLengthStats: undefined,
};
