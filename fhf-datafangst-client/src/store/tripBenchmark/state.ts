import { AverageTripBenchmarks, TripBenchmarks } from "generated/openapi";

export interface TripBenchmarkState {
  tripBenchmarks?: TripBenchmarks;
  averageTripBenchmarks?: AverageTripBenchmarks;
  tripBenchmarksLoading: boolean;
}

export const initialTripBenchmarkState: TripBenchmarkState = {
  tripBenchmarks: undefined,
  tripBenchmarksLoading: false,
  averageTripBenchmarks: undefined,
};
