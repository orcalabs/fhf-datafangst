import { Vessel, VesselBenchmarks } from "generated/openapi";

export interface VesselState {
  vessels?: Vessel[];
  vesselsByCallSign?: Record<string, Vessel>;
  vesselsByFiskeridirId?: Record<number, Vessel>;
  vesselBenchmarks?: VesselBenchmarks;
}

export const initialVesselState: VesselState = {
  vessels: undefined,
  vesselsByFiskeridirId: undefined,
  vesselsByCallSign: undefined,
  vesselBenchmarks: undefined,
};
