import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "~/store/selectAppState";

export const selectUser = createSelector(selectAppState, (state) => state.user);

export const selectUserConsent = createSelector(
  selectAppState,
  (state) => state.user?.fuelConsent,
);
