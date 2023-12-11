import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { AppState } from "store/state";
import { setActiveDashboardMenu } from "./actions";

export const dashboardBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder.addCase(setActiveDashboardMenu, (state, action) => {
    state.activeMenu = action.payload;
  });
