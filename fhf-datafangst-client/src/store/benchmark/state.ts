import { Trip } from "generated/openapi";

export interface HistoricParams {
  vesselNames: string[];
  dataset: (string | number)[][];
  metric?: string;
}
export interface BenchmarkModalParams {
  title?: string;
  description?: string;
  dataset: HistoricParams;
}

export enum BenchmarkDataSource {
  Landings,
  Hauls,
}

export interface BenchmarkTimeSpanParams {
  startYear: number;
  endYear: number;
}

export interface BenchmarkState {
  benchmarkModal?: BenchmarkModalParams;
  benchmarkTrips: Record<number, Trip[]>;
  benchmarkHistoric?: Record<string, number[]>;
  benchmarkNumHistoric: number;
  benchmarkTimeSpan: BenchmarkTimeSpanParams;
  benchmarkDataSource: BenchmarkDataSource;
}

export const initialBenchmarkState: BenchmarkState = {
  benchmarkModal: undefined,
  benchmarkHistoric: undefined,
  benchmarkTrips: {},
  benchmarkTimeSpan: {
    startYear: new Date().getFullYear(),
    endYear: new Date().getFullYear() - 1,
  },
  benchmarkNumHistoric: 10,
  benchmarkDataSource: BenchmarkDataSource.Landings,
};
