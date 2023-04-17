import { HaulsArgs, HaulsFilter } from "api/haulsApi";
import { Haul, HaulsMatrix } from "generated/openapi";

export interface HaulState {
  hauls?: Haul[];
  haulsByArea?: Record<string, Haul[]>;
  haulsMatrix?: HaulsMatrix;
  haulsLoading: boolean;
  haulsMatrixLoading: boolean;
  haulsSearch?: HaulsArgs;
  hoveredFilter?: HaulsFilter;
  selectedHaul?: Haul;
}

export const initialHaulState: HaulState = {
  hauls: undefined,
  haulsByArea: undefined,
  haulsMatrix: undefined,
  haulsLoading: false,
  haulsMatrixLoading: false,
  haulsSearch: undefined,
  hoveredFilter: undefined,
  selectedHaul: undefined,
};
