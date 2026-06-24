import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { getTrack } from "~/store";
import type { AppState } from "~/store/state";
import {
  deleteUserHaul,
  getActiveUserHaul,
  getUserHauls,
  setSelectedUserHaul,
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
    .addCase(deleteUserHaul.pending, (state, action) => {
      action.meta.arg.token = state.authUser?.access_token;
      action.meta.arg.callSignOverride = state.selectedCallSign;
    })
    .addCase(deleteUserHaul.fulfilled, (state, action) => {
      state.userHauls = state.userHauls?.filter(
        (v) => v.id !== action.meta.arg.userHaulId,
      );
    })
    .addCase(setSelectedUserHaul, (state, action) => {
      const haul = action.payload;
      state.selectedUserHaul = haul;
      state.ais = undefined;
      state.vms = undefined;
      state.track = undefined;
      if (
        haul &&
        state.vesselsByCallSign
        // state.bwUser?.fiskInfoProfile?.ircs
      ) {
        const vessel = state.vesselsByCallSign[state.selectedCallSign!];

        // NOTE: If vessels under 15m report ERS, add BW-token here
        if (vessel) {
          (action as any).asyncDispatch(
            getTrack({
              mmsi: vessel.ais?.mmsi,
              callSign: vessel.fiskeridir.callSign,
              start: haul.startTs,
              end: haul.endTs,
            }),
          );
        }
      }
    });
