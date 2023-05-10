import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectors";

export const selectTrips = createSelector(
  selectAppState,
  (state) => state.trips,
);

export const selectSelectedTrip = createSelector(
  selectAppState,
  (state) => state.selectedTrip,
);

export const selectTripsSearch = createSelector(
  selectAppState,
  (state) => state.tripsSearch,
);

export const selectTripsLoading = createSelector(
  selectAppState,
  (state) => state.tripsLoading,
);
