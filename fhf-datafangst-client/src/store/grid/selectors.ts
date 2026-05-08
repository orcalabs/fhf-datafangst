import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "~/store/selectAppState";

export const selectSelectedGrids = createSelector(
  selectAppState,
  (state) => state.selectedGrids,
);

export const selectSelectedGridsString = createSelector(
  selectAppState,
  (state) => state.selectedGridsString,
);
