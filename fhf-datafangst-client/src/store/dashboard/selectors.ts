import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectors";

export const selectActiveDashboardMenu = createSelector(
  selectAppState,
  (state) => state.activeMenu,
);
