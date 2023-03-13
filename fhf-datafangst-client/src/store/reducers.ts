import { ActionReducerMapBuilder, createReducer } from "@reduxjs/toolkit";
import { AppState, initialAppState } from "./state";
import { resetState, setError, setViewMode } from "./actions";
import { fishmapBuilder } from "./fishmap";
import { vesselBuilder } from "./vessel";
import { specieBuilder } from "./specie";
import { haulBuilder } from "./haul";
import { gearBuilder } from "./gear";

export const emptyState = {
  hauls: undefined,
  selectedGrids: [],
  selectedGridsString: [],
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
    .addCase(resetState, (state, _) => ({ ...state, ...emptyState }));

export const appReducer = createReducer(initialAppState, (builder) =>
  new AppActionReducerMapBuilder(builder)
    .extendBuilder(baseBuilder)
    .extendBuilder(fishmapBuilder)
    .extendBuilder(vesselBuilder)
    .extendBuilder(haulBuilder)
    .extendBuilder(specieBuilder)
    .extendBuilder(gearBuilder)
    .finish(),
);
