import type { User } from "oidc-react";
import type { AppPage, BwUser } from "~/models";
import type { AisState } from "./ais/state";
import { initialAisState } from "./ais/state";
import type { BenchmarkState } from "./benchmark/state";
import { initialBenchmarkState } from "./benchmark/state";
import type { DashboardState } from "./dashboard/state";
import { initialDashboardState } from "./dashboard/state";
import type { DeliveryPointState } from "./deliveryPoint/state";
import { initialDeliveryPointState } from "./deliveryPoint/state";
import type { FishingFacilityState } from "./fishingFacility/state";
import { initialFishingFacilitiesState } from "./fishingFacility/state";
import type { FuelState } from "./fuel/state";
import { initialFuelState } from "./fuel/state";
import type { GearState } from "./gear/state";
import { initialGearState } from "./gear/state";
import type { GridState } from "./grid/state";
import { initialGridState } from "./grid/state";
import type { HaulState } from "./haul/state";
import { initialHaulState } from "./haul/state";
import type { LandingState } from "./landing/state";
import { initialLandingState } from "./landing/state";
import type { OrgState } from "./org/state";
import { initialOrgState } from "./org/state";
import type { SpeciesState } from "./species/state";
import { initialSpeciesState } from "./species/state";
import type { TrackState } from "./track/state";
import { initialTrackState } from "./track/state";
import type { TripState } from "./trip/state";
import { initialTripState } from "./trip/state";
import type { TripBenchmarkState } from "./tripBenchmark";
import { initialTripBenchmarkState } from "./tripBenchmark";
import type { UserState } from "./user/state";
import { initialUserState } from "./user/state";
import type { VesselState } from "./vessel/state";
import { initialVesselState } from "./vessel/state";
import type { VmsState } from "./vms/state";
import { initialVmsState } from "./vms/state";
import type { WeatherState } from "./weather/state";
import { initialWeatherState } from "./weather/state";

export interface BaseState {
  error: boolean;
  isLoggedIn: boolean;
  appPage?: AppPage;
  bwUser?: BwUser;
  bwUserLoading: boolean;
  selectedCallSign?: string;
  authUser?: User;
  tripFiltersOpen: boolean;
  tripDetailsOpen: boolean;
  consentDialogOpen: boolean;
}

const initialBaseState: BaseState = {
  error: false,
  isLoggedIn: false,
  appPage: undefined,
  authUser: undefined,
  tripFiltersOpen: false,
  tripDetailsOpen: false,
  bwUserLoading: false,
  consentDialogOpen: false,
};

export interface AppState
  extends
    BaseState,
    GridState,
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
    BenchmarkState,
    OrgState {}

export const emptyState = {
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
  selectedLiveVessel: undefined,
  tripFiltersOpen: false,
  tripDetailsOpen: false,
  consentDialogOpen: false,
  track: undefined,
  trips: undefined,
  tripsSearch: undefined,
  vms: undefined,
} satisfies Partial<AppState>;

export const initialAppState: AppState = {
  ...initialBaseState,
  ...initialGridState,
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
  ...initialOrgState,
};
