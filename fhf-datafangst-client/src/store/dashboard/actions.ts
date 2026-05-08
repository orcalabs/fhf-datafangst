import { createAction } from "@reduxjs/toolkit";
import type { DashboardViewState } from "./state";

export const setActiveDashboardMenu = createAction<DashboardViewState>(
  "benchmark/setActiveDashboardMenu",
);
