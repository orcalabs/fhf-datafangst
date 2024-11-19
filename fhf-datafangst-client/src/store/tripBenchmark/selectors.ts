import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectAppState";

export const selectTripBenchmarks = createSelector(
  selectAppState,
  (state) => state.tripBenchmarks,
);

export const selectTripBenchmarksLoading = createSelector(
  selectAppState,
  (state) => state.tripBenchmarksLoading,
);

export const selectAverageTripBenchmarks = createSelector(
  selectAppState,
  (state) => state.averageTripBenchmarks,
);

export const selectEeoi = createSelector(selectAppState, (state) => state.eeoi);

export const selectEeoiLoading = createSelector(
  selectAppState,
  (state) => state.eeoiLoading,
);

export const selectAverageEeoi = createSelector(
  selectAppState,
  (state) => state.averageEeoi,
);

export const selectAverageEeoiLoading = createSelector(
  selectAppState,
  (state) => state.averageEeoiLoading,
);
