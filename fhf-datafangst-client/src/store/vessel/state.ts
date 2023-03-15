import { Vessel } from "generated/openapi";

export interface VesselState {
  vessels?: Record<number, Vessel>;
  vesselsByCallsign?: Record<string, Vessel>;
  vesselsByFiskeridirId?: Record<number, Vessel>;
}

export const initialVesselState: VesselState = {
  vessels: undefined,
  vesselsByFiskeridirId: undefined,
  vesselsByCallsign: undefined,
};
