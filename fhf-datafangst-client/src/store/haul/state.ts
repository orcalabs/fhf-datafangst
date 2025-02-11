import { HaulsArgs, HaulsFilter, HaulsMatrixArgs } from "api/haulsApi";
import { getMonth, getYear } from "date-fns";
import { Haul, HaulsMatrix } from "generated/openapi";

export interface HaulState {
  hauls?: Record<number, Haul>;
  haulsMatrix?: HaulsMatrix;
  haulsMatrix2?: HaulsMatrix;
  haulsLoading: boolean;
  haulsMatrixLoading: boolean;
  haulsMatrix2Loading: boolean;
  haulsSearch?: HaulsArgs;
  haulsMatrixSearch?: HaulsMatrixArgs;
  haulsMatrix2Search?: HaulsMatrixArgs;
  selectedHaul?: Haul;
  selectedTripHaul?: Haul;
  showTimeSlider: boolean;
  haulDateSliderFrame?: Date;
}

export const initialHaulState: HaulState = {
  hauls: undefined,
  haulsMatrix: undefined,
  haulsMatrix2: undefined,
  haulsLoading: false,
  haulsMatrixLoading: false,
  haulsMatrix2Loading: false,
  haulsSearch: undefined,
  haulsMatrixSearch: undefined,
  haulsMatrix2Search: undefined,
  selectedHaul: undefined,
  selectedTripHaul: undefined,
  showTimeSlider: false,
};

const month = getMonth(new Date());

export const initialHaulsMatrixSearch: HaulsMatrixArgs = {
  filter: HaulsFilter.VesselLength,
  months: [month === 0 ? 12 : month],
  years: [getYear(new Date()) - (month === 0 ? 1 : 0)],
};
