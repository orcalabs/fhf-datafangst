import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { createReducer } from "@reduxjs/toolkit";
import {
  checkLoggedIn,
  getBwUser,
  resetState,
  resetTrackState,
  setAppPage,
  setError,
  setTripDetailsOpen,
  setTripFiltersOpen,
} from "./actions";
import { aisBuilder } from "./ais";
import { benchmarkBuilder } from "./benchmark";
import { dashboardBuilder } from "./dashboard";
import { deliveryPointBuilder } from "./deliveryPoint";
import { fishingFacilityBuilder } from "./fishingFacility";
import { fuelBuilder } from "./fuel";
import { gearBuilder } from "./gear";
import { gridBuilder } from "./grid/";
import { haulBuilder } from "./haul";
import { landingBuilder } from "./landing";
import { orgBuilder } from "./org";
import { speciesBuilder } from "./species";
import type { AppState } from "./state";
import { emptyState, initialAppState } from "./state";
import { trackBuilder } from "./track";
import { tripBuilder } from "./trip";
import { tripBenchmarkBuilder } from "./tripBenchmark";
import { getUser, userBuilder } from "./user";
import { vesselBuilder } from "./vessel";
import { vmsBuilder } from "./vms";
import { weatherBuilder } from "./weather";

export const PROJECT_USERS: Record<string, string> = {
  "post@orcalabs.no": "LFNX",
  "stale.walderhaug@fhf.no": "LDDF",
  "rita.naustvik@fhf.no": "LDDF",
  "eskild.johansen@fhf.no": "LDDF",
  "kim@orcalabs.no": "LDDF",
  "eivind@rinde.no": "LDDF",
  "bard.hanssen@sintef.no": "LDDF",
  "fiskinfo.nord@gmail.com": "LDDF",
  "dorthea.vatn@sintef.no": "LDDF",
  "oystein.hermansen@gmail.com": "LDDF",
  "per.finne@fiskeridir.no": "LFNX",
  "erlend.stav@sintef.no": "LFLJ",
  "per.gunnar.auran@sintef.no": "LFAJ",
};

const emptyTrackState = {
  track: undefined,
};

class AppActionReducerMapBuilder<State> {
  builder: ActionReducerMapBuilder<State>;

  constructor(builder: ActionReducerMapBuilder<State>) {
    this.builder = builder;
  }

  extendBuilder(
    extender: (
      _: ActionReducerMapBuilder<State>,
    ) => ActionReducerMapBuilder<State>,
  ) {
    extender(this.builder);
    return this;
  }

  finish = () => this.builder;
}

const baseBuilder = (builder: ActionReducerMapBuilder<AppState>) =>
  builder
    .addCase(setError, (state, action) => {
      state.error = action.payload;
    })
    .addCase(setAppPage, (state, action) => ({
      ...state,
      ...emptyState,
      appPage: action.payload,
    }))
    .addCase(getBwUser.pending, (state, _) => {
      state.bwUserLoading = true;
      state.bwUser = undefined;
    })
    .addCase(getBwUser.fulfilled, (state, action) => {
      state.bwUserLoading = false;
      state.bwUser = action.payload;

      state.selectedCallSign =
        state.bwUser.user.email && state.bwUser.user.email in PROJECT_USERS
          ? (localStorage.getItem("callSignOverride") ??
            PROJECT_USERS[state.bwUser.user.email])
          : (state.bwUser.fiskInfoProfile?.ircs ?? undefined);
    })
    .addCase(getBwUser.rejected, (state, _) => {
      state.bwUserLoading = false;
    })
    .addCase(checkLoggedIn, (state, action) => {
      const user = action.payload;
      const token = user.access_token;

      state.isLoggedIn = token !== undefined;
      state.authUser = user;

      if (token) {
        (action as any).asyncDispatch(getBwUser(token));
        (action as any).asyncDispatch(getUser(token));
      }
    })
    .addCase(resetTrackState, (state, _) => ({ ...state, ...emptyTrackState }))
    .addCase(setTripFiltersOpen, (state, action) => {
      state.tripFiltersOpen = action.payload;
    })
    .addCase(setTripDetailsOpen, (state, action) => {
      state.tripDetailsOpen = action.payload;
    })
    .addCase(resetState, (state, _) => ({ ...state, ...emptyState }));

export const appReducer = createReducer(initialAppState, (builder) =>
  new AppActionReducerMapBuilder(builder)
    .extendBuilder(baseBuilder)
    .extendBuilder(gridBuilder)
    .extendBuilder(vesselBuilder)
    .extendBuilder(haulBuilder)
    .extendBuilder(speciesBuilder)
    .extendBuilder(gearBuilder)
    .extendBuilder(aisBuilder)
    .extendBuilder(tripBuilder)
    .extendBuilder(tripBenchmarkBuilder)
    .extendBuilder(vmsBuilder)
    .extendBuilder(trackBuilder)
    .extendBuilder(fishingFacilityBuilder)
    .extendBuilder(userBuilder)
    .extendBuilder(landingBuilder)
    .extendBuilder(weatherBuilder)
    .extendBuilder(benchmarkBuilder)
    .extendBuilder(dashboardBuilder)
    .extendBuilder(fuelBuilder)
    .extendBuilder(deliveryPointBuilder)
    .extendBuilder(orgBuilder)
    .finish(),
);
