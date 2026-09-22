import type {
  AverageTripBenchmarks,
  AverageVesselsBenchmarks,
  SumVesselBenchmark,
  TripBenchmarks,
} from "~/generated/openapi";

export interface TripBenchmarkState {
  tripBenchmarks?: TripBenchmarks;
  averageTripBenchmarks?: AverageTripBenchmarks;
  tripBenchmarksLoading: boolean;
  eeoi?: number;
  averageEeoi?: number;
  eeoiLoading: boolean;
  averageEeoiLoading: boolean;
  sumPerVesselBenchmarks?: SumVesselBenchmark[];
  sumPerVesselBenchmarksLoading: boolean;
  avgVesselBenchmarks?: AverageVesselsBenchmarks;
  avgVesselBenchmarksLoading: boolean;
}

export const initialTripBenchmarkState: TripBenchmarkState = {
  tripBenchmarks: undefined,
  tripBenchmarksLoading: false,
  averageTripBenchmarks: undefined,
  eeoi: undefined,
  averageEeoi: undefined,
  eeoiLoading: false,
  averageEeoiLoading: false,
  sumPerVesselBenchmarks: undefined,
  sumPerVesselBenchmarksLoading: false,
  avgVesselBenchmarks: undefined,
  avgVesselBenchmarksLoading: false,
};
