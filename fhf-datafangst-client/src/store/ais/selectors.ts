import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectors";

export const selectAisLoading = createSelector(
  selectAppState,
  (state) => state.aisLoading,
);

export const selectAis = createSelector(selectAppState, (state) => state.ais);

export const selectAisSearch = createSelector(
  selectAppState,
  (state) => state.aisSearch,
);
