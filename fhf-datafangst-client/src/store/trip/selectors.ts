import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectors";

export const selectTrips = createSelector(
  selectAppState,
  (state) => state.trips,
);

export const selectCurrentTrip = createSelector(
  selectAppState,
  (state) => state.currentTrip,
);

export const selectCurrentTripLoading = createSelector(
  selectAppState,
  (state) => state.currentTripLoading,
);

export const selectSelectedTrip = createSelector(
  selectAppState,
  (state) => state.selectedTrip,
);

export const selectSelectedOrCurrentTrip = createSelector(
  selectAppState,
  (state) => state.selectedTrip ?? state.currentTrip,
);

export const selectTripsSearch = createSelector(
  selectAppState,
  (state) => state.tripsSearch,
);

export const selectTripsLoading = createSelector(
  selectAppState,
  (state) => state.tripsLoading,
);
