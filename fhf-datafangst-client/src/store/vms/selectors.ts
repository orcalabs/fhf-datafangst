import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectors";

export const selectVmsLoading = createSelector(
  selectAppState,
  (state) => state.vmsLoading,
);

export const selectVms = createSelector(selectAppState, (state) => state.vms);
