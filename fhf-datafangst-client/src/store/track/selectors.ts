import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectAppState";

export const selectTrackLoading = createSelector(
  selectAppState,
  (state) => state.trackLoading,
);

export const selectTrack = createSelector(
  selectAppState,
  (state) => state.track,
);
