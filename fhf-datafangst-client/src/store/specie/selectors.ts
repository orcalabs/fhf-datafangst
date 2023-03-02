import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectors";

export const selectSpecies = createSelector(
  selectAppState,
  (state) => state.species,
);

export const selectSpeciesFao = createSelector(
  selectAppState,
  (state) => state.speciesFao,
);

export const selectSpeciesFiskeridir = createSelector(
  selectAppState,
  (state) => state.speciesFiskeridir,
);

export const selectSpeciesGroups = createSelector(selectAppState, (state) =>
  Array.from(state.speciesGroups).sort((a, b) =>
    a.name.localeCompare(b.name, "no"),
  ),
);

export const selectSpeciesMainGroups = createSelector(selectAppState, (state) =>
  Array.from(state.speciesMainGroups).sort((a, b) =>
    a.name.localeCompare(b.name, "no"),
  ),
);
