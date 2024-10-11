import { Vessel, VesselBenchmarks } from "generated/openapi";

export interface VesselState {
  vessels?: Vessel[];
  vesselsByCallsign?: Record<string, Vessel>;
  vesselsByFiskeridirId?: Record<number, Vessel>;
  vesselBenchmarks?: VesselBenchmarks;
}

export const initialVesselState: VesselState = {
  vessels: undefined,
  vesselsByFiskeridirId: undefined,
  vesselsByCallsign: undefined,
  vesselBenchmarks: undefined,
};
