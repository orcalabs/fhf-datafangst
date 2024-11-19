import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { AppState } from "store/state";
import {
  getAverageEeoi,
  getAverageTripBenchmarks,
  getEeoi,
  getTripBenchmarks,
} from "./actions";

export const tripBenchmarkBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(getTripBenchmarks.pending, (state, action) => {
      action.meta.arg.accessToken = state.authUser?.access_token;
      state.tripBenchmarks = undefined;
      state.tripBenchmarksLoading = true;
    })
    .addCase(getTripBenchmarks.fulfilled, (state, action) => {
      state.tripBenchmarks = action.payload;
      state.tripBenchmarksLoading = false;
    })
    .addCase(getTripBenchmarks.rejected, (state, _action) => {
      state.tripBenchmarksLoading = false;
    })
    .addCase(getAverageTripBenchmarks.fulfilled, (state, action) => {
      state.averageTripBenchmarks = action.payload;
    })
    .addCase(getEeoi.pending, (state, action) => {
      action.meta.arg.accessToken = state.authUser?.access_token;
      state.eeoi = undefined;
      state.eeoiLoading = true;
    })
    .addCase(getEeoi.fulfilled, (state, action) => {
      state.eeoi = action.payload;
      state.eeoiLoading = false;
    })
    .addCase(getEeoi.rejected, (state, _action) => {
      state.eeoiLoading = false;
    })
    .addCase(getAverageEeoi.pending, (state, _action) => {
      state.averageEeoi = undefined;
      state.averageEeoiLoading = true;
    })
    .addCase(getAverageEeoi.fulfilled, (state, action) => {
      state.averageEeoi = action.payload;
      state.averageEeoiLoading = false;
    })
    .addCase(getAverageEeoi.rejected, (state, _action) => {
      state.averageEeoiLoading = false;
    });
