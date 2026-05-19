import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { createReducer } from "@reduxjs/toolkit";
import { checkLoggedIn, getBwUser, setError } from "./actions";
import { fuelBuilder } from "./fuel";
import type { AppState } from "./state";
import { initialAppState } from "./state";
import { getUser, userBuilder } from "./user";
import { userHaulBuilder } from "./userHaul";

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
          ircs: "JXMK",
          mmsi: 257842500,
          imo: -1,
          regNum: "",
          sbrRegNum: "",
          vesselId: "",
          vesselEmail: "",
          vesselPhone: "",
          vesselName: "Skomværfisk",
        };
        // Assign Gadus Njord to most test users
      } else if (
        state.bwUser.user.email === "stale.walderhaug@fhf.no" ||
        state.bwUser.user.email === "rita.naustvik@fhf.no" ||
        state.bwUser.user.email === "eskild.johansen@fhf.no" ||
        state.bwUser.user.email === "kim@orcalabs.no" ||
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
          vesselName: "Gadus Njord",
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
          vesselName: "Hermes",
        };
        // Assign Frøyanes Junior to Erlend
      } else if (state.bwUser.user.email === "erlend.stav@sintef.no") {
        state.bwUser.fiskInfoProfile = {
          ircs: "LFLJ",
          mmsi: 259616000,
          imo: -1,
          regNum: "",
          sbrRegNum: "",
          vesselId: "",
          vesselEmail: "",
          vesselPhone: "",
          vesselName: "Frøyanes Junior",
        };
        // Assign Selvåg Senior to Per Gunnar
      } else if (state.bwUser.user.email === "per.gunnar.auran@sintef.no") {
        state.bwUser.fiskInfoProfile = {
          ircs: "LGOQ",
          mmsi: 259616000,
          imo: -1,
          regNum: "",
          sbrRegNum: "",
          vesselId: "",
          vesselEmail: "",
          vesselPhone: "",
          vesselName: "Selvåg Senior",
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
    });

export const appReducer = createReducer(initialAppState, (builder) =>
  new AppActionReducerMapBuilder(builder)
    .extendBuilder(baseBuilder)
    .extendBuilder(userBuilder)
    .extendBuilder(fuelBuilder)
    .extendBuilder(userHaulBuilder)
    .finish(),
);
