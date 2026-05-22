import { createSelector } from "@reduxjs/toolkit";
import { PROJECT_USERS } from "./reducers";
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

export const selectLoading = createSelector(
  selectAppState,
  (state) =>
    state.bwUserLoading || state.userLoading || state.vessels === undefined,
);

export const selectBwUserProfile = createSelector(
  selectAppState,
  (state) => state.bwUser,
);

export const selectBwUserCallSign = createSelector(
  selectBwUserProfile,
  (state) => state?.fiskInfoProfile?.ircs ?? undefined,
);

export const selectIsProjectUser = createSelector(
  selectBwUserProfile,
  (state) => state?.user.email && state.user.email in PROJECT_USERS,
);

export const selectSelectedCallSign = createSelector(
  selectAppState,
  (state) => state.selectedCallSign,
);
