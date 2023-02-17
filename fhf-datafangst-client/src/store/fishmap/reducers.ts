import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { AppState } from "store/state";
import { initializeMap } from ".";

export const fishmapBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder.addCase(initializeMap, (state, action) => {
    state.map = action.payload;
  });
