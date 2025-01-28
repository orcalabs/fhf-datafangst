import { Track } from "models";

export interface AisState {
  ais?: Track;
  aisLoading: boolean;
}

export const initialAisState: AisState = {
  ais: undefined,
  aisLoading: false,
};
