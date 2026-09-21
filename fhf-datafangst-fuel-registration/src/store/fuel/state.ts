import type {
  FuelMeasurement,
  FuelMeasurementOrBunkering,
} from "~/generated/openapi";

export interface FuelState {
  fuelMeasurements?: FuelMeasurement[];
  fuelMeasurementsLoading: boolean;
  fuelMeasurementsScrollable: boolean;
  fuelPostStatus?: "success" | "error";
  fuelMeasurementsAndBunkerings?: FuelMeasurementOrBunkering[];
  fuelMeasurementsAndBunkeringsLoading: boolean;
  lastFuelMeasurement?: FuelMeasurement;
}

export const initialFuelState: FuelState = {
  fuelMeasurements: undefined,
  fuelMeasurementsLoading: false,
  fuelMeasurementsScrollable: true,
  fuelPostStatus: undefined,
  fuelMeasurementsAndBunkerings: undefined,
  fuelMeasurementsAndBunkeringsLoading: false,
  lastFuelMeasurement: undefined,
};
