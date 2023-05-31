import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectors";

export const selectFishingFacilitiesLoading = createSelector(
  selectAppState,
  (state) => state.fishingFacilitiesLoading,
);

export const selectFishingFacilities = createSelector(
  selectAppState,
  (state) => state.fishingFacilities,
);

export const selectSelectedFishingFacility = createSelector(
  selectAppState,
  (state) => state.selectedFishingFacility,
);

export const selectFishingFacilitySearch = createSelector(
  selectAppState,
  (state) => state.fishingFacilitiesSearch,
);

export const selectFishingFacility = (idx: number) =>
  createSelector(selectFishingFacilities, (state) => state?.[idx]);
