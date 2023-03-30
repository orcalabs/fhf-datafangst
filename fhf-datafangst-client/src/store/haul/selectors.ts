import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectors";
import { sumCatches } from "utils";

export const selectHaulsLoading = createSelector(
  selectAppState,
  (state) => state.haulsLoading,
);

export const selectHaulsGridLoading = createSelector(
  selectAppState,
  (state) => state.haulsGridLoading,
);

export const selectHaulsSearch = createSelector(
  selectAppState,
  (state) => state.haulsSearch,
);

export const selectHauls = createSelector(
  selectAppState,
  (state) => state.hauls ?? [],
);

export const selectHaulsSorted = createSelector(selectHauls, (state) =>
  Array.from(state).sort(
    (a, b) => sumCatches(b.catches) - sumCatches(a.catches),
  ),
);

export const selectHaulsGrid = createSelector(
  selectAppState,
  (state) => state.haulsGrid,
);

export const selectHaulsByArea = createSelector(
  selectAppState,
  (state) => state.haulsByArea ?? {},
);

export const selectSelectedHaul = createSelector(
  selectAppState,
  (state) => state.selectedHaul,
);

export const selectGearFilterStats = createSelector(
  selectAppState,
  (state) => state.gearFilterStats ?? [],
);

export const selectSpeciesFilterStats = createSelector(
  selectAppState,
  (state) => state.specieFilterStats ?? [],
);

export const selectVesselLengthFilterStats = createSelector(
  selectAppState,
  (state) => state.vesselLengthStats ?? [],
);
