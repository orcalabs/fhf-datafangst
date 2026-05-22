import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import type { AppState } from "~/store/state";
import { getVessels } from "./actions";

export const vesselBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder.addCase(getVessels.fulfilled, (state, action) => {
    state.vessels = action.payload;
  });
