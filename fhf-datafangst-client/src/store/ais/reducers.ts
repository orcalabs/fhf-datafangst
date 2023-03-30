import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { getAis, getHaulAis } from "./actions";
import { AppState } from "store/state";

export const aisBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(getAis.pending, (state, _) => {
      state.aisLoading = true;
      state.ais = undefined;
    })
    .addCase(getAis.fulfilled, (state, action) => {
      state.aisLoading = false;
      const ais = action.payload;
      if (!ais) return;
      state.ais = ais;
    })
    .addCase(getAis.rejected, (state, _) => {
      state.aisLoading = false;
    })
    .addCase(getHaulAis, (state, action) => {
      const haul = action.payload;

      if (haul && state.vesselsByCallsign) {
        const vessel = state.vesselsByCallsign[haul.vesselCallSignErs];
        if (vessel?.ais) {
          (action as any).asyncDispatch(
            getAis({
              mmsi: vessel.ais.mmsi,
              start: haul.startTimestamp,
              end: haul.stopTimestamp,
            }),
          );
        }
      }
    });
