import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "./selectAppState";

export const selectError = createSelector(
  selectAppState,
  (state) => state.error,
);

export const selectAccessToken = createSelector(
  selectAppState,
  (state) => state.authUser?.access_token,
);

export const selectIsLoggedIn = createSelector(
  selectAppState,
  (state) => state.isLoggedIn,
);

export const selectBwUserProfile = createSelector(
  selectAppState,
  (state) => state.bwUser,
);

export const selectBwUserLoading = createSelector(
  selectAppState,
  (state) => state.bwUserLoading,
);
