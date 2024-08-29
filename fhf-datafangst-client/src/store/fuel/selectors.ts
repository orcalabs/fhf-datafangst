import { createSelector } from "@reduxjs/toolkit";
import { CurrentTrip, Trip } from "generated/openapi";
import { selectAppState } from "store/selectAppState";
import { selectSelectedOrCurrentTrip } from "store/trip";

export const selectFuelMeasurementsLoading = createSelector(
  selectAppState,
  (state) => state.fuelMeasurementsLoading,
);

export const selectFuelMeasurements = createSelector(
  selectAppState,
  (state) => state.fuelMeasurements,
);

export const selectFuelOfTrip = createSelector(
  selectFuelMeasurements,
  selectSelectedOrCurrentTrip,
  (fuel, trip) => {
    if (!fuel || !trip) {
      return undefined;
    }

    const start = new Date(
      (trip as Trip).start ?? (trip as CurrentTrip).departure,
    );
    const end = new Date((trip as Trip).end ?? new Date());

    const measurements = fuel.filter((f) => {
      const d = new Date(f.timestamp);
      return d >= start && d <= end;
    });

    if (measurements.length < 2) {
      return undefined;
    }

    return measurements[0].fuel - measurements.last()!.fuel;
  },
);
