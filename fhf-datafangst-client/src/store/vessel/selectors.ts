import { createSelector } from "@reduxjs/toolkit";
import { Haul, Vessel } from "generated/openapi";
import { selectHauls } from "store/haul";
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

export const selectVesselsByFiskeridirId = createSelector(
  selectAppState,
  (state) => state.vesselsByFiskeridirId ?? {},
);

export const selectVesselsByHaulId = createSelector(
  selectVesselsByFiskeridirId,
  selectVesselsByCallsign,
  selectHauls,
  (vesselsByFiskeridirId, vesselsByCallSign, hauls) => {
    const vesselsMap: Record<string, Vessel> = {};
    for (const haul of hauls) {
      if (haul.fiskeridirVesselId) {
        vesselsMap[haul.haulId] =
          vesselsByFiskeridirId[haul.fiskeridirVesselId];
      } else {
        vesselsMap[haul.haulId] = vesselsByCallSign[haul.vesselCallSignErs];
      }
    }

    return vesselsMap;
  },
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
