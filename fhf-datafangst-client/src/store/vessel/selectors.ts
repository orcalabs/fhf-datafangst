import { createSelector } from "@reduxjs/toolkit";
import { Vessel } from "generated/openapi";
import { selectHauls } from "store/haul";
import { selectLandings } from "store/landing";
import { selectAppState } from "store/selectors";

export const selectVesselsLoading = createSelector(
  selectAppState,
  (state) => state.vessels === undefined,
);

export const selectVessels = createSelector(
  selectAppState,
  (state) => state.vessels,
);

export const selectVesselsSorted = createSelector(selectVessels, (state) =>
  state
    ? [...state].sort((a, b) =>
        (a.fiskeridir?.name ?? "Ukjent").localeCompare(
          b.fiskeridir?.name ?? "Ukjent",
          "no",
        ),
      )
    : [],
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
    for (const haul of Object.values(hauls)) {
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

export const selectVesselsByLandingId = createSelector(
  selectVesselsByFiskeridirId,
  selectVesselsByCallsign,
  selectLandings,
  (vesselsByFiskeridirId, vesselsByCallSign, landings) => {
    const vesselsMap: Record<string, Vessel> = {};
    for (const landing of Object.values(landings)) {
      if (landing.fiskeridirVesselId) {
        vesselsMap[landing.landingId] =
          vesselsByFiskeridirId[landing.fiskeridirVesselId];
      } else if (landing.vesselCallSign) {
        vesselsMap[landing.landingId] =
          vesselsByCallSign[landing.vesselCallSign];
      }
    }

    return vesselsMap;
  },
);
