import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectors";

export const selectGear = createSelector(selectAppState, (state) => state.gear);

export const selectGearGroups = createSelector(
  selectAppState,
  (state) => state.gearGroups,
);

export const selectGearMainGroups = createSelector(
  selectAppState,
  (state) => state.gearMainGroups,
);
