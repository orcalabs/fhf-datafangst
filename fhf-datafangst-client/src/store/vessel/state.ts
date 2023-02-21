import { Vessel } from "models";

export interface VesselState {
  vessels?: Record<number, Vessel>;
}

export const initialVesselState: VesselState = {
  vessels: undefined,
};
