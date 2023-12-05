import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectors";

export const selectSpecies = createSelector(
  selectAppState,
  (state) => state.species ?? [],
);

export const selectSpeciesMap = createSelector(selectSpecies, (state) =>
  Object.fromEntries(state.map((s) => [s.id, s])),
);

export const selectSpeciesFao = createSelector(
  selectAppState,
  (state) => state.speciesFao,
);

export const selectSpeciesFiskeridir = createSelector(
  selectAppState,
  (state) => state.speciesFiskeridir ?? [],
);

export const selectSpeciesFiskeridirMap = createSelector(
  selectSpeciesFiskeridir,
  (state) => Object.fromEntries(state.map((s) => [s.id, s])),
);

// Species Groups are always returned in sorted order by the API
export const selectSpeciesGroups = createSelector(
  selectAppState,
  (state) => state.speciesGroups ?? [],
);

export const selectSpeciesGroupsSortedByName = createSelector(
  selectSpeciesGroups,
  (state) => [...state].sort((a, b) => a.name.localeCompare(b.name, "no")),
);

export const selectSpeciesGroupsMap = createSelector(
  selectSpeciesGroups,
  (state) => Object.fromEntries(state.map((s) => [s.id, s])),
);

export const selectSpeciesMainGroups = createSelector(
  selectAppState,
  (state) => state.speciesMainGroups,
);
