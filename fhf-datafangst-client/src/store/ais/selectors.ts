import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectAppState";

export const selectAisLoading = createSelector(
  selectAppState,
  (state) => state.aisLoading,
);

export const selectAis = createSelector(selectAppState, (state) => state.ais);

export const selectCurrentPositions = createSelector(
  selectAppState,
  (state) => state.currentPositions,
);

export const selectCurrentPositionsLoading = createSelector(
  selectAppState,
  (state) => state.currentPositionsLoading,
);
