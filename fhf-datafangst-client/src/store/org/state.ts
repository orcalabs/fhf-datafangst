import { FuelEntry, OrgBenchmarks } from "generated/openapi";

export interface OrgState {
  orgBenchmarks?: OrgBenchmarks;
  orgBenchmarksLoading: boolean;
  orgFuelConsumption?: FuelEntry[];
}

export const initialOrgState: OrgState = {
  orgBenchmarks: undefined,
  orgBenchmarksLoading: false,
  orgFuelConsumption: undefined,
};
