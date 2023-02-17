import { FishmapState, initialFishmapState } from "./fishmap";
import { VesselState, initialVesselState } from "./vessel";

export interface BaseState {
  error: boolean;
}

const initialBaseState: BaseState = {
  error: false,
};

export interface AppState extends BaseState, FishmapState, VesselState {}

export const initialAppState: AppState = {
  ...initialBaseState,
  ...initialFishmapState,
  ...initialVesselState,
};
