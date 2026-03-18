import { ActionReducerMapBuilder, createReducer } from "@reduxjs/toolkit";
import { checkLoggedIn, getBwUser, setError } from "./actions";
import { fuelBuilder } from "./fuel";
import { AppState, initialAppState } from "./state";
import { getUser, userBuilder } from "./user";

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
      if (state.bwUser.user.email === "post@orcalabs.no") {
        state.bwUser.fiskInfoProfile = {
          ircs: "LFRA",
          mmsi: 257842500,
          imo: -1,
          regNum: null,
          sbrRegNum: null,
          vesselId: "324982394823",
          vesselEmail: null,
          vesselPhone: null,
          vesselName: "Senja",
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
    .finish(),
);
