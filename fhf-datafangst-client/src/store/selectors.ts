import { createSelector } from "@reduxjs/toolkit";
import { AppState } from "./state";

export const selectAppState = (state: AppState) => state;

export const selectError = createSelector(
  selectAppState,
  (state) => state.error,
);

export const selectViewState = createSelector(
  selectAppState,
  (state) => state.viewState,
);

export const selectIsLoggedIn = createSelector(
  selectAppState,
  (state) => state.isLoggedIn,
);

export const selectSecondaryMenuOpen = createSelector(
  selectAppState,
  (state) => state.selectedGrids.length > 0 || Boolean(state.selectedTrip),
);

export const selectTrackMissing = createSelector(
  selectAppState,
  (state) =>
    (state.selectedHaul ?? state.selectedTrip) &&
    !state.track?.length &&
    !state.trackLoading,
);

export const selectBwUserProfile = createSelector(
  selectAppState,
  (state) => state.bwProfile,
);

export const selectMatrixToggle = createSelector(
  selectAppState,
  (state) => state.matrixToggle,
);

export const selectTripFiltersOpen = createSelector(
  selectAppState,
  (state) => state.tripFiltersOpen,
);

export const selectTripDetailsOpen = createSelector(
  selectAppState,
  (state) => state.tripDetailsOpen,
);
