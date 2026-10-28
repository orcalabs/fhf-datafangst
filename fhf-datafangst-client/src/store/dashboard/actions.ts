import { createAction } from "@reduxjs/toolkit";
import type { PerVesselStats } from "~/generated/openapi";
import type { VesselRankingType } from "~/models";
import type { DashboardViewState } from "./state";

export const setActiveDashboardMenu = createAction<DashboardViewState>(
  "benchmark/setActiveDashboardMenu",
);

export const setVesselRankingType = createAction<VesselRankingType>(
  "benchmark/setVesselRankingType",
);

export const setVesselRankingKpi = createAction<keyof PerVesselStats>(
  "benchmark/setVesselRankingKpi",
);
