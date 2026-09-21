import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "~/store/selectAppState";

export const selectFuelMeasurementsLoading = createSelector(
  selectAppState,
  (state) => state.fuelMeasurementsLoading,
);

export const selectFuelMeasurements = createSelector(
  selectAppState,
  (state) => state.fuelMeasurements,
);

export const selectFuelMeasurementsAndBunkerings = createSelector(
  selectAppState,
  (state) => state.fuelMeasurementsAndBunkerings,
);

export const selectFuelMeasurementsAndBunkeringsLoading = createSelector(
  selectAppState,
  (state) => state.fuelMeasurementsAndBunkeringsLoading,
);
