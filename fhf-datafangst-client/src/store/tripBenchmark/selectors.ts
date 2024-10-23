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
