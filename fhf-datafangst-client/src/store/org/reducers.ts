import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { AppState } from "store/state";
import { getOrgBenchmarks, getOrgFuelConsumption } from "./actions";

export const orgBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(getOrgBenchmarks.pending, (state, action) => {
      action.meta.arg.token = state.authUser?.access_token;
      state.orgBenchmarks = undefined;
      state.orgBenchmarksLoading = true;
    })
    .addCase(getOrgBenchmarks.fulfilled, (state, action) => {
      state.orgBenchmarks = action.payload;
      state.orgBenchmarksLoading = false;
    })
    .addCase(getOrgBenchmarks.rejected, (state, _) => {
      state.orgBenchmarksLoading = false;
    })
    .addCase(getOrgFuelConsumption.fulfilled, (state, action) => {
      state.orgFuelConsumption = action.payload;
    });
