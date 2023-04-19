import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { AppState } from "store/state";
import { getHaulTrip, setSelectedTrip } from ".";
import { getTrack } from "store";

export const tripBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(getHaulTrip.fulfilled, (state, action) => {
      const trip = action.payload;
      state.selectedHaulTrip = trip;

      if (trip && state.vesselsByFiskeridirId) {
        const vessel = state.vesselsByFiskeridirId[trip.fiskeridirVesselId];

        if (vessel) {
          (action as any).asyncDispatch(
            getTrack({
              mmsi: vessel.ais?.mmsi,
              callSign: vessel.fiskeridir.callSign,
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
