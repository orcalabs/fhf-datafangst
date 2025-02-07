import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { AppState } from "store/state";
import { getUser, updateUser } from "./actions";

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
    .addCase(updateUser.pending, (state, action) => {
      action.meta.arg.accessToken = state.authUser?.access_token;
    })
    .addCase(updateUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });
