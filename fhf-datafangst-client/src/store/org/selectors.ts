import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectAppState";

export const selectOrgBenchmarks = createSelector(
  selectAppState,
  (state) => state.orgBenchmarks,
);

export const selectOrgBenchmarksLoading = createSelector(
  selectAppState,
  (state) => state.orgBenchmarksLoading,
);

export const selectOrgFuelConsumption = createSelector(
  selectAppState,
  (state) => state.orgFuelConsumption,
);
