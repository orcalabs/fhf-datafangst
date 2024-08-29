import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { AppState } from "store/state";
import { getVms } from "./actions";

export const vmsBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(getVms.pending, (state, _) => {
      state.vmsLoading = true;
      state.vms = undefined;
    })
    .addCase(getVms.fulfilled, (state, action) => {
      state.vmsLoading = false;
      state.vms = action.payload;
    })
    .addCase(getVms.rejected, (state, _) => {
      state.vmsLoading = false;
    });
