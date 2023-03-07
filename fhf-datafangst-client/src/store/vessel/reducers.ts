import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { AppState } from "store/state";
import { getVessels } from ".";

export const vesselBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder.addCase(getVessels.fulfilled, (state, action) => {
    const vessels = action.payload;
    state.vessels = {};
    for (const vessel of vessels) {
      if (!vessel.fiskeridirVessel.lengthGroupId) {
        vessel.fiskeridirVessel.lengthGroupId = 99;
      }
      state.vessels[vessel.fiskeridirVessel.id] = vessel;
    }
  });
