import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectors";

export const selectVesselsLoading = createSelector(
  selectAppState,
  (state) => state.vessels === undefined,
);

export const selectVessels = createSelector(
  selectAppState,
  (state) => state.vessels ?? {},
);

export const selectVessel = (id: number) =>
  createSelector(selectVessels, (state) => state[id]);

export const selectSelectedVessel = createSelector(
  selectAppState,
  (state) => state.selectedVessel,
);

export const selectErsEnabled = createSelector(
  selectSelectedVessel,
  (state) => state?.ersEnabled ?? true,
);
