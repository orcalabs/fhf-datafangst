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

export const selectCurrentPositions = createSelector(
  selectAppState,
  (state) => state.currentPositions,
);

export const selectCurrentPositionsLoading = createSelector(
  selectAppState,
  (state) => state.currentPositionsLoading,
);

export const selectCurrentPositionsMap = createSelector(
  selectAppState,
  (state) => state.currentPositionsMap ?? {},
);
