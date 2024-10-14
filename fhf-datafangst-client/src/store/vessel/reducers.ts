import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { AppState } from "store/state";
import { getVesselBenchmarks, getVessels } from "./actions";

export const vesselBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(getVessels.fulfilled, (state, action) => {
      const vessels = action.payload;
      state.vessels = vessels;
      state.vesselsByCallSign = {};
      state.vesselsByFiskeridirId = {};
      for (const vessel of vessels) {
        if (vessel.fiskeridir?.callSign) {
          state.vesselsByCallSign[vessel.fiskeridir.callSign] = vessel;
        }

        if (vessel.fiskeridir?.id) {
          state.vesselsByFiskeridirId[vessel.fiskeridir.id] = vessel;
        }
      }
    })
    .addCase(getVesselBenchmarks.fulfilled, (state, action) => {
      state.vesselBenchmarks = action.payload;
    });
