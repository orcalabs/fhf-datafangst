import { type ActionReducerMapBuilder } from "@reduxjs/toolkit";
import {
  type FuelMeasurementOrBunkeringOneOf,
  type FuelMeasurementOrBunkeringOneOf1,
} from "~/generated/openapi";
import type { AppState } from "~/store/state";
import {
  createBunkering,
  createFuelMeasurement,
  deleteBunkering,
  deleteFuelMeasurement,
  getFuelMeasurements,
  getFuelMeasurementsAndBunkerings,
  updateBunkering,
  updateFuelMeasurement,
} from "./actions";

export const fuelBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(getFuelMeasurements.pending, (state, action) => {
      action.meta.arg.callSignOverride = state.selectedCallSign;
      action.meta.arg.token = state.authUser?.access_token;
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
      action.meta.arg.callSignOverride = state.selectedCallSign;
      action.meta.arg.token = state.authUser?.access_token;
    })
    .addCase(createFuelMeasurement.fulfilled, (state, action) => {
      const fuel: FuelMeasurementOrBunkeringOneOf1 = {
        type: "fuelMeasurement",
        value: action.payload,
      };
      if (state.fuelMeasurementsAndBunkerings) {
        state.fuelMeasurementsAndBunkerings.push(fuel);
        state.fuelMeasurementsAndBunkerings.sort((a, b) =>
          b.value.timestamp.localeCompare(a.value.timestamp),
        );
      } else {
        state.fuelMeasurementsAndBunkerings = [fuel];
      }
    })
    .addCase(updateFuelMeasurement.pending, (state, action) => {
      action.meta.arg.callSignOverride = state.selectedCallSign;
      action.meta.arg.token = state.authUser?.access_token;
    })
    .addCase(updateFuelMeasurement.fulfilled, (state, action) => {
      const idx = state.fuelMeasurementsAndBunkerings?.findIndex(
        (f) =>
          f.type === "fuelMeasurement" &&
          f.value.id === action.meta.arg.fuelMeasurementId,
      );

      if (idx !== undefined && idx >= 0) {
        const fuelMeasurement = state.fuelMeasurementsAndBunkerings![idx];
        const sort =
          fuelMeasurement.value.timestamp !== action.meta.arg.timestamp;

        if (fuelMeasurement.type === "fuelMeasurement") {
          fuelMeasurement.value = {
            ...fuelMeasurement.value,
            ...action.meta.arg,
          };
        }
        if (sort) {
          state.fuelMeasurementsAndBunkerings!.sort((a, b) =>
            b.value.timestamp.localeCompare(a.value.timestamp),
          );
        }
      }
    })
    .addCase(deleteFuelMeasurement.pending, (state, action) => {
      action.meta.arg.callSignOverride = state.selectedCallSign;
      action.meta.arg.token = state.authUser?.access_token;
    })
    .addCase(deleteFuelMeasurement.fulfilled, (state, action) => {
      const idx = state.fuelMeasurementsAndBunkerings?.findIndex(
        (f) =>
          f.type === "fuelMeasurement" &&
          f.value.id === action.meta.arg.fuelMeasurementId,
      );
      if (idx !== undefined && idx >= 0) {
        state.fuelMeasurementsAndBunkerings!.splice(idx, 1);
      }
    })
    .addCase(getFuelMeasurementsAndBunkerings.pending, (state, action) => {
      action.meta.arg.callSignOverride = state.selectedCallSign;
      action.meta.arg.token = state.authUser?.access_token;
      state.fuelMeasurementsAndBunkeringsLoading = true;
      state.fuelMeasurementsAndBunkerings = undefined;
    })
    .addCase(getFuelMeasurementsAndBunkerings.fulfilled, (state, action) => {
      state.fuelMeasurementsAndBunkeringsLoading = false;
      state.fuelMeasurementsAndBunkerings = action.payload;
    })
    .addCase(getFuelMeasurementsAndBunkerings.rejected, (state, _) => {
      state.fuelMeasurementsAndBunkeringsLoading = false;
    })
    .addCase(createBunkering.pending, (state, action) => {
      action.meta.arg.callSignOverride = state.selectedCallSign;
      action.meta.arg.token = state.authUser?.access_token;
    })
    .addCase(createBunkering.fulfilled, (state, action) => {
      const bunkering: FuelMeasurementOrBunkeringOneOf = {
        type: "bunkering",
        value: action.payload,
      };
      if (state.fuelMeasurementsAndBunkerings) {
        state.fuelMeasurementsAndBunkerings.push(bunkering);
        state.fuelMeasurementsAndBunkerings.sort((a, b) =>
          b.value.timestamp.localeCompare(a.value.timestamp),
        );
      } else {
        state.fuelMeasurementsAndBunkerings = [bunkering];
      }
    })
    .addCase(updateBunkering.pending, (state, action) => {
      action.meta.arg.callSignOverride = state.selectedCallSign;
      action.meta.arg.token = state.authUser?.access_token;
    })
    .addCase(updateBunkering.fulfilled, (state, action) => {
      const idx = state.fuelMeasurementsAndBunkerings?.findIndex(
        (f) =>
          f.type === "bunkering" && f.value.id === action.meta.arg.bunkeringId,
      );
      if (idx !== undefined && idx >= 0) {
        const bunkering = state.fuelMeasurementsAndBunkerings![idx];
        const sort = bunkering.value.timestamp !== action.meta.arg.timestamp;

        if (bunkering.type === "bunkering") {
          bunkering.value = {
            ...bunkering.value,
            ...action.meta.arg,
          };
        }
        if (sort) {
          state.fuelMeasurementsAndBunkerings!.sort((a, b) =>
            b.value.timestamp.localeCompare(a.value.timestamp),
          );
        }
      }
    })
    .addCase(deleteBunkering.pending, (state, action) => {
      action.meta.arg.callSignOverride = state.selectedCallSign;
      action.meta.arg.token = state.authUser?.access_token;
    })
    .addCase(deleteBunkering.fulfilled, (state, action) => {
      const idx = state.fuelMeasurementsAndBunkerings?.findIndex(
        (f) =>
          f.type === "bunkering" && f.value.id === action.meta.arg.bunkeringId,
      );
      if (idx !== undefined && idx >= 0) {
        state.fuelMeasurementsAndBunkerings!.splice(idx, 1);
      }
    });
