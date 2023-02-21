import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectors";

export const selectSpecies = createSelector(
  selectAppState,
  (state) => state.species,
);

export const selectSpecie = (code: number | undefined) =>
  createSelector(selectSpecies, (state) =>
    code ? state.find((s) => s.id === code) : undefined,
  );

export const selectSpecieGroups = createSelector(selectAppState, (state) =>
  Array.from(state.specieGroups).sort((a, b) =>
    a.name.localeCompare(b.name, "no"),
  ),
);
