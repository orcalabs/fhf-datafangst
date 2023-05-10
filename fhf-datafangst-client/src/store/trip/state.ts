import { TripsArgs } from "api";
import { Trip } from "generated/openapi";

export interface TripState {
  trips?: Trip[];
  tripsLoading: boolean;
  selectedTrip?: Trip;
  tripsSearch?: TripsArgs;
}

export const initialTripState: TripState = {
  trips: undefined,
  tripsLoading: false,
  selectedTrip: undefined,
  tripsSearch: undefined,
};
