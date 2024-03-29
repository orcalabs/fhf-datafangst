import { createSelector } from "@reduxjs/toolkit";
import { selectVesselsByFiskeridirId } from "store/vessel";
import { selectAppState } from "store/selectors";

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
