export enum DashboardViewState {
  Overview = "overview",
  Follow = "follow",
}

export interface DashboardState {
  activeMenu: DashboardViewState;
}

export const initialDashboardState: DashboardState = {
  activeMenu: DashboardViewState.Overview,
};
