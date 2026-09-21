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

export const selectFuelMeasurementsScrollable = createSelector(
  selectAppState,
  (state) => state.fuelMeasurementsScrollable,
);

export const selectFuelPostStatus = createSelector(
  selectAppState,
  (state) => state.fuelPostStatus,
);

export const selectLastFuelMeasurement = createSelector(
  selectAppState,
  (state) => {
    if (
      state.activeUserHaul &&
      (state.lastFuelMeasurement === undefined ||
        new Date(state.activeUserHaul.startTs) >
          new Date(state.lastFuelMeasurement?.timestamp))
    ) {
      return state.activeUserHaul.startFuelLiter;
    } else {
      return state.lastFuelMeasurement?.fuel;
    }
  },
);

export const selectFuelMeasurementsAndBunkerings = createSelector(
  selectAppState,
  (state) => state.fuelMeasurementsAndBunkerings,
);

export const selectFuelMeasurementsAndBunkeringsLoading = createSelector(
  selectAppState,
  (state) => state.fuelMeasurementsAndBunkeringsLoading,
);
