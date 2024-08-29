import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { AppState } from "store/state";
import { getVessels } from "./actions";

export const vesselBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder.addCase(getVessels.fulfilled, (state, action) => {
    const vessels = action.payload;
    state.vessels = vessels;
    state.vesselsByCallsign = {};
    state.vesselsByFiskeridirId = {};
    for (const vessel of vessels) {
      if (vessel.fiskeridir?.callSign) {
        state.vesselsByCallsign[vessel.fiskeridir.callSign] = vessel;
      }

      if (vessel.fiskeridir?.id) {
        state.vesselsByFiskeridirId[vessel.fiskeridir.id] = vessel;
      }
    }
  });
