import { AisArgs } from "api";
import { Track } from "models";

export interface AisState {
  ais?: Track;
  aisLoading: boolean;
  aisSearch?: AisArgs;
}

export const initialAisState: AisState = {
  ais: undefined,
  aisLoading: false,
  aisSearch: undefined,
};
