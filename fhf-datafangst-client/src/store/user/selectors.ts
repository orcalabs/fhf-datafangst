import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectAppState";
import { selectVesselsByFiskeridirId } from "store/vessel";

export const selectUserLoading = createSelector(
  selectAppState,
  (state) => state.userLoading,
);

export const selectUser = createSelector(selectAppState, (state) => state.user);

export const selectUserFollowList = createSelector(
  selectVesselsByFiskeridirId,
  selectUser,
  (vesselsByFiskeridirId, user) =>
    user?.following.map((vesselId) => vesselsByFiskeridirId[vesselId]),
);
