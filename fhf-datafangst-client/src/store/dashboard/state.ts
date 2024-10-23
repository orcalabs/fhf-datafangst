export enum DashboardViewState {
  Overview = "overview",
  Benchmark = "benchmark",
  Follow = "follow",
  Fuel = "fuel",
}

export interface DashboardState {
  activeMenu: DashboardViewState;
}

export const initialDashboardState: DashboardState = {
  activeMenu: DashboardViewState.Overview,
};
