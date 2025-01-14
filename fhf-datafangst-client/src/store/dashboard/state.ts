export enum DashboardViewState {
  Overview = "overview",
  Benchmark = "benchmark",
  Follow = "follow",
  Fuel = "fuel",
  Company = "company",
}

export interface DashboardState {
  activeMenu: DashboardViewState;
}

export const initialDashboardState: DashboardState = {
  activeMenu: DashboardViewState.Overview,
};
