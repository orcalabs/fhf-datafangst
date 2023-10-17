import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { getUser, updateUser, setSelectedVessels } from "./actions";
import { AppState } from "store/state";

export const userBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(getUser.pending, (state, _) => {
      state.userLoading = true;
      state.user = undefined;
    })
    .addCase(getUser.fulfilled, (state, action) => {
      state.userLoading = false;
      state.user = action.payload;
    })
    .addCase(getUser.rejected, (state, _) => {
      state.userLoading = false;
    })
    .addCase(updateUser.fulfilled, (state, action) => {
      state.user = action.payload;
    })
    .addCase(setSelectedVessels, (state, action) => {
      state.userVessels = action.payload;
    });
