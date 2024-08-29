import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectAppState";

export const selectActiveDashboardMenu = createSelector(
  selectAppState,
  (state) => state.activeMenu,
);
