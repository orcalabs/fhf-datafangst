import { BwUser } from "models";
import { User } from "oidc-react";
import { FuelState, initialFuelState } from "./fuel/state";
import { initialUserState, UserState } from "./user/state";

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

export interface AppState extends BaseState, UserState, FuelState {}

export const initialAppState: AppState = {
  ...initialBaseState,
  ...initialUserState,
  ...initialFuelState,
};
