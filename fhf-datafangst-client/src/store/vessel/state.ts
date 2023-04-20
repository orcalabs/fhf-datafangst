import { Vessel } from "generated/openapi";

export interface VesselState {
  vessels?: Vessel[];
  vesselsByCallsign?: Record<string, Vessel>;
  vesselsByFiskeridirId?: Record<number, Vessel>;
}

export const initialVesselState: VesselState = {
  vessels: undefined,
  vesselsByFiskeridirId: undefined,
  vesselsByCallsign: undefined,
};
