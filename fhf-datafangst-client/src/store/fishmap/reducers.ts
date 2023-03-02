import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { AppState } from "store/state";
import { initializeMap, setSelectedGrids } from ".";

export const fishmapBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(initializeMap, (state, action) => {
      state.map = action.payload;
    })
    .addCase(setSelectedGrids, (state, action) => {
      return {
        ...state,
        selectedGrids: action.payload,
      };
    });
