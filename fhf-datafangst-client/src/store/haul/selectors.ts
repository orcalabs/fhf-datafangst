import { createSelector } from "@reduxjs/toolkit";
import { HaulsFilter } from "api";
import { LengthGroups } from "models";
import { selectGearGroupsSorted } from "store/gear";
import { selectAppState } from "store/selectors";
import { selectSpeciesGroupsSorted } from "store/species";
import { matrixSum, sumCatches } from "utils";

export const selectHaulsLoading = createSelector(
  selectAppState,
  (state) => state.haulsLoading,
);

export const selectHaulsMatrixLoading = createSelector(
  selectAppState,
  (state) => state.haulsMatrixLoading,
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

export const selectHaulsMatrix = createSelector(
  selectAppState,
  (state) => state.haulsMatrix,
);

export const selectHaulsByArea = createSelector(
  selectAppState,
  (state) => state.haulsByArea ?? {},
);

export const selectSelectedHaul = createSelector(
  selectAppState,
  (state) => state.selectedHaul,
);

export const selectHaulsFilter = createSelector(
  selectHaulsSearch,
  (state) => state?.filter,
);

const getIndexes = (original: { id: any }[], selected?: { id: any }[]) =>
  original.reduce((tot: number[], cur, idx) => {
    if (selected?.some((s) => s.id === cur.id)) {
      tot.push(idx);
    }
    return tot;
  }, []);

export const selectHaulsSelectedIndexes = createSelector(
  selectHaulsSearch,
  selectGearGroupsSorted,
  selectSpeciesGroupsSorted,
  (search, gearGroups, speciesGroups) => {
    const now = new Date();
    const originalDates = Array.from(
      { length: now.getFullYear() * 12 + now.getMonth() },
      (_, i) => ({ id: 2010 * 12 + i }),
    );
    const selectedDates =
      search?.years && search?.months
        ? search.years
            .map((y) => search.months!.map((m) => ({ id: y * 12 + m - 1 })))
            .flat()
        : [];

    return {
      dates: getIndexes(originalDates, selectedDates),
      gearGroups: getIndexes(gearGroups, search?.gearGroupIds),
      speciesGroups: getIndexes(speciesGroups, search?.speciesGroupIds),
      lengthGroups: getIndexes(LengthGroups, search?.vesselLengthRanges),
    };
  },
);

export const selectHaulsFilterSelectionIndexes = createSelector(
  selectHaulsSearch,
  selectHaulsSelectedIndexes,
  (search, selections) => {
    if (search)
      switch (search.filter) {
        case HaulsFilter.Date:
          return selections.dates;
        case HaulsFilter.GearGroup:
          return selections.gearGroups;
        case HaulsFilter.SpeciesGroup:
          return selections.speciesGroups;
        case HaulsFilter.VesselLength:
          return selections.lengthGroups;
      }

    return [];
  },
);

export const selectLocationsMatrix = createSelector(
  selectHaulsMatrix,
  selectHaulsFilter,
  (matrix, filter) => {
    switch (filter) {
      case HaulsFilter.Date:
        return matrix?.dates;
      case HaulsFilter.GearGroup:
        return matrix?.gearGroup;
      case HaulsFilter.SpeciesGroup:
        return matrix?.speciesGroup;
      case HaulsFilter.VesselLength:
        return matrix?.lengthGroup;
      case HaulsFilter.Vessel:
        return matrix?.lengthGroup;
    }
  },
);

const computeStats = (
  matrix: number[],
  widthArray: { id: any }[],
  activeSelected: number[],
  selected: number[],
) => {
  const stats = [];
  const width = widthArray.length;
  const height = matrix.length / width;

  for (let x = 0; x < width; x++) {
    let value = 0;
    if (activeSelected.length)
      for (let i = 0; i < activeSelected.length; i++) {
        value += matrixSum(
          matrix,
          width,
          x,
          activeSelected[i],
          x,
          activeSelected[i],
        );
      }
    else {
      value = matrixSum(matrix, width, x, 0, x, height - 1);
    }
    if (value > 0 || selected.includes(x)) {
      stats.push({ id: widthArray[x].id, value });
    }
  }

  return stats;
};

const computeActiveStats = (
  matrix: number[],
  heightArray: { id: any }[],
  selected: number[],
) => {
  const stats = [];
  const height = heightArray.length;
  const width = matrix.length / height;

  for (let y = 0; y < height; y++) {
    const value = matrixSum(matrix, width, 0, y, width - 1, y);
    if (value > 0 || selected.includes(y)) {
      stats.push({ id: heightArray[y].id, value });
    }
  }

  return stats;
};

export const selectGearFilterStats = createSelector(
  selectHaulsMatrix,
  selectHaulsSearch,
  selectHaulsFilter,
  selectHaulsSelectedIndexes,
  selectHaulsFilterSelectionIndexes,
  selectGearGroupsSorted,
  (matrix, search, filter, selection, activeSelection, gearGroups) => {
    if (!matrix) {
      return [];
    }

    console.log(search?.gearGroupIds);

    return filter === HaulsFilter.GearGroup
      ? computeActiveStats(matrix.gearGroup, gearGroups, selection.gearGroups)
      : computeStats(
          matrix.gearGroup,
          gearGroups,
          activeSelection,
          selection.gearGroups,
        );
  },
);

export const selectGearFilterStatsSorted = createSelector(
  selectGearFilterStats,
  (state) => [...state].sort((a, b) => b.value - a.value),
);

export const selectSpeciesFilterStats = createSelector(
  selectHaulsMatrix,
  selectHaulsFilter,
  selectHaulsSelectedIndexes,
  selectHaulsFilterSelectionIndexes,
  selectSpeciesGroupsSorted,
  (matrix, filter, selection, activeSelection, speciesGroups) => {
    if (!matrix) {
      return [];
    }

    return filter === HaulsFilter.SpeciesGroup
      ? computeActiveStats(
          matrix.speciesGroup,
          speciesGroups,
          selection.speciesGroups,
        )
      : computeStats(
          matrix.speciesGroup,
          speciesGroups,
          activeSelection,
          selection.speciesGroups,
        );
  },
);

export const selectSpeciesFilterStatsSorted = createSelector(
  selectSpeciesFilterStats,
  (state) => [...state].sort((a, b) => b.value - a.value),
);

export const selectVesselLengthFilterStats = createSelector(
  selectHaulsMatrix,
  selectHaulsFilter,
  selectHaulsSelectedIndexes,
  selectHaulsFilterSelectionIndexes,
  (matrix, filter, selection, activeSelection) => {
    if (!matrix) {
      return [];
    }

    return filter === HaulsFilter.VesselLength
      ? computeActiveStats(
          matrix.lengthGroup,
          LengthGroups,
          selection.lengthGroups,
        )
      : computeStats(
          matrix.lengthGroup,
          LengthGroups,
          activeSelection,
          selection.lengthGroups,
        );
  },
);

export const selectVesselLengthFilterStatsSorted = createSelector(
  selectVesselLengthFilterStats,
  (state) => [...state].sort((a, b) => b.value - a.value),
);
