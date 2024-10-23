import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { AppState } from "store/state";
import { getTripBenchmarks } from "./actions";

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
    });
