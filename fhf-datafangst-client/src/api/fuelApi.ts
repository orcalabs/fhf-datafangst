import {
  DeleteFuelMeasurement,
  FuelMeasurementApi,
  FuelMeasurementBody,
} from "generated/openapi";
import { apiConfiguration, apiGet, axiosInstance } from "./baseApi";

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

export const getFuelMeasurements = async (args: FuelMeasurementsArgs) =>
  apiGet(async () =>
    api.routesV1FuelMeasurementGetFuelMeasurements({
      startDate: args.startDate?.toISOString(),
      endDate: args.endDate?.toISOString(),
      bwToken: args.token!,
    }),
  );

export const createFuelMeasurement = async (
  args: CreateUpdateFuelMeasurementsArgs,
) =>
  apiGet(async () =>
    api.routesV1FuelMeasurementCreateFuelMeasurements({
      fuelMeasurementBody: [{ timestamp: args.timestamp, fuel: args.fuel }],
      bwToken: args.token!,
    }),
  );

export const updateFuelMeasurement = async (
  args: CreateUpdateFuelMeasurementsArgs,
) =>
  apiGet(async () =>
    api.routesV1FuelMeasurementUpdateFuelMeasurements({
      fuelMeasurementBody: [{ timestamp: args.timestamp, fuel: args.fuel }],
      bwToken: args.token!,
    }),
  );

export const deleteFuelMeasurement = async (args: DeleteFuelMeasurementsArgs) =>
  apiGet(async () =>
    api.routesV1FuelMeasurementDeleteFuelMeasurements({
      deleteFuelMeasurement: [{ timestamp: args.timestamp }],
      bwToken: args.token!,
    }),
  );
