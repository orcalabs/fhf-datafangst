import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectors";

export const selectHaulsLoading = createSelector(
  selectAppState,
  (state) => state.haulsLoading,
);

export const selectHaulsGridLoading = createSelector(
  selectAppState,
  (state) => state.haulsGridLoading,
);

export const selectHaulsSearch = createSelector(
  selectAppState,
  (state) => state.haulsSearch,
);

export const selectHauls = createSelector(
  selectAppState,
  (state) => state.hauls ?? [],
);

export const selectHaulsGrid = createSelector(
  selectAppState,
  (state) => state.haulsGrid,
);

export const selectHaulsByArea = createSelector(
  selectAppState,
  (state) => state.haulsByArea ?? {},
);

export const selectFilteredHauls = createSelector(
  selectAppState,
  (state) => state.filteredHauls ?? [],
);

export const selectHaulsFilter = createSelector(
  selectAppState,
  (state) => state.haulsFilter,
);
