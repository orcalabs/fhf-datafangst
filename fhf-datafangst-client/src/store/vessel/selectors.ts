import { createSelector } from "@reduxjs/toolkit";
import { Vessel } from "generated/openapi";
import { selectHaulsMap } from "store/haul";
import { selectLandings } from "store/landing";
import { selectAppState } from "store/selectAppState";
import { selectBwUserCallSign } from "store/selectors";

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
  (state) => state.vesselsByCallSign ?? {},
);

export const selectVesselsByFiskeridirId = createSelector(
  selectAppState,
  (state) => state.vesselsByFiskeridirId ?? {},
);

export const selectVesselByFiskeridirId = createSelector(
  [selectVesselsByFiskeridirId, (_, id: number | undefined) => id],
  (vessels, id) => (id !== undefined ? vessels[id] : undefined),
);

export const selectVesselsByHaulId = createSelector(
  selectVesselsByFiskeridirId,
  selectVesselsByCallsign,
  selectHaulsMap,
  (vesselsByFiskeridirId, vesselsByCallSign, hauls) => {
    const vesselsMap: Record<string, Vessel> = {};
    for (const haul of Object.values(hauls)) {
      if (haul.fiskeridirVesselId) {
        vesselsMap[haul.id] = vesselsByFiskeridirId[haul.fiskeridirVesselId];
      } else {
        vesselsMap[haul.id] = vesselsByCallSign[haul.callSign];
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
        vesselsMap[landing.id] =
          vesselsByFiskeridirId[landing.fiskeridirVesselId];
      } else if (landing.vesselCallSign) {
        vesselsMap[landing.id] = vesselsByCallSign[landing.vesselCallSign];
      }
    }

    return vesselsMap;
  },
);

export const selectVesselBenchmarks = createSelector(
  selectAppState,
  (state) => state.vesselBenchmarks,
);

export const selectEstimatedFuelConsumption = createSelector(
  selectAppState,
  (state) => state.estimatedFuelConsumption,
);

export const selectSelectedLiveVessel = createSelector(
  selectAppState,
  (state) => state.selectedLiveVessel,
);

export const selectEstimatedLiveFuelConsumption = createSelector(
  selectAppState,
  (state) => state.estimatedLiveFuelConsumption,
);

export const selectLoggedInVessel = createSelector(
  selectVesselsByCallsign,
  selectBwUserCallSign,
  (vessels, callSign) => (callSign && vessels ? vessels[callSign] : undefined),
);
