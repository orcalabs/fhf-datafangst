import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { AppState } from "store/state";
import { getVessels } from ".";

export const vesselBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder.addCase(getVessels.fulfilled, (state, action) => {
    const vessels = action.payload;
    state.vessels = {};
    state.vesselsByCallsign = {};

    for (const vessel of vessels) {
      if (!vessel.fiskeridir.lengthGroupId) {
        vessel.fiskeridir.lengthGroupId = 99;
      }

      if (vessel.fiskeridir.callSign) {
        state.vesselsByCallsign[vessel.fiskeridir.callSign] = vessel;
      }

      state.vessels[vessel.fiskeridir.id] = vessel;
    }
  });
