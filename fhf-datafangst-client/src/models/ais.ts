import { AisPosition } from "generated/openapi";

export interface Track {
  mmsi: number;
  positions: AisPosition[];
}
