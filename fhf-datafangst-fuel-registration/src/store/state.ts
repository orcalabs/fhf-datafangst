import type { User } from "oidc-react";
import type { BwUser } from "~/models";
import type { FuelState } from "./fuel/state";
import { initialFuelState } from "./fuel/state";
import type { UserState } from "./user/state";
import { initialUserState } from "./user/state";
import { initialUserHaulState, type UserHaulState } from "./userHaul";

export interface BaseState {
  error: boolean;
  isLoggedIn: boolean;
  bwUser?: BwUser;
  bwUserLoading: boolean;
  authUser?: User;
}

const initialBaseState: BaseState = {
  error: false,
  isLoggedIn: false,
  authUser: undefined,
  bwUserLoading: false,
};

export interface AppState
  extends BaseState, UserState, FuelState, UserHaulState {}

export const initialAppState: AppState = {
  ...initialBaseState,
  ...initialUserState,
  ...initialFuelState,
  ...initialUserHaulState,
};
