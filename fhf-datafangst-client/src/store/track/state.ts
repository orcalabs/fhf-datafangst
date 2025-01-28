import { AisVmsPosition, CurrentPosition } from "generated/openapi";

export interface TrackState {
  track?: AisVmsPosition[];
  currentPositions?: CurrentPosition[];
  trackLoading: boolean;
  currentPositionsLoading: boolean;
}

export const initialTrackState: TrackState = {
  track: undefined,
  currentPositions: undefined,
  trackLoading: false,
  currentPositionsLoading: false,
};
