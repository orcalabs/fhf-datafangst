import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { AppState } from "store/state";
import { getAis } from "./actions";

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
    });
