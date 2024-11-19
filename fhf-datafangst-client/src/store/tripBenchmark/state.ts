import { AverageTripBenchmarks, TripBenchmarks } from "generated/openapi";

export interface TripBenchmarkState {
  tripBenchmarks?: TripBenchmarks;
  averageTripBenchmarks?: AverageTripBenchmarks;
  tripBenchmarksLoading: boolean;
  eeoi?: number;
  averageEeoi?: number;
  eeoiLoading: boolean;
  averageEeoiLoading: boolean;
}

export const initialTripBenchmarkState: TripBenchmarkState = {
  tripBenchmarks: undefined,
  tripBenchmarksLoading: false,
  averageTripBenchmarks: undefined,
  eeoi: undefined,
  averageEeoi: undefined,
  eeoiLoading: false,
  averageEeoiLoading: false,
};
