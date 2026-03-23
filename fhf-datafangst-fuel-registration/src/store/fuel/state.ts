import { FuelMeasurement } from "generated/openapi";

export interface FuelState {
  fuelMeasurements?: FuelMeasurement[];
  fuelMeasurementsLoading: boolean;
  fuelPostStatus?: "success" | "error";
}

export const initialFuelState: FuelState = {
  fuelMeasurements: undefined,
  fuelMeasurementsLoading: false,
  fuelPostStatus: undefined,
};
