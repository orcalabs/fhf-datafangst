import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { getVms } from "./actions";
import { AppState } from "store/state";

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
      const vms = action.payload;
      if (!vms) return;
      state.vms = vms;
    })
    .addCase(getVms.rejected, (state, _) => {
      state.vmsLoading = false;
    });
