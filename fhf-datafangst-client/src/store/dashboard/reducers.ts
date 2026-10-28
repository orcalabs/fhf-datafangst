import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import type { AppState } from "~/store/state";
import {
  setActiveDashboardMenu,
  setVesselRankingKpi,
  setVesselRankingType,
} from "./actions";

export const dashboardBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(setActiveDashboardMenu, (state, action) => {
      state.activeMenu = action.payload;
    })
    .addCase(setVesselRankingType, (state, action) => {
      state.vesselRankingType = action.payload;
    })
    .addCase(setVesselRankingKpi, (state, action) => {
      state.vesselRankingKpi = action.payload;
    });
