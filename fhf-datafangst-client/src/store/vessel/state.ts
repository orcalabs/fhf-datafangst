import {
  CurrentAisPosition,
  Vessel,
  VesselBenchmarks,
} from "generated/openapi";

export interface VesselState {
  vessels?: Vessel[];
  vesselsByCallSign?: Record<string, Vessel>;
  vesselsByFiskeridirId?: Record<number, Vessel>;
  vesselsByMmsi?: Record<number, Vessel>;
  vesselBenchmarks?: VesselBenchmarks;
  estimatedFuelConsumption?: number;
  selectedVessel?: Vessel;
  selectedLiveVessel?: CurrentAisPosition;
}

export const initialVesselState: VesselState = {
  vessels: undefined,
  vesselsByFiskeridirId: undefined,
  vesselsByCallSign: undefined,
  vesselsByMmsi: undefined,
  vesselBenchmarks: undefined,
  estimatedFuelConsumption: undefined,
  selectedVessel: undefined,
  selectedLiveVessel: undefined,
};
