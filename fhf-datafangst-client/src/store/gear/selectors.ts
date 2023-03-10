import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectors";

export const selectGears = createSelector(
  selectAppState,
  (state) => state.gears,
);

export const selectGearGroups = createSelector(
  selectAppState,
  (state) => state.gearGroups,
);

export const selectGearMainGroups = createSelector(
  selectAppState,
  (state) => state.gearMainGroups,
);
