import { Vessel } from "models";

export interface VesselState {
  vessels?: Record<number, Vessel>;
  selectedVessel?: Vessel;
}

export const initialVesselState: VesselState = {
  vessels: undefined,
  selectedVessel: undefined,
};
