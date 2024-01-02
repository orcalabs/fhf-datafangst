import { LandingsArgs, LandingsFilter } from "api/landingsApi";
import { getMonth, getYear } from "date-fns";
import { Landing, LandingMatrix } from "generated/openapi";

export interface LandingState {
  landings?: Record<string, Landing>;
  landingsMatrix?: LandingMatrix;
  landingsMatrix2?: LandingMatrix;
  landingsLoading: boolean;
  landingsMatrixLoading: boolean;
  landingsMatrix2Loading: boolean;
  landingsSearch?: LandingsArgs;
  landingsMatrixSearch?: LandingsArgs;
  landingsMatrix2Search?: LandingsArgs;
  hoveredLandingFilter?: LandingsFilter;
  selectedLanding?: Landing;
  selectedTripLanding?: Landing;
  showTimeSlider: boolean;
  landingDateSliderFrame?: Date;
}

export const initialLandingState: LandingState = {
  landings: undefined,
  landingsMatrix: undefined,
  landingsMatrix2: undefined,
  landingsLoading: false,
  landingsMatrixLoading: false,
  landingsMatrix2Loading: false,
  landingsSearch: undefined,
  landingsMatrixSearch: undefined,
  landingsMatrix2Search: undefined,
  hoveredLandingFilter: undefined,
  selectedLanding: undefined,
  selectedTripLanding: undefined,
  showTimeSlider: false,
};

const month = getMonth(new Date());

export const initialLandingsMatrixSearch: LandingsArgs = {
  months: [month === 0 ? 12 : month],
  years: [getYear(new Date()) - (month === 0 ? 1 : 0)],
};
