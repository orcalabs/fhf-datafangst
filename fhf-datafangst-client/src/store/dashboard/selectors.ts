import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "~/store/selectAppState";

export const selectActiveDashboardMenu = createSelector(
  selectAppState,
  (state) => state.activeMenu,
);

export const selectVesselRankingType = createSelector(
  selectAppState,
  (state) => state.vesselRankingType,
);

export const selectVesselRankingKpi = createSelector(
  selectAppState,
  (state) => state.vesselRankingKpi,
);
