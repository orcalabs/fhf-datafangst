import { createSelector } from "@reduxjs/toolkit";
import { HaulsArgs, HaulsFilter } from "api";
import { GearGroup, SpeciesGroup } from "generated/openapi";
import { LengthGroups } from "models";
import { selectSelectedGridsString } from "store/fishmap";
import { selectGearGroupsSorted } from "store/gear";
import { selectAppState } from "store/selectors";
import { selectSpeciesGroupsSorted } from "store/species";
import { fishingLocationAreas, matrixSum, sumCatches } from "utils";

export const selectHaulsLoading = createSelector(
  selectAppState,
  (state) => state.haulsLoading,
);

export const selectHaulsMatrixLoading = createSelector(
  selectAppState,
  (state) => state.haulsMatrixLoading,
);

export const selectHaulsMatrix2Loading = createSelector(
  selectAppState,
  (state) => state.haulsMatrix2Loading,
);

export const selectHaulsSearch = createSelector(
  selectAppState,
  (state) => state.haulsSearch,
);

export const selectHaulsMatrixSearch = createSelector(
  selectAppState,
  (state) => state.haulsMatrixSearch,
);

export const selectHaulsMatrix2Search = createSelector(
  selectAppState,
  (state) => state.haulsMatrix2Search,
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

export const selectHaulsMatrix2 = createSelector(
  selectAppState,
  (state) => state.haulsMatrix2,
);

export const selectSelectedHaul = createSelector(
  selectAppState,
  (state) => state.selectedHaul,
);

export const selectHaulsFilter = createSelector(
  selectHaulsMatrixSearch,
  (state) => state?.filter,
);

const getIndexes = (original: { id: any }[], selected?: { id: any }[]) =>
  selected?.reduce((tot: number[], cur) => {
    const idx = original.findIndex((o) => o.id === cur.id);
    if (idx >= 0) {
      tot.push(idx);
    }
    return tot;
  }, []) ?? [];

const _selectHaulsActiveFilterSelectedIndexes = (
  search: HaulsArgs | undefined,
  gearGroups: GearGroup[],
  speciesGroups: SpeciesGroup[],
) => {
  if (search)
    switch (search.filter) {
      case HaulsFilter.Date:
        const now = new Date();
        const datesLength = now.getFullYear() * 12 + now.getMonth() - 2010 * 12;
        const originalDates = Array.from({ length: datesLength }, (_, i) => ({
          id: 2010 * 12 + i,
        }));
        const selectedDates =
          search?.years && search?.months
            ? search.years
                .map((y) => search.months!.map((m) => ({ id: y * 12 + m - 1 })))
                .flat()
            : [];
        return getIndexes(originalDates, selectedDates);
      case HaulsFilter.GearGroup:
        return getIndexes(gearGroups, search?.gearGroupIds);
      case HaulsFilter.SpeciesGroup:
        return getIndexes(speciesGroups, search?.speciesGroupIds);
      case HaulsFilter.VesselLength:
        return getIndexes(LengthGroups, search?.vesselLengthRanges);
      case HaulsFilter.CatchLocation:
        return [];
    }

  return [];
};

export const selectHaulsMatrixActiveFilterSelectedIndexes = createSelector(
  selectHaulsMatrixSearch,
  selectGearGroupsSorted,
  selectSpeciesGroupsSorted,
  _selectHaulsActiveFilterSelectedIndexes,
);

export const selectHaulsMatrix2ActiveFilterSelectedIndexes = createSelector(
  selectHaulsMatrix2Search,
  selectGearGroupsSorted,
  selectSpeciesGroupsSorted,
  _selectHaulsActiveFilterSelectedIndexes,
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
      case HaulsFilter.CatchLocation:
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
        const y = activeSelected[i];
        value += matrixSum(matrix, width, x, y, x, y);
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
  selectedFilters: number[],
  selectedLocations?: number[],
) => {
  const stats = [];
  const height = heightArray.length;
  const width = matrix.length / height;

  if (selectedLocations)
    for (let y = 0; y < height; y++) {
      let value = 0;
      for (let i = 0; i < selectedLocations.length; i++) {
        const x = selectedLocations[i];
        value += matrixSum(matrix, width, x, y, x, y);
      }
      if (value > 0 || selectedFilters.includes(y)) {
        stats.push({ id: heightArray[y].id, value });
      }
    }
  else
    for (let y = 0; y < height; y++) {
      const value = matrixSum(matrix, width, 0, y, width - 1, y);
      if (value > 0 || selectedFilters.includes(y)) {
        stats.push({ id: heightArray[y].id, value });
      }
    }

  return stats;
};

export const selectGearFilterStats = createSelector(
  selectHaulsMatrix,
  selectHaulsMatrixSearch,
  selectGearGroupsSorted,
  selectHaulsMatrixActiveFilterSelectedIndexes,
  (matrix, search, gearGroups, activeSelected) => {
    if (!matrix) {
      return [];
    }

    const selected = getIndexes(gearGroups, search?.gearGroupIds);
    return search?.filter === HaulsFilter.GearGroup
      ? computeActiveStats(matrix.gearGroup, gearGroups, selected)
      : computeStats(matrix.gearGroup, gearGroups, activeSelected, selected);
  },
);

export const selectGearFilterStatsSorted = createSelector(
  selectGearFilterStats,
  (state) => [...state].sort((a, b) => b.value - a.value),
);

export const selectSelectedGridLocationIndexes = createSelector(
  selectSelectedGridsString,
  (state) =>
    state.reduce((tot: number[], cur) => {
      const idx = fishingLocationAreas.indexOf(cur);
      if (idx >= 0) {
        tot.push(idx);
      }
      return tot;
    }, []),
);

export const selectGearFilterGridStats = createSelector(
  selectHaulsMatrix2,
  selectHaulsMatrix2Search,
  selectGearGroupsSorted,
  selectHaulsMatrix2ActiveFilterSelectedIndexes,
  selectSelectedGridLocationIndexes,
  (matrix, search, gearGroups, activeSelected, selectedLocations) => {
    if (!matrix) {
      return [];
    }

    const selected = getIndexes(gearGroups, search?.gearGroupIds);
    return search?.filter === HaulsFilter.GearGroup
      ? computeActiveStats(
          matrix.gearGroup,
          gearGroups,
          selected,
          selectedLocations,
        )
      : computeStats(matrix.gearGroup, gearGroups, activeSelected, selected);
  },
);

export const selectGearFilterGridStatsSorted = createSelector(
  selectGearFilterGridStats,
  (state) => [...state].sort((a, b) => b.value - a.value),
);

export const selectSpeciesFilterStats = createSelector(
  selectHaulsMatrix,
  selectHaulsMatrixSearch,
  selectSpeciesGroupsSorted,
  selectHaulsMatrixActiveFilterSelectedIndexes,
  (matrix, search, speciesGroups, activeSelected) => {
    if (!matrix) {
      return [];
    }

    const selected = getIndexes(speciesGroups, search?.speciesGroupIds);
    return search?.filter === HaulsFilter.SpeciesGroup
      ? computeActiveStats(matrix.speciesGroup, speciesGroups, selected)
      : computeStats(
          matrix.speciesGroup,
          speciesGroups,
          activeSelected,
          selected,
        );
  },
);

export const selectSpeciesFilterStatsSorted = createSelector(
  selectSpeciesFilterStats,
  (state) => [...state].sort((a, b) => b.value - a.value),
);

export const selectSpeciesFilterGridStats = createSelector(
  selectHaulsMatrix2,
  selectHaulsMatrix2Search,
  selectSpeciesGroupsSorted,
  selectHaulsMatrix2ActiveFilterSelectedIndexes,
  selectSelectedGridLocationIndexes,
  (matrix, search, speciesGroups, activeSelected, selectedLocations) => {
    if (!matrix) {
      return [];
    }

    const selected = getIndexes(speciesGroups, search?.speciesGroupIds);
    return search?.filter === HaulsFilter.SpeciesGroup
      ? computeActiveStats(
          matrix.speciesGroup,
          speciesGroups,
          selected,
          selectedLocations,
        )
      : computeStats(
          matrix.speciesGroup,
          speciesGroups,
          activeSelected,
          selected,
        );
  },
);

export const selectSpeciesFilterGridStatsSorted = createSelector(
  selectSpeciesFilterGridStats,
  (state) => [...state].sort((a, b) => b.value - a.value),
);

export const selectVesselLengthFilterStats = createSelector(
  selectHaulsMatrix,
  selectHaulsMatrixSearch,
  selectHaulsMatrixActiveFilterSelectedIndexes,
  (matrix, search, activeSelected) => {
    if (!matrix) {
      return [];
    }

    const selected = getIndexes(LengthGroups, search?.vesselLengthRanges);
    return search?.filter === HaulsFilter.VesselLength
      ? computeActiveStats(matrix.lengthGroup, LengthGroups, selected)
      : computeStats(
          matrix.lengthGroup,
          LengthGroups,
          activeSelected,
          selected,
        );
  },
);

export const selectVesselLengthFilterStatsSorted = createSelector(
  selectVesselLengthFilterStats,
  (state) => [...state].sort((a, b) => b.value - a.value),
);

export const selectVesselLengthFilterGridStats = createSelector(
  selectHaulsMatrix2,
  selectHaulsMatrix2Search,
  selectHaulsMatrix2ActiveFilterSelectedIndexes,
  selectSelectedGridLocationIndexes,
  (matrix, search, activeSelected, selectedLocations) => {
    if (!matrix) {
      return [];
    }

    const selected = getIndexes(LengthGroups, search?.vesselLengthRanges);
    return search?.filter === HaulsFilter.VesselLength
      ? computeActiveStats(
          matrix.lengthGroup,
          LengthGroups,
          selected,
          selectedLocations,
        )
      : computeStats(
          matrix.lengthGroup,
          LengthGroups,
          activeSelected,
          selected,
        );
  },
);

export const selectVesselLengthFilterGridStatsSorted = createSelector(
  selectVesselLengthFilterGridStats,
  (state) => [...state].sort((a, b) => b.value - a.value),
);
