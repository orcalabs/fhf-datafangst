import { Vessel } from "generated/openapi";

export interface VesselState {
  vessels?: Record<number, Vessel>;
  vesselsByCallsign?: Record<string, Vessel>;
}

export const initialVesselState: VesselState = {
  vessels: undefined,
  vesselsByCallsign: undefined,
};
