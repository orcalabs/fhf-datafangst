import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectors";

export const selectGears = createSelector(
  selectAppState,
  (state) => state.gears ?? [],
);

export const selectGearsMap = createSelector(selectGears, (state) =>
  Object.fromEntries(state.map((g) => [g.id, g])),
);

export const selectGearGroups = createSelector(
  selectAppState,
  (state) => state.gearGroups ?? [],
);

export const selectGearGroupsMap = createSelector(selectGearGroups, (state) =>
  Object.fromEntries(state.map((g) => [g.id, g])),
);

export const selectGearGroupsSorted = createSelector(
  selectGearGroups,
  (state) => [...state].sort((a, b) => a.id - b.id),
);

export const selectGearMainGroups = createSelector(
  selectAppState,
  (state) => state.gearMainGroups,
);
