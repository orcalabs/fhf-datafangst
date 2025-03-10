import { createSelector } from "@reduxjs/toolkit";
import { Policies, Roles } from "models";
import { selectAppState } from "./selectAppState";

export const selectError = createSelector(
  selectAppState,
  (state) => state.error,
);

export const selectAccessToken = createSelector(
  selectAppState,
  (state) => state.authUser?.access_token,
);

export const selectAppPage = createSelector(
  selectAppState,
  (state) => state.appPage,
);

export const selectIsLoggedIn = createSelector(
  selectAppState,
  (state) => state.isLoggedIn,
);

export const selectTrackMissing = createSelector(
  selectAppState,
  (state) =>
    (state.selectedHaul ?? state.selectedTrip) &&
    !state.track?.length &&
    !state.trackLoading,
);

export const selectTripFiltersOpen = createSelector(
  selectAppState,
  (state) => state.tripFiltersOpen,
);

export const selectTripDetailsOpen = createSelector(
  selectAppState,
  (state) => state.tripDetailsOpen,
);

export const selectBwUserProfile = createSelector(
  selectAppState,
  (state) => state.bwUser,
);

export const selectBwUserCallSign = createSelector(
  selectBwUserProfile,
  (state) => state?.fiskInfoProfile?.ircs,
);

const AIS_ROLES = [
  Roles.BwDownloadFishingfacility,
  Roles.BwEksternFiskInfoUtvikler,
  Roles.BwFiskerikyndig,
  Roles.BwFiskinfoAdmin,
  Roles.BwUtdanningsBruker,
  Roles.BwViewAis,
  Roles.BwYrkesfisker,
];

export const selectCanReadAisUnder15 = createSelector(
  selectBwUserProfile,
  (state) =>
    state?.policies?.includes(Policies.BwAisFiskinfo) &&
    state.roles?.some((v) => AIS_ROLES.includes(v)),
);

export const selectBwUserLoading = createSelector(
  selectAppState,
  (state) => state.bwUserLoading,
);
