import { ActionReducerMapBuilder, createReducer } from "@reduxjs/toolkit";
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
import { fishmapBuilder } from "./fishmap/";
import { fuelBuilder } from "./fuel";
import { gearBuilder } from "./gear";
import { haulBuilder } from "./haul";
import { landingBuilder } from "./landing";
import { orgBuilder } from "./org";
import { speciesBuilder } from "./species";
import { AppState, emptyState, initialAppState } from "./state";
import { trackBuilder } from "./track";
import { tripBuilder } from "./trip";
import { tripBenchmarkBuilder } from "./tripBenchmark";
import { getUser, userBuilder } from "./user";
import { vesselBuilder } from "./vessel";
import { vmsBuilder } from "./vms";
import { weatherBuilder } from "./weather";

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

      // Hijack Skomværfisk as a vessel for testing purposes.
      if (state.bwUser.user.email === "post@orcalabs.no") {
        state.bwUser.fiskInfoProfile = {
          ircs: "LDDF",
          mmsi: 257842500,
          imo: -1,
          regNum: "",
          sbrRegNum: "",
          vesselId: "",
          vesselEmail: "",
          vesselPhone: "",
          vesselName: "",
        };
        // Assign Gadus Njord to Per Gunnar, Eivind, Bård, Tore and Dorthea
      } else if (
        state.bwUser.user.email === "stale.walderhaug@fhf.no" ||
        state.bwUser.user.email === "rita.naustvik@fhf.no" ||
        state.bwUser.user.email === "eskild.johansen@fhf.no" ||
        state.bwUser.user.email === "kim@orcalabs.no" ||
        state.bwUser.user.email === "per.gunnar.auran@sintef.no" ||
        state.bwUser.user.email === "eivind@rinde.no" ||
        state.bwUser.user.email === "bard.hanssen@sintef.no" ||
        state.bwUser.user.email === "fiskinfo.nord@gmail.com" ||
        state.bwUser.user.email === "dorthea.vatn@sintef.no"
      ) {
        state.bwUser.fiskInfoProfile = {
          ircs: "LDDF",
          mmsi: 257656000,
          imo: -1,
          regNum: "",
          sbrRegNum: "",
          vesselId: "",
          vesselEmail: "",
          vesselPhone: "",
          vesselName: "",
        };
        // Assign Hermes to Per
      } else if (state.bwUser.user.email === "per.finne@fiskeridir.no") {
        state.bwUser.fiskInfoProfile = {
          ircs: "LFNX",
          mmsi: 257640000,
          imo: -1,
          regNum: "",
          sbrRegNum: "",
          vesselId: "",
          vesselEmail: "",
          vesselPhone: "",
          vesselName: "",
        };
        // Assign Loran to Erlend
      } else if (state.bwUser.user.email === "erlend.stav@sintef.no") {
        state.bwUser.fiskInfoProfile = {
          ircs: "LJWR",
          mmsi: 259616000,
          imo: -1,
          regNum: "",
          sbrRegNum: "",
          vesselId: "",
          vesselEmail: "",
          vesselPhone: "",
          vesselName: "",
        };
      }
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
    .extendBuilder(fishmapBuilder)
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
