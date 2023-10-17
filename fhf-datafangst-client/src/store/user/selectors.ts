import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectors";

export const selectUserLoading = createSelector(
  selectAppState,
  (state) => state.userLoading,
);

export const selectUser = createSelector(selectAppState, (state) => state.user);

export const selectUserVessels = createSelector(
  selectAppState,
  (state) => state.userVessels,
);
