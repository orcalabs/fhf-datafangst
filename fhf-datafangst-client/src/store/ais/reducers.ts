import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { AppState } from "store/state";
import { getAis, getCurrentAis } from "./actions";

export const aisBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(getAis.pending, (state, _) => {
      state.aisLoading = true;
      state.ais = undefined;
    })
    .addCase(getAis.fulfilled, (state, action) => {
      state.aisLoading = false;
      state.ais = action.payload;
    })
    .addCase(getAis.rejected, (state, _) => {
      state.aisLoading = false;
    })
    .addCase(getCurrentAis.pending, (state, action) => {
      action.meta.arg.token = state.authUser?.access_token;
      if (!state.currentPositions) {
        state.currentPositionsLoading = true;
      }
    })
    .addCase(getCurrentAis.fulfilled, (state, action) => {
      state.currentPositions = action.payload;
      state.currentPositionsLoading = false;
    })
    .addCase(getCurrentAis.rejected, (state, _action) => {
      state.currentPositionsLoading = false;
    });
