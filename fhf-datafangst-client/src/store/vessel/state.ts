import {
  CurrentPosition,
  LiveFuel,
  Vessel,
  VesselBenchmarks,
} from "generated/openapi";

export interface VesselState {
  vessels?: Vessel[];
  vesselsByCallSign?: Record<string, Vessel>;
  vesselsByFiskeridirId?: Record<number, Vessel>;
  vesselBenchmarks?: VesselBenchmarks;
  estimatedFuelConsumption?: number;
  selectedVessel?: Vessel;
  selectedLiveVessel?: CurrentPosition;
  estimatedLiveFuelConsumption?: LiveFuel;
}

export const initialVesselState: VesselState = {
  vessels: undefined,
  vesselsByFiskeridirId: undefined,
  vesselsByCallSign: undefined,
  vesselBenchmarks: undefined,
  estimatedFuelConsumption: undefined,
  selectedVessel: undefined,
  selectedLiveVessel: undefined,
  estimatedLiveFuelConsumption: undefined,
};
