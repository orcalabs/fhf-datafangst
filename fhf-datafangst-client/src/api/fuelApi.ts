import {
  DeleteFuelMeasurement,
  FuelApi,
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

const api = new FuelApi(apiConfiguration, undefined, axiosInstance);

export const getFuelMeasurements = async (args: FuelMeasurementsArgs) =>
  apiGet(async () =>
    api.routesV1FuelGetFuelMeasurements({
      startDate: args.startDate?.toISOString(),
      endDate: args.endDate?.toISOString(),
      bwToken: args.token!,
    }),
  );

export const createFuelMeasurement = async (
  args: CreateUpdateFuelMeasurementsArgs,
) =>
  apiGet(async () =>
    api.routesV1FuelCreateFuelMeasurements({
      fuelMeasurementBody: [{ timestamp: args.timestamp, fuel: args.fuel }],
      bwToken: args.token!,
    }),
  );

export const updateFuelMeasurement = async (
  args: CreateUpdateFuelMeasurementsArgs,
) =>
  apiGet(async () =>
    api.routesV1FuelUpdateFuelMeasurements({
      fuelMeasurementBody: [{ timestamp: args.timestamp, fuel: args.fuel }],
      bwToken: args.token!,
    }),
  );

export const deleteFuelMeasurement = async (args: DeleteFuelMeasurementsArgs) =>
  apiGet(async () =>
    api.routesV1FuelDeleteFuelMeasurements({
      deleteFuelMeasurement: [{ timestamp: args.timestamp }],
      bwToken: args.token!,
    }),
  );
