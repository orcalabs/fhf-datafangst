import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import type { AppState } from "~/store/state";
import {
  createFuelMeasurement,
  deleteFuelMeasurement,
  getFuelMeasurements,
  resetFuelPostStatus,
  updateFuelMeasurement,
} from "./actions";

export const fuelBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(getFuelMeasurements.pending, (state, action) => {
      action.meta.arg.callSignOverride = state.selectedCallSign;
      action.meta.arg.token = state.authUser?.access_token;
      action.meta.arg.limit += 1;
      state.fuelMeasurementsLoading = true;
      if (action.meta.arg.offset === 0) {
        state.fuelMeasurements = undefined;
      }
    })
    .addCase(getFuelMeasurements.fulfilled, (state, action) => {
      const newMeasurements = action.payload.slice(
        0,
        action.meta.arg.limit - 1,
      );

      state.fuelMeasurements = state.fuelMeasurements
        ? state.fuelMeasurements.concat(newMeasurements)
        : newMeasurements;

      state.fuelMeasurementsLoading = false;
      state.fuelMeasurementsScrollable =
        action.payload.length === action.meta.arg.limit;
    })
    .addCase(getFuelMeasurements.rejected, (state, _) => {
      state.fuelMeasurementsLoading = false;
    })
    .addCase(createFuelMeasurement.pending, (state, action) => {
      action.meta.arg.callSignOverride = state.selectedCallSign;
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
      state.fuelPostStatus = "success";
    })
    .addCase(createFuelMeasurement.rejected, (state, _) => {
      state.fuelPostStatus = "error";
    })
    .addCase(updateFuelMeasurement.pending, (state, action) => {
      action.meta.arg.callSignOverride = state.selectedCallSign;
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
      state.fuelPostStatus = "success";
    })
    .addCase(updateFuelMeasurement.rejected, (state, _) => {
      state.fuelPostStatus = "error";
    })
    .addCase(deleteFuelMeasurement.pending, (state, action) => {
      action.meta.arg.callSignOverride = state.selectedCallSign;
      action.meta.arg.token = state.authUser?.access_token;
    })
    .addCase(deleteFuelMeasurement.fulfilled, (state, action) => {
      const idx = state.fuelMeasurements?.findIndex(
        (f) => f.id === action.meta.arg.id,
      );
      if (idx !== undefined && idx >= 0) {
        state.fuelMeasurements!.splice(idx, 1);
      }
      state.fuelPostStatus = "success";
    })
    .addCase(deleteFuelMeasurement.rejected, (state, _) => {
      state.fuelPostStatus = "error";
    })
    .addCase(resetFuelPostStatus, (state, _) => {
      state.fuelPostStatus = undefined;
    });
