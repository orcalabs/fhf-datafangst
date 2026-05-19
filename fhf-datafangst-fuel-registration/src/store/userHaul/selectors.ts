import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "~/store/selectAppState";

export const selectUserHauls = createSelector(
  selectAppState,
  (state) => state.userHauls,
);

export const selectUserHaulsDesc = createSelector(selectUserHauls, (state) =>
  state ? [...state].reverse() : undefined,
);

export const selectUserHaulsLoading = createSelector(
  selectAppState,
  (state) => state.userHaulsLoading,
);

export const selectActiveUserHaul = createSelector(
  selectAppState,
  (state) => state.activeUserHaul,
);

export const selectActiveUserHaulLoading = createSelector(
  selectAppState,
  (state) => state.activeUserHaulLoading,
);
