import { TripsArgs } from "api";
import { CurrentTrip, Trip } from "generated/openapi";

export enum TripTrackIdentifier {
  TripId = 1,
  MmsiCallSign = 2,
}

export interface TripState {
  trips?: Trip[];
  currentTrip?: CurrentTrip;
  tripsLoading: boolean;
  currentTripLoading: boolean;
  selectedTrip?: Trip;
  tripsSearch?: TripsArgs;
  tripTrackIdentifier: TripTrackIdentifier;
}

export const initialTripState: TripState = {
  trips: undefined,
  currentTrip: undefined,
  tripsLoading: false,
  currentTripLoading: false,
  selectedTrip: undefined,
  tripsSearch: undefined,
  tripTrackIdentifier: TripTrackIdentifier.TripId,
};
