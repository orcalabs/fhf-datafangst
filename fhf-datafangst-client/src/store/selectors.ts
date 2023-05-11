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

export const selectViewState = createSelector(
  selectAppState,
  (state) => state.viewState,
);

export const selectIsLoggedIn = createSelector(
  selectAppState,
  (state) => state.isLoggedIn,
);

export const selectHaulsMenuOpen = createSelector(
  selectAppState,
  (state) => state.selectedGrids.length > 0,
);

export const selectTrackMissing = createSelector(
  selectAppState,
  (state) => state.selectedHaul && !state.track?.length && !state.trackLoading,
);

export const selectBwUserProfile = createSelector(
  selectAppState,
  (state) => state.bwProfile,
);
