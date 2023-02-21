import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectors";

export const selectHaulsLoading = createSelector(
  selectAppState,
  (state) => state.haulsLoading,
);

export const selectHaulsSearch = createSelector(
  selectAppState,
  (state) => state.haulsSearch,
);
