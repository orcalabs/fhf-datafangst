import { TripBenchmarks } from "generated/openapi";

export interface TripBenchmarkState {
  tripBenchmarks?: TripBenchmarks;
  tripBenchmarksLoading: boolean;
}

export const initialTripBenchmarkState: TripBenchmarkState = {
  tripBenchmarks: undefined,
  tripBenchmarksLoading: false,
};
