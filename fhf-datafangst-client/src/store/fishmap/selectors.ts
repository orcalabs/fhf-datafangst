import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectors";
import { ViewMode } from "./state";

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

export const selectViewMode = createSelector(
  selectAppState,
  (state) => state.viewMode,
);

export const selectShowGrid = createSelector(
  selectAppState,
  (state) =>
    state.haulsMatrix &&
    state.viewMode === ViewMode.Grid &&
    !(state.selectedTrip ?? state.trips?.length) &&
    state.fishingFacilities === undefined &&
    !state.fishingFacilitiesLoading &&
    !state.tripsLoading,
);
