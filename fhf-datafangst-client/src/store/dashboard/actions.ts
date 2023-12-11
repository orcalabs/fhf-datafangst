import { createAction } from "@reduxjs/toolkit";
import { DashboardViewState } from "./state";

export const setActiveDashboardMenu = createAction<DashboardViewState>(
  "benchmark/setActiveDashboardMenu",
);
