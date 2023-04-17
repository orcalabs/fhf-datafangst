import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { AppState } from "store/state";
import { getGear, getGearGroups, getGearMainGroups } from ".";

export const gearBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(getGear.fulfilled, (state, action) => {
      state.gears = action.payload;
    })
    .addCase(getGearGroups.fulfilled, (state, action) => {
      state.gearGroups = action.payload;
    })
    .addCase(getGearMainGroups.fulfilled, (state, action) => {
      state.gearMainGroups = action.payload;
    });
