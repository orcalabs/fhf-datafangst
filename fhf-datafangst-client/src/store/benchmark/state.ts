import { Trip } from "generated/openapi";

export interface BenchmarkModalParams {
  title?: string;
  description?: string;
  yAxis: number[];
  xAxis: string[];
  metric?: string;
}

export enum BenchmarkDataSource {
  Landings,
  Hauls,
}

export interface BenchmarkState {
  benchmarkModal?: BenchmarkModalParams;
  benchmarkTrips: Record<number, Trip[]>
  benchmarkHistoric?: Record<string,number[]>;
  benchmarkNumHistoric: number;
  benchmarkDataSource: BenchmarkDataSource;
}

export const initialBenchmarkState: BenchmarkState = {
  benchmarkModal: undefined,
  benchmarkHistoric: undefined,
  benchmarkTrips: {},
  benchmarkNumHistoric: 10,
  benchmarkDataSource: BenchmarkDataSource.Landings,
};
