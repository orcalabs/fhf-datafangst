import type { Vessel } from "~/generated/openapi";

export interface VesselState {
  vessels?: Vessel[];
}

export const initialVesselState: VesselState = {
  vessels: undefined,
};
