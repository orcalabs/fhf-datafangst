import { HaulState, initialHaulState } from "./haul";
import { FishmapState, initialFishmapState } from "./fishmap";
import { initialSpecieState, SpecieState } from "./specie";
import { VesselState, initialVesselState } from "./vessel";
import { GearState, initialGearState } from "./gear";
import { AisState, initialAisState } from "./ais";
import { initialTripState, TripState } from "./trip";

export enum ViewMode {
  Grid = "grid",
  Heatmap = "heatmap",
}

export interface BaseState {
  error: boolean;
  viewMode: ViewMode;
  isLoggedIn: boolean;
}

const initialBaseState: BaseState = {
  error: false,
  viewMode: ViewMode.Grid,
  isLoggedIn: false,
};

export interface AppState
  extends BaseState,
    FishmapState,
    VesselState,
    HaulState,
    GearState,
    AisState,
    TripState,
    SpecieState {}

export const initialAppState: AppState = {
  ...initialBaseState,
  ...initialFishmapState,
  ...initialVesselState,
  ...initialHaulState,
  ...initialGearState,
  ...initialAisState,
  ...initialTripState,
  ...initialSpecieState,
};
