import type {
  FuelMeasurement,
  FuelMeasurementOrBunkering,
} from "~/generated/openapi";

export interface FuelState {
  fuelMeasurements?: FuelMeasurement[];
  fuelMeasurementsLoading: boolean;
  fuelMeasurementsAndBunkerings?: FuelMeasurementOrBunkering[];
  fuelMeasurementsAndBunkeringsLoading: boolean;
}

export const initialFuelState: FuelState = {
  fuelMeasurements: undefined,
  fuelMeasurementsLoading: false,
  fuelMeasurementsAndBunkerings: undefined,
  fuelMeasurementsAndBunkeringsLoading: false,
};
