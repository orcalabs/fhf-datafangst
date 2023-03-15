import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { AppState } from "store/state";
import { getHaulTrip } from ".";

export const tripBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder.addCase(getHaulTrip.fulfilled, (state, action) => {
    state.selectedHaulTrip = action.payload;
  });
