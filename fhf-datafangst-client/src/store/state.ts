import { HaulState, initialHaulState } from "./haul";
import { FishmapState, initialFishmapState } from "./fishmap";
import { initialSpecieState, SpecieState } from "./specie";
import { VesselState, initialVesselState } from "./vessel";

export interface BaseState {
  error: boolean;
}

const initialBaseState: BaseState = {
  error: false,
};

export interface AppState
  extends BaseState,
    FishmapState,
    VesselState,
    HaulState,
    SpecieState {}

export const initialAppState: AppState = {
  ...initialBaseState,
  ...initialFishmapState,
  ...initialVesselState,
  ...initialHaulState,
  ...initialSpecieState,
};
