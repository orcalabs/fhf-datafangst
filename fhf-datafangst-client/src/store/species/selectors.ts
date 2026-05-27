import { createSelector } from "@reduxjs/toolkit";
import type {
  Condition,
  ConditionDetailed,
  Quality,
  QualityDetailed,
} from "~/generated/openapi";
import { selectAppState } from "~/store/selectAppState";

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

export const selectSpeciesFiskeridirSorted = createSelector(
  selectSpeciesFiskeridir,
  (state) =>
    [...state].sort((a, b) =>
      (a.name ?? "Ukjent").localeCompare(b.name ?? "Ukjent", "no"),
    ),
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

export const selectConditions = createSelector(
  selectAppState,
  (state) => state.conditions,
);

export const selectConditionsMap = createSelector(selectConditions, (state) =>
  state
    ? (Object.fromEntries(state.map((v) => [v.id, v])) as Record<
        Condition,
        ConditionDetailed
      >)
    : undefined,
);

export const selectConditionsSorted = createSelector(
  selectConditions,
  (state) =>
    state
      ? [...state].sort((a, b) => a.name.localeCompare(b.name, "no"))
      : undefined,
);

export const selectQualities = createSelector(
  selectAppState,
  (state) => state.qualities,
);

export const selectQualitiesMap = createSelector(selectQualities, (state) =>
  state
    ? (Object.fromEntries(state.map((v) => [v.id, v])) as Record<
        Quality,
        QualityDetailed
      >)
    : undefined,
);

export const selectQualitiesSorted = createSelector(selectQualities, (state) =>
  state
    ? [...state].sort((a, b) => a.name.localeCompare(b.name, "no"))
    : undefined,
);
