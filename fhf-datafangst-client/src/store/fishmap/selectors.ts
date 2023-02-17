import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectors";

export const selectFishmap = createSelector(
  selectAppState,
  (state) => state.map
);

export const selectFishmapState = createSelector(selectAppState, (state) => ({
  map: state.map,
  centerCoordinate: state.centerCoordinate,
  zoom: state.zoomLevel,
  zoomFactor: state.zoomFactor,
}));
