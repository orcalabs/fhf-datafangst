import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { getAis } from "store/ais";
import { AppState } from "store/state";
import { getHaulTrip, setSelectedTrip } from ".";

export const tripBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(getHaulTrip.fulfilled, (state, action) => {
      const trip = action.payload;
      state.selectedHaulTrip = trip;

      if (trip && state.vesselsByFiskeridirId) {
        const vessel = state.vesselsByFiskeridirId[trip.fiskeridirVesselId];
        if (vessel?.ais) {
          (action as any).asyncDispatch(
            getAis({
              mmsi: vessel.ais.mmsi,
              start: trip.start,
              end: trip.end,
            }),
          );
        }
      }
    })
    .addCase(setSelectedTrip, (state, action) => {
      state.selectedHaulTrip = action.payload;
    });
