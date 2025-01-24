import {
  DeleteFuelMeasurement,
  FuelMeasurementApi,
  FuelMeasurementBody,
} from "generated/openapi";
import { apiConfiguration, apiFn, axiosInstance } from "./baseApi";

export interface FuelMeasurementsArgs {
  token?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface CreateUpdateFuelMeasurementsArgs extends FuelMeasurementBody {
  token?: string;
}

export interface DeleteFuelMeasurementsArgs extends DeleteFuelMeasurement {
  token?: string;
}

const api = new FuelMeasurementApi(apiConfiguration, undefined, axiosInstance);

export const getFuelMeasurements = apiFn((args: FuelMeasurementsArgs, signal) =>
  api.routesV1FuelMeasurementGetFuelMeasurements(
    {
      startDate: args.startDate?.toISOString(),
      endDate: args.endDate?.toISOString(),
      bwToken: args.token!,
    },
    { signal },
  ),
);

export const createFuelMeasurement = apiFn(
  (args: CreateUpdateFuelMeasurementsArgs) =>
    api.routesV1FuelMeasurementCreateFuelMeasurements({
      fuelMeasurementBody: [{ timestamp: args.timestamp, fuel: args.fuel }],
      bwToken: args.token!,
    }),
);

export const updateFuelMeasurement = apiFn(
  (args: CreateUpdateFuelMeasurementsArgs) =>
    api.routesV1FuelMeasurementUpdateFuelMeasurements({
      fuelMeasurementBody: [{ timestamp: args.timestamp, fuel: args.fuel }],
      bwToken: args.token!,
    }),
);

export const deleteFuelMeasurement = apiFn((args: DeleteFuelMeasurementsArgs) =>
  api.routesV1FuelMeasurementDeleteFuelMeasurements({
    deleteFuelMeasurement: [{ timestamp: args.timestamp }],
    bwToken: args.token!,
  }),
);
