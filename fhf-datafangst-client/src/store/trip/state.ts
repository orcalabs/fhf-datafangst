import { TripsArgs } from "api";
import { CurrentTrip, Trip } from "generated/openapi";

export interface TripState {
  trips?: Trip[];
  currentTrip?: CurrentTrip;
  tripsLoading: boolean;
  currentTripLoading: boolean;
  selectedTrip?: Trip;
  tripsSearch?: TripsArgs;
}

export const initialTripState: TripState = {
  trips: undefined,
  currentTrip: undefined,
  tripsLoading: false,
  currentTripLoading: false,
  selectedTrip: undefined,
  tripsSearch: undefined,
};
