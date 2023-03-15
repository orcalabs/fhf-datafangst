import { Trip } from "generated/openapi";

export interface TripState {
  selectedHaulTrip?: Trip;
}

export const initialTripState: TripState = {
  selectedHaulTrip: undefined,
};
