import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { AppState } from "store/state";
import {
  createFuelMeasurement,
  deleteFuelMeasurement,
  getFuelMeasurements,
  updateFuelMeasurement,
} from "./actions";

export const fuelBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(getFuelMeasurements.pending, (state, _) => {
      state.fuelMeasurementsLoading = true;
      state.fuelMeasurements = undefined;
    })
    .addCase(getFuelMeasurements.fulfilled, (state, action) => {
      state.fuelMeasurementsLoading = false;
      state.fuelMeasurements = action.payload;
    })
    .addCase(getFuelMeasurements.rejected, (state, _) => {
      state.fuelMeasurementsLoading = false;
    })
    .addCase(createFuelMeasurement.pending, (state, action) => {
      action.meta.arg.token = state.authUser?.access_token;
    })
    .addCase(createFuelMeasurement.fulfilled, (state, action) => {
      if (state.fuelMeasurements) {
        state.fuelMeasurements = state.fuelMeasurements.concat(action.payload);
        state.fuelMeasurements.sort((a, b) =>
          b.timestamp.localeCompare(a.timestamp),
        );
      } else {
        state.fuelMeasurements = action.payload;
      }
    })
    .addCase(updateFuelMeasurement.pending, (state, action) => {
      action.meta.arg.token = state.authUser?.access_token;
    })
    .addCase(updateFuelMeasurement.fulfilled, (state, action) => {
      const idx = state.fuelMeasurements?.findIndex(
        (f) => f.id === action.meta.arg.id,
      );
      if (idx !== undefined && idx >= 0) {
        state.fuelMeasurements![idx] = {
          ...state.fuelMeasurements![idx],
          ...action.meta.arg,
        };
      }
    })
    .addCase(deleteFuelMeasurement.pending, (state, action) => {
      action.meta.arg.token = state.authUser?.access_token;
    })
    .addCase(deleteFuelMeasurement.fulfilled, (state, action) => {
      const idx = state.fuelMeasurements?.findIndex(
        (f) => f.id === action.meta.arg.id,
      );
      if (idx !== undefined && idx >= 0) {
        state.fuelMeasurements!.splice(idx, 1);
      }
    });
