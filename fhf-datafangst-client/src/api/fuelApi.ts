import {
  CreateFuelMeasurement,
  DeleteFuelMeasurement,
  FuelMeasurementApi,
  UpdateFuelMeasurement,
} from "generated/openapi";
import { apiConfiguration, apiFn, axiosInstance } from "./baseApi";

export interface FuelMeasurementsArgs {
  token?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface CreateFuelMeasurementsArgs extends CreateFuelMeasurement {
  token?: string;
}

export interface UpdateFuelMeasurementsArgs extends UpdateFuelMeasurement {
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
  ({ token, ...body }: CreateFuelMeasurementsArgs) =>
    api.routesV1FuelMeasurementCreateFuelMeasurements({
      createFuelMeasurement: [body],
      bwToken: token!,
    }),
);

export const updateFuelMeasurement = apiFn(
  ({ token, ...body }: UpdateFuelMeasurementsArgs) =>
    api.routesV1FuelMeasurementUpdateFuelMeasurements({
      updateFuelMeasurement: [body],
      bwToken: token!,
    }),
);

export const deleteFuelMeasurement = apiFn(
  ({ token, ...body }: DeleteFuelMeasurementsArgs) =>
    api.routesV1FuelMeasurementDeleteFuelMeasurements({
      deleteFuelMeasurement: [body],
      bwToken: token!,
    }),
);
