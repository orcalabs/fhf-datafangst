import type { User } from "oidc-react";
import type { BwUser } from "~/models";
import type { FuelState } from "./fuel/state";
import { initialFuelState } from "./fuel/state";
import type { UserState } from "./user/state";
import { initialUserState } from "./user/state";
import { initialUserHaulState, type UserHaulState } from "./userHaul";
import { initialVesselState, type VesselState } from "./vessel";

export interface BaseState {
  error: boolean;
  isLoggedIn: boolean;
  bwUser?: BwUser;
  bwUserLoading: boolean;
  selectedCallSign?: string;
  authUser?: User;
}

const initialBaseState: BaseState = {
  error: false,
  isLoggedIn: false,
  authUser: undefined,
  bwUserLoading: false,
};

export interface AppState
  extends BaseState, UserState, VesselState, FuelState, UserHaulState {}

export const initialAppState: AppState = {
  ...initialBaseState,
  ...initialUserState,
  ...initialVesselState,
  ...initialFuelState,
  ...initialUserHaulState,
};
