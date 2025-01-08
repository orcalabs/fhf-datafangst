import { BwUser } from "models";
import { User } from "oidc-react";
import { AisState, initialAisState } from "./ais/state";
import { BenchmarkState, initialBenchmarkState } from "./benchmark/state";
import { DashboardState, initialDashboardState } from "./dashboard/state";
import {
  DeliveryPointState,
  initialDeliveryPointState,
} from "./deliveryPoint/state";
import {
  FishingFacilityState,
  initialFishingFacilitiesState,
} from "./fishingFacility/state";
import { FishmapState, initialFishmapState } from "./fishmap/state";
import { FuelState, initialFuelState } from "./fuel/state";
import { GearState, initialGearState } from "./gear/state";
import { HaulState, initialHaulState } from "./haul/state";
import { initialLandingState, LandingState } from "./landing/state";
import { initialSpeciesState, SpeciesState } from "./species/state";
import { initialTrackState, TrackState } from "./track/state";
import { initialTripState, TripState } from "./trip/state";
import { initialTripBenchmarkState, TripBenchmarkState } from "./tripBenchmark";
import { initialUserState, UserState } from "./user/state";
import { initialVesselState, VesselState } from "./vessel/state";
import { initialVmsState, VmsState } from "./vms/state";
import { initialWeatherState, WeatherState } from "./weather/state";

export enum MenuViewState {
  Overview = "overview",
  Live = "live",
  MyPage = "mypage",
  Trips = "trips",
  Benchmark = "benchmark", // Unused for now
}

export enum MatrixToggle {
  Haul,
  Landing,
}

export interface BaseState {
  error: boolean;
  isLoggedIn: boolean;
  viewState: MenuViewState;
  bwUser?: BwUser;
  authUser?: User;
  matrixToggle: MatrixToggle;
  tripFiltersOpen: boolean;
  tripDetailsOpen: boolean;
}

const initialBaseState: BaseState = {
  error: false,
  isLoggedIn: false,
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
    TripBenchmarkState,
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

export const emptyState: Partial<AppState> = {
  ais: undefined,
  currentTrip: undefined,
  fishingFacilities: undefined,
  hauls: undefined,
  haulsMatrix2: undefined,
  haulsSearch: undefined,
  landings: undefined,
  landingsMatrix2: undefined,
  landingsSearch: undefined,
  selectedHaul: undefined,
  selectedLanding: undefined,
  selectedFishingFacility: undefined,
  selectedGrids: [],
  selectedGridsString: [],
  selectedTrip: undefined,
  selectedTripHaul: undefined,
  tripFiltersOpen: false,
  track: undefined,
  trips: undefined,
  tripsSearch: undefined,
  vms: undefined,
};

export const initialAppState: AppState = {
  ...initialBaseState,
  ...initialFishmapState,
  ...initialVesselState,
  ...initialHaulState,
  ...initialGearState,
  ...initialAisState,
  ...initialTripState,
  ...initialTripBenchmarkState,
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
