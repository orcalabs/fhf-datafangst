import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectors";

export const selectSelectedHaulTrip = createSelector(
  selectAppState,
  (state) => state.selectedHaulTrip,
);
