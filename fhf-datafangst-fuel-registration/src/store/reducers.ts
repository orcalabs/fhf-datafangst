import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { createReducer } from "@reduxjs/toolkit";
import { checkLoggedIn, getBwUser, setError } from "./actions";
import { fuelBuilder } from "./fuel";
import type { AppState } from "./state";
import { initialAppState } from "./state";
import { getUser, userBuilder } from "./user";
import { userHaulBuilder } from "./userHaul";
import { vesselBuilder } from "./vessel";

export const PROJECT_USERS: Record<string, string> = {
  "post@orcalabs.no": "LFNX",
  "stale.walderhaug@fhf.no": "LDDF",
  "rita.naustvik@fhf.no": "LDDF",
  "eskild.johansen@fhf.no": "LDDF",
  "eivind@rinde.no": "LDDF",
  "bard.hanssen@sintef.no": "LDDF",
  "fiskinfo.nord@gmail.com": "LDDF",
  "dorthea.vatn@sintef.no": "LDDF",
  "oystein.hermansen@gmail.com": "LDDF",
  "per.finne@fiskeridir.no": "LFNX",
  "erlend.stav@sintef.no": "LFLJ",
  "per.gunnar.auran@sintef.no": "LFAJ",
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
    });

export const appReducer = createReducer(initialAppState, (builder) =>
  new AppActionReducerMapBuilder(builder)
    .extendBuilder(baseBuilder)
    .extendBuilder(userBuilder)
    .extendBuilder(vesselBuilder)
    .extendBuilder(fuelBuilder)
    .extendBuilder(userHaulBuilder)
    .finish(),
);
