import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import type { AppState } from "~/store/state";
import {
  abortUserHaul,
  deleteUserHaul,
  getActiveUserHaul,
  getUserHauls,
  startUserHaul,
  stopUserHaul,
} from "./actions";

export const userHaulBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(getUserHauls.pending, (state, action) => {
      action.meta.arg.token = state.authUser?.access_token;
      action.meta.arg.callSignOverride = state.selectedCallSign;
      state.userHauls = undefined;
      state.userHaulsLoading = true;
    })
    .addCase(getUserHauls.fulfilled, (state, action) => {
      state.userHauls = action.payload;
      state.userHaulsLoading = false;
    })
    .addCase(getUserHauls.rejected, (state, _) => {
      state.userHaulsLoading = false;
    })
    .addCase(getActiveUserHaul.pending, (state, action) => {
      action.meta.arg.token = state.authUser?.access_token;
      action.meta.arg.callSignOverride = state.selectedCallSign;
      state.activeUserHaul = undefined;
      state.activeUserHaulLoading = true;
    })
    .addCase(getActiveUserHaul.fulfilled, (state, action) => {
      state.activeUserHaul = action.payload;
      state.activeUserHaulLoading = false;
    })
    .addCase(getActiveUserHaul.rejected, (state, _) => {
      state.userHaulsLoading = false;
    })
    .addCase(startUserHaul.pending, (state, action) => {
      action.meta.arg.token = state.authUser?.access_token;
      action.meta.arg.callSignOverride = state.selectedCallSign;
      state.activeUserHaulLoading = true;
    })
    .addCase(startUserHaul.fulfilled, (state, action) => {
      state.activeUserHaul = action.payload;
      state.activeUserHaulLoading = false;
    })
    .addCase(startUserHaul.rejected, (state, _) => {
      state.activeUserHaulLoading = false;
    })
    .addCase(stopUserHaul.pending, (state, action) => {
      action.meta.arg.token = state.authUser?.access_token;
      action.meta.arg.callSignOverride = state.selectedCallSign;
      state.activeUserHaulLoading = true;
    })
    .addCase(stopUserHaul.fulfilled, (state, action) => {
      state.activeUserHaul = undefined;
      state.activeUserHaulLoading = false;

      // TODO: Make custom status for user hauls
      state.fuelPostStatus = "success";

      if (state.userHauls) {
        state.userHauls.push(action.payload);
      } else {
        state.userHauls = [action.payload];
      }
    })
    .addCase(stopUserHaul.rejected, (state, _) => {
      state.activeUserHaulLoading = false;

      // TODO: Make custom status for user hauls
      state.fuelPostStatus = "error";
    })
    .addCase(abortUserHaul.pending, (state, action) => {
      action.meta.arg.token = state.authUser?.access_token;
      action.meta.arg.callSignOverride = state.selectedCallSign;
    })
    .addCase(abortUserHaul.fulfilled, (state, _) => {
      state.activeUserHaul = undefined;
    })
    .addCase(deleteUserHaul.pending, (state, action) => {
      action.meta.arg.token = state.authUser?.access_token;
      action.meta.arg.callSignOverride = state.selectedCallSign;
    })
    .addCase(deleteUserHaul.fulfilled, (state, action) => {
      state.userHauls = state.userHauls?.filter(
        (v) => v.id !== action.meta.arg.userHaulId,
      );
    });
