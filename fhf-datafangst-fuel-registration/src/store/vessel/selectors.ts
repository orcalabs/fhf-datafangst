import { createSelector } from "@reduxjs/toolkit";
import type { Vessel } from "~/generated/openapi";
import { selectAppState } from "~/store/selectAppState";
import { selectBwUserCallSign, selectSelectedCallSign } from "../selectors";

export const selectVessels = createSelector(
  selectAppState,
  (state) => state.vessels,
);

export const selectVesselsLoading = createSelector(
  selectAppState,
  (state) => state.vessels === undefined,
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
  selectVessels,
  (state) => {
    if (!state) {
      return undefined;
    }

    const vessels: Record<string, Vessel> = {};

    for (const vessel of state) {
      if (vessel.fiskeridir?.callSign && vessel.isActive) {
        vessels[vessel.fiskeridir.callSign] = vessel;
      }
    }

    return vessels;
  },
);

export const selectLoggedInVessel = createSelector(
  selectVesselsByCallsign,
  selectSelectedCallSign,
  (vessels, callSign) => (callSign && vessels ? vessels[callSign] : undefined),
);

export const selectFishery = createSelector(
  selectBwUserCallSign,
  selectVesselsByCallsign,
  (callSign, vessels) =>
    callSign && vessels
      ? (vessels[callSign]?.fisheryId ?? undefined)
      : undefined,
);

export const selectFisheryVessels = createSelector(
  selectFishery,
  selectVesselsSorted,
  (fishery, vessels) =>
    fishery !== undefined && vessels
      ? vessels.filter((v) => v.fisheryId === fishery)
      : [],
);
