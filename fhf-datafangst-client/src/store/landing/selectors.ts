import { createSelector } from "@reduxjs/toolkit";
import { LandingsArgs, LandingsFilter } from "api";
import { getAllYearsArray } from "components/Filters/YearsFilter";
import {
  GearGroup,
  LandingsSorting,
  Ordering,
  SpeciesGroup,
} from "generated/openapi";
import { LengthGroups } from "models";
import { selectSelectedGridsString } from "store/fishmap";
import { selectGearGroupsSorted } from "store/gear";
import { selectAppState } from "store/selectors";
import { selectSpeciesGroupsSorted } from "store/species";
import { fishingLocationAreas, matrixSum, MinLandingYear } from "utils";

export const selectShowLandingTimeSlider = createSelector(
  selectAppState,
  (state) =>
    (!!state.landingsMatrix || state.landingsMatrixLoading) &&
    !state.selectedTrip &&
    state.trips === undefined &&
    !state.selectedGrids.length &&
    state.fishingFacilities === undefined &&
    !state.fishingFacilitiesLoading &&
    !state.tripsLoading,
);

export const selectLandingsLoading = createSelector(
  selectAppState,
  (state) => state.landingsLoading,
);

export const selectLandingsMatrixLoading = createSelector(
  selectAppState,
  (state) => state.landingsMatrixLoading,
);

export const selectLandingsMatrix2Loading = createSelector(
  selectAppState,
  (state) => state.landingsMatrix2Loading,
);

export const selectLandingsSearch = createSelector(
  selectAppState,
  (state) => state.landingsSearch,
);

export const selectLandingsMatrixSearch = createSelector(
  selectAppState,
  (state) => state.landingsMatrixSearch,
);

export const selectLandingsMatrix2Search = createSelector(
  selectAppState,
  (state) => state.landingsMatrix2Search,
);

export const selectLandings = createSelector(
  selectAppState,
  (state) => state.landings ?? {},
);

export const selectLandingsSorted = (
  sorting: LandingsSorting,
  ordering: Ordering,
) =>
  createSelector(selectLandings, (state) => {
    if (!Object.keys(state).length) {
      return state;
    }

    if (
      ordering === Ordering.Desc &&
      sorting === LandingsSorting.LandingTimestamp
    ) {
      return Object.values(state).sort(
        (a, b) =>
          new Date(b.landingTimestamp).getTime() -
          new Date(a.landingTimestamp).getTime(),
      );
    } else if (
      ordering === Ordering.Asc &&
      sorting === LandingsSorting.LandingTimestamp
    ) {
      return Object.values(state).sort(
        (a, b) =>
          new Date(a.landingTimestamp).getTime() -
          new Date(b.landingTimestamp).getTime(),
      );
    } else if (
      ordering === Ordering.Desc &&
      sorting === LandingsSorting.LivingWeight
    ) {
      return Object.values(state).sort(
        (a, b) => b.totalLivingWeight - a.totalLivingWeight,
      );
    } else if (
      ordering === Ordering.Asc &&
      sorting === LandingsSorting.LivingWeight
    ) {
      return Object.values(state).sort(
        (a, b) => a.totalLivingWeight - b.totalLivingWeight,
      );
    }
    return state;
  });

export const selectLandingsMatrix = createSelector(
  selectAppState,
  (state) => state.landingsMatrix,
);

export const selectLandingsMatrix2 = createSelector(
  selectAppState,
  (state) => state.landingsMatrix2,
);

export const selectSelectedLanding = createSelector(
  selectAppState,
  (state) => state.selectedLanding,
);

export const selectSelectedTripLanding = createSelector(
  selectAppState,
  (state) => state.selectedTripLanding,
);

export const selectLandingsFilter = createSelector(
  selectLandingsMatrixSearch,
  (state) =>
    state?.filter === LandingsFilter.Vessel
      ? LandingsFilter.VesselLength
      : state?.filter,
);

export const selectLandingDateSliderFrame = createSelector(
  selectAppState,
  (state) => state.landingDateSliderFrame,
);

const getIndexes = (original: { id: any }[], selected?: { id: any }[]) =>
  selected?.reduce((tot: number[], cur) => {
    const idx = original.findIndex((o) => o.id === cur.id);
    if (idx >= 0) {
      tot.push(idx);
    }
    return tot;
  }, []) ?? [];

const _selectLandingsActiveFilterSelectedIndexes = (
  search: LandingsArgs | undefined,
  gearGroups: GearGroup[],
  speciesGroups: SpeciesGroup[],
  currentDateSliderFrame?: Date,
) => {
  if (search)
    switch (search.filter) {
      case LandingsFilter.Date:
        if (
          !search.years?.length &&
          !search.months?.length &&
          !currentDateSliderFrame
        ) {
          return [];
        }

        const now = new Date();
        const datesLength = (now.getFullYear() + 1) * 12 - MinLandingYear * 12;
        const originalDates = Array.from({ length: datesLength }, (_, i) => ({
          id: MinLandingYear * 12 + i,
        }));

        if (currentDateSliderFrame) {
          const d = currentDateSliderFrame;
          return getIndexes(originalDates, [
            { id: d.getFullYear() * 12 + d.getMonth() },
          ]);
        }

        const years = search.years?.length
          ? search.years
          : getAllYearsArray(MinLandingYear);
        const months = search.months?.length
          ? search.months
          : Array.from({ length: 12 }, (_, i) => i + 1);

        const selectedDates = years
          .map((y) => months.map((m) => ({ id: y * 12 + m - 1 })))
          .flat();

        return getIndexes(originalDates, selectedDates);
      case LandingsFilter.GearGroup:
        return getIndexes(gearGroups, search?.gearGroupIds);
      case LandingsFilter.SpeciesGroup:
        return getIndexes(speciesGroups, search?.speciesGroupIds);
      case LandingsFilter.VesselLength:
        return getIndexes(LengthGroups, search?.vesselLengthRanges);
    }

  return [];
};

export const selectLandingsMatrixActiveFilterSelectedIndexes = createSelector(
  selectLandingsMatrixSearch,
  selectGearGroupsSorted,
  selectSpeciesGroupsSorted,
  selectLandingDateSliderFrame,
  _selectLandingsActiveFilterSelectedIndexes,
);

export const selectLandingsMatrix2ActiveFilterSelectedIndexes = createSelector(
  selectLandingsMatrix2Search,
  selectGearGroupsSorted,
  selectSpeciesGroupsSorted,
  _selectLandingsActiveFilterSelectedIndexes,
);

export const selectLandingLocationsMatrix = createSelector(
  selectLandingsMatrix,
  selectLandingsFilter,
  (matrix, filter) => {
    switch (filter) {
      case LandingsFilter.Date:
        return matrix?.dates;
      case LandingsFilter.GearGroup:
        return matrix?.gearGroup;
      case LandingsFilter.SpeciesGroup:
        return matrix?.speciesGroup;
      case LandingsFilter.VesselLength:
        return matrix?.lengthGroup;
    }
  },
);

const computeStats = (
  matrix: number[],
  widthArray: { id: any }[],
  filters: number[],
  activeFilters?: number[],
) => {
  const stats = [];
  const width = widthArray.length;
  const height = matrix.length / width;

  if (activeFilters?.length)
    for (let x = 0; x < width; x++) {
      let value = 0;
      for (let i = 0; i < activeFilters.length; i++) {
        const y = activeFilters[i];
        if (y < height) {
          value += matrixSum(matrix, width, x, y, x, y);
        }
      }
      if (value > 0 || filters.includes(x)) {
        stats.push({ id: widthArray[x].id, value });
      }
    }
  else
    for (let x = 0; x < width; x++) {
      const value = matrixSum(matrix, width, x, 0, x, height - 1);
      if (value > 0 || filters.includes(x)) {
        stats.push({ id: widthArray[x].id, value });
      }
    }

  return stats;
};

const selectGearFilterStats = createSelector(
  selectLandingsMatrix,
  selectLandingsMatrixSearch,
  selectLandingsFilter,
  selectGearGroupsSorted,
  selectLandingsMatrixActiveFilterSelectedIndexes,
  (matrix, search, filter, gearGroups, activeSelected) => {
    if (!matrix) {
      return [];
    }

    const selected = getIndexes(gearGroups, search?.gearGroupIds);
    return computeStats(
      matrix.gearGroup,
      gearGroups,
      selected,
      filter === LandingsFilter.GearGroup ? undefined : activeSelected,
    );
  },
);

export const selectLandingGearFilterStats = createSelector(
  selectGearFilterStats,
  (state) => [...state].sort((a, b) => b.value - a.value),
);

const selectSelectedGridLocationIndexes = createSelector(
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

const selectGearFilterGridStats = createSelector(
  selectLandingsMatrix2,
  selectLandingsMatrix2Search,
  selectGearGroupsSorted,
  selectLandingsMatrix2ActiveFilterSelectedIndexes,
  selectSelectedGridLocationIndexes,
  (matrix, search, gearGroups, activeSelected, selectedLocations) => {
    if (!matrix) {
      return [];
    }

    const selected = getIndexes(gearGroups, search?.gearGroupIds);
    return computeStats(
      matrix.gearGroup,
      gearGroups,
      selected,
      search?.filter === LandingsFilter.GearGroup
        ? selectedLocations
        : activeSelected,
    );
  },
);

export const selectLandingGearFilterGridStats = createSelector(
  selectGearFilterGridStats,
  (state) => [...state].sort((a, b) => b.value - a.value),
);

const selectSpeciesFilterStats = createSelector(
  selectLandingsMatrix,
  selectLandingsMatrixSearch,
  selectLandingsFilter,
  selectSpeciesGroupsSorted,
  selectLandingsMatrixActiveFilterSelectedIndexes,
  (matrix, search, filter, speciesGroups, activeSelected) => {
    if (!matrix) {
      return [];
    }

    const selected = getIndexes(speciesGroups, search?.speciesGroupIds);
    return computeStats(
      matrix.speciesGroup,
      speciesGroups,
      selected,
      filter === LandingsFilter.SpeciesGroup ? undefined : activeSelected,
    );
  },
);

export const selectLandingSpeciesFilterStats = createSelector(
  selectSpeciesFilterStats,
  (state) => [...state].sort((a, b) => b.value - a.value),
);

const selectSpeciesFilterGridStats = createSelector(
  selectLandingsMatrix2,
  selectLandingsMatrix2Search,
  selectSpeciesGroupsSorted,
  selectLandingsMatrix2ActiveFilterSelectedIndexes,
  selectSelectedGridLocationIndexes,
  (matrix, search, speciesGroups, activeSelected, selectedLocations) => {
    if (!matrix) {
      return [];
    }

    const selected = getIndexes(speciesGroups, search?.speciesGroupIds);
    return computeStats(
      matrix.speciesGroup,
      speciesGroups,
      selected,
      search?.filter === LandingsFilter.SpeciesGroup
        ? selectedLocations
        : activeSelected,
    );
  },
);

export const selectLandingSpeciesFilterGridStats = createSelector(
  selectSpeciesFilterGridStats,
  (state) => [...state].sort((a, b) => b.value - a.value),
);

const selectVesselLengthFilterStats = createSelector(
  selectLandingsMatrix,
  selectLandingsMatrixSearch,
  selectLandingsFilter,
  selectLandingsMatrixActiveFilterSelectedIndexes,
  (matrix, search, filter, activeSelected) => {
    if (!matrix) {
      return [];
    }

    const selected = getIndexes(LengthGroups, search?.vesselLengthRanges);
    return computeStats(
      matrix.lengthGroup,
      LengthGroups,
      selected,
      filter === LandingsFilter.VesselLength ? undefined : activeSelected,
    );
  },
);

export const selectLandingVesselLengthFilterStats = createSelector(
  selectVesselLengthFilterStats,
  (state) => [...state].sort((a, b) => b.value - a.value),
);

const selectVesselLengthFilterGridStats = createSelector(
  selectLandingsMatrix2,
  selectLandingsMatrix2Search,
  selectLandingsMatrix2ActiveFilterSelectedIndexes,
  selectSelectedGridLocationIndexes,
  (matrix, search, activeSelected, selectedLocations) => {
    if (!matrix) {
      return [];
    }

    const selected = getIndexes(LengthGroups, search?.vesselLengthRanges);
    return computeStats(
      matrix.lengthGroup,
      LengthGroups,
      selected,
      search?.filter === LandingsFilter.VesselLength
        ? selectedLocations
        : activeSelected,
    );
  },
);

export const selectLandingVesselLengthFilterGridStats = createSelector(
  selectVesselLengthFilterGridStats,
  (state) => [...state].sort((a, b) => b.value - a.value),
);
