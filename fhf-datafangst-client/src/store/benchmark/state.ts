export interface BenchmarkState {
    benchmarkModal : boolean,
    benchmarkNumHistoric : number,
}

export const initialBenchmarkState: BenchmarkState = {
    benchmarkModal : false,
    benchmarkNumHistoric : 10
};
