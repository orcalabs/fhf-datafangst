import { type ActionReducerMapBuilder } from "@reduxjs/toolkit";
import type {
  FuelMeasurementOrBunkeringOneOf,
  FuelMeasurementOrBunkeringOneOf1,
} from "~/generated/openapi";
import type { AppState } from "~/store/state";
import {
  createBunkering,
  createFuelMeasurement,
  deleteBunkering,
  deleteFuelMeasurement,
  getFuelMeasurements,
  getFuelMeasurementsAndBunkerings,
  resetFuelPostStatus,
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
    })
    .addCase(getFuelMeasurements.fulfilled, (state, action) => {
      state.fuelMeasurements = action.payload;

      state.fuelMeasurementsLoading = false;

      if (state.fuelMeasurements.length) {
        state.lastFuelMeasurement = state.fuelMeasurements[0];
      } else {
        state.lastFuelMeasurement = undefined;
      }
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

      state.lastFuelMeasurement = action.payload;

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
      const idx = state.fuelMeasurementsAndBunkerings?.findIndex(
        (f) =>
          f.type === "fuelMeasurement" &&
          f.value.id === action.meta.arg.fuelMeasurementId,
      );
      if (idx !== undefined && idx >= 0) {
        state.fuelMeasurementsAndBunkerings!.splice(idx, 1);
      }

      state.fuelPostStatus = "success";
    })
    .addCase(deleteFuelMeasurement.rejected, (state, _) => {
      state.fuelPostStatus = "error";
    })
    .addCase(resetFuelPostStatus, (state, _) => {
      state.fuelPostStatus = undefined;
    })
    .addCase(getFuelMeasurementsAndBunkerings.pending, (state, action) => {
      action.meta.arg.callSignOverride = state.selectedCallSign;
      action.meta.arg.token = state.authUser?.access_token;
      action.meta.arg.limit += 1;
      state.fuelMeasurementsAndBunkeringsLoading = true;
      if (action.meta.arg.offset === 0) {
        state.fuelMeasurementsAndBunkerings = undefined;
      }
    })
    .addCase(getFuelMeasurementsAndBunkerings.fulfilled, (state, action) => {
      const newMeasurements = action.payload.slice(
        0,
        action.meta.arg.limit - 1,
      );

      state.fuelMeasurementsAndBunkerings = state.fuelMeasurementsAndBunkerings
        ? state.fuelMeasurementsAndBunkerings.concat(newMeasurements)
        : newMeasurements;

      state.fuelMeasurementsScrollable =
        action.payload.length === action.meta.arg.limit;

      state.fuelMeasurementsAndBunkeringsLoading = false;
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

      state.fuelPostStatus = "success";
    })
    .addCase(createBunkering.rejected, (state, _) => {
      state.fuelPostStatus = "error";
    })
    .addCase(updateBunkering.pending, (state, action) => {
      action.meta.arg.callSignOverride = state.selectedCallSign;
      action.meta.arg.token = state.authUser?.access_token;
    })
    .addCase(updateBunkering.rejected, (state, _) => {
      state.fuelPostStatus = "error";
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
      state.fuelPostStatus = "success";
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
    })
    .addCase(deleteBunkering.rejected, (state, _) => {
      state.fuelPostStatus = "error";
    });
