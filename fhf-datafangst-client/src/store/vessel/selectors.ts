import { createSelector } from "@reduxjs/toolkit";
import { Haul } from "generated/openapi";
import { selectAppState } from "store/selectors";

export const selectVesselsLoading = createSelector(
  selectAppState,
  (state) => state.vessels === undefined,
);

export const selectVessels = createSelector(
  selectAppState,
  (state) => state.vessels ?? {},
);

export const selectVesselsByCallsign = createSelector(
  selectAppState,
  (state) => state.vesselsByCallsign ?? {},
);

export const selectVessel = (haul: Haul) =>
  createSelector(
    selectVessels,
    selectVesselsByCallsign,
    (vessels, vesselsByCallsign) => {
      let vessel;
      if (haul.fiskeridirVesselId) {
        vessel = vessels[haul.fiskeridirVesselId];
      } else {
        vessel = vesselsByCallsign[haul.vesselCallSignErs];
      }
      return vessel;
    },
  );
