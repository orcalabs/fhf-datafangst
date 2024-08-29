import {
  DeleteFuelMeasurement,
  FuelMeasurementBody,
  V1fuelApi,
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

const api = new V1fuelApi(apiConfiguration, undefined, axiosInstance);

export const getFuelMeasurements = async (args: FuelMeasurementsArgs) =>
  apiGet(async () =>
    api.getFuelMeasurements(
      {
        startDate: args.startDate?.toISOString(),
        endDate: args.endDate?.toISOString(),
      },
      { headers: { "bw-token": args.token } },
    ),
  );

export const createFuelMeasurement = async (
  args: CreateUpdateFuelMeasurementsArgs,
) =>
  apiGet(async () =>
    api.createFuelMeasurements(
      { fuelMeasurementBody: [{ timestamp: args.timestamp, fuel: args.fuel }] },
      { headers: { "bw-token": args.token } },
    ),
  );

export const updateFuelMeasurement = async (
  args: CreateUpdateFuelMeasurementsArgs,
) =>
  apiGet(async () =>
    api.updateFuelMeasurements(
      { fuelMeasurementBody: [{ timestamp: args.timestamp, fuel: args.fuel }] },
      { headers: { "bw-token": args.token } },
    ),
  );

export const deleteFuelMeasurement = async (args: DeleteFuelMeasurementsArgs) =>
  apiGet(async () =>
    api.deleteFuelMeasurements(
      { deleteFuelMeasurement: [{ timestamp: args.timestamp }] },
      { headers: { "bw-token": args.token } },
    ),
  );
