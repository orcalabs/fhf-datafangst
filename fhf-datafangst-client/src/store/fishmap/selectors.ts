import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectAppState";

export const selectFishmap = createSelector(
  selectAppState,
  (state) => state.map,
);

export const selectSelectedGrids = createSelector(
  selectAppState,
  (state) => state.selectedGrids,
);

export const selectSelectedGridsString = createSelector(
  selectAppState,
  (state) => state.selectedGridsString,
);

export const selectFishmapState = createSelector(selectAppState, (state) => ({
  map: state.map,
  centerCoordinate: state.centerCoordinate,
  zoom: state.zoomLevel,
  zoomFactor: state.zoomFactor,
}));

export const selectShowGrid = createSelector(
  selectAppState,
  (state) =>
    (state.haulsMatrix ?? state.landingsMatrix) &&
    !state.selectedTrip &&
    state.trips === undefined &&
    state.fishingFacilities === undefined &&
    !state.fishingFacilitiesLoading &&
    !state.tripsLoading,
);
