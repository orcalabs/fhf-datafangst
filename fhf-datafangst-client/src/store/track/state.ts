import { AisVmsPosition } from "generated/openapi";

export interface TrackState {
  track?: AisVmsPosition[];
  trackLoading: boolean;
}

export const initialTrackState: TrackState = {
  track: undefined,
  trackLoading: false,
};
