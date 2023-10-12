export interface BenchmarkState {
    benchmarkModal : boolean,
    benchmarkDataSource: boolean,
    benchmarkNumHistoric : number,
}

export const initialBenchmarkState: BenchmarkState = {
    benchmarkModal : false,
    benchmarkDataSource: false,
    benchmarkNumHistoric : 10,
};
