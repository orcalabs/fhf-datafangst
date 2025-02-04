export enum DashboardViewState {
  Overview = "overview",
  Benchmark = "benchmark",
  Company = "company",
}

export interface DashboardState {
  activeMenu: DashboardViewState;
}

export const initialDashboardState: DashboardState = {
  activeMenu: DashboardViewState.Overview,
};
