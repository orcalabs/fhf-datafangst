import { ActionReducerMapBuilder, createReducer } from "@reduxjs/toolkit";
import { AppState, initialAppState } from "./state";
import {
  checkLoggedIn,
  getUserProfile,
  resetState,
  resetTrackState,
  setError,
  setViewState,
} from "./actions";
import { fishmapBuilder } from "./fishmap";
import { vesselBuilder } from "./vessel";
import { speciesBuilder } from "./species";
import { haulBuilder } from "./haul";
import { gearBuilder } from "./gear";
import { tripBuilder } from "./trip";
import { aisBuilder } from "./ais";
import { vmsBuilder } from "./vms";
import { trackBuilder } from "./track";
import { fishingFacilityBuilder } from "./fishingFacility";

export const emptyState = {
  ais: undefined,
  haulsMatrix2: undefined,
  haulsSearch: undefined,
  selectedHaul: undefined,
  selectedGrids: [],
  selectedGridsString: [],
  selectedTrip: undefined,
  selectedTripHaul: undefined,
  track: undefined,
  trips: undefined,
  vms: undefined,
};

const emptyTrackState = {
  track: undefined,
};

export const emptyViewState = {
  haulsMatrix: undefined,
  haulsMatrix2: undefined,
  haulsMatrixSearch: undefined,
  haulsSearch: undefined,
  selectedGrids: [],
  selectedGridsString: [],
  selectedTrip: undefined,
  selectedTripHaul: undefined,
  track: undefined,
  trips: undefined,
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
    .addCase(setViewState, (state, action) => {
      const viewState = action.payload;
      // Prevent wrong matrix state if clicking the tabs quickly
      if (state.haulsMatrixLoading) {
        return;
      }

      return {
        ...state,
        ...emptyViewState,
        viewState,
      };
    })
    .addCase(getUserProfile.fulfilled, (state, action) => {
      state.bwProfile = action.payload;
    })
    .addCase(checkLoggedIn, (state, action) => {
      const user = action.payload;
      const token = user.access_token;

      state.isLoggedIn = token !== undefined;
      state.user = user;

      if (token) {
        (action as any).asyncDispatch(getUserProfile(token));
      }
    })
    .addCase(resetTrackState, (state, _) => ({ ...state, ...emptyTrackState }))
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
    .extendBuilder(vmsBuilder)
    .extendBuilder(trackBuilder)
    .extendBuilder(fishingFacilityBuilder)
    .finish(),
);
