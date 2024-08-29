import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectAppState";

export const selectGears = createSelector(
  selectAppState,
  (state) => state.gears ?? [],
);

export const selectGearsMap = createSelector(selectGears, (state) =>
  Object.fromEntries(state.map((g) => [g.id, g])),
);

// Gear Groups are always returned in sorted order by the API
export const selectGearGroups = createSelector(
  selectAppState,
  (state) => state.gearGroups ?? [],
);

export const selectGearGroupsMap = createSelector(selectGearGroups, (state) =>
  Object.fromEntries(state.map((g) => [g.id, g])),
);

export const selectGearMainGroups = createSelector(
  selectAppState,
  (state) => state.gearMainGroups,
);
