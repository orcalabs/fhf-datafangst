import { ActionReducerMapBuilder, createReducer } from "@reduxjs/toolkit";
import { AppState, initialAppState } from "./state";
import {
  checkLoggedIn,
  resetState,
  resetTrackState,
  setError,
  setViewMode,
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

export const emptyState = {
  hauls: undefined,
  haulsByArea: undefined,
  selectedHaul: undefined,
  selectedHaulTrip: undefined,
  selectedGrids: [],
  selectedGridsString: [],
  ais: undefined,
  vms: undefined,
  track: undefined,
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
    .addCase(setViewMode, (state, action) => {
      state.viewMode = action.payload;
    })
    .addCase(checkLoggedIn.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload;
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
    .finish(),
);
