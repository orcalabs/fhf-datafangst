import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import type { AppState } from "~/store/state";
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
    .addCase(getFuelMeasurements.pending, (state, action) => {
      action.meta.arg.callSignOverride = "LFNX";
      action.meta.arg.token =
        "eyJhbGciOiJSUzI1NiIsImtpZCI6IjgwMjlENjhCMTU3OTM3NUQ2Qjk4NTNFMzZCNzM3QjFGIiwidHlwIjoiYXQrand0In0.eyJpc3MiOiJodHRwczovL2lkLmJhcmVudHN3YXRjaC5ubyIsIm5iZiI6MTc4ODM1MjUwMiwiaWF0IjoxNzg4MzUyNTAyLCJleHAiOjE3ODgzNTYxMDIsImF1ZCI6ImFwaSIsInNjb3BlIjpbIm9wZW5pZCIsImFwaSJdLCJhbXIiOlsicHdkIl0sImNsaWVudF9pZCI6ImZoZi1kYXRhZmFuZ3N0Iiwic3ViIjoiODJjMDAxMmItZjMzNy00N2FmLWFkYzMtYmFhYWJjZTU0MGE0IiwiYXV0aF90aW1lIjoxNzg3MjEyMjczLCJpZHAiOiJsb2NhbCIsInByZWZlcnJlZF91c2VybmFtZSI6InBvc3RAb3JjYWxhYnMubm8iLCJzaWQiOiJCNkE0N0E3RkQ2MDEwNDkxNTVEOTk0RTZDNzcxODlFQyJ9.0uItq2rxlnuXguEo2emM5Bw5KhfbcduUvBU4t-YL9Jm0_F83fePITvgpE0utWDQWc53LBLSUeEoWLJIGtK1ulpB65tvEiuyTtyBCbWr4X_1y3GTi4kgBFTr2iyuZfYLdBnQ58PTztAwq3ryZ7epqT74tJPJuw8OvVV0qbFb7YXjirRqAoJHdaia3WxixxJrw3EC4r2EU7rFuj1FCust4cTfUm3qMF8fzcx2Dir_ZZwy53ZitaBvjXMg2OFXnkzNghxLfDga7yg2Z3FSlYFqiWSeJupYVkB7MDKhohnLMKLJrRM7WaeYpiH7PI5iORL1s_zZLaiXG4o7jlQFcdgn_5g";
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
    .addCase(createFuelMeasurement.pending, (__, _) => {
      // action.meta.arg.callSignOverride = state.bwUser?.fiskInfoProfile?.ircs;
      // action.meta.arg.token = state.authUser?.access_token;
    })
    .addCase(createFuelMeasurement.fulfilled, (state, action) => {
      if (state.fuelMeasurements) {
        state.fuelMeasurements.push(action.payload);
        state.fuelMeasurements.sort((a, b) =>
          b.timestamp.localeCompare(a.timestamp),
        );
      } else {
        state.fuelMeasurements = [action.payload];
      }
    })
    .addCase(updateFuelMeasurement.pending, (__, _) => {
      //action.meta.arg.callSignOverride = state.bwUser?.fiskInfoProfile?.ircs;
      //action.meta.arg.token = state.authUser?.access_token;
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
    .addCase(deleteFuelMeasurement.pending, (__, _) => {
      //action.meta.arg.callSignOverride = state.bwUser?.fiskInfoProfile?.ircs;
      //action.meta.arg.token = state.authUser?.access_token;
    })
    .addCase(deleteFuelMeasurement.fulfilled, (state, action) => {
      const idx = state.fuelMeasurements?.findIndex(
        (f) => f.id === action.meta.arg.id,
      );
      if (idx !== undefined && idx >= 0) {
        state.fuelMeasurements!.splice(idx, 1);
      }
    });
