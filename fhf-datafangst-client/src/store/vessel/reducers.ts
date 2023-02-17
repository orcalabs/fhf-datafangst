import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { emptyState } from "store/reducers";
import { AppState } from "store/state";
import { getVessels, setSelectedVessel } from ".";
import { Feature } from "ol";
import { Icon, Style } from "ol/style";
import vesselPin from "assets/icons/vessel-map-small.svg";

const image = new Icon({
  opacity: 1,
  anchor: [0.5, 0.5],
  scale: 0.05,
  src: vesselPin,
});

export const vesselBuilder = (
  builder: ActionReducerMapBuilder<AppState>
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(getVessels.fulfilled, (state, action) => {
      const vessels = action.payload;
      state.vessels = {};
      for (const vessel of vessels) {
        if (vessel.mmsi) {
          vessel.mapPlot = new Feature({ vessel });
          vessel.mapPlot.setStyle(new Style({ image }));
        }
        state.vessels[vessel.id] = vessel;
      }
    })
    .addCase(setSelectedVessel, (state, action) => {
      return {
        ...state,
        ...emptyState,
        selectedVessel: action.payload,
      };
    });
