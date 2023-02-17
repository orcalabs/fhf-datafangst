import { createSelector } from "@reduxjs/toolkit";
import { AppState } from "./state";

export const selectAppState = (state: AppState) => state;

export const selectError = createSelector(
  selectAppState,
  (state) => state.error
);
