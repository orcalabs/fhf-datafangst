import type { FuelMeasurement } from "~/generated/openapi";

export interface FuelState {
  fuelMeasurements?: FuelMeasurement[];
  fuelMeasurementsLoading: boolean;
  fuelMeasurementsScrollable: boolean;
  fuelPostStatus?: "success" | "error";
}

export const initialFuelState: FuelState = {
  fuelMeasurements: undefined,
  fuelMeasurementsLoading: false,
  fuelMeasurementsScrollable: true,
  fuelPostStatus: undefined,
};
