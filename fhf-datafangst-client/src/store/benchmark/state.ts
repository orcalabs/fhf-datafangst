export interface BenchmarkModalParams {
  title?: string;
  description?: string;
}

export interface BenchmarkState {
  benchmarkModal?: BenchmarkModalParams;
  benchmarkHistoric?: number[];
  benchmarkXAxis?: string[];
  benchmarkMetric?: string;
  benchmarkNumHistoric: number;
  benchmarkDataSource: boolean;
}

export const initialBenchmarkState: BenchmarkState = {
  benchmarkModal: undefined,
  benchmarkHistoric: undefined,
  benchmarkMetric: undefined,
  benchmarkXAxis: undefined,
  benchmarkNumHistoric: 10,
  benchmarkDataSource: false,
};
