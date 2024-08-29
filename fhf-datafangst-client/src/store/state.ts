import { FiskInfoProfile } from "models";
import { User } from "oidc-react";
import { AisState, initialAisState } from "./ais";
import { BenchmarkState, initialBenchmarkState } from "./benchmark";
import { DashboardState, initialDashboardState } from "./dashboard";
import { DeliveryPointState, initialDeliveryPointState } from "./deliveryPoint";
import {
  FishingFacilityState,
  initialFishingFacilitiesState,
} from "./fishingFacility";
import { FishmapState, initialFishmapState } from "./fishmap";
import { FuelState, initialFuelState } from "./fuel";
import { GearState, initialGearState } from "./gear";
import { HaulState, initialHaulState } from "./haul";
import { initialLandingState, LandingState } from "./landing";
import { initialSpeciesState, SpeciesState } from "./species";
import { initialTrackState, TrackState } from "./track";
import { initialTripState, TripState } from "./trip";
import { initialUserState, UserState } from "./user";
import { initialVesselState, VesselState } from "./vessel";
import { initialVmsState, VmsState } from "./vms";
import { initialWeatherState, WeatherState } from "./weather";

export enum MenuViewState {
  Overview = "overview",
  MyPage = "mypage",
  Trips = "trips",
  Benchmark = "benchmark",
}

export enum MatrixToggle {
  Haul,
  Landing,
}

export interface BaseState {
  error: boolean;
  isLoggedIn: boolean;
  viewState: MenuViewState;
  bwProfile?: FiskInfoProfile;
  authUser?: User;
  matrixToggle: MatrixToggle;
  tripFiltersOpen: boolean;
  tripDetailsOpen: boolean;
}

const initialBaseState: BaseState = {
  error: false,
  isLoggedIn: false,
  bwProfile: undefined,
  viewState: MenuViewState.Overview,
  authUser: undefined,
  matrixToggle: MatrixToggle.Haul,
  tripFiltersOpen: false,
  tripDetailsOpen: false,
};

export interface AppState
  extends BaseState,
    FishmapState,
    VesselState,
    HaulState,
    GearState,
    AisState,
    TripState,
    VmsState,
    TrackState,
    FishingFacilityState,
    UserState,
    LandingState,
    WeatherState,
    SpeciesState,
    DashboardState,
    FuelState,
    DeliveryPointState,
    BenchmarkState {}

export const initialAppState: AppState = {
  ...initialBaseState,
  ...initialFishmapState,
  ...initialVesselState,
  ...initialHaulState,
  ...initialGearState,
  ...initialAisState,
  ...initialTripState,
  ...initialVmsState,
  ...initialTrackState,
  ...initialFishingFacilitiesState,
  ...initialSpeciesState,
  ...initialUserState,
  ...initialLandingState,
  ...initialWeatherState,
  ...initialBenchmarkState,
  ...initialDashboardState,
  ...initialFuelState,
  ...initialDeliveryPointState,
};
