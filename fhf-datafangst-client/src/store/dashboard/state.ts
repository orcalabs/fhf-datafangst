import type { PerVesselStats } from "~/generated/openapi";
import { VesselRankingType } from "~/models";

export enum DashboardViewState {
  Overview = "overview",
  Benchmark = "benchmark",
  Company = "company",
}

export interface DashboardState {
  activeMenu: DashboardViewState;
  vesselRankingType: VesselRankingType;
  vesselRankingKpi: keyof PerVesselStats;
}

export const initialDashboardState: DashboardState = {
  activeMenu: DashboardViewState.Overview,
  vesselRankingType: VesselRankingType.Similar,
  vesselRankingKpi: "livingWeight",
};
