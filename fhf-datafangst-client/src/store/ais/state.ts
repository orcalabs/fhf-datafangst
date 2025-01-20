import { CurrentAisPosition } from "generated/openapi";
import { Track } from "models";

export interface AisState {
  ais?: Track;
  currentPositions?: CurrentAisPosition[];
  aisLoading: boolean;
  currentPositionsLoading: boolean;
}

export const initialAisState: AisState = {
  ais: undefined,
  currentPositions: undefined,
  aisLoading: false,
  currentPositionsLoading: false,
};
