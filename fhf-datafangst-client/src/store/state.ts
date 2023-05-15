import { HaulState, initialHaulState } from "./haul";
import { FishmapState, initialFishmapState } from "./fishmap";
import { initialSpeciesState, SpeciesState } from "./species";
import { VesselState, initialVesselState } from "./vessel";
import { GearState, initialGearState } from "./gear";
import { AisState, initialAisState } from "./ais";
import { initialTripState, TripState } from "./trip";
import { initialVmsState, VmsState } from "./vms";
import { TrackState, initialTrackState } from "./track";
import { FiskInfoProfile } from "models";
import {
  FishingFacilityState,
  initialFishingFacilitiesState,
} from "./fishingFacility";

export enum MenuViewState {
  Overview = "overview",
  MyPage = "mypage",
}

export interface BaseState {
  error: boolean;
  isLoggedIn: boolean;
  bwProfile?: FiskInfoProfile;
  viewState: MenuViewState;
}

const initialBaseState: BaseState = {
  error: false,
  isLoggedIn: false,
  bwProfile: undefined,
  viewState: MenuViewState.Overview,
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
    SpeciesState {}

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
};
