import { FuelMeasurement } from "generated/openapi";

export interface FuelState {
  fuelMeasurements?: FuelMeasurement[];
  fuelMeasurementsLoading: boolean;
}

export const initialFuelState: FuelState = {
  fuelMeasurements: undefined,
  fuelMeasurementsLoading: false,
};
