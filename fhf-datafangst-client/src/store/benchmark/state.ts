export interface BenchmarkModalParams {
  title?: string;
  description?: string;
}

export enum BenchmarkDataSource {
  Landings,
  Hauls,
}

export interface BenchmarkState {
  benchmarkModal?: BenchmarkModalParams;
  benchmarkHistoric?: number[];
  benchmarkXAxis?: string[];
  benchmarkMetric?: string;
  benchmarkNumHistoric: number;
  benchmarkDataSource: BenchmarkDataSource;
}

export const initialBenchmarkState: BenchmarkState = {
  benchmarkModal: undefined,
  benchmarkHistoric: undefined,
  benchmarkMetric: undefined,
  benchmarkXAxis: undefined,
  benchmarkNumHistoric: 10,
  benchmarkDataSource: BenchmarkDataSource.Landings,
};
