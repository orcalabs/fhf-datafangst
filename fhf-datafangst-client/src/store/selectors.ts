import { createSelector } from "@reduxjs/toolkit";
import { AppState } from "./state";

export const selectAppState = (state: AppState) => state;

export const selectError = createSelector(
  selectAppState,
  (state) => state.error,
);

export const selectViewMode = createSelector(
  selectAppState,
  (state) => state.viewMode,
);

export const selectHaulsMenuOpen = createSelector(
  selectAppState,
  (state) => state.selectedGrids.length > 0,
);
