import { Vessel, VesselBenchmarks } from "generated/openapi";

export interface VesselState {
  vessels?: Vessel[];
  vesselsByCallSign?: Record<string, Vessel>;
  vesselsByFiskeridirId?: Record<number, Vessel>;
  vesselBenchmarks?: VesselBenchmarks;
  estimatedFuelConsumption?: number;
}

export const initialVesselState: VesselState = {
  vessels: undefined,
  vesselsByFiskeridirId: undefined,
  vesselsByCallSign: undefined,
  vesselBenchmarks: undefined,
  estimatedFuelConsumption: undefined,
};
