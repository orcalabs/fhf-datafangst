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

export const selectViewState = createSelector(
  selectAppState,
  (state) => state.viewState,
);

export const selectIsLoggedIn = createSelector(
  selectAppState,
  (state) => state.isLoggedIn,
);

export const selectSecondaryMenuOpen = createSelector(
  selectAppState,
  (state) => state.selectedGrids.length > 0 || Boolean(state.selectedTrip),
);

export const selectTrackMissing = createSelector(
  selectAppState,
  (state) =>
    (state.selectedHaul ?? state.selectedTrip) &&
    !state.track?.length &&
    !state.trackLoading,
);

export const selectMatrixToggle = createSelector(
  selectAppState,
  (state) => state.matrixToggle,
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

export const selectVesselSettingsOpen = createSelector(
  selectAppState,
  (state) => state.vesselSettingsOpen,
);

export const selectBwUserLoading = createSelector(
  selectAppState,
  (state) => state.bwUserLoading,
);
