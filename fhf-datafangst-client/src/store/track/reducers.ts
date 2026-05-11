import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import type { AppState } from "~/store/state";
import {
  getCurrentPositions,
  getCurrentTripTrack,
  getHaulTrack,
  getTrack,
} from "./actions";

export const trackBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(getTrack.pending, (state, action) => {
      action.meta.arg.accessToken = state.authUser?.access_token;
      state.trackLoading = true;
      state.track = undefined;
    })
    .addCase(getTrack.fulfilled, (state, action) => {
      state.trackLoading = false;
      const track = action.payload;
      if (!track) return;
      state.track = track;
    })
    .addCase(getTrack.rejected, (state, _) => {
      state.trackLoading = false;
    })
    .addCase(getHaulTrack, (state, action) => {
      const haul = action.payload;

      if (haul && state.vesselsByCallSign) {
        const vessel = state.vesselsByCallSign[haul.callSign];

        if (vessel) {
          (action as any).asyncDispatch(
            getTrack({
              mmsi: vessel.ais?.mmsi,
              callSign: vessel.fiskeridir.callSign,
              start: haul.startTimestamp,
              end: haul.stopTimestamp,
            }),
          );
        }
      }
    })
    .addCase(getCurrentPositions.pending, (state, action) => {
      action.meta.arg.token = state.authUser?.access_token;
      if (!state.currentPositions) {
        state.currentPositionsLoading = true;
      }
    })
    .addCase(getCurrentPositions.fulfilled, (state, action) => {
      state.currentPositions = action.payload;
      state.currentPositionsMap = {};

      for (const pos of action.payload) {
        state.currentPositionsMap[pos.vesselId] = pos;
      }
      state.currentPositionsLoading = false;
    })
    .addCase(getCurrentPositions.rejected, (state, _action) => {
      state.currentPositionsLoading = false;
    })
    .addCase(getCurrentTripTrack.pending, (state, action) => {
      action.meta.arg.accessToken = state.authUser?.access_token;
      state.trackLoading = action.meta.arg.loading;
      if (state.trackLoading) {
        state.track = undefined;
      }
    })
    .addCase(getCurrentTripTrack.fulfilled, (state, action) => {
      const track = action.payload;
      state.track = track;
      state.trackLoading = false;
    })
    .addCase(getCurrentTripTrack.rejected, (state, _action) => {
      state.trackLoading = false;
    });
