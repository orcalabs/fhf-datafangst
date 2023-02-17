import { ActionReducerMapBuilder, createReducer } from "@reduxjs/toolkit";
import { AppState, initialAppState } from "./state";
import { setError } from "./actions";
import { fishmapBuilder } from "./fishmap";
import { vesselBuilder } from "./vessel";

export const emptyState = {
  selectedVessel: undefined,
};

class AppActionReducerMapBuilder<State> {
  builder: ActionReducerMapBuilder<State>;

  constructor(builder: ActionReducerMapBuilder<State>) {
    this.builder = builder;
  }

  extendBuilder(
    extender: (
      _: ActionReducerMapBuilder<State>
    ) => ActionReducerMapBuilder<State>
  ) {
    extender(this.builder);
    return this;
  }

  finish = () => this.builder;
}

const baseBuilder = (builder: ActionReducerMapBuilder<AppState>) =>
  builder.addCase(setError, (state, action) => {
    state.error = action.payload;
  });

export const appReducer = createReducer(initialAppState, (builder) =>
  new AppActionReducerMapBuilder(builder)
    .extendBuilder(baseBuilder)
    .extendBuilder(fishmapBuilder)
    .extendBuilder(vesselBuilder)
    .finish()
);
